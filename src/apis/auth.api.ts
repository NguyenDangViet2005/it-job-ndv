import { apiPost } from "./api";
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterHRRequest,
  RegisterHRResponse,
  UserResponse,
} from "@/types/api.type";

const ENDPOINT = "/api/Auth";

export const authApi = {
  // Đăng ký ứng viên (role = user)
  registerUser: async (data: RegisterRequest) => {
    const response = await apiPost<ApiResponse<LoginResponse>>(
      `${ENDPOINT}/register-user`,
      data
    );

    // Lưu userInfo vào localStorage sau khi đăng ký thành công
    if (response.data?.user) {
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
    }

    return response;
  },

  // Đăng ký nhà tuyển dụng (role = employer)
  registerHR: async (data: RegisterHRRequest) => {
    const response = await apiPost<ApiResponse<RegisterHRResponse>>(
      `${ENDPOINT}/register-hr`,
      data
    );

    // Lưu userInfo vào localStorage sau khi đăng ký thành công
    if (response.data?.user) {
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
    }

    return response;
  },

  // Đăng ký (legacy)
  register: async (data: RegisterRequest) => {
    const response = await apiPost<ApiResponse<LoginResponse>>(
      `${ENDPOINT}/register`,
      data
    );

    // Lưu userInfo vào localStorage
    if (response.data?.user) {
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
    }

    return response;
  },

  // Đăng nhập
  login: async (data: LoginRequest) => {
    const response = await apiPost<ApiResponse<LoginResponse>>(
      `${ENDPOINT}/login`,
      data
    );

    // Lưu userInfo vào localStorage sau khi login thành công
    if (response.data?.user) {
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
    }

    return response;
  },

  // Làm mới token
  refreshToken: async (refreshToken: string) => {
    const response = await apiPost<ApiResponse<LoginResponse>>(
      `${ENDPOINT}/refresh-token`,
      {
        refreshToken,
      }
    );

    // Cập nhật userInfo nếu có
    if (response.data?.user) {
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
    }

    return response;
  },

  // Đăng xuất
  logout: (token: string) => {
    // Xóa userInfo khi logout
    localStorage.removeItem("userInfo");
    return apiPost<ApiResponse<void>>(`${ENDPOINT}/logout`, undefined, {
      token,
    });
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: (token: string) => {
    return apiPost<ApiResponse<UserResponse>>(`${ENDPOINT}/me`, undefined, {
      token,
    });
  },
};
