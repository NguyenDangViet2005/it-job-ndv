import { SetMetadata } from '@nestjs/common';

export const SECURITY_CHECK_KEY = 'security_check';

export interface SecurityOptions {
  /**
   * Bắt buộc kiểm tra chữ ký điện tử (Signature/HMAC) trong headers.
   */
  requireSignature?: boolean;
  /**
   * Giới hạn độ lệch thời gian giữa client và server (chống replay attack), tính bằng ms.
   * Mặc định khuyến nghị: 300000ms (5 phút).
   */
  maxTimestampDiffMs?: number;
  /**
   * Bắt buộc giải mã payload trước khi vào controller.
   */
  requireDecryption?: boolean;
  /**
   * Custom tag hoặc action code phục vụ audit / firewall sau này.
   */
  action?: string;
  [key: string]: any;
}

/**
 * Decorator cấu hình bảo mật trước khi vào controller (Pre-Controller Interceptor).
 * Dành cho các phương thức nhạy cảm (thanh toán, đổi mật khẩu cấp cao, API đối tác...).
 */
export const SecurityCheck = (options: SecurityOptions = {}) =>
  SetMetadata(SECURITY_CHECK_KEY, options);
