"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import PostHeader from "@/components/cards/postCards/post-header";
import PostMedia from "@/components/cards/postCards/post-media";
import PostActions from "@/components/cards/postCards/post-actions";
import PostComments from "@/components/cards/postCards/post-comments";
import PostLightbox from "@/components/modals/post-lightbox.modal";
import { useAuth } from "@/hooks/useAuth";
import type {
  PostCardProps,
  NormalizedPost,
} from "@/types/post-card.types";
import {
  isApiPost,
  getAttachmentsArray,
  getCommentsArray,
} from "@/types/post-card.types";
import type { CommentResponse, AttachmentResponse } from "@/types/api.type";

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
  const userId = currentUserId || user?.id;

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState<
    { url: string; type: "image" | "video" }[]
  >([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Open lightbox
  const openLightbox = (
    media: { url: string; type: "image" | "video" }[],
    startIndex: number = 0
  ) => {
    setLightboxMedia(media);
    setCurrentMediaIndex(startIndex);
    setLightboxOpen(true);
  };

  // Normalize post data
  const normalizedPost: NormalizedPost = isApiPost(post)
    ? {
        id: post.id,
        userId: post.user?.id,
        author: post.user?.fullName || currentUserName,
        avatar: post.user?.avatar || currentUserAvatar,
        role: undefined,
        timestamp: post.createdAt
          ? new Date(post.createdAt).toLocaleDateString("vi-VN")
          : "Vừa xong",
        title: undefined,
        content: post.content,
        image: undefined,
        images: getAttachmentsArray(post.attachments)
          .filter((a: AttachmentResponse) => a.fileType === "image")
          .map((a: AttachmentResponse) => a.fileUrl),
        video: getAttachmentsArray(post.attachments).find(
          (a: AttachmentResponse) => a.fileType === "video"
        )?.fileUrl,
        likes: post.interaction?.totalLikes || 0,
        liked: post.interaction?.isLikedByCurrentUser || false,
        comments: getCommentsArray(post.interaction?.comments).map(
          (c: CommentResponse) => ({
            id: c.id,
            userId: c.User?.id || c.user?.id,
            author: c.User?.fullName || c.user?.fullName || "Unknown",
            avatar: c.User?.avatar || c.user?.avatar || "",
            content: c.content,
            timestamp: c.createdAt
              ? new Date(c.createdAt).toLocaleDateString("vi-VN")
              : "Vừa xong",
            likes: 0,
            attachments: c.Attachments || c.attachments || [],
          })
        ),
        totalComments: post.interaction?.totalComments || 0,
        showComments: post.showComments || false,
        shares: 0,
      }
    : {
        ...post,
        userId: undefined,
        author: post.author || currentUserName,
        avatar: post.avatar || currentUserAvatar,
        timestamp: post.timestamp || "Vừa xong",
        images: post.images || (post.image ? [post.image] : []),
        video: undefined,
        totalComments: post.comments.length,
        showComments: post.showComments || false,
        shares: post.shares || 0,
      };

  const handleAddComment = async (content: string, attachments?: File[]) => {
    await onAddComment(post.id, content, attachments);
  };

  const handleEditComment = async (
    commentId: number,
    content: string,
    attachments?: File[]
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
        <CardContent className="pt-6">
          {/* Post Header */}
          <PostHeader
            post={normalizedPost}
            postId={post.id}
            currentUserId={currentUserId || undefined}
            currentUserAvatar={currentUserAvatar}
            currentUserName={currentUserName}
            isSaved={isSaved}
            onSave={onSavePost}
            onReport={onReportPost}
            onEdit={onEditPost}
            onDelete={onDeletePost}
          />

          {/* Post Title */}
          {normalizedPost.title && (
            <h2 className="text-xl font-bold mb-2">{normalizedPost.title}</h2>
          )}

          {/* Post Content */}
          <p className="mb-4">{normalizedPost.content}</p>

          {/* Media (Images/Video) */}
          <PostMedia
            images={normalizedPost.images}
            video={normalizedPost.video}
            onOpenLightbox={openLightbox}
          />

          {/* Post Actions */}
          <PostActions
            likes={normalizedPost.likes}
            liked={normalizedPost.liked}
            totalComments={normalizedPost.totalComments}
            shares={normalizedPost.shares}
            onLike={() => onLikePost(post.id)}
            onToggleComments={() => onToggleComments(post.id)}
          />

          {/* Comments Section */}
          <PostComments
            post={normalizedPost}
            currentUserAvatar={currentUserAvatar}
            currentUserName={currentUserName}
            currentUserId={userId}
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
