import { apiPost, apiPut, apiDelete, apiGetPaginated } from "./api";

const ENDPOINT = "/connection";

export const connectionApi = {
  // Send connection request
  sendRequest: (userId: number, connectedUserId: number, token: string) => {
    return apiPost<any>(
      `${ENDPOINT}`,
      { userId, connectedUserId },
      { token },
    );
  },

  // Accept connection request
  acceptRequest: (connectionId: number, token: string) => {
    return apiPut<any>(`${ENDPOINT}/${connectionId}/accept`, {}, { token });
  },

  // Reject connection request
  rejectRequest: (connectionId: number, token: string) => {
    return apiPut<any>(`${ENDPOINT}/${connectionId}/reject`, {}, { token });
  },

  // Remove connection
  removeConnection: (connectionId: number, token: string) => {
    return apiDelete<any>(`${ENDPOINT}/${connectionId}`, { token });
  },

  // Get user connections (accepted)
  getUserConnections: (
    userId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token?: string,
  ) => {
    return apiGetPaginated<any>(
      `${ENDPOINT}/user/${userId}`,
      pageNumber,
      pageSize,
      { token },
    );
  },

  // Get pending requests (received)
  getPendingRequests: (
    pageNumber: number = 1,
    pageSize: number = 10,
    token: string,
  ) => {
    return apiGetPaginated<any>(
      `${ENDPOINT}/pending`,
      pageNumber,
      pageSize,
      { token },
    );
  },

  // Get sent requests
  getSentRequests: (
    pageNumber: number = 1,
    pageSize: number = 10,
    token: string,
  ) => {
    return apiGetPaginated<any>(
      `${ENDPOINT}/sent`,
      pageNumber,
      pageSize,
      { token },
    );
  },
};
