/**
 * Auth utility functions
 */

import { jwtDecode } from "jwt-decode";
import { ROUTES, ROUTE_GROUPS } from "@/constants";

interface JWTPayload {
  role?: string;
  userId?: number;
  email?: string;
  exp?: number;
}

// ==================== JWT Token Functions ====================

/**
 * Check if token is expired
 * @param token - JWT token string
 * @returns true if expired, false otherwise
 */
export function isTokenExpired(token?: string): boolean {
  if (!token) {
    return true;
  }

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    if (!decoded.exp) {
      return true;
    }
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true;
  }
}

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

/**
 * Get redirect path based on user role
 */
export const getRedirectPathByRole = (role: string): string => {
  const normalizedRole = role.toLowerCase().trim();

  switch (normalizedRole) {
    case "admin":
      return ROUTES.ADMIN;
    case "hr":
    case "employer":
      return ROUTES.HR;
    case "user":
      return ROUTES.USER_DASHBOARD;
    default:
      return ROUTES.HOME;
  }
};

