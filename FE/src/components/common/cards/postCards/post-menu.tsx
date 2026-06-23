"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreHorizontal,
  Bookmark,
  Flag,
  Edit,
  Trash2,
  BookmarkCheck,
} from "lucide-react";

interface PostMenuProps {
  postid: number;
  postUserId?: number;
  currentUserId?: number;
  isSaved?: boolean;
  onSave?: (postid: number) => void;
  onReport?: (postid: number) => void;
  onEdit?: (postid: number) => void;
  onDelete?: (postid: number) => void;
}

export default function PostMenu({
  postid,
  postUserId,
  currentUserId,
  isSaved = false,
  onSave,
  onReport,
  onEdit,
  onDelete,
}: PostMenuProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if current user is the post owner
  const isOwner = currentUserId && postUserId && currentUserId === postUserId;

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(postid);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-target hover:bg-accent transition-all duration-300"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* Save/Unsave Post */}
          {onSave && (
            <DropdownMenuItem
              onClick={() => onSave(postid)}
              className="cursor-pointer"
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="mr-2 h-4 w-4" />
                  Bỏ lưu bài viết
                </>
              ) : (
                <>
                  <Bookmark className="mr-2 h-4 w-4" />
                  Lưu bài viết
                </>
              )}
            </DropdownMenuItem>
          )}

          {/* Report Post */}
          {onReport && (
            <DropdownMenuItem
              onClick={() => onReport(postid)}
              className="cursor-pointer"
            >
              <Flag className="mr-2 h-4 w-4" />
              Báo cáo bài viết
            </DropdownMenuItem>
          )}

          {/* Owner Actions */}
          {isOwner && (
            <>
              <DropdownMenuSeparator />

              {/* Edit Post */}
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => onEdit(postid)}
                  className="cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa bài viết
                </DropdownMenuItem>
              )}

              {/* Delete Post */}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa bài viết
                </DropdownMenuItem>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bài viết</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
