import { toast } from "sonner";
import { interactionApi } from "@/apis/interaction.api";
import type { FullPostResponse } from "@/types/api.type";

interface UsePostInteractionsProps {
  isAuthenticated: boolean;
  user: any;
  token: string | null;
  setPosts: React.Dispatch<React.SetStateAction<FullPostResponse[]>>;
  setLoadingCommentsForPost: React.Dispatch<
    React.SetStateAction<number | null>
  >;
  posts: FullPostResponse[];
}

export function usePostInteractions({
  isAuthenticated,
  user,
  token,
  setPosts,
  setLoadingCommentsForPost,
  posts,
}: UsePostInteractionsProps) {
  const handleLikePost = async (postId: number) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thực hiện thao tác này");
      return;
    }
    if (!user || !token) return;

    try {
      const result = await interactionApi.toggleLike(postId, user.id, token);

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                interaction: {
                  ...post.interaction,
                  isLikedByCurrentUser: result.isLiked,
                  totalLikes: result.totalLikes,
                },
              }
            : post,
        ),
      );
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleToggleComments = (postId: number) => {
    setPosts((prev: FullPostResponse[]) =>
      prev.map((post: FullPostResponse) =>
        post.id === postId
          ? { ...post, showComments: !(post as any).showComments }
          : post,
      ),
    );
  };

  const handleAddComment = async (
    postId: number,
    content: string,
    attachments?: File[],
  ) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thực hiện thao tác này");
      return;
    }
    if (!user || !token) return;

    try {
      const newComment = await interactionApi.addComment(
        postId,
        user.id,
        content,
        token,
        attachments,
      );

      setPosts((prev: FullPostResponse[]) =>
        prev.map((post: FullPostResponse) =>
          post.id === postId
            ? {
                ...post,
                interaction: {
                  ...post.interaction,
                  totalComments: post.interaction.totalComments + 1,
                  comments: [newComment, ...(post.interaction.comments || [])],
                },
                showComments: true,
              }
            : post,
        ),
      );
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleEditComment = async (
    postId: number,
    commentId: number,
    content: string,
    attachments?: File[],
    keepImageUrls?: string[],
  ) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thực hiện thao tác này");
      return;
    }
    if (!user || !token) return;

    try {
      const updatedComment = await interactionApi.updateComment(
        postId,
        commentId,
        user.id,
        content,
        token,
        attachments,
        keepImageUrls,
      );

      setPosts((prev: FullPostResponse[]) =>
        prev.map((post: FullPostResponse) =>
          post.id === postId
            ? {
                ...post,
                interaction: {
                  ...post.interaction,
                  comments: (post.interaction.comments || []).map((c) =>
                    c.id === commentId ? updatedComment : c,
                  ),
                },
              }
            : post,
        ),
      );
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  const handleDeleteComment = async (postId: number, commentId: number) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thực hiện thao tác này");
      return;
    }
    if (!user || !token) return;

    try {
      await interactionApi.deleteComment(postId, commentId, user.id, token);

      setPosts((prev: FullPostResponse[]) =>
        prev.map((post: FullPostResponse) =>
          post.id === postId
            ? {
                ...post,
                interaction: {
                  ...post.interaction,
                  totalComments: post.interaction.totalComments - 1,
                  comments: (post.interaction.comments || []).filter(
                    (c) => c.id !== commentId,
                  ),
                },
              }
            : post,
        ),
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleLoadMoreComments = async (postId: number) => {
    if (!token) return;

    setLoadingCommentsForPost(postId);
    try {
      const post = posts.find((p: FullPostResponse) => p.id === postId);
      if (!post) return;

      const currentPage = Math.ceil(
        (post.interaction.comments || []).length / 10,
      );
      const response = await interactionApi.getComments(
        postId,
        currentPage + 1,
        10,
        token,
      );

      setPosts((prev: FullPostResponse[]) =>
        prev.map((p: FullPostResponse) =>
          p.id === postId
            ? {
                ...p,
                interaction: {
                  ...p.interaction,
                  comments: [
                    ...(p.interaction.comments || []),
                    ...(response.data || []),
                  ],
                },
              }
            : p,
        ),
      );
    } catch (error) {
      console.error("Failed to load more comments:", error);
    } finally {
      setLoadingCommentsForPost(null);
    }
  };

  return {
    handleLikePost,
    handleToggleComments,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
    handleLoadMoreComments,
  };
}
