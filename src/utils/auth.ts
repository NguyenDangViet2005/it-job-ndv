// Utility functions để làm việc với user authentication

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: "user" | "employer" | "admin";
  avatar?: string;
  // Thêm các field khác nếu cần
}

/**
 * Lấy thông tin user từ localStorage
 */
export const getUserInfo = (): UserInfo | null => {
  if (typeof window === "undefined") return null;

  const userInfo = localStorage.getItem("userInfo");
  if (!userInfo) return null;

  try {
    return JSON.parse(userInfo);
  } catch {
    return null;
  }
};

/**
 * Lấy role của user hiện tại
 */
export const getUserRole = (): string => {
  const userInfo = getUserInfo();
  return userInfo?.role || "";
};

/**
 * Lấy ID của user hiện tại
 */
export const getUserId = (): number | null => {
  const userInfo = getUserInfo();
  return userInfo?.id || null;
};

/**
 * Kiểm tra user có phải là admin không
 */
export const isAdmin = (): boolean => {
  return getUserRole() === "admin";
};

/**
 * Kiểm tra user có phải là employer không
 */
export const isEmployer = (): boolean => {
  return getUserRole() === "employer";
};

/**
 * Kiểm tra user có phải là user thường không
 */
export const isUser = (): boolean => {
  return getUserRole() === "user";
};

/**
 * Kiểm tra user đã đăng nhập chưa
 */
export const isAuthenticated = (): boolean => {
  return getUserInfo() !== null;
};

/**
 * Lưu thông tin user vào localStorage
 */
export const setUserInfo = (userInfo: UserInfo): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("userInfo", JSON.stringify(userInfo));
};

/**
 * Xóa thông tin user khỏi localStorage
 */
export const clearUserInfo = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("userInfo");
};
