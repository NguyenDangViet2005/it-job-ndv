import { apiPost, apiGet, apiGetPaginated, apiPut, apiDelete } from './api';
import type { ApplicationRequest, ApplicationResponse } from '@/types/application.type';
import { getUserRole } from '@/utils/auth';

const ENDPOINT = '/api/Application';

interface UpdateApplicationStatusRequest {
  cvUrl: string;
  coverLetter: string;
  status: string;
}

export const applicationApi = {
  // Tạo đơn ứng tuyển mới
  create: (data: ApplicationRequest, token: string) => {
    return apiPost<ApplicationResponse>(ENDPOINT, data, { token });
  },

  // Lấy danh sách đơn ứng tuyển của user
  getByUser: (userId: number, pageNumber: number = 1, pageSize: number = 10, token: string) => {
    return apiGetPaginated<ApplicationResponse>(`${ENDPOINT}/user/${userId}`, pageNumber, pageSize, { token });
  },

  // Lấy danh sách đơn ứng tuyển theo job
  getByJob: (jobId: number, pageNumber: number = 1, pageSize: number = 10, token: string) => {
    return apiGetPaginated<ApplicationResponse>(`${ENDPOINT}/job/${jobId}`, pageNumber, pageSize, { token });
  },

  // Lấy danh sách đơn ứng tuyển theo company
  getByCompany: (companyId: number, pageNumber: number = 1, pageSize: number = 10, token: string) => {
    const role = getUserRole();
    return apiGetPaginated<ApplicationResponse>(`${ENDPOINT}/company/${companyId}`, pageNumber, pageSize, { 
      token,
      params: { role }
    });
  },

  // Lấy chi tiết đơn ứng tuyển
  getById: (id: number, token: string) => {
    return apiGet<ApplicationResponse>(`${ENDPOINT}/${id}`, { token });
  },

  // Cập nhật trạng thái đơn ứng tuyển (chấp nhận/từ chối)
  updateStatus: (jobId: number, userId: number, data: UpdateApplicationStatusRequest, token: string) => {
    return apiPut<ApplicationResponse>(`${ENDPOINT}/${jobId}/${userId}`, data, { token });
  },

  // Chấp nhận đơn ứng tuyển
  accept: (jobId: number, userId: number, cvUrl: string, coverLetter: string, token: string) => {
    return apiPut<ApplicationResponse>(
      `${ENDPOINT}/${jobId}/${userId}`,
      { cvUrl, coverLetter, status: 'accepted' },
      { token }
    );
  },

  // Từ chối đơn ứng tuyển
  reject: (jobId: number, userId: number, cvUrl: string, coverLetter: string, token: string) => {
    return apiPut<ApplicationResponse>(
      `${ENDPOINT}/${jobId}/${userId}`,
      { cvUrl, coverLetter, status: 'rejected' },
      { token }
    );
  },

  // Xóa đơn ứng tuyển
  delete: (jobId: number, userId: number, token: string) => {
    return apiDelete(`${ENDPOINT}/${jobId}/${userId}`, { token });
  },
};
