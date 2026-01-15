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
  getByUserId: (userId: number, token: string) => {
    const role = getUserRole(token);
    return apiGet<ApiResponse<BlogResponse[]>>(`${ENDPOINT}/user/${userId}`, {
      token,
      params: { role },
    });
  },

  // Tạo blog mới với multipart/form-data
  create: async (formData: FormData, token: string) => {
    const BE_ENDPOINT = process.env.NEXT_PUBLIC_BE_ENDPOINT;

    console.log("Creating blog with FormData:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await fetch(`${BE_ENDPOINT}${ENDPOINT}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Không set Content-Type, để browser tự động set với boundary
      },
      body: formData,
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      console.error("Error response:", error);
      throw new Error(error.message || `HTTP Error: ${response.status}`);
    }

    return response.json();
  },

  // Cập nhật blog với multipart/form-data
  update: async (id: number, formData: FormData, token: string) => {
    const BE_ENDPOINT = process.env.NEXT_PUBLIC_BE_ENDPOINT;
    const response = await fetch(`${BE_ENDPOINT}${ENDPOINT}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
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
    return apiGet<Array<{ id: number; name: string }>>("/api/BlogCategory", {
      token,
    });
  },
};
