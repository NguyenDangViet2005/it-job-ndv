import { SetMetadata } from '@nestjs/common';

export type RateLimitStrategy = 'auto' | 'ip' | 'user' | 'both';

export interface RateLimitOptions {
  /**
   * Chiến lược nhận diện client:
   * - 'auto': Nếu chưa login thì check IP, đã login thì check User-ID
   * - 'ip': Luôn check theo IP (bảo vệ chống brute force login/register)
   * - 'user': Luôn check theo User-ID (nếu chưa login fallback về IP)
   * - 'both': Check đồng thời cả IP và User-ID (dành cho API nhạy cảm: đổi pass, thanh toán, xóa dữ liệu)
   */
  strategy?: RateLimitStrategy;

  /**
   * Đánh dấu API nhạy cảm: tự động check cả IP và User-ID
   */
  sensitive?: boolean;
}

export interface BurstLimitOptions {
  /**
   * Số lượng token tối đa trong xô (dung lượng burst cho phép thao tác nhanh tạm thời)
   * Ví dụ: 5 click liên tục
   */
  capacity: number;

  /**
   * Tốc độ hồi phục token mỗi giây (Token Bucket refill rate)
   * Ví dụ: 1 token / giây
   */
  refillRate: number;
}

export const RATE_LIMIT_METADATA_KEY = 'security:rate_limit_options';
export const BURST_LIMIT_METADATA_KEY = 'security:burst_limit_options';

/**
 * Decorator cấu hình chiến lược Rate Limiting (IP / User-ID / Both)
 */
export const RateLimit = (options: RateLimitOptions) =>
  SetMetadata(RATE_LIMIT_METADATA_KEY, options);

/**
 * Decorator cấu hình Token Bucket để chống người dùng tương tác quá nhanh (spam click, automated bot)
 */
export const BurstLimit = (options: BurstLimitOptions) =>
  SetMetadata(BURST_LIMIT_METADATA_KEY, options);
