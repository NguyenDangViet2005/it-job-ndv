"use client";

import MainContent from "@/components/sections/qa/MainContent";
import { useInfiniteScroll } from "@/lib/hooks/usePost";
import { useQAPage } from "@/lib/hooks/useQAPage";
import { usePostInteractions } from "@/lib/hooks/usePostInteractions";
import QAPageLayout from "@/components/layouts/user.QA.layout"; 
import LoadingScreen from "@/components/common/loading-screen";

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
    return <LoadingScreen fullScreen={true} message="Đang tải dữ liệu..." />;
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
