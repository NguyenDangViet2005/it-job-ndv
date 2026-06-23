import { Attachment, Post, User } from "@/types";
import { apiGet, apiPut, apiPost, apiDelete, apiGetPaginated } from "./api";

const ENDPOINT = "/user";

export const userApi = {
  // Lấy danh sách tất cả users (admin)
  getAll: (pageNumber: number = 1, pageSize: number = 10, token?: string) => {
    return apiGetPaginated<User>(ENDPOINT, pageNumber, pageSize, {
      token,
    });
  },

  // Lấy thông tin user theo ID
  getById: (id: number, token?: string) => {
    return apiGet<User>(`${ENDPOINT}/${id}`, { token });
  },

  // Cập nhật thông tin user
  update: (id: number, data: Partial<User>, token: string) => {
    return apiPut<{ message: string; data: User }>(
      `${ENDPOINT}/${id}`,
      data,
      { token }
    );
  },

  // Cập nhật avatar
  updateAvatar: async (id: number, file: File, token: string) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_ENDPOINT}${ENDPOINT}/${id}/avatar`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update avatar");
    }

    return response.json() as Promise<{ message: string; data: User }>;
  },

  // Cập nhật ảnh bìa
  updateCoverImage: async (id: number, file: File, token: string) => {
    const formData = new FormData();
    formData.append("coverimage", file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_ENDPOINT}${ENDPOINT}/${id}/cover-image`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update cover image");
    }

    return response.json() as Promise<{ message: string; data: User }>;
  },

  // Đổi mật khẩu
  changePassword: (
    id: number,
    currentPassword: string,
    newPassword: string,
    token: string
  ) => {
    return apiPost<{ message: string }>(
      `${ENDPOINT}/${id}/change-password`,
      { currentPassword, newPassword },
      { token }
    );
  },

  // Lấy các bài đăng của user
  getPosts: (
    id: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token?: string
  ) => {
    return apiGetPaginated<Post>(
      `${ENDPOINT}/${id}/posts`,
      pageNumber,
      pageSize,
      { token }
    );
  },

  // Lấy media (ảnh/video) của user
  getMedia: (
    id: number,
    pageNumber: number = 1,
    pageSize: number = 6,
    token?: string
  ) => {
    return apiGetPaginated<Attachment>(
      `${ENDPOINT}/${id}/media`,
      pageNumber,
      pageSize,
      { token }
    );
  },

  // Lấy danh sách ứng tuyển của user
  getApplications: (
    id: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token?: string
  ) => {
    return apiGetPaginated<any>(
      `${ENDPOINT}/${id}/applications`,
      pageNumber,
      pageSize,
      { token }
    );
  },

  // Lấy kỹ năng của user
  getSkills: (id: number, token?: string) => {
    return apiGet<any[]>(`${ENDPOINT}/${id}/skills`, { token });
  },

  // Thêm kỹ năng cho user
  addSkill: (id: number, skillid: number, token: string) => {
    return apiPost<{ message: string }>(
      `${ENDPOINT}/${id}/skills`,
      { skillid },
      { token }
    );
  },

  // Xóa kỹ năng của user
  removeSkill: (id: number, skillid: number, token: string) => {
    return apiDelete<void>(`${ENDPOINT}/${id}/skills/${skillid}`, { token });
  },

  // Xóa user (admin only - cascade delete)
  delete: (id: number, token: string) => {
    return apiDelete<void>(`${ENDPOINT}/${id}`, { token });
  },

  // Cập nhật CV
  updateCV: async (id: number, file: File, token: string) => {
    const formData = new FormData();
    formData.append("cv", file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_ENDPOINT}${ENDPOINT}/${id}/cv`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update CV");
    }

    return response.json() as Promise<{ message: string; data: User }>;
  },
};
