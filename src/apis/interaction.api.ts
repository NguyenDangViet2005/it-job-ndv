import { apiPost, apiDelete, apiGetPaginated } from "./api";
import type { CommentResponse, LikeResponse } from "@/types/api.type";

const ENDPOINT = "/api/Post";

export const interactionApi = {
  // Toggle like cho bài post
  toggleLike: (postId: number, userId: number, token: string) => {
    return apiPost<LikeResponse>(
      `${ENDPOINT}/${postId}/like`,
      { postId, userId },
      { token }
    );
  },

  // Lấy comments của bài post với pagination
  getComments: (
    postId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    token?: string
  ) => {
    return apiGetPaginated<CommentResponse>(
      `${ENDPOINT}/${postId}/comments`,
      pageNumber,
      pageSize,
      { token }
    );
  },

  // Thêm comment vào bài post
  addComment: async (
    postId: number,
    userId: number,
    content: string,
    token: string,
    attachments?: File[]
  ) => {
    const formData = new FormData();
    formData.append("PostId", postId.toString());
    formData.append("UserId", userId.toString());
    formData.append("Content", content);

    if (attachments && attachments.length > 0) {
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_ENDPOINT}${ENDPOINT}/${postId}/comment`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add comment");
    }

    return response.json() as Promise<CommentResponse>;
  },

  // Xóa comment
  deleteComment: (
    postId: number,
    commentId: number,
    userId: number,
    token: string
  ) => {
    return apiDelete<void>(`${ENDPOINT}/${postId}/comment/${commentId}`, {
      token,
      params: { userId },
    });
  },
};
