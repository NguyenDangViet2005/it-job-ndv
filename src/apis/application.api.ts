import { Application, ApplicationRequest } from "@/types";
import { apiPost, apiGet, apiGetPaginated, apiPut, apiDelete } from "./api";
import { getUserRole } from "@/utils"; 

const ENDPOINT = "/application";

interface UpdateApplicationStatusRequest {
  cvurl: string;
  coverletter: string;
  status: string;
}

export const applicationApi = {
  // Tạo đơn ứng tuyển mới
  create: (data: ApplicationRequest, token: string) => {
    return apiPost<Application>(ENDPOINT, data, { token });
  },

  // Lấy danh sách đơn ứng tuyển của user
  getByUser: (
    userid: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token: string
  ) => {
    return apiGetPaginated<Application>(
      `${ENDPOINT}/user/${userid}`,
      pageNumber,
      pageSize,
      { token }
    );
  },

  // Lấy danh sách đơn ứng tuyển theo job
  getByJob: (
    jobid: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token: string
  ) => {
    return apiGetPaginated<Application>(
      `${ENDPOINT}/job/${jobid}`,
      pageNumber,
      pageSize,
      { token }
    );
  },

  // Lấy danh sách đơn ứng tuyển theo company
  getByCompany: (
    companyid: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token: string
  ) => {
    const role = getUserRole(token) || "";
    return apiGetPaginated<Application>(
      `${ENDPOINT}/company/${companyid}`,
      pageNumber,
      pageSize,
      {
        token,
        params: { role },
      }
    );
  },

  // Lấy chi tiết đơn ứng tuyển
  getById: (id: number, token: string) => {
    return apiGet<Application>(`${ENDPOINT}/${id}`, { token });
  },

  // Cập nhật trạng thái đơn ứng tuyển (chấp nhận/từ chối)
  updateStatus: (
    jobid: number,
    userid: number,
    data: UpdateApplicationStatusRequest,
    token: string
  ) => {
    return apiPut<Application>(`${ENDPOINT}/${jobid}/${userid}`, data, {
      token,
    });
  },

  // Chấp nhận đơn ứng tuyển
  accept: (
    jobid: number,
    userid: number,
    cvurl: string,
    coverletter: string,
    token: string
  ) => {
    return apiPut<Application>(
      `${ENDPOINT}/${jobid}/${userid}`,
      { cvurl, coverletter, status: "accepted" },
      { token }
    );
  },

  // Từ chối đơn ứng tuyển
  reject: (
    jobid: number,
    userid: number,
    cvurl: string,
    coverletter: string,
    token: string
  ) => {
    return apiPut<Application>(
      `${ENDPOINT}/${jobid}/${userid}`,
      { cvurl, coverletter, status: "rejected" },
      { token }
    );
  },

  // Xóa đơn ứng tuyển
  delete: (jobid: number, userid: number, token: string) => {
    return apiDelete(`${ENDPOINT}/${jobid}/${userid}`, { token });
  },
};
