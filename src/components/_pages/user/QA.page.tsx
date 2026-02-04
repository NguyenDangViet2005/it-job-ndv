"use client";

import MainContent from "@/components/sections/qa/MainContent";
import { useInfiniteScroll } from "@/lib/hooks/usePost";
import { useQAPage } from "@/lib/hooks/useQAPage";
import { usePostInteractions } from "@/lib/hooks/usePostInteractions";
import QAPageLayout from "@/components/layouts/user.QA.layout"; 

export default function QAPage() {
  const {
    user,
    token,
    isAuthenticated,
    authLoading,
    posts,
    loading,
    hasMore,
    loadMore,
    setPosts,
    loadingCommentsForPost,
    setLoadingCommentsForPost,
    blogs,
    suggestedCompanies,
    followedCompanyIds,
    connections,
  } = useQAPage();

  const {
    handleLikePost,
    handleToggleComments,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
    handleLoadMoreComments,
  } = usePostInteractions({
    isAuthenticated,
    user,
    token,
    setPosts,
    setLoadingCommentsForPost,
    posts,
  });

  const loadMoreRef = useInfiniteScroll(loadMore, hasMore, loading);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <QAPageLayout
      blogs={blogs}
      suggestedCompanies={suggestedCompanies}
      followedCompanyIds={followedCompanyIds}
      connections={connections}
    >
      <MainContent
        posts={posts}
        loading={loading}
        onLikePost={handleLikePost}
        onToggleComments={handleToggleComments}
        onAddComment={handleAddComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
        onLoadMoreComments={handleLoadMoreComments}
        loadingCommentsForPost={loadingCommentsForPost}
        currentUserAvatar={user?.avatar}
        currentUserName={user?.fullname}
        currentUserId={user?.id}
      />
      <div ref={loadMoreRef} className="h-10" />
    </QAPageLayout>
  );
}
