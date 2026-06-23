import { toast } from "sonner";
import EditPostDialog from "@/components/common/modals/qa/edit-post-modal";
import CreatePostForm from "@/components/common/forms/qa/CreatePostForm";
import PostList from "@/components/sections/qa/main-content/post-list.section";
import { useAuth } from "@/lib/hooks/useAuth";
import { useCreatePost } from "@/lib/hooks/useCreatePost";
import { useEditPost } from "@/lib/hooks/useEditPost";
import type { MainContentProps } from "@/types";

function MainContent({
  posts,
  loading,
  onLikePost,
  onToggleComments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLoadMoreComments,
  loadingCommentsForPost,
  currentUserAvatar,
  currentUserName = "",
  currentUserId,
}: MainContentProps) {
  const { user, token, isAuthenticated } = useAuth();

  const createPostHook = useCreatePost({
    userid: user?.id,
    token,
    isAuthenticated,
  });

  const editPostHook = useEditPost({
    posts,
    token,
  });

  const handleDeletePostWithAuth = (postid: number) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thực hiện thao tác này");
      return;
    }
    editPostHook.handleDeletePost(postid);
  };

  return (
    <div className="w-full">
      <main className="md:col-span-2 space-y-4 lg:space-y-6">
        <CreatePostForm
          newPost={createPostHook.newPost}
          setNewPost={createPostHook.setNewPost}
          selectedImages={createPostHook.selectedImages}
          selectedVideo={createPostHook.selectedVideo}
          isCreatingPost={createPostHook.isCreatingPost}
          isAuthenticated={isAuthenticated}
          currentUserAvatar={currentUserAvatar || user?.avatar}
          currentUserName={currentUserName || user?.fullname}
          imageInputRef={createPostHook.imageInputRef}
          videoInputRef={createPostHook.videoInputRef}
          onImageSelect={createPostHook.handleImageSelect}
          onVideoSelect={createPostHook.handleVideoSelect}
          onRemoveImage={createPostHook.removeSelectedImage}
          onRemoveVideo={createPostHook.removeSelectedVideo}
          onSubmit={createPostHook.handlePostSubmit}
        />

        <PostList
          posts={posts}
          loading={loading}
          currentUserAvatar={currentUserAvatar || user?.avatar}
          currentUserName={currentUserName || user?.fullname}
          currentUserId={currentUserId || user?.id}
          onLikePost={onLikePost}
          onToggleComments={onToggleComments}
          onAddComment={onAddComment}
          onEditComment={onEditComment}
          onDeleteComment={onDeleteComment}
          onLoadMoreComments={onLoadMoreComments}
          loadingCommentsForPost={loadingCommentsForPost}
          onEditPost={editPostHook.handleEditPost}
          onDeletePost={handleDeletePostWithAuth}
        />
      </main>

      <EditPostDialog
        open={editPostHook.editDialogOpen}
        onOpenChange={editPostHook.setEditDialogOpen}
        post={editPostHook.postToEdit}
        onSave={editPostHook.handleSaveEditedPost}
      />
    </div>
  );
}

export default MainContent;
