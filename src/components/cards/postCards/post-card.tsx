"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import PostHeader from "@/components/cards/postCards/post-header";
import PostMedia from "@/components/cards/postCards/post-media";
import PostActions from "@/components/cards/postCards/post-actions";
import PostComments, {
  PostCommentsRef,
} from "@/components/cards/postCards/post-comments";
import PostLightbox from "@/components/modals/post-lightbox.modal";
import { useAuth } from "@/hooks/useAuth";
import type { PostCardProps } from "@/types/post-card.types";

export default function PostCard({
  post,
  index = 0,
  currentUserAvatar,
  currentUserName = "Bạn",
  currentUserId,
  isSaved = false,
  onLikePost,
  onToggleComments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLoadMoreComments,
  onSavePost,
  onReportPost,
  onEditPost,
  onDeletePost,
  loadingComments = false,
}: PostCardProps) {
  const { user } = useAuth();
  const userid = currentUserId || user?.id;
  const commentInputRef = useRef<PostCommentsRef>(null);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState<
    { url: string; type: "image" | "video" }[]
  >([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Open lightbox
  const openLightbox = (
    media: { url: string; type: "image" | "video" }[],
    startIndex: number = 0,
  ) => {
    setLightboxMedia(media);
    setCurrentMediaIndex(startIndex);
    setLightboxOpen(true);
  };

  const handleAddComment = async (content: string, attachments?: File[]) => {
    await onAddComment(post.id, content, attachments);
  };

  const handleEditComment = async (
    commentId: number,
    content: string,
    attachments?: File[],
  ) => {
    if (onEditComment) {
      await onEditComment(commentId, content, attachments);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (onDeleteComment) {
      await onDeleteComment(commentId);
    }
  };

  const handleLoadMoreComments = async () => {
    if (onLoadMoreComments) {
      await onLoadMoreComments(post.id);
    }
  };

  return (
    <>
      <Card
        className="hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <CardContent>
          {/* Post Header */}
          <PostHeader
            post={post}
            postid={post.id}
            currentUserId={currentUserId || undefined}
            currentUserAvatar={currentUserAvatar}
            currentUserName={currentUserName}
            isSaved={isSaved}
            onSave={onSavePost}
            onReport={onReportPost}
            onEdit={onEditPost}
            onDelete={onDeletePost}
          />

          {/* Post Title - Legacy support */}
          {post.title && (
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
          )}

          {/* Post Content */}
          <p className="mb-4">{post.content}</p>

          <PostMedia
            attachments={post.attachments}
            images={post.images} // Legacy
            video={post.video} // Legacy
            onOpenLightbox={openLightbox}
          />

          {/* Post Actions */}
          <PostActions
            likes={post.interaction?.totalLikes || post.likes || 0}
            liked={
              post.interaction?.islikedByCurrentUser || post.liked || false
            }
            totalComments={
              post.interaction?.totalComments ||
              ("totalComments" in post ? post.totalComments : 0) ||
              ("comments" in post && Array.isArray(post.comments)
                ? post.comments.length
                : 0) ||
              0
            }
            shares={post.shares || 0}
            onLike={() => onLikePost(post.id)}
            onToggleComments={() => onToggleComments(post.id)}
            onCommentButtonClick={() => {
              if (!post.showComments) {
                onToggleComments(post.id);
              }
              // Wait for render if it wasn't visible
              setTimeout(() => {
                commentInputRef.current?.focusInput();
              }, 100);
            }}
          />

          {/* Comments Section */}
          <PostComments
            ref={commentInputRef}
            post={post}
            currentUserAvatar={currentUserAvatar}
            currentUserName={currentUserName}
            currentUserId={userid}
            loadingComments={loadingComments}
            onAddComment={handleAddComment}
            onEditComment={onEditComment ? handleEditComment : undefined}
            onDeleteComment={onDeleteComment ? handleDeleteComment : undefined}
            onToggleComments={() => onToggleComments(post.id)}
            onLoadMoreComments={handleLoadMoreComments}
          />
        </CardContent>
      </Card>

      {/* Lightbox Modal */}
      <PostLightbox
        open={lightboxOpen}
        media={lightboxMedia}
        initialIndex={currentMediaIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
