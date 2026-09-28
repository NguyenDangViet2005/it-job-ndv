import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserPayload {
  id: number;
  email: string;
  role: string;
  [key: string]: any;
}

/**
 * Custom Decorator để lấy thông tin User đang đăng nhập từ request.
 * - @CurrentUser() user: UserPayload  -> Lấy toàn bộ payload
 * - @CurrentUser('id') userId: number -> Lấy trực tiếp trường id
 */
export const CurrentUser = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserPayload | undefined;

    if (!user) return null;
    return data ? user[data] : user;
  },
);
