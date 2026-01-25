import { useState } from "react";
import { toast } from "sonner";
import { postApi } from "@/apis/post.api";
import type { FullPostResponse } from "@/types/api.type";

interface UseEditPostProps {
  posts: FullPostResponse[];
  token: string | null;
  onSuccess?: () => void;
}

export function useEditPost({ posts, token, onSuccess }: UseEditPostProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<FullPostResponse | null>(null);

  const handleEditPost = (postId: number) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setPostToEdit(post);
      setEditDialogOpen(true);
    }
  };

  const handleSaveEditedPost = async (
    postId: number,
    content: string,
    newImages: File[],
    keepImageUrls: string[],
  ) => {
    if (!token) return;

    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) {
        throw new Error("Post not found");
      }

      const updateData: any = { content };
      if (post.user?.id) {
        updateData.userId = post.user.id;
      } else if (post.company?.id) {
        updateData.companyId = post.company.id;
      }

      await postApi.updateWithImages(
        postId,
        updateData,
        newImages.length > 0 ? newImages : undefined,
        keepImageUrls,
        token,
      );

      if (onSuccess) {
        onSuccess();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Không thể cập nhật bài viết");
      throw error;
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!token) return;

    try {
      await postApi.delete(postId, token);
      
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Không thể xóa bài viết");
    }
  };

  return {
    editDialogOpen,
    setEditDialogOpen,
    postToEdit,
    handleEditPost,
    handleSaveEditedPost,
    handleDeletePost,
  };
}
