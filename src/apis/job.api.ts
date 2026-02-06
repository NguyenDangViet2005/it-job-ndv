import { Job } from "@/types";
import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiGetPaginated,
  apiGetById,
} from "./api";
import type { ApiResponse } from "@/types/api.type";
import { getUserRole } from "@/utils";

const ENDPOINT = "/job";

export const jobApi = {
  // Lấy danh sách công việc
  getAll: (pageNumber: number = 1, pageSize: number = 10, token?: string) => {
    return apiGetPaginated<Job>(ENDPOINT, pageNumber, pageSize, {
      token,
    });
  },

  // Lấy chi tiết công việc
  getById: (id: number, token?: string) => {
    return apiGetById<Job>(ENDPOINT, id, { token });
  },

  // Lấy công việc theo công ty
  getByCompany: (
    companyid: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token?: string
  ) => {
    const role = getUserRole(token);
    return apiGetPaginated<Job>(
      `${ENDPOINT}/by-company`,
      pageNumber,
      pageSize,
      {
        params: { companyid, role },
        token,
      }
    );
  },

  // Tạo công việc mới
  create: (
    companyid: number,
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
    return apiPost<ApiResponse<Job>>(`${ENDPOINT}/${companyid}`, data, {
      token,
    });
  },

  // Cập nhật công việc
  update: (id: number, data: Partial<Job>, token: string) => {
    return apiPut<ApiResponse<Job>>(`${ENDPOINT}/${id}`, data, {
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
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      return Promise.reject(new Error("Keyword is required"));
    }
    return apiGetPaginated<Job>(ENDPOINT, pageNumber, pageSize, {
      params: { keyword: trimmedKeyword },
      token,
    });
  },

  // Lấy công việc hôm nay
  getToday: (token?: string) => {
    return apiGet<Job[]>(`${ENDPOINT}/today`, { token });
  },

  // Lấy công việc theo skill
  getBySkill: (
    skillid: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token?: string
  ) => {
    return apiGetPaginated<Job>(
      `${ENDPOINT}/by-skill`,
      pageNumber,
      pageSize,
      {
        params: { skillid },
        token,
      }
    );
  },

  // Lấy công việc theo user (HR)
  getByUser: (
    userid: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token?: string
  ) => {
    const role = getUserRole(token);
    return apiGetPaginated<Job>(
      `${ENDPOINT}/by-user/${userid}`,
      pageNumber,
      pageSize,
      { token, params: { role } }
    );
  },
};
