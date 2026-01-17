import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiGetPaginated,
  apiGetById,
} from "./api";
import type { ApiResponse, BlogResponse } from "@/types/api.type";
import { getUserRole } from "@/utils/auth";

const ENDPOINT = "/blog";

export const blogApi = {
  // Lấy danh sách blog
  getAll: (
    pageNumber: number = 1,
    pageSize: number = 10,
    categoryId?: number,
    token?: string
  ) => {
    return apiGetPaginated<BlogResponse>(ENDPOINT, pageNumber, pageSize, {
      params: categoryId ? { categoryId } : undefined,
      token,
    });
  },

  // Lấy chi tiết blog
  getById: (id: number, token?: string) => {
    return apiGetById<BlogResponse>(ENDPOINT, id, { token });
  },

  // Lấy blog theo userId
  getByUserId: (
    userId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token?: string
  ) => {
    return apiGetPaginated<BlogResponse>(
      `${ENDPOINT}/user/${userId}`,
      pageNumber,
      pageSize,
      { token }
    );
  },

  // Tạo blog mới
  create: async (data: FormData | any, token: string) => {
    const BE_ENDPOINT = process.env.NEXT_PUBLIC_BE_ENDPOINT || "http://localhost:8081/api";
    const isFormData = data instanceof FormData;

    const response = await fetch(`${BE_ENDPOINT}${ENDPOINT}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      console.error("Error response:", error);
      throw new Error(error.message || `HTTP Error: ${response.status}`);
    }

    return response.json();
  },

  // Cập nhật blog
  update: async (id: number, data: FormData | any, token: string) => {
    const BE_ENDPOINT = process.env.NEXT_PUBLIC_BE_ENDPOINT || "http://localhost:8081/api";
    const isFormData = data instanceof FormData;

    const response = await fetch(`${BE_ENDPOINT}${ENDPOINT}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || `HTTP Error: ${response.status}`);
    }

    return response.json();
  },

  // Xóa blog
  delete: (id: number, token: string) => {
    return apiDelete<ApiResponse<void>>(`${ENDPOINT}/${id}`, { token });
  },

  // Tìm kiếm blog
  search: (
    keyword: string,
    pageNumber: number = 1,
    pageSize: number = 10,
    token?: string
  ) => {
    return apiGetPaginated<BlogResponse>(ENDPOINT, pageNumber, pageSize, {
      params: { keyword },
      token,
    });
  },

  // Lấy danh sách categories
  getCategories: (token?: string) => {
    return apiGet<Array<{ id: number; name: string }>>("/blogcategory", {
      token,
    });
  },
};
