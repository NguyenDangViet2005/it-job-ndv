import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import {
  SECURITY_CHECK_KEY,
  type SecurityOptions,
} from '~/common/decorators/security-check.decorator.js';

/**
 * Pre-controller Interceptor: Thực thi các bước kiểm tra an ninh / bảo mật TRƯỚC khi controller xử lý request.
 *
 * Request Lifecycle:
 * Middleware -> Guard -> [SecurityInterceptor (Pre-Controller)] -> Pipe -> Controller -> Interceptor (Post)
 *
 * Được thiết kế linh hoạt với các hooks:
 * - Anti-replay attack (kiểm tra x-timestamp)
 * - Chữ ký số (HMAC / Signature verification)
 * - Giải mã payload nhạy cảm (Decryption hook)
 * - Custom security handler
 */
@Injectable()
export class SecurityInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SecurityInterceptor.name);

  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const securityOptions = this.reflector.getAllAndOverride<SecurityOptions>(
      SECURITY_CHECK_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Nếu endpoint hoặc controller không cấu hình @SecurityCheck, cho phép đi tiếp
    if (!securityOptions) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();

    // 1. Kiểm tra chống Replay Attack (Anti-replay timestamp)
    if (securityOptions.maxTimestampDiffMs) {
      this.validateTimestamp(request, securityOptions.maxTimestampDiffMs);
    }

    // 2. Hook kiểm tra Chữ ký bảo mật (Signature / HMAC)
    if (securityOptions.requireSignature) {
      this.validateSignature(request, securityOptions);
    }

    // 3. Hook giải mã payload (nếu có yêu cầu mã hóa đầu cuối)
    if (securityOptions.requireDecryption) {
      this.decryptPayload(request, securityOptions);
    }

    // 4. Hook mở rộng cho các thuật toán bảo mật tùy chỉnh sau này
    this.customSecurityHooks(request, securityOptions);

    return next.handle();
  }

  /**
   * Kiểm tra x-timestamp trong header để chống Replay Attack.
   */
  protected validateTimestamp(req: Request, maxDiffMs: number): void {
    const timestampHeader = req.headers['x-timestamp'] as string;
    if (!timestampHeader) {
      throw new BadRequestException('Thiếu header xác thực thời gian (x-timestamp)');
    }

    const clientTimestamp = Number(timestampHeader);
    if (Number.isNaN(clientTimestamp)) {
      throw new BadRequestException('Định dạng x-timestamp không hợp lệ');
    }

    const now = Date.now();
    const diff = Math.abs(now - clientTimestamp);

    if (diff > maxDiffMs) {
      this.logger.warn(`Timestamp chênh lệch quá lớn: ${diff}ms > ${maxDiffMs}ms`);
      throw new UnauthorizedException('Request đã hết hạn hoặc thời gian không đồng bộ');
    }
  }

  /**
   * Hook xác thực chữ ký (Signature/HMAC).
   * Bạn có thể implement chi tiết thuật toán (HMAC-SHA256, RSA...) ở đây khi cần.
   */
  protected validateSignature(req: Request, options: SecurityOptions): void {
    const signature = req.headers['x-signature'] as string;
    if (!signature) {
      throw new UnauthorizedException('Thiếu chữ ký xác thực bảo mật (x-signature)');
    }

    // TODO: Triển khai thuật toán xác minh HMAC(payload + timestamp + secretKey)
    // Ví dụ:
    // const expectedSignature = crypto.createHmac('sha256', SECRET).update(...).digest('hex');
    // if (signature !== expectedSignature) throw new UnauthorizedException('Chữ ký không hợp lệ');
  }

  /**
   * Hook giải mã payload được mã hóa từ phía Client trước khi chuyển giao cho Pipe & Controller.
   */
  protected decryptPayload(req: Request, options: SecurityOptions): void {
    // TODO: Triển khai giải mã req.body bằng AES/RSA khi cần
  }

  /**
   * Hook tùy chỉnh dành cho các nghiệp vụ bảo mật đặc thù khác.
   */
  protected customSecurityHooks(req: Request, options: SecurityOptions): void {
    // Tùy biến thêm logic bảo mật theo từng nghiệp vụ
  }
}
