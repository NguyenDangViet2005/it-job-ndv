"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import PostHeader from "@/components/post/post-header";
import PostMedia from "@/components/post/post-media";
import PostActions from "@/components/post/post-actions";
import PostComments from "@/components/post/post-comments.section";
import PostLightbox from "@/components/modals/post-lightbox.modal";
import { useAuth } from "@/hooks/useAuth";
import type {
  PostCardProps,
  NormalizedPost,
} from "@/components/post/post-card.types";
import {
  isApiPost,
  getAttachmentsArray,
  getCommentsArray,
} from "@/components/post/post-card.types";
import type { CommentResponse, AttachmentResponse } from "@/types/api.type";

export default function PostCard({
  post,
  index = 0,
  currentUserAvatar,
  currentUserName = "Bạn",
  isSaved = false,
  onLikePost,
  onToggleComments,
  onAddComment,
  onLoadMoreComments,
  onSavePost,
  onReportPost,
  onEditPost,
  onDeletePost,
  loadingComments = false,
}: PostCardProps) {
  const { user } = useAuth();
  const currentUserId = user?.id;

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
            userId: c.user?.id,
            author: c.user?.fullName || "Unknown",
            avatar: c.user?.avatar || "",
            content: c.content,
            timestamp: c.createdAt
              ? new Date(c.createdAt).toLocaleDateString("vi-VN")
              : "Vừa xong",
            likes: 0,
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

  const handleAddComment = async (content: string) => {
    await onAddComment(post.id, content);
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
            loadingComments={loadingComments}
            onAddComment={handleAddComment}
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
