import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE_KEY = 'response_message';

/**
 * Decorator cấu hình message phản hồi cho TransformInterceptor ở đầu ra.
 * Ví dụ: @ResponseMessage('Lấy thông tin người dùng thành công')
 */
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE_KEY, message);
