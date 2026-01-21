"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainContent from "@/sections/user/QA/main-content/mainContent";
import RightSidebar from "@/sections/user/QA/right-sidebar/rightSidebar";
import LeftSidebar from "@/sections/user/QA/left-sidebar/leftSidebar";
import { usePosts, useInfiniteScroll } from "@/hooks/usePost";
import { interactionApi } from "@/apis/interaction.api";
import { companyApi, blogApi, followApi } from "@/apis";
import { useAuth } from "@/hooks/useAuth";
import type { FullPostResponse, BlogResponse, Company } from "@/types/api.type";
import { ROUTES } from "@/configs";
import { followList as testFollowList } from "@/types/test.type";

export default function QAPage() {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // All useState hooks must be at the top, before any conditional returns
  const [loadingCommentsForPost, setLoadingCommentsForPost] = useState<
    number | null
  >(null);
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [suggestedCompanies, setSuggestedCompanies] = useState<Company[]>([]);
  const [followedCompanyIds, setFollowedCompanyIds] = useState<number[]>([]);

  // All custom hooks must be called before any conditional returns
  const { posts, loading, hasMore, loadMore, setPosts } = usePosts(
    user?.id || undefined,
    token,
  );

  // Fetch side data
  useEffect(() => {
    const fetchSideData = async () => {
      try {
        // Fetch blogs
        const blogRes = await blogApi.getAll(1, 5);
        if (blogRes.data) {
          // Flatten if paginated structure is different, but assuming .data is array
          const blogData = Array.isArray(blogRes.data)
            ? blogRes.data
            : (blogRes.data as any).data || [];
          setBlogs(blogData);
        }

        // Fetch suggested companies
        const companyRes = await companyApi.getAll(1, 5);
        if (companyRes.data) {
          const companyData = Array.isArray(companyRes.data)
            ? companyRes.data
            : (companyRes.data as any).data || [];
          setSuggestedCompanies(companyData);
        }

        // Fetch followed companies if user is logged in
        if (user && token) {
          const followRes = await followApi.getFollowsByUser(
            user.id,
            1,
            100,
            token,
          ); // Get all follows to check
          if (followRes.data) {
            const follows = Array.isArray(followRes.data)
              ? followRes.data
              : (followRes.data as any).data || [];
            setFollowedCompanyIds(follows.map((f: any) => f.companyId));
          } else if (followRes.follows) {
            // Handle alternative response structure if any
            setFollowedCompanyIds(
              followRes.follows.map((f: any) => f.companyId),
            );
          }
        }
      } catch (error) {
        console.error("Error fetching side data:", error);
      }
    };

    if (!authLoading) {
      fetchSideData();
    }
  }, [authLoading, user, token]);

  // Infinite scroll ref - must be called before conditional return
  const loadMoreRef = useInfiniteScroll(loadMore, hasMore, loading);

  // Check authentication using context loading state
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(ROUTES.ACCESS_DENIED);
    }
  }, [authLoading, isAuthenticated, router]);

  // Scroll to top when content is ready to prevent auto-scrolling to bottom
  useEffect(() => {
    if (!authLoading) {
      window.scrollTo(0, 0);
    }
  }, [authLoading]);

  // Show loading while checking auth (conditional return after all hooks)
  if (authLoading || !isAuthenticated) {
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
            : post,
        ),
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
          : post,
      ),
    );
  };

  // Handle add comment with auth check
  const handleAddComment = async (
    postId: number,
    content: string,
    attachments?: File[],
  ) => {
    if (!isAuthenticated) return;
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
                  comments: [newComment, ...post.interaction.comments],
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

  // Handle edit comment
  const handleEditComment = async (
    postId: number,
    commentId: number,
    content: string,
    attachments?: File[],
    keepImageUrls?: string[],
  ) => {
    if (!isAuthenticated || !user || !token) return;

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
                  comments: post.interaction.comments.map((c) =>
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

  // Handle delete comment
  const handleDeleteComment = async (postId: number, commentId: number) => {
    if (!isAuthenticated || !user || !token) return;

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
                  comments: post.interaction.comments.filter(
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
        token,
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
            : p,
        ),
      );
    } catch (error) {
      console.error("Failed to load more comments:", error);
    } finally {
      setLoadingCommentsForPost(null);
    }
  };

  return (
    <div className="min-h-screen bg-background mt-20">
      <div className="max-w-[1400px] mx-auto flex justify-center lg:justify-between px-4 gap-4">
        {/* LEFT SIDEBAR - Profile + Friends (Fixed) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="fixed top-20 w-64 h-[calc(100vh-5rem)] overflow-hidden">
            <LeftSidebar followList={testFollowList} />
          </div>
        </aside>

        {/* MAIN CONTENT - Scrollable */}
        <main className="flex-1 min-w-0 max-w-2xl lg:max-w-none">
          <div className="max-w-2xl mx-auto">
            <MainContent
              posts={posts}
              loading={loading}
              onLikePost={handleLikePost}
              onToggleComments={handleToggleComments}
              onAddComment={handleAddComment}
              onEditComment={(postId, commentId, content, attachments) =>
                handleEditComment(postId, commentId, content, attachments)
              }
              onDeleteComment={(postId, commentId) =>
                handleDeleteComment(postId, commentId)
              }
              onLoadMoreComments={handleLoadMoreComments}
              loadingCommentsForPost={loadingCommentsForPost}
              currentUserAvatar={user?.avatar}
              currentUserName={user?.fullName}
              currentUserId={user?.id}
            />
            {/* Infinite scroll trigger */}
            <div ref={loadMoreRef} className="h-10" />
          </div>
        </main>

        {/* RIGHT SIDEBAR - Company Posts + Followed Companies (Fixed) */}
        <aside className="hidden md:block w-[340px] flex-shrink-0">
          <div
            className="fixed top-20 w-[340px] h-[calc(100vh-5rem)] overflow-hidden"
            style={{
              right: "max(1rem, calc((100vw - 1400px)/2 + 1rem))",
            }}
          >
            <RightSidebar
              followList={suggestedCompanies}
              companyPosts={blogs}
              followedCompanyIds={followedCompanyIds}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
