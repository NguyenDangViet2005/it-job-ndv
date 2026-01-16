import {
  apiPost,
  apiPut,
  apiDelete,
  apiGetPaginated,
  apiGetById,
  apiGet,
} from "./api";
import type {
  ApiResponse,
  PostResponse,
  PostRequest,
  ResponseData,
} from "@/types/api.type";

const ENDPOINT = "/post";

export const postApi = {
  // Lấy danh sách bài đăng với pagination
  getAll: (
    pageNumber: number = 1,
    pageSize: number = 10,
    currentUserId?: number,
    token?: string
  ) => {
    const params: Record<string, string | number> = { pageNumber, pageSize };
    if (currentUserId) params.currentUserId = currentUserId;
    return apiGet<ResponseData<PostResponse>>(ENDPOINT, { params, token });
  },

  // Lấy chi tiết bài đăng
  getById: (id: number, currentUserId?: number, token?: string) => {
    const params: Record<string, string | number> = {};
    if (currentUserId) params.currentUserId = currentUserId;
    return apiGet<PostResponse>(`${ENDPOINT}/${id}`, { params, token });
  },

  // Lấy bài đăng theo user
  getByUser: (
    userId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    currentUserId?: number,
    token?: string
  ) => {
    const params: Record<string, string | number> = { pageNumber, pageSize };
    if (currentUserId) params.currentUserId = currentUserId;
    return apiGet<ResponseData<PostResponse>>(`${ENDPOINT}/user/${userId}`, {
      params,
      token,
    });
  },

  // Lấy bài đăng theo company
  getByCompany: (
    companyId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    currentUserId?: number,
    token?: string
  ) => {
    const params: Record<string, string | number> = { pageNumber, pageSize };
    if (currentUserId) params.currentUserId = currentUserId;
    return apiGet<ResponseData<PostResponse>>(
      `${ENDPOINT}/company/${companyId}`,
      { params, token }
    );
  },

  // Tạo bài đăng mới với attachments
  create: async (
    data: { content: string; userId?: number; companyId?: number },
    images?: File[],
    video?: File,
    token?: string
  ) => {
    const formData = new FormData();
    formData.append("content", data.content);
    if (data.userId) formData.append("userId", data.userId.toString());
    if (data.companyId) formData.append("companyId", data.companyId.toString());

    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    if (video) {
      formData.append("video", video);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_ENDPOINT}${ENDPOINT}`,
      {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create post");
    }

    return response.json() as Promise<PostResponse>;
  },

  // Cập nhật bài đăng (chỉ text)
  update: (id: number, data: PostRequest, token: string) => {
    return apiPut<ApiResponse<PostResponse>>(`${ENDPOINT}/${id}`, data, {
      token,
    });
  },

  // Cập nhật bài đăng với ảnh
  updateWithImages: async (
    id: number,
    data: { content: string; userId?: number; companyId?: number },
    images?: File[],
    keepImageUrls?: string[],
    token?: string
  ) => {
    const formData = new FormData();
    formData.append("content", data.content);
    if (data.userId) formData.append("userId", data.userId.toString());
    if (data.companyId) formData.append("companyId", data.companyId.toString());

    // Add keepImageUrls array
    if (keepImageUrls && keepImageUrls.length > 0) {
      keepImageUrls.forEach((url) => {
        formData.append("keepImageUrls[]", url);
      });
    }

    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_ENDPOINT}${ENDPOINT}/${id}`,
      {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update post");
    }

    return response.json() as Promise<PostResponse>;
  },

  // Xóa bài đăng
  delete: (id: number, token: string) => {
    return apiDelete<ApiResponse<void>>(`${ENDPOINT}/${id}`, { token });
  },

  // Lấy comments của bài đăng
  getComments: (
    postId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token?: string
  ) => {
    return apiGetPaginated<any>(
      `${ENDPOINT}/${postId}/comments`,
      pageNumber,
      pageSize,
      { token }
    );
  },

  // Toggle like bài đăng
  toggleLike: (postId: number, userId: number, token?: string) => {
    return apiPost<{ isLiked: boolean; totalLikes: number }>(
      `${ENDPOINT}/${postId}/like`,
      { userId },
      { token }
    );
  },
};
