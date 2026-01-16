"use client";

import { useState, useRef } from "react";
import {
  ThumbsUp,
  Send,
  Loader2,
  X,
  ImageIcon,
  MoreVertical,
  Edit,
  Trash,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";
import { Button } from "@/components/ui/shadcn/button";
import { Separator } from "@/components/ui/shadcn/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import type { NormalizedPost } from "./post-card.types";
import type { AttachmentResponse } from "@/types/api.type";

interface PostCommentsProps {
  post: NormalizedPost;
  currentUserAvatar?: string;
  currentUserName: string;
  currentUserId?: number;
  loadingComments: boolean;
  onAddComment: (content: string, attachments?: File[]) => Promise<void>;
  onEditComment?: (
    commentId: number,
    content: string,
    newAttachments?: File[],
    keepImageUrls?: string[]
  ) => Promise<void>;
  onDeleteComment?: (commentId: number) => Promise<void>;
  onToggleComments: () => void;
  onLoadMoreComments?: () => Promise<void>;
}

export default function PostComments({
  post,
  currentUserAvatar,
  currentUserName,
  currentUserId,
  loadingComments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onToggleComments,
  onLoadMoreComments,
}: PostCommentsProps) {
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentAttachments, setCommentAttachments] = useState<File[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingAttachments, setEditingAttachments] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<
    AttachmentResponse[]
  >([]);
  const [keepExistingAttachments, setKeepExistingAttachments] = useState<
    AttachmentResponse[]
  >([]);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const editAttachmentInputRef = useRef<HTMLInputElement>(null);

  const getTopComments = (limit: number = 3) => {
    return [...post.comments].slice(0, limit);
  };

  const handleAddComment = async () => {
    if (commentInput.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onAddComment(
          commentInput,
          commentAttachments.length > 0 ? commentAttachments : undefined
        );
        setCommentInput("");
        setCommentAttachments([]);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleEditComment = async (commentId: number) => {
    if (editingContent.trim() && !isSubmitting && onEditComment) {
      setIsSubmitting(true);
      try {
        await onEditComment(
          commentId,
          editingContent,
          editingAttachments.length > 0 ? editingAttachments : undefined,
          keepExistingAttachments.length > 0
            ? keepExistingAttachments.map((a) => a.fileUrl)
            : undefined
        );
        setEditingCommentId(null);
        setEditingContent("");
        setEditingAttachments([]);
        setKeepExistingAttachments([]);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (onDeleteComment && confirm("Đồng ý xóa bình luận này?")) {
      try {
        await onDeleteComment(commentId);
      } catch (error) {
        console.error("Failed to delete comment", error);
      }
    }
  };

  const startEditingComment = (
    commentId: number,
    currentContent: string,
    existingAttachments?: AttachmentResponse[]
  ) => {
    setEditingCommentId(commentId);
    setEditingContent(currentContent);
    setEditingAttachments([]);
    const attachments = existingAttachments || [];
    setExistingAttachments(attachments);
    setKeepExistingAttachments(attachments); // Initially keep all existing
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent("");
    setEditingAttachments([]);
    setExistingAttachments([]);
    setKeepExistingAttachments([]);
  };

  const handleAttachmentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setCommentAttachments((prev) => [...prev, ...files].slice(0, 4));
    }
  };

  const handleEditAttachmentSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setEditingAttachments((prev) => [...prev, ...files].slice(0, 4));
    }
    // Reset input to allow selecting same file again
    if (editAttachmentInputRef.current) {
      editAttachmentInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setCommentAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const removeEditingAttachment = (index: number) => {
    setEditingAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (attachmentToRemove: AttachmentResponse) => {
    setKeepExistingAttachments((prev) =>
      prev.filter((att) => att.fileUrl !== attachmentToRemove.fileUrl)
    );
  };

  if (post.comments.length === 0 && !post.showComments) {
    return null;
  }

  return (
    <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
      <Separator />

      {/* Comments List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {(post.showComments ? post.comments : getTopComments(3)).map(
          (comment, idx) => (
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
                {editingCommentId === comment.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                      autoFocus
                      placeholder="Nội dung bình luận..."
                    />
                    {/* Display existing attachments */}
                    {keepExistingAttachments.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          Ảnh hiện tại:
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {keepExistingAttachments.map((att, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={att.fileUrl}
                                alt={`Attachment ${idx + 1}`}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => removeExistingAttachment(att)}
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* New attachments preview */}
                    {editingAttachments.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          Ảnh mới:
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {editingAttachments.map((file, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`New attachment ${idx + 1}`}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => removeEditingAttachment(idx)}
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <input
                      ref={editAttachmentInputRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleEditAttachmentSelect}
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEditComment(comment.id)}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Lưu"
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => editAttachmentInputRef.current?.click()}
                        disabled={isSubmitting}
                      >
                        <ImageIcon className="h-3 w-3 mr-1" />
                        Ảnh
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditing}
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-muted rounded-2xl px-4 py-2 hover:bg-muted/80 transition-colors duration-300 relative group">
                      <p className="font-semibold text-sm cursor-target hover:text-primary transition-colors duration-300">
                        {comment.author}
                      </p>
                      <p className="text-sm">{comment.content}</p>
                      {/* Display comment attachments if any */}
                      {(comment as any).attachments &&
                        (comment as any).attachments.length > 0 && (
                          <div className="flex gap-2 flex-wrap mt-2">
                            {(comment as any).attachments.map(
                              (att: AttachmentResponse, idx: number) => (
                                <img
                                  key={idx}
                                  src={att.fileUrl}
                                  alt={`Comment attachment ${idx + 1}`}
                                  className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(att.fileUrl, "_blank");
                                  }}
                                />
                              )
                            )}
                          </div>
                        )}
                      {currentUserId === comment.userId &&
                        onEditComment &&
                        onDeleteComment && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  startEditingComment(
                                    comment.id,
                                    comment.content,
                                    (comment as any).attachments
                                  )
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-destructive"
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
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
                  </>
                )}
              </div>
            </div>
          )
        )}
      </div>

      {/* Show more comments button */}
      {!post.showComments && post.totalComments > 3 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleComments}
          className="cursor-target w-full hover:bg-muted transition-all duration-300"
        >
          Xem thêm {post.totalComments - 3} bình luận
        </Button>
      )}

      {post.showComments &&
        post.comments.length < post.totalComments &&
        onLoadMoreComments && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLoadMoreComments}
            disabled={loadingComments}
            className="cursor-target w-full hover:bg-muted transition-all duration-300"
          >
            {loadingComments ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang tải...
              </>
            ) : (
              `Xem thêm ${post.totalComments - post.comments.length} bình luận`
            )}
          </Button>
        )}

      {post.showComments && post.comments.length > 3 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleComments}
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
  );
}
