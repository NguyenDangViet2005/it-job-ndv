/**
 * Auth utility functions
 */

import { ROUTES, ROUTE_GROUPS } from "@/constants";

// ==================== Route Access Functions ====================

/**
 * Check if the user role has access to the specific path
 */
export const hasRouteAccess = (
  role: string | undefined,
  pathname: string
): boolean => {
  if (!role) return false;

  const normalizedRole = role.toLowerCase().trim();

  // Check if route is in public routes
  const isPublicRoute = ROUTE_GROUPS.PUBLIC.some((route) =>
    pathname.startsWith(route)
  );

  // Admin routes
  if (pathname.startsWith(ROUTES.ADMIN)) {
    return normalizedRole === "admin";
  }

  // HR routes
  if (pathname.startsWith(ROUTES.HR)) {
    return normalizedRole === "employer" || normalizedRole === "hr";
  }

  // User dashboard routes
  if (pathname.startsWith(ROUTES.USER_DASHBOARD)) {
    return normalizedRole === "user";
  }

  // Public routes - accessible by all
  if (isPublicRoute) {
    return true;
  }

  // Default: allow access
  return true;
};
