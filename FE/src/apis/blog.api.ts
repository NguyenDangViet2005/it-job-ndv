import { getApiEndpoint } from "./api-endpoint";
import { Blog } from "@/types";
import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiGetPaginated,
  apiGetById,
} from "./api";
import type { ApiResponse } from "@/types/api.type";

const ENDPOINT = "/blog";

export const blogApi = {
  // Lấy danh sách blog
  getAll: (
    pageNumber: number = 1,
    pageSize: number = 10,
    categoryid?: number,
    token?: string
  ) => {
    return apiGetPaginated<Blog>(ENDPOINT, pageNumber, pageSize, {
      params: categoryid ? { categoryid } : undefined,
      token,
    });
  },

  // Lấy chi tiết blog
  getById: (id: number, token?: string) => {
    return apiGetById<Blog>(ENDPOINT, id, { token });
  },

  // Lấy blog theo userid
  getByUserId: (
    userid: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token?: string
  ) => {
    return apiGetPaginated<Blog>(
      `${ENDPOINT}/user/${userid}`,
      pageNumber,
      pageSize,
      { token }
    );
  },

  // Tạo blog mới
  create: async (data: FormData | any, token: string) => {
    const isFormData = data instanceof FormData;

    const response = await fetch(`${getApiEndpoint()}${ENDPOINT}`, {
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
    const isFormData = data instanceof FormData;

    const response = await fetch(`${getApiEndpoint()}${ENDPOINT}/${id}`, {
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
    return apiGetPaginated<Blog>(ENDPOINT, pageNumber, pageSize, {
      params: { keyword },
      token,
    });
  },

  // Lấy danh sách categories
  getCategories: async (token?: string) => {
    const res = await apiGet<any>("/blogcategory", {
      token,
    });
    return (Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res)
      ? res
      : []) as Array<{ id: number; name: string }>;
  },
};
