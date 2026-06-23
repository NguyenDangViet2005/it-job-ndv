import { Skill } from "@/types";
import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiGetPaginated,
  apiGetById,
} from "./api";
import type { ApiResponse } from "@/types/api.type";

const ENDPOINT = "/skills";

export const skillApi = {
  // Lấy danh sách skills
  getAll: (pageNumber: number = 1, pageSize: number = 20, token?: string) => {
    return apiGetPaginated<Skill>(ENDPOINT, pageNumber, pageSize, { token });
  },

  // Lấy chi tiết skill
  getById: (id: number, token?: string) => {
    return apiGetById<Skill>(ENDPOINT, id, { token });
  },

  // Tạo skill mới
  create: (data: Partial<Skill>, token: string) => {
    return apiPost<ApiResponse<Skill>>(ENDPOINT, data, { token });
  },

  // Cập nhật skill
  update: (id: number, data: Partial<Skill>, token: string) => {
    return apiPut<ApiResponse<Skill>>(`${ENDPOINT}/${id}`, data, { token });
  },

  // Xóa skill
  delete: (id: number, token: string) => {
    return apiDelete<ApiResponse<void>>(`${ENDPOINT}/${id}`, { token });
  },
};
