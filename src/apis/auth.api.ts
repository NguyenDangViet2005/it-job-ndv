import { apiPost, apiGet } from "./api";
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterHRRequest,
  RegisterHRResponse,
  UserResponse,
} from "@/types/api.type";

const ENDPOINT = "/auth";

export const authApi = {
  // Đăng ký ứng viên (role = user)
  registerUser: async (data: RegisterRequest) => {
    return await apiPost<ApiResponse<LoginResponse>>(
      `${ENDPOINT}/register`,
      data,
      { credentials: "include" },
    );
  },

  // Đăng ký nhà tuyển dụng (role = employer)
  registerHR: async (data: RegisterHRRequest) => {
    return await apiPost<ApiResponse<RegisterHRResponse>>(
      `${ENDPOINT}/register-hr`,
      data,
      { credentials: "include" },
    );
  },

  // Login
  login: async (data: LoginRequest) => {
    return await apiPost<ApiResponse<LoginResponse>>(
      `${ENDPOINT}/login`,
      data,
      { credentials: "include" },
    );
  },

  // Refresh Token (Uses HttpOnly Cookie)
  refreshtoken: async () => {
    return await apiPost<ApiResponse<LoginResponse>>(
      `${ENDPOINT}/refresh-token`,
      undefined,
      { credentials: "include" }, // Send cookies only
    );
  },

  // Logout
  logout: async () => {
    return await apiPost<ApiResponse<void>>(`${ENDPOINT}/logout`, undefined, {
      credentials: "include",
    });
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: (token: string) => {
    return apiGet<ApiResponse<UserResponse>>(`${ENDPOINT}/me`, {
      token,
      credentials: "include", // Optional but good practice
    });
  },
};
