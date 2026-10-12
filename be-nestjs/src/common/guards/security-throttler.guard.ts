import {
  Injectable,
  ExecutionContext,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ThrottlerGuard,
  InjectThrottlerOptions,
  InjectThrottlerStorage,
  type ThrottlerModuleOptions,
  type ThrottlerStorage,
} from '@nestjs/throttler';
import type { ThrottlerLimitDetail, ThrottlerRequest } from '@nestjs/throttler/dist/throttler.guard.interface.js';
import { JwtService } from '@nestjs/jwt';
import {
  RATE_LIMIT_METADATA_KEY,
  BURST_LIMIT_METADATA_KEY,
  type RateLimitOptions,
  type BurstLimitOptions,
} from '~/common/decorators/rate-limit.decorator.js';

interface TokenBucketState {
  tokens: number;
  lastRefill: number;
}

/**
 * SecurityThrottlerGuard: Guard giới hạn tần suất request đa tầng thông minh:
 * 1. Nhận diện Client theo ngữ cảnh:
 *    - Chưa login: Track theo Client IP (xử lý qua proxy reverse)
 *    - Đã login: Track theo User-ID (tránh bị block chéo cùng mạng công ty / trường học)
 *    - API nhạy cảm (sensitive / strategy 'both'): Track đồng thời cả IP và User-ID
 * 2. Token Bucket Burst Limiting: Chống spam tương tác liên tục trong tích tắc (click farm / brute force)
 * 3. Security Audit Logging: Ghi log chi tiết (IP, User ID, Method, URL, User-Agent, Request-Id) khi bị block 429
 * 4. Chuẩn hóa HTTP Headers: Trả về Retry-After, X-RateLimit-*
 */
@Injectable()
export class SecurityThrottlerGuard extends ThrottlerGuard {
  protected override readonly logger = new Logger('SecurityRateLimiter');
  private readonly tokenBuckets = new Map<string, TokenBucketState>();
  private readonly jwtService = new JwtService();

  constructor(
    @InjectThrottlerOptions() options: ThrottlerModuleOptions,
    @InjectThrottlerStorage() storageService: ThrottlerStorage,
    reflector: Reflector,
  ) {
    super(options, storageService, reflector);

    // Tự động dọn dẹp các bucket cũ sau mỗi 10 phút để tránh rò rỉ bộ nhớ
    const cleanupInterval = setInterval(() => {
      this.cleanupTokenBuckets();
    }, 10 * 60 * 1000);
    cleanupInterval.unref?.();
  }

  protected override async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
    const { context } = requestProps;
    const { req } = this.getRequestResponse(context);

    // Lưu execution context vào req để getTracker có thể truy cập metadata
    req._throttlerContext = context;

    // 1. Kiểm tra Token Bucket (Burst limiter) nếu route có gắn @BurstLimit
    const burstOptions = this.reflector.getAllAndOverride<BurstLimitOptions>(
      BURST_LIMIT_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (burstOptions) {
      const tracker = await this.getTracker(req);
      const burstKey = `${context.getClass().name}:${context.getHandler().name}:${tracker}`;
      const isAllowed = this.consumeTokenBucket(burstKey, burstOptions);

      if (!isAllowed) {
        const clientIp = this.getClientIp(req);
        const userId = this.extractUserId(req);
        const method = req.method;
        const path = req.originalUrl || req.url;

        this.logger.warn(
          `🚨 [BURST_LIMIT_EXCEEDED - TOKEN BUCKET] Quá nhiều thao tác trong tích tắc! | IP: ${clientIp} | User: ${userId ?? 'GUEST'} | Route: [${method}] ${path}`,
        );

        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: 'Bạn đang thao tác quá nhanh. Vui lòng dừng lại vài giây trước khi tiếp tục.',
            error: 'Too Many Requests (Burst Limit Exceeded)',
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }

    // 2. Chuyển tiếp cho cơ chế Fixed / Sliding Window của ThrottlerGuard xử lý
    return super.handleRequest(requestProps);
  }

  /**
   * Tính toán Tracker Key theo chiến lược bảo mật:
   * - Chưa login: IP
   * - Đã login: User-ID
   * - Nhạy cảm: Cả IP và User-ID
   */
  protected override async getTracker(req: Record<string, any>): Promise<string> {
    const clientIp = this.getClientIp(req);
    const userId = this.extractUserId(req);

    const context = req._throttlerContext as ExecutionContext | undefined;
    const options = context
      ? this.reflector.getAllAndOverride<RateLimitOptions>(
          RATE_LIMIT_METADATA_KEY,
          [context.getHandler(), context.getClass()],
        )
      : undefined;

    const strategy = options?.strategy ?? 'auto';
    const isSensitive = options?.sensitive ?? false;

    // Nếu là API nhạy cảm hoặc strategy chỉ định 'both': Check cả IP và User ID
    if (isSensitive || strategy === 'both') {
      return `both:${clientIp}_${userId ? `uid:${userId}` : 'guest'}`;
    }

    // Nếu strategy chỉ định 'ip': Luôn check theo IP
    if (strategy === 'ip') {
      return `ip:${clientIp}`;
    }

    // Nếu strategy chỉ định 'user': Luôn check theo User ID
    if (strategy === 'user') {
      return userId ? `uid:${userId}` : `ip:${clientIp}`;
    }

    // Mặc định 'auto': Đã login thì check theo User-ID, chưa login thì check theo IP
    return userId ? `uid:${userId}` : `ip:${clientIp}`;
  }

  /**
   * Ghi log bảo mật chi tiết khi người dùng vượt quá ngưỡng cho phép (HTTP 429)
   */
  protected override async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    const { req, res } = this.getRequestResponse(context);
    const clientIp = this.getClientIp(req);
    const userId = this.extractUserId(req);
    const method = req.method;
    const path = req.originalUrl || req.url;
    const reqId = req.requestId || req.headers?.['x-request-id'] || 'NO-ID';
    const userAgent = req.headers?.['user-agent'] || 'Unknown';

    const retryAfter = Math.ceil(throttlerLimitDetail.timeToExpire);

    // Ghi Security Audit Log
    this.logger.warn(
      `🚨 [SECURITY RATE-LIMIT BLOCKED] IP: ${clientIp} | UserID: ${userId ?? 'ANONYMOUS'} | ` +
      `Route: [${method}] ${path} | Limit: ${throttlerLimitDetail.limit} reqs / ${Math.ceil(throttlerLimitDetail.ttl / 1000)}s | ` +
      `RetryAfter: ${retryAfter}s | UserAgent: ${userAgent} | RequestId: ${reqId}`,
    );

    // Thiết lập HTTP headers phản hồi chuẩn RFC 6585
    if (res && typeof res.setHeader === 'function') {
      res.setHeader('Retry-After', String(retryAfter));
      res.setHeader('X-RateLimit-Limit', String(throttlerLimitDetail.limit));
      res.setHeader('X-RateLimit-Remaining', '0');
      res.setHeader(
        'X-RateLimit-Reset',
        String(Math.ceil(Date.now() / 1000 + retryAfter)),
      );
    }

    await super.throwThrottlingException(context, throttlerLimitDetail);
  }

  /**
   * Thuật toán Token Bucket: Tiêu thụ 1 token trong xô
   */
  private consumeTokenBucket(key: string, options: BurstLimitOptions): boolean {
    const now = Date.now();
    let bucket = this.tokenBuckets.get(key);

    if (!bucket) {
      bucket = { tokens: options.capacity, lastRefill: now };
      this.tokenBuckets.set(key, bucket);
    } else {
      // Hồi phục token theo thời gian trôi qua
      const elapsedSeconds = (now - bucket.lastRefill) / 1000;
      const refilledTokens = elapsedSeconds * options.refillRate;
      bucket.tokens = Math.min(options.capacity, bucket.tokens + refilledTokens);
      bucket.lastRefill = now;
    }

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return true;
    }

    return false;
  }

  /**
   * Dọn dẹp các token buckets lâu không hoạt động
   */
  private cleanupTokenBuckets(): void {
    const now = Date.now();
    for (const [key, bucket] of this.tokenBuckets.entries()) {
      // Nếu không hoạt động quá 5 phút, xóa khỏi bộ nhớ
      if (now - bucket.lastRefill > 5 * 60 * 1000) {
        this.tokenBuckets.delete(key);
      }
    }
  }

  /**
   * Lấy IP chuẩn xác của Client, hỗ trợ reverse proxy (Vercel, Cloudflare, NGINX)
   */
  private getClientIp(req: Record<string, any>): string {
    const forwarded = req.headers?.['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket?.remoteAddress || '127.0.0.1';
  }

  /**
   * Trích xuất User ID an toàn:
   * 1. Từ req.user (nếu guard xác thực đã chạy trước)
   * 2. Hoặc giải mã nhanh Bearer token từ Authorization header
   */
  private extractUserId(req: Record<string, any>): number | null {
    if (req.user?.id) {
      return Number(req.user.id);
    }

    const authHeader = req.headers?.authorization;
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      try {
        const decoded = this.jwtService.decode(token) as { id?: number };
        if (decoded && typeof decoded.id === 'number') {
          return decoded.id;
        }
      } catch {
        // Bỏ qua lỗi giải mã nếu token không đúng định dạng
      }
    }

    return null;
  }
}
