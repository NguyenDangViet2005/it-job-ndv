"use client";

import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";
import PostMenu from "@/components/cards/postCards/post-menu";
import { ROUTES } from "@/configs";

interface PostHeaderProps {
  post: any; 
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
  // Always show USER info (not company)
  const userName = post.user?.fullName || post.author || currentUserName;
  const userAvatar = post.user?.avatar || post.avatar || currentUserAvatar;
  const userId = post.user?.id || post.userId;
  
  // Check if this is a company post
  const hasCompany = !!post.company;
  const companyName = post.company?.name;
  const companyId = post.company?.id;

  const displayTime = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("vi-VN")
    : post.timestamp || "Vừa xong";

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {userId ? (
          <Link href={ROUTES.PROFILE(userId)}>
            <Avatar className="cursor-target hover:scale-110 transition-transform duration-300">
              <AvatarImage src={userAvatar} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Avatar className="cursor-target hover:scale-110 transition-transform duration-300">
            <AvatarImage src={userAvatar} />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div>
          {userId ? (
            <Link href={ROUTES.PROFILE(userId)}>
              <p className="font-semibold cursor-target hover:text-primary transition-colors duration-300">
                {userName}
              </p>
            </Link>
          ) : (
            <p className="font-semibold cursor-target hover:text-primary transition-colors duration-300">
              {userName}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {hasCompany && companyId ? (
              <>
                Làm việc tại{" "}
                <Link 
                  href={ROUTES.COMPANY_DETAIL(companyId)}
                  className="hover:text-primary hover:underline transition-colors"
                >
                  {companyName}
                </Link>
                {" • "}
              </>
            ) : post.role ? (
              `${post.role} • `
            ) : null}
            {displayTime}
          </p>
        </div>
      </div>
      <PostMenu
        postId={postId}
        postUserId={post.user?.id || post.userId}
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
