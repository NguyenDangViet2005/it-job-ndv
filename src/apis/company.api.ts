import { apiGet, apiPost, apiPut, apiDelete, apiGetPaginated, apiGetById, apiUploadFile } from './api';
import type { ApiResponse, ResponseData, Company, CompanyUpdateRequest } from '@/types/api.type';
import { getUserRole } from '@/utils/auth';

const ENDPOINT = '/api/Companies';

export const companyApi = {
  // Lấy danh sách công ty với phân trang
  getAll: (pageNumber: number = 1, pageSize: number = 10, token?: string) => {
    return apiGetPaginated<Company>(ENDPOINT, pageNumber, pageSize, { token });
  },

  // Lấy chi tiết công ty theo ID
  getById: (id: number, token?: string) => {
    return apiGetById<Company>(ENDPOINT, id, { token });
  },

  // Tạo công ty mới
  create: (data: Partial<Company>, token?: string) => {
    return apiPost<ApiResponse<Company>>(ENDPOINT, data, { token });
  },

  // Cập nhật công ty
  update: (id: number, data: Partial<Company>, token?: string) => {
    return apiPut<ApiResponse<Company>>(`${ENDPOINT}/${id}`, data, { token });
  },

  // Xóa công ty
  delete: (id: number, token?: string) => {
    return apiDelete<ApiResponse<void>>(`${ENDPOINT}/${id}`, { token });
  },

  // Tìm kiếm công ty
  search: (keyword: string, pageNumber: number = 1, pageSize: number = 10, token?: string) => {
    return apiGetPaginated<Company>(ENDPOINT, pageNumber, pageSize, {
      params: { keyword },
      token,
    });
  },

  // Lấy danh sách logo công ty
  getLogos: (pageNumber: number = 1, pageSize: number = 10, token?: string) => {
    return apiGetPaginated<Pick<Company, 'id' | 'name' | 'avatar'>>(`${ENDPOINT}/logos`, pageNumber, pageSize, { token });
  },

  // ===== HR Company Management =====

  // Lấy công ty của HR đang đăng nhập
  getMyCompany: (token?: string) => {
    const role = getUserRole();
    return apiGet<Company>(`${ENDPOINT}/my-company`, { token, params: { role } });
  },

  // Upload ảnh đại diện công ty
  uploadAvatar: (file: File, token?: string) => {
    return apiUploadFile<{ avatarUrl: string; message: string }>(`${ENDPOINT}/upload-avatar`, file, 'file', { token });
  },

  // Upload ảnh bìa công ty
  uploadCover: (file: File, token?: string) => {
    return apiUploadFile<{ coverImageUrl: string; message: string }>(`${ENDPOINT}/upload-cover`, file, 'file', { token });
  },

  // Cập nhật thông tin công ty
  updateMyCompany: (data: CompanyUpdateRequest, token?: string) => {
    return apiPut<{ data: Company; message: string }>(`${ENDPOINT}/my-company`, data, { token });
  },
};
