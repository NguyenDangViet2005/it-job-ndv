import { jwtDecode } from "jwt-decode";
import { UserRole } from "@/constants";

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface JwtPayload {
  nameid: string; // ID
  email: string;
  unique_name: string; // Name
  role: string;
  nbf: number;
  exp: number;
  iat: number;
}

/**
 * Decode JWT token to get user info
 */
export const getUserInfo = (token?: string | null): UserInfo | null => {
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    return {
      id: parseInt(decoded.nameid),
      name: decoded.unique_name,
      email: decoded.email,
      role: decoded.role as UserRole,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Get user role from token
 */
export const getUserRole = (token?: string | null): string => {
  const userInfo = getUserInfo(token);
  return userInfo?.role || "";
};

/**
 * Get user ID from token
 */
export const getUserId = (token?: string | null): number | null => {
  const userInfo = getUserInfo(token);
  return userInfo?.id || null;
};
