"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcn/avatar";
import PostMenu from "@/components/cards/postCards/post-menu";
import type { NormalizedPost } from "../../../types/post-card.types";
import { ROUTES } from "@/configs";

interface PostHeaderProps {
  post: NormalizedPost;
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
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {post.userId ? (
          <Link href={ROUTES.PROFILE(post.userId)}>
            <Avatar className="cursor-target hover:scale-110 transition-transform duration-300">
              <AvatarImage src={post.avatar || currentUserAvatar} />
              <AvatarFallback>
                {(post.author || currentUserName).charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Avatar className="cursor-target hover:scale-110 transition-transform duration-300">
            <AvatarImage src={post.avatar || currentUserAvatar} />
            <AvatarFallback>
              {(post.author || currentUserName).charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
        <div>
          {post.userId ? (
            <Link href={ROUTES.PROFILE(post.userId)}>
              <p className="font-semibold cursor-target hover:text-primary transition-colors duration-300">
                {post.author || currentUserName}
              </p>
            </Link>
          ) : (
            <p className="font-semibold cursor-target hover:text-primary transition-colors duration-300">
              {post.author || currentUserName}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {post.role && `${post.role} • `}
            {post.timestamp || "Vừa xong"}
          </p>
        </div>
      </div>
      <PostMenu
        postId={postId}
        postUserId={post.userId}
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
