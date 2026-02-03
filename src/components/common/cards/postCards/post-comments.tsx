"use client";

import { useState, useRef, forwardRef, useImperativeHandle } from "react";
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
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NormalizedPost } from "@/types/post-card.types";
import type { AttachmentResponse } from "@/types/api.type";
import Link from "next/link";
import { DEFAULT_AVATARS } from "@/constants";
import { useAuth } from "@/lib/hooks/useAuth";

interface PostCommentsProps {
  post: any; // Accept raw post object (API response)
  currentUserAvatar?: string;
  currentUserName: string;
  currentUserId?: number;
  loadingComments: boolean;
  onAddComment: (content: string, attachments?: File[]) => Promise<void>;
  onEditComment?: (
    commentId: number,
    content: string,
    newAttachments?: File[],
    keepImageUrls?: string[],
  ) => Promise<void>;
  onDeleteComment?: (commentId: number) => Promise<void>;
  onToggleComments: () => void;
  onLoadMoreComments?: () => Promise<void>;
}

export interface PostCommentsRef {
  focusInput: () => void;
}

const PostComments = forwardRef<PostCommentsRef, PostCommentsProps>(
  (props, ref) => {
    const {
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
    } = props;

    const { isAuthenticated } = useAuth();

    // Extract comments based on API structure or fallback to legacy
    const comments = post.interaction?.comments || post.comments || [];
    const totalComments =
      post.interaction?.totalComments || post.totalComments || comments.length;
    const showComments = post.showComments;

    const [commentInput, setCommentInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentAttachments, setCommentAttachments] = useState<File[]>([]);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(
      null,
    );
    const [editingContent, setEditingContent] = useState("");
    const [editingAttachments, setEditingAttachments] = useState<File[]>([]);
    const [existingAttachments, setExistingAttachments] = useState<
      AttachmentResponse[]
    >([]);
    const [keepExistingAttachments, setKeepExistingAttachments] = useState<
      AttachmentResponse[]
    >([]);

    const inputRef = useRef<HTMLInputElement>(null);
    const attachmentInputRef = useRef<HTMLInputElement>(null);
    const editAttachmentInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focusInput: () => {
        inputRef.current?.focus();
      },
    }));

    const getTopComments = (limit: number = 3) => {
      return [...comments].slice(0, limit);
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
              ? keepExistingAttachments.map((a) => a.fileurl)
              : undefined,
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
      existingAttachments?: AttachmentResponse[],
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
      e: React.ChangeEvent<HTMLInputElement>,
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

    const removeExistingAttachment = (
      attachmentToRemove: AttachmentResponse,
    ) => {
      setKeepExistingAttachments((prev) =>
        prev.filter((att) => att.fileurl !== attachmentToRemove.fileurl),
      );
    };

    const handleAddComment = async () => {
      if (commentInput.trim() && !isSubmitting) {
        setIsSubmitting(true);
        try {
          await onAddComment(
            commentInput,
            commentAttachments.length > 0 ? commentAttachments : undefined,
          );
          setCommentInput("");
          setCommentAttachments([]);
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    if (comments.length === 0 && !showComments) {
      return null;
    }

    return (
      <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
        <Separator />

        {/* Comments List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {(showComments ? comments : getTopComments(3)).map(
            (comment: any, idx: number) => {
              const commentTime = comment.createdat
                ? new Date(comment.createdat).toLocaleDateString("vi-VN")
                : comment.timestamp || "Vừa xong";
              
              // Get user info from comment
              const commentUser = comment.user || comment.User;
              const commentUserId = commentUser?.id;
              const commentUserAvatar = commentUser?.avatar;
              const commentUserName = commentUser?.fullName || "Người dùng";
              
              // Check if user has company (from CompanyMembers relationship)
              const userCompanyMember = commentUser?.CompanyMembers?.[0];
              const hasCompany = !!userCompanyMember?.Company;
              const companyName = userCompanyMember?.Company?.name;
              const companyid = userCompanyMember?.Company?.id;
              
              return (
                <div
                  key={comment.id}
                  className="flex gap-3 animate-in fade-in slide-in-from-left-2"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <Link href={commentUserId ? `/profile/${commentUserId}` : "#"}>
                    <Avatar className="h-7 w-7 cursor-target hover:scale-110 transition-transform duration-300">
                      <AvatarImage src={commentUserAvatar} />
                      <AvatarFallback>
                        {commentUserName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1">
                    {editingCommentId === comment.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs min-h-[80px]"
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
                                    src={att.fileurl}
                                    alt={`Attachment ${idx + 1}`}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                  <button
                                    onClick={() =>
                                      removeExistingAttachment(att)
                                    }
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
                            onClick={() =>
                              editAttachmentInputRef.current?.click()
                            }
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
                          <Link href={commentUserId ? `/profile/${commentUserId}` : "#"}>
                            <p className="font-semibold text-sm cursor-target hover:text-primary transition-colors duration-300">
                              {commentUserName}
                            </p>
                          </Link>
                          {hasCompany && companyid && (
                            <p className="text-xs text-muted-foreground">
                              Làm việc tại{" "}
                              <Link 
                                href={`/companies/${companyid}`}
                                className="hover:text-primary hover:underline transition-colors"
                              >
                                {companyName}
                              </Link>
                            </p>
                          )}
                          <p className="text-sm mt-1">{comment.content}</p>
                          {/* Display comment attachments if any */}
                          {comment?.attachments?.length > 0 && (
                            <div className="flex gap-2 flex-wrap mt-2">
                              {comment?.attachments?.map(
                                (att: AttachmentResponse, idx: number) => (
                                  <img
                                    key={idx}
                                    src={att.fileurl}
                                    alt={`Comment attachment ${idx + 1}`}
                                    className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(att.fileurl, "_blank");
                                    }}
                                  />
                                ),
                              )}
                            </div>
                          )}
                          {currentUserId === comment.user?.id &&
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
                                        comment.attachments,
                                      )
                                    }
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Chỉnh sửa
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
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
                          <span>{commentTime}</span>
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
              );
            },
          )}
        </div>

        {/* Show more comments button */}
        {!showComments && totalComments > 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleComments}
            className="cursor-target w-full hover:bg-muted transition-all duration-300"
          >
            Xem thêm {totalComments - 3} bình luận
          </Button>
        )}

        {showComments &&
          comments.length < totalComments &&
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
                `Xem thêm ${totalComments - comments.length} bình luận`
              )}
            </Button>
          )}

        {showComments && comments.length > 3 && (
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
            <AvatarImage src={currentUserAvatar || DEFAULT_AVATARS.USER} />
            <AvatarFallback>{currentUserName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder={isAuthenticated ? "Viết bình luận..." : "Đăng nhập để bình luận..."}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                disabled={isSubmitting || !isAuthenticated}
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
                disabled={isSubmitting || !isAuthenticated}
                className="cursor-target rounded-full hover:bg-accent hover:scale-110 transition-all duration-300"
                title="Đính kèm ảnh/video"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleAddComment}
                disabled={isSubmitting || !commentInput.trim() || !isAuthenticated}
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
  },
);

export default PostComments;
