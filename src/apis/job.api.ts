import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiGetPaginated,
  apiGetById,
} from "./api";
import type { ApiResponse, JobResponse } from "@/types/api.type";
import { getUserRole } from "@/utils/auth";

const ENDPOINT = "/job";

export const jobApi = {
  // Lấy danh sách công việc
  getAll: (pageNumber: number = 1, pageSize: number = 10, token?: string) => {
    return apiGetPaginated<JobResponse>(ENDPOINT, pageNumber, pageSize, {
      token,
    });
  },

  // Lấy chi tiết công việc
  getById: (id: number, token?: string) => {
    return apiGetById<JobResponse>(ENDPOINT, id, { token });
  },

  // Lấy công việc theo công ty
  getByCompany: (
    companyId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token?: string
  ) => {
    const role = getUserRole();
    return apiGetPaginated<JobResponse>(
      `${ENDPOINT}/by-company`,
      pageNumber,
      pageSize,
      {
        params: { companyId, role },
        token,
      }
    );
  },

  // Tạo công việc mới
  create: (
    companyId: number,
    data: {
      title: string;
      description: string;
      type: string;
      quantity: number;
      deadline: string;
      status: string;
    },
    token: string
  ) => {
    return apiPost<ApiResponse<JobResponse>>(`${ENDPOINT}/${companyId}`, data, {
      token,
    });
  },

  // Cập nhật công việc
  update: (id: number, data: Partial<JobResponse>, token: string) => {
    return apiPut<ApiResponse<JobResponse>>(`${ENDPOINT}/${id}`, data, {
      token,
    });
  },

  // Xóa công việc
  delete: (id: number, token: string) => {
    return apiDelete<ApiResponse<void>>(`${ENDPOINT}/${id}`, { token });
  },

  // Tìm kiếm công việc
  search: (
    keyword: string,
    pageNumber: number = 1,
    pageSize: number = 10,
    token?: string
  ) => {
    return apiGetPaginated<JobResponse>(ENDPOINT, pageNumber, pageSize, {
      params: { keyword },
      token,
    });
  },

  // Lấy công việc hôm nay
  getToday: (token?: string) => {
    return apiGet<JobResponse[]>(`${ENDPOINT}/today`, { token });
  },

  // Lấy công việc theo skill
  getBySkill: (
    skillId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token?: string
  ) => {
    return apiGetPaginated<JobResponse>(
      `${ENDPOINT}/by-skill`,
      pageNumber,
      pageSize,
      {
        params: { skillId },
        token,
      }
    );
  },

  // Lấy công việc theo user (HR)
  getByUser: (
    userId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token?: string
  ) => {
    const role = getUserRole();
    return apiGetPaginated<JobResponse>(
      `${ENDPOINT}/by-user/${userId}`,
      pageNumber,
      pageSize,
      { token, params: { role } }
    );
  },
};
