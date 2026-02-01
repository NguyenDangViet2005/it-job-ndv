import { apiPost, apiGetPaginated } from "./api";

const ENDPOINT = "/follow";

export const followApi = {
  // Toggle follow status
  toggleFollow: (
    userid: number,
    companyid: number,
    token: string,
  ): Promise<{ followed: boolean }> => {
    return apiPost<{ followed: boolean }>(
      `${ENDPOINT}`,
      { userid, companyid },
      { token },
    );
  },

  // Get follows by company
  getFollowsByCompany: (
    companyid: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token?: string,
  ) => {
    return apiGetPaginated<any>(
      `${ENDPOINT}/company/${companyid}`,
      pageNumber,
      pageSize,
      { token },
    );
  },
};
