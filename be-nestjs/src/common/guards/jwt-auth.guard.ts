import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard bắt buộc đăng nhập.
 * Nếu không có JWT hợp lệ, tự động trả về HTTP 401 Unauthorized.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
