"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Heart,
  Send,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Play,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";
import { Button } from "@/components/ui/shadcn/button";
import { Separator } from "@/components/ui/shadcn/separator";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import PostMenu from "@/components/post/post-menu";
import type {
  FullPostResponse,
  CommentResponse,
  AttachmentResponse,
} from "@/types/api.type";
import { getUserId } from "@/utils/auth";
import Routes from "@/routes";

// Legacy types for backward compatibility
interface LegacyComment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

interface LegacyPost {
  id: number;
  author?: string;
  avatar?: string;
  role?: string;
  timestamp?: string;
  title?: string;
  content: string;
  image?: string;
  images?: string[];
  likes: number;
  liked: boolean;
  comments: LegacyComment[];
  showComments?: boolean;
  shares?: number;
}

// Union type for both formats
type PostType = LegacyPost | (FullPostResponse & { showComments?: boolean });

interface PostCardProps {
  post: PostType;
  index?: number;
  currentUserAvatar?: string;
  currentUserName?: string;
  isSaved?: boolean;
  onLikePost: (postId: number) => void;
  onToggleComments: (postId: number) => void;
  onAddComment: (postId: number, content: string) => void;
  onLoadMoreComments?: (postId: number) => Promise<void>;
  onSavePost?: (postId: number) => void;
  onReportPost?: (postId: number) => void;
  onEditPost?: (postId: number) => void;
  onDeletePost?: (postId: number) => void;
  loadingComments?: boolean;
}

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
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current user ID
  const currentUserId = getUserId();

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState<
    { url: string; type: "image" | "video" }[]
  >([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Comment attachment state
  const [commentAttachments, setCommentAttachments] = useState<File[]>([]);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  // Open lightbox
  const openLightbox = (
    media: { url: string; type: "image" | "video" }[],
    startIndex: number = 0
  ) => {
    setLightboxMedia(media);
    setCurrentMediaIndex(startIndex);
    setLightboxOpen(true);
  };

  // Navigate lightbox
  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % lightboxMedia.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex(
      (prev) => (prev - 1 + lightboxMedia.length) % lightboxMedia.length
    );
  };

  // Handle attachment selection
  const handleAttachmentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setCommentAttachments((prev) => [...prev, ...files].slice(0, 4));
    }
  };

  const removeAttachment = (index: number) => {
    setCommentAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Helper function to check if post is API format
  const isApiPost = (
    p: PostType
  ): p is FullPostResponse & { showComments?: boolean } => {
    return "interaction" in p || "user" in p || "attachments" in p;
  };

  // Helper to ensure attachments is array
  const getAttachmentsArray = (attachments: any): AttachmentResponse[] => {
    if (!attachments) return [];
    if (Array.isArray(attachments)) return attachments;
    // Handle .NET $values format
    if (attachments.$values && Array.isArray(attachments.$values)) {
      return attachments.$values;
    }
    return [];
  };

  // Helper to ensure comments is array
  const getCommentsArray = (comments: any): CommentResponse[] => {
    if (!comments) return [];
    if (Array.isArray(comments)) return comments;
    // Handle .NET $values format
    if (comments.$values && Array.isArray(comments.$values)) {
      return comments.$values;
    }
    return [];
  };

  // Normalize post data
  const normalizedPost = isApiPost(post)
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
        images: post.images || (post.image ? [post.image] : []),
        video: undefined as string | undefined,
        totalComments: post.comments.length,
      };

  const getTopComments = (
    comments: typeof normalizedPost.comments,
    limit: number = 3
  ) => {
    return [...comments].slice(0, limit);
  };

  const handleAddComment = async () => {
    if (commentInput.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onAddComment(post.id, commentInput);
        setCommentInput("");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleLoadMore = async () => {
    if (onLoadMoreComments && !loadingComments) {
      await onLoadMoreComments(post.id);
    }
  };

  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="pt-6">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {normalizedPost.userId ? (
              <Link href={Routes.profile(normalizedPost.userId)}>
                <Avatar className="cursor-target hover:scale-110 transition-transform duration-300">
                  <AvatarImage src={normalizedPost.avatar || currentUserAvatar} />
                  <AvatarFallback>
                    {(normalizedPost.author || currentUserName).charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Avatar className="cursor-target hover:scale-110 transition-transform duration-300">
                <AvatarImage src={normalizedPost.avatar || currentUserAvatar} />
                <AvatarFallback>
                  {(normalizedPost.author || currentUserName).charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              {normalizedPost.userId ? (
                <Link href={Routes.profile(normalizedPost.userId)}>
                  <p className="font-semibold cursor-target hover:text-primary transition-colors duration-300">
                    {normalizedPost.author || currentUserName}
                  </p>
                </Link>
              ) : (
                <p className="font-semibold cursor-target hover:text-primary transition-colors duration-300">
                  {normalizedPost.author || currentUserName}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {normalizedPost.role && `${normalizedPost.role} • `}
                {normalizedPost.timestamp || "Vừa xong"}
              </p>
            </div>
          </div>
          <PostMenu
            postId={post.id}
            postUserId={normalizedPost.userId}
            currentUserId={currentUserId || undefined}
            isSaved={isSaved}
            onSave={onSavePost}
            onReport={onReportPost}
            onEdit={onEditPost}
            onDelete={onDeletePost}
          />
        </div>

        {/* Post Title */}
        {normalizedPost.title && (
          <h2 className="text-xl font-bold mb-2">{normalizedPost.title}</h2>
        )}

        {/* Post Content */}
        <p className="mb-4">{normalizedPost.content}</p>

        {/* Video */}
        {normalizedPost.video && (
          <div
            className="rounded-lg overflow-hidden mb-4 group cursor-target max-h-[400px] relative"
            onClick={() =>
              openLightbox([{ url: normalizedPost.video!, type: "video" }], 0)
            }
          >
            <video
              src={normalizedPost.video}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Play className="h-16 w-16 text-white" />
            </div>
          </div>
        )}

        {/* Multiple Post Images */}
        {normalizedPost.images &&
          normalizedPost.images.length > 0 &&
          !normalizedPost.video && (
            <div
              className={`mb-4 gap-2 ${
                normalizedPost.images.length === 1
                  ? "grid grid-cols-1"
                  : normalizedPost.images.length === 2
                  ? "grid grid-cols-2"
                  : normalizedPost.images.length === 3
                  ? "grid grid-cols-2"
                  : normalizedPost.images.length === 4
                  ? "grid grid-cols-2"
                  : "grid grid-cols-3"
              }`}
            >
              {normalizedPost.images.slice(0, 5).map((img, imgIdx) => (
                <div
                  key={imgIdx}
                  onClick={() => {
                    const allMedia = normalizedPost.images!.map((url) => ({
                      url,
                      type: "image" as const,
                    }));
                    openLightbox(allMedia, imgIdx);
                  }}
                  className={`relative rounded-lg overflow-hidden group cursor-target max-h-[300px] ${
                    normalizedPost.images!.length === 3 && imgIdx === 0
                      ? "col-span-2"
                      : normalizedPost.images!.length >= 5 && imgIdx === 4
                      ? "relative"
                      : ""
                  }`}
                >
                  <img
                    src={img}
                    alt={`Post image ${imgIdx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {normalizedPost.images!.length > 3 && imgIdx === 2 && (
                    <div
                      className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white hover:bg-black/70 transition-colors duration-300 cursor-target"
                      onClick={(e) => {
                        e.stopPropagation();
                        const allMedia = normalizedPost.images!.map((url) => ({
                          url,
                          type: "image" as const,
                        }));
                        openLightbox(allMedia, 0);
                      }}
                    >
                      <span className="text-4xl font-bold">
                        +{normalizedPost.images!.length - 3}
                      </span>
                      <span className="text-sm mt-2">Xem thêm</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        {/* Post Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-2 cursor-target hover:text-primary transition-colors duration-300">
            <div className="flex -space-x-1">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                <ThumbsUp className="h-3 w-3 text-white fill-white" />
              </div>
              <div
                className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center animate-pulse"
                style={{ animationDelay: "150ms" }}
              >
                <Heart className="h-3 w-3 text-white fill-white" />
              </div>
            </div>
            <span>{normalizedPost.likes}</span>
          </div>
          <div className="flex gap-3">
            <span
              className="cursor-target hover:text-primary hover:underline transition-all duration-300"
              onClick={() => onToggleComments(post.id)}
            >
              {normalizedPost.totalComments} bình luận
            </span>
            {normalizedPost.shares !== undefined &&
              normalizedPost.shares > 0 && (
                <span className="cursor-target hover:text-primary hover:underline transition-all duration-300">
                  {normalizedPost.shares} chia sẻ
                </span>
              )}
          </div>
        </div>

        <Separator />

        {/* Post Actions */}
        <div className="flex justify-around pt-2">
          <Button
            variant="ghost"
            className={`cursor-target flex-1 transition-all duration-300 hover:scale-105 ${
              normalizedPost.liked
                ? "text-blue-600 hover:text-blue-700"
                : "hover:bg-blue-50 dark:hover:bg-blue-950"
            }`}
            onClick={() => onLikePost(post.id)}
          >
            <ThumbsUp
              className={`h-4 w-4 mr-2 transition-all duration-300 ${
                normalizedPost.liked ? "fill-blue-600" : ""
              }`}
            />
            Thích
          </Button>
          <Button
            variant="ghost"
            className="cursor-target flex-1 hover:bg-green-50 dark:hover:bg-green-950 hover:scale-105 transition-all duration-300"
            onClick={() => onToggleComments(post.id)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Bình luận
          </Button>
          <Button
            variant="ghost"
            className="cursor-target flex-1 hover:bg-amber-50 dark:hover:bg-amber-950 hover:scale-105 transition-all duration-300"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Chia sẻ
          </Button>
        </div>

        {/* Comments Section */}
        {(normalizedPost.comments.length > 0 ||
          normalizedPost.showComments) && (
          <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
            <Separator />

            {/* Comments List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(normalizedPost.showComments
                ? normalizedPost.comments
                : getTopComments(normalizedPost.comments, 3)
              ).map((comment, idx) => (
                <div
                  key={comment.id}
                  className="flex gap-3 animate-in fade-in slide-in-from-left-2"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <Avatar className="h-10 w-10 cursor-target hover:scale-110 transition-transform duration-300">
                    <AvatarImage src={comment.avatar} />
                    <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-2xl px-4 py-2 hover:bg-muted/80 transition-colors duration-300">
                      <p className="font-semibold text-sm cursor-target hover:text-primary transition-colors duration-300">
                        {comment.author}
                      </p>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 px-4 text-xs text-muted-foreground">
                      <span className="cursor-target hover:text-primary hover:underline transition-all duration-300">
                        Thích
                      </span>
                      <span className="cursor-target hover:text-primary hover:underline transition-all duration-300">
                        Trả lời
                      </span>
                      <span>{comment.timestamp}</span>
                      {comment.likes > 0 && (
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3 fill-blue-600 text-blue-600" />
                          {comment.likes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show more comments button */}
            {!normalizedPost.showComments &&
              normalizedPost.totalComments > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleComments(post.id)}
                  className="cursor-target w-full hover:bg-muted transition-all duration-300"
                >
                  Xem thêm {normalizedPost.totalComments - 3} bình luận
                </Button>
              )}

            {normalizedPost.showComments &&
              normalizedPost.comments.length < normalizedPost.totalComments &&
              onLoadMoreComments && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLoadMore}
                  disabled={loadingComments}
                  className="cursor-target w-full hover:bg-muted transition-all duration-300"
                >
                  {loadingComments ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    `Xem thêm ${
                      normalizedPost.totalComments -
                      normalizedPost.comments.length
                    } bình luận`
                  )}
                </Button>
              )}

            {normalizedPost.showComments &&
              normalizedPost.comments.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleComments(post.id)}
                  className="cursor-target w-full hover:bg-muted transition-all duration-300"
                >
                  Ẩn bớt bình luận
                </Button>
              )}

            {/* Add Comment */}
            <div className="flex gap-3 pt-2">
              <Avatar className="h-10 w-10 cursor-target hover:scale-110 transition-transform duration-300">
                <AvatarImage src={currentUserAvatar} />
                <AvatarFallback>{currentUserName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Viết bình luận..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                    disabled={isSubmitting}
                    className="cursor-target flex-1 rounded-full border border-input bg-muted px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:border-primary/50 transition-all duration-300 disabled:opacity-50"
                  />
                  <input
                    ref={attachmentInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleAttachmentSelect}
                    className="hidden"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => attachmentInputRef.current?.click()}
                    disabled={isSubmitting}
                    className="cursor-target rounded-full hover:bg-accent hover:scale-110 transition-all duration-300"
                    title="Đính kèm ảnh/video"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleAddComment}
                    disabled={isSubmitting || !commentInput.trim()}
                    className="cursor-target rounded-full hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {/* Selected Attachments Preview */}
                {commentAttachments.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {commentAttachments.map((file, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Attachment ${idx + 1}`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeAttachment(idx)}
                          className="cursor-target absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-black/95 border-none">
          <VisuallyHidden>
            <DialogTitle>Xem ảnh</DialogTitle>
          </VisuallyHidden>
          <div className="relative flex items-center justify-center min-h-[60vh]">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLightboxOpen(false)}
              className="cursor-target absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation arrows */}
            {lightboxMedia.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevMedia}
                  className="cursor-target absolute left-4 z-50 text-white hover:bg-white/20 rounded-full"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextMedia}
                  className="cursor-target absolute right-4 z-50 text-white hover:bg-white/20 rounded-full"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Media content */}
            <div className="flex items-center justify-center p-8">
              {lightboxMedia[currentMediaIndex]?.type === "video" ? (
                <video
                  src={lightboxMedia[currentMediaIndex]?.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[80vh] rounded-lg"
                />
              ) : (
                <img
                  src={lightboxMedia[currentMediaIndex]?.url}
                  alt={`Media ${currentMediaIndex + 1}`}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
              )}
            </div>

            {/* Thumbnails */}
            {lightboxMedia.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {lightboxMedia.map((media, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentMediaIndex(idx)}
                    className={`cursor-target w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentMediaIndex
                        ? "border-primary scale-110"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    {media.type === "video" ? (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Play className="h-6 w-6" />
                      </div>
                    ) : (
                      <img
                        src={media.url}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Counter */}
            {lightboxMedia.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                {currentMediaIndex + 1} / {lightboxMedia.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
