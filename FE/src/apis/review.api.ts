import { Review } from "@/types";
import { apiPost, apiPut, apiDelete, apiGetPaginated, apiGetById } from "./api";
import type { ApiResponse } from "@/types/api.type";

const ENDPOINT = "/review";

export const reviewApi = {
  // Lấy danh sách đánh giá
  getAll: (pageNumber: number = 1, pageSize: number = 10, token?: string) => {
    return apiGetPaginated<Review>(ENDPOINT, pageNumber, pageSize, {
      token,
    });
  },

  // Lấy chi tiết đánh giá
  getById: (id: number, token?: string) => {
    return apiGetById<Review>(ENDPOINT, id, { token });
  },

  // Lấy đánh giá theo công ty
  getByCompany: (
    companyid: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token?: string
  ) => {
    return apiGetPaginated<Review>(
      `${ENDPOINT}/company/${companyid}`,
      pageNumber,
      pageSize,
      { token }
    );
  },

  // Lấy đánh giá theo user
  getByUser: (
    userid: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token: string
  ) => {
    return apiGetPaginated<Review>(
      `${ENDPOINT}/user/${userid}`,
      pageNumber,
      pageSize,
      { token }
    );
  },

  // Tạo đánh giá mới
  create: (data: Partial<Review>, token: string) => {
    return apiPost<ApiResponse<Review>>(ENDPOINT, data, { token });
  },

  // Cập nhật đánh giá
  update: (id: number, data: Partial<Review>, token: string) => {
    return apiPut<ApiResponse<Review>>(`${ENDPOINT}/${id}`, data, {
      token,
    });
  },

  // Xóa đánh giá
  delete: (id: number, token: string) => {
    return apiDelete<ApiResponse<void>>(`${ENDPOINT}/${id}`, { token });
  },
};
