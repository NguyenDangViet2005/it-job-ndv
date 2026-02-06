import { useState } from "react";
import { toast } from "sonner";
import { postApi } from "@/apis/post.api";
import { Post } from "@/types";

interface UseEditPostProps {
  posts: Post[];
  token: string | null;
  onSuccess?: () => void;
}

export function useEditPost({ posts, token, onSuccess }: UseEditPostProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);

  const handleEditPost = (postid: number) => {
    const post = posts.find((p) => p.id === postid);
    if (post) {
      setPostToEdit(post);
      setEditDialogOpen(true);
    }
  };

  const handleSaveEditedPost = async (
    postid: number,
    content: string,
    newImages: File[],
    keepImageUrls: string[],
  ) => {
    if (!token) return;

    try {
      const post = posts.find((p) => p.id === postid);
      if (!post) {
        throw new Error("Post not found");
      }

      const updateData: any = { content };
      if (post.user?.id) {
        updateData.userid = post.user.id;
      } else if (post.company?.id) {
        updateData.companyid = post.company.id;
      }

      await postApi.updateWithImages(
        postid,
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

  const handleDeletePost = async (postid: number) => {
    if (!token) return;

    try {
      await postApi.delete(postid, token);
      
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
