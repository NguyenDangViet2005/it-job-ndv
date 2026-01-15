import { jwtDecode } from "jwt-decode";
import { UserResponse } from "@/types/api.type";

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: "user" | "employer" | "admin";
  avatar?: string;
  // Thêm các field khác nếu cần
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
 * Lấy thông tin user từ token
 */
export const getUserInfo = (token?: string | null): UserInfo | null => {
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    return {
      id: parseInt(decoded.nameid),
      name: decoded.unique_name,
      email: decoded.email,
      role: decoded.role as any,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Lấy role của user từ token
 */
export const getUserRole = (token?: string | null): string => {
  const userInfo = getUserInfo(token);
  return userInfo?.role || "";
};

/**
 * Lấy ID của user từ token
 */
export const getUserId = (token?: string | null): number | null => {
  const userInfo = getUserInfo(token);
  return userInfo?.id || null;
};

/**
 * Các hàm check role
 */
export const isAdmin = (token?: string | null): boolean => {
  return getUserRole(token) === "admin";
};

export const isEmployer = (token?: string | null): boolean => {
  return getUserRole(token) === "employer";
};

export const isUser = (token?: string | null): boolean => {
  return getUserRole(token) === "user";
};

/**
 * Các hàm legacy (đã deprecated/xóa)
 */
export const isAuthenticated = (): boolean => {
  return false; // Deprecated
};

export const setUserInfo = (userInfo: UserInfo): void => {
  // Deprecated
};

export const clearUserInfo = (): void => {
  // Deprecated
};
