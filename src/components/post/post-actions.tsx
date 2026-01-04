"use client";

import { ThumbsUp, MessageCircle, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { Separator } from "@/components/ui/shadcn/separator";

interface PostActionsProps {
  likes: number;
  liked: boolean;
  totalComments: number;
  shares: number;
  onLike: () => void;
  onToggleComments: () => void;
}

export default function PostActions({
  likes,
  liked,
  totalComments,
  shares,
  onLike,
  onToggleComments,
}: PostActionsProps) {
  return (
    <>
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
          <span>{likes}</span>
        </div>
        <div className="flex gap-3">
          <span
            className="cursor-target hover:text-primary hover:underline transition-all duration-300"
            onClick={onToggleComments}
          >
            {totalComments} bình luận
          </span>
          {shares > 0 && (
            <span className="cursor-target hover:text-primary hover:underline transition-all duration-300">
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
          className={`cursor-target flex-1 transition-all duration-300 hover:scale-105 ${
            liked
              ? "text-blue-600 hover:text-blue-700"
              : "hover:bg-blue-50 dark:hover:bg-blue-950"
          }`}
          onClick={onLike}
        >
          <ThumbsUp
            className={`h-4 w-4 mr-2 transition-all duration-300 ${
              liked ? "fill-blue-600" : ""
            }`}
          />
          Thích
        </Button>
        <Button
          variant="ghost"
          className="cursor-target flex-1 hover:bg-green-50 dark:hover:bg-green-950 hover:scale-105 transition-all duration-300"
          onClick={onToggleComments}
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
    </>
  );
}
