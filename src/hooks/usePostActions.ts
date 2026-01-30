import { useState } from "react";
import { postApi } from "@/apis";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner"; // hoặc notification library bạn đang dùng

export function usePostActions() {
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  const currentUserId = user?.id;

  const handleSavePost = async (postId: number) => {
    try {
      setLoading(true);
      // TODO: Implement save post API
      // await postApi.savePost(postId, currentUserId);
      toast?.success?.("Đã lưu bài viết");
    } catch (error) {
      toast?.error?.("Không thể lưu bài viết");
    } finally {
      setLoading(false);
    }
  };

  const handleReportPost = async (postId: number) => {
    try {
      setLoading(true);
      // TODO: Implement report post API
      // await postApi.reportPost(postId, currentUserId);
      toast?.success?.("Đã báo cáo bài viết");
    } catch (error) {
      toast?.error?.("Không thể báo cáo bài viết");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = async (postId: number) => {
    try {
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      setLoading(true);
      if (!token) {
        toast?.error?.("Vui lòng đăng nhập");
        return;
      }

      await postApi.delete(postId, token);
      toast?.success?.("Đã xóa bài viết");

      // Refresh posts list
      window.location.reload(); // hoặc dùng state management để update
    } catch (error) {
      console.error("Error deleting post:", error);
      toast?.error?.("Không thể xóa bài viết");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSavePost,
    handleReportPost,
    handleEditPost,
    handleDeletePost,
  };
}
