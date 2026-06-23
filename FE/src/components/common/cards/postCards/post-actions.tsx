"use client";

import { ThumbsUp, MessageCircle, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/hooks/useAuth";


interface PostActionsProps {
  likes: number;
  liked: boolean;
  totalComments: number;
  shares: number;
  onLike: () => void;
  onToggleComments: () => void;
  onCommentButtonClick?: () => void;
}

export default function PostActions({
  likes,
  liked,
  totalComments,
  shares,
  onLike,
  onToggleComments,
  onCommentButtonClick,
}: PostActionsProps) {
  const { isAuthenticated } = useAuth();
  


  return (
    <>
      {/* Post Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
        <div className="flex items-center gap-2 cursor-target hover:text-primary">
          <div className="flex -space-x-1">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
              <ThumbsUp className="h-3 w-3 text-white fill-white" />
            </div>
          </div>
          <span>{likes}</span>
        </div>
        <div className="flex gap-3">
          <span
            className="cursor-target hover:text-primary hover:underline"
            onClick={onToggleComments}
          >
            {totalComments} bình luận
          </span>
          {shares > 0 && (
            <span className="cursor-target hover:text-primary hover:underline">
              {shares} chia sẻ
            </span>
          )}
        </div>
      </div>

      <Separator />

      {/* Post Actions */}
      <div className="flex justify-around pt-2">
        <Button
          variant="ghost"
          disabled={!isAuthenticated}
          className={`cursor-target flex-1 ${
            liked
              ? "text-blue-600 hover:text-blue-700"
              : "hover:bg-blue-50 dark:hover:bg-blue-950"
          }`}
          onClick={onLike}
        >
          <ThumbsUp
            className={`h-4 w-4 mr-2 ${
              liked ? "fill-blue-600" : ""
            }`}
          />
          Thích
        </Button>
        <Button
          variant="ghost"
          disabled={!isAuthenticated}
          className="cursor-target flex-1 hover:bg-green-50 dark:hover:bg-green-950"
          onClick={onCommentButtonClick || onToggleComments}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Bình luận
        </Button>
        <Button
          variant="ghost"
          disabled={!isAuthenticated}
          onClick={() => {
          }}
          className="cursor-target flex-1 hover:bg-amber-50 dark:hover:bg-amber-950"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Chia sẻ
        </Button>
      </div>
    </>
  );
}
