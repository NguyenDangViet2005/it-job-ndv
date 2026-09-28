import { SetMetadata } from '@nestjs/common';

export enum Role {
  ADMIN = 'admin',
  EMPLOYER = 'employer',
  USER = 'user',
}

export type RoleType = Role | (string & {});

export const ROLES_KEY = 'roles';

/**
 * Gán danh sách quyền được phép truy cập vào handler hoặc controller
 * Ví dụ: @Roles('admin') hoặc @Roles(Role.ADMIN, Role.EMPLOYER)
 */
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);
