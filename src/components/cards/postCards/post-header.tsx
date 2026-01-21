"use client";

import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";
import PostMenu from "@/components/cards/postCards/post-menu";
import type { PostType } from "../../../types/post-card.types"; // Use generic PostType
import { ROUTES } from "@/configs";

interface PostHeaderProps {
  post: any; // Allow relaxed type to handle both API and Legacy struct without mapping
  postId: number;
  currentUserId?: number;
  currentUserAvatar?: string;
  currentUserName: string;
  isSaved: boolean;
  onSave?: (postId: number) => void;
  onReport?: (postId: number) => void;
  onEdit?: (postId: number) => void;
  onDelete?: (postId: number) => void;
}

export default function PostHeader({
  post,
  postId,
  currentUserId,
  currentUserAvatar,
  currentUserName,
  isSaved,
  onSave,
  onReport,
  onEdit,
  onDelete,
}: PostHeaderProps) {
  // Logic determined directly from API response structure
  const authorName =
    post.company?.name || post.user?.fullName || post.author || currentUserName;
  const authorAvatar =
    post.company?.avatar ||
    post.user?.avatar ||
    post.avatar ||
    currentUserAvatar;
  const authorId = post.company?.id || post.user?.id || post.userId;
  const isCompany = !!post.company;

  // Explicitly handle "user" object (API) vs direct props (Legacy)
  // Ensure we don't crash if user/company is null

  const displayTime = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("vi-VN")
    : post.timestamp || "Vừa xong";

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {authorId ? (
          <Link href={isCompany ? "#" : ROUTES.PROFILE(authorId)}>
            {" "}
            {/* Disable link for company for now or Route to company */}
            <Avatar className="cursor-target hover:scale-110 transition-transform duration-300">
              <AvatarImage src={authorAvatar} />
              <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Avatar className="cursor-target hover:scale-110 transition-transform duration-300">
            <AvatarImage src={authorAvatar} />
            <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div>
          {authorId ? (
            <Link href={isCompany ? "#" : ROUTES.PROFILE(authorId)}>
              <p className="font-semibold cursor-target hover:text-primary transition-colors duration-300">
                {authorName}
              </p>
            </Link>
          ) : (
            <p className="font-semibold cursor-target hover:text-primary transition-colors duration-300">
              {authorName}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {post.role && `${post.role} • `}
            {displayTime}
          </p>
        </div>
      </div>
      <PostMenu
        postId={postId}
        postUserId={post.user?.id || post.userId} // Handle API (post.user.id) or Legacy
        currentUserId={currentUserId}
        isSaved={isSaved}
        onSave={onSave}
        onReport={onReport}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
