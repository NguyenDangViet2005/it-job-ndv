import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import PostCard from "@/components/cards/postCards/post-card";
import type { PostListProps } from "@/types";

export default function PostList({
  posts,
  loading,
  currentUserAvatar,
  currentUserName = "Bạn",
  currentUserId,
  onLikePost,
  onToggleComments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLoadMoreComments,
  loadingCommentsForPost,
  onEditPost,
  onDeletePost,
}: PostListProps) {
  if (posts.length === 0 && !loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            Chưa có bài đăng nào
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          index={index}
          currentUserAvatar={currentUserAvatar}
          currentUserName={currentUserName}
          currentUserId={currentUserId}
          onLikePost={onLikePost}
          onToggleComments={onToggleComments}
          onAddComment={async (postid, content, attachments) =>
            onAddComment(postid, content, attachments)
          }
          onEditComment={
            onEditComment
              ? async (commentId, content, attachments) =>
                  onEditComment(post.id, commentId, content, attachments)
              : undefined
          }
          onDeleteComment={
            onDeleteComment
              ? async (commentId) => onDeleteComment(post.id, commentId)
              : undefined
          }
          onLoadMoreComments={onLoadMoreComments}
          loadingComments={loadingCommentsForPost === post.id}
          onSavePost={(postid) => console.log("Save post:", postid)}
          onReportPost={(postid) => console.log("Report post:", postid)}
          onEditPost={onEditPost}
          onDeletePost={onDeletePost}
        />
      ))}

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </>
  );
}
