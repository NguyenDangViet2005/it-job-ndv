import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator đánh dấu endpoint là public (không bắt buộc JWT authentication).
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
