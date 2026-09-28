import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, RoleType } from '~/common/decorators/roles.decorator.js';
import { UserPayload } from '~/common/decorators/current-user.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu endpoint hoặc controller không khai báo @Roles thì cho phép qua
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserPayload | undefined;

    if (!user || !user.role) {
      throw new ForbiddenException('Bạn không có quyền truy cập tài nguyên này');
    }

    const hasRole = requiredRoles.some((role) => role === user.role);
    if (!hasRole) {
      throw new ForbiddenException(
        `Quyền truy cập bị từ chối. Thao tác này yêu cầu quyền: [${requiredRoles.join(', ')}]`,
      );
    }

    return true;
  }
}
