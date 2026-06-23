/**
 * Permission helper
 * Handle role-based permissions and access control
 */

import { USER_ROLES, type UserRole } from "@/constants/app-config";
import { ROUTES } from "@/constants/routes";

export const hasPermission = (
  userRole: UserRole | undefined,
  requiredRole: UserRole | UserRole[]
): boolean => {
  if (!userRole) return false;

  const required = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return required.includes(userRole);
};

export const isAdmin = (userRole: UserRole | undefined): boolean => {
  return userRole === USER_ROLES.ADMIN;
};

export const isEmployer = (userRole: UserRole | undefined): boolean => {
  return userRole === USER_ROLES.EMPLOYER;
};

export const isUser = (userRole: UserRole | undefined): boolean => {
  return userRole === USER_ROLES.USER;
};

export const canAccessAdminPanel = (userRole: UserRole | undefined): boolean => {
  return isAdmin(userRole);
};

export const canAccessHRPanel = (userRole: UserRole | undefined): boolean => {
  return isEmployer(userRole) || isAdmin(userRole);
};

export const canManageJobs = (userRole: UserRole | undefined): boolean => {
  return isEmployer(userRole) || isAdmin(userRole);
};

export const canManageUsers = (userRole: UserRole | undefined): boolean => {
  return isAdmin(userRole);
};

export const canApplyToJobs = (userRole: UserRole | undefined): boolean => {
  return isUser(userRole);
};

/**
 * Get redirect path based on user role
 */
export const getRedirectPathByRole = (role: string | undefined): string => {
  if (!role) return ROUTES.HOME;
  
  const normalizedRole = role.toLowerCase().trim();

  switch (normalizedRole) {
    case USER_ROLES.ADMIN:
      return ROUTES.ADMIN; // Updated to new route structure
    case USER_ROLES.EMPLOYER:
      return ROUTES.HR;    // Updated to new route structure
    case "hr":
      return ROUTES.HR;
    case USER_ROLES.USER:
      return ROUTES.USER_DASHBOARD; // Updated to new route structure
    default:
      return ROUTES.HOME;
  }
};
