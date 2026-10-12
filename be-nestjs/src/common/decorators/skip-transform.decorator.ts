import { SetMetadata } from '@nestjs/common';

export const SKIP_TRANSFORM_KEY = 'skip_transform';

/**
 * Decorator bỏ qua chuẩn hóa response của TransformInterceptor.
 * Hữu ích cho các endpoint trả về file stream, binary, OAuth redirect hoặc webhook bên thứ ba.
 */
export const SkipTransform = () => SetMetadata(SKIP_TRANSFORM_KEY, true);
