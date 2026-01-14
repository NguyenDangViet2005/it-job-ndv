import { apiPost, apiPut, apiDelete, apiGetPaginated, apiGetById } from "./api";
import type { ApiResponse, ReviewResponse } from "@/types/api.type";

const ENDPOINT = "/review";

export const reviewApi = {
  // Lấy danh sách đánh giá
  getAll: (pageNumber: number = 1, pageSize: number = 10, token?: string) => {
    return apiGetPaginated<ReviewResponse>(ENDPOINT, pageNumber, pageSize, {
      token,
    });
  },

  // Lấy chi tiết đánh giá
  getById: (id: number, token?: string) => {
    return apiGetById<ReviewResponse>(ENDPOINT, id, { token });
  },

  // Lấy đánh giá theo công ty
  getByCompany: (
    companyId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token?: string
  ) => {
    return apiGetPaginated<ReviewResponse>(
      `${ENDPOINT}/company/${companyId}`,
      pageNumber,
      pageSize,
      { token }
    );
  },

  // Lấy đánh giá theo user
  getByUser: (
    userId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token: string
  ) => {
    return apiGetPaginated<ReviewResponse>(
      `${ENDPOINT}/user/${userId}`,
      pageNumber,
      pageSize,
      { token }
    );
  },

  // Tạo đánh giá mới
  create: (data: Partial<ReviewResponse>, token: string) => {
    return apiPost<ApiResponse<ReviewResponse>>(ENDPOINT, data, { token });
  },

  // Cập nhật đánh giá
  update: (id: number, data: Partial<ReviewResponse>, token: string) => {
    return apiPut<ApiResponse<ReviewResponse>>(`${ENDPOINT}/${id}`, data, {
      token,
    });
  },

  // Xóa đánh giá
  delete: (id: number, token: string) => {
    return apiDelete<ApiResponse<void>>(`${ENDPOINT}/${id}`, { token });
  },
};
