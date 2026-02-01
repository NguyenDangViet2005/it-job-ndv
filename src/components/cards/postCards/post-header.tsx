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
  postid: number;
  currentUserId?: number;
  currentUserAvatar?: string;
  currentUserName: string;
  isSaved: boolean;
  onSave?: (postid: number) => void;
  onReport?: (postid: number) => void;
  onEdit?: (postid: number) => void;
  onDelete?: (postid: number) => void;
}

export default function PostHeader({
  post,
  postid,
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
  const userid = post.user?.id || post.userid;
  
  // Check if this is a company post
  const hasCompany = !!post.company;
  const companyName = post.company?.name;
  const companyid = post.company?.id;

  const displayTime = post.createdat
    ? new Date(post.createdat).toLocaleDateString("vi-VN")
    : post.timestamp || "Vừa xong";

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {userid ? (
          <Link href={ROUTES.PROFILE(userid)}>
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
          {userid ? (
            <Link href={ROUTES.PROFILE(userid)}>
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
            {hasCompany && companyid ? (
              <>
                Làm việc tại{" "}
                <Link 
                  href={ROUTES.COMPANY_DETAIL(companyid)}
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
        postid={postid}
        postUserId={post.user?.id || post.userid}
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
