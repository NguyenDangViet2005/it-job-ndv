import { apiPost, apiGetPaginated, apiGet } from "./api";
import type { ApiResponse } from "@/types/api.type";

const ENDPOINT = "/follow";

export const followApi = {
  // Toggle follow status
  toggleFollow: (
    userId: number,
    companyId: number,
    token: string,
  ): Promise<{ followed: boolean }> => {
    return apiPost<{ followed: boolean }>(
      `${ENDPOINT}`,
      { userId, companyId },
      { token },
    );
  },

  // Get follows by user
  getFollowsByUser: (
    userId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token?: string,
  ) => {
    return apiGetPaginated<any>( // Replace 'any' with FollowResponse if available
      `${ENDPOINT}/user/${userId}`,
      pageNumber,
      pageSize,
      { token },
    );
  },

  // Get follows by company
  getFollowsByCompany: (
    companyId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token?: string,
  ) => {
    return apiGetPaginated<any>(
      `${ENDPOINT}/company/${companyId}`,
      pageNumber,
      pageSize,
      { token },
    );
  },
};
