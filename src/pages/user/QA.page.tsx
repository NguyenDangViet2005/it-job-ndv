"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainContent from "@/sections/user/QA/main-content/mainContent";
import RightSidebar from "@/sections/user/QA/right-sidebar/rightSidebar";
import LeftSidebar from "@/sections/user/QA/left-sidebar/leftSidebar";
import { companyPosts, followList } from "@/types/test.type";
import { usePosts, useInfiniteScroll } from "@/hooks/usePost";
import { interactionApi } from "@/apis/interaction.api";
import { useAuth } from "@/hooks/useAuth";
import type { FullPostResponse } from "@/types/api.type";
import { ROUTES } from "@/configs";

export default function QAPage() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();

  // All useState hooks must be at the top, before any conditional returns
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loadingCommentsForPost, setLoadingCommentsForPost] = useState<
    number | null
  >(null);

  // All custom hooks must be called before any conditional returns
  const { posts, loading, hasMore, loadMore, setPosts } = usePosts(
    user?.id || undefined,
    token
  );

  // Infinite scroll ref - must be called before conditional return
  const loadMoreRef = useInfiniteScroll(loadMore, hasMore, loading);

  // Check authentication on mount
  useEffect(() => {
    const checkAuthentication = () => {
      // Check localStorage for token
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken && !isAuthenticated) {
        router.push(ROUTES.ACCESS_DENIED);
        return;
      }

      setIsCheckingAuth(false);
    };

    checkAuthentication();
  }, [isAuthenticated, router]);

  // Show loading while checking auth (conditional return after all hooks)
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Handle like post with auth check
  const handleLikePost = async (postId: number) => {
    if (!isAuthenticated) return;
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
            : post
        )
      );
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  // Handle toggle comments
  const handleToggleComments = (postId: number) => {
    setPosts((prev: FullPostResponse[]) =>
      prev.map((post: FullPostResponse) =>
        post.id === postId
          ? { ...post, showComments: !(post as any).showComments }
          : post
      )
    );
  };

  // Handle add comment with auth check
  const handleAddComment = async (postId: number, content: string) => {
    if (!isAuthenticated) return;
    if (!user || !token) return;

    try {
      const newComment = await interactionApi.addComment(
        postId,
        user.id,
        content,
        token
      );

      setPosts((prev: FullPostResponse[]) =>
        prev.map((post: FullPostResponse) =>
          post.id === postId
            ? {
                ...post,
                interaction: {
                  ...post.interaction,
                  totalComments: post.interaction.totalComments + 1,
                  comments: [newComment, ...post.interaction.comments],
                },
                showComments: true,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  // Handle load more comments for a specific post
  const handleLoadMoreComments = async (postId: number) => {
    if (!token) return;

    setLoadingCommentsForPost(postId);
    try {
      const post = posts.find((p: FullPostResponse) => p.id === postId);
      if (!post) return;

      const currentPage = Math.ceil(post.interaction.comments.length / 10);
      const response = await interactionApi.getComments(
        postId,
        currentPage + 1,
        10,
        token
      );

      setPosts((prev: FullPostResponse[]) =>
        prev.map((p: FullPostResponse) =>
          p.id === postId
            ? {
                ...p,
                interaction: {
                  ...p.interaction,
                  comments: [...p.interaction.comments, ...response.data],
                },
              }
            : p
        )
      );
    } catch (error) {
      console.error("Failed to load more comments:", error);
    } finally {
      setLoadingCommentsForPost(null);
    }
  };

  return (
    <div className="min-h-screen bg-background mt-20">
      <div className="max-w-7xl mx-auto flex">
        {/* LEFT SIDEBAR - Profile + Friends (Fixed, No Scroll) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="fixed top-20 w-64 h-[calc(100vh-7rem)] overflow-hidden">
            <LeftSidebar followList={followList} />
          </div>
        </aside>

        {/* MAIN CONTENT - Scrollable */}
        <main className="flex-1 min-w-0 px-6">
          <div className="max-w-2xl mx-auto">
            <MainContent
              posts={posts}
              loading={loading}
              onLikePost={handleLikePost}
              onToggleComments={handleToggleComments}
              onAddComment={handleAddComment}
              onLoadMoreComments={handleLoadMoreComments}
              loadingCommentsForPost={loadingCommentsForPost}
              currentUserAvatar={user?.avatar}
              currentUserName={user?.fullName}
            />
            {/* Infinite scroll trigger */}
            <div ref={loadMoreRef} className="h-10" />
          </div>
        </main>

        {/* RIGHT SIDEBAR - Company Posts + Followed Companies (Fixed, No Scroll) */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="fixed top-20 right-[calc((100vw-1280px)/2)] w-64 h-[calc(100vh-7rem)] overflow-hidden">
            <RightSidebar followList={followList} companyPosts={companyPosts} />
          </div>
        </aside>
      </div>
    </div>
  );
}
