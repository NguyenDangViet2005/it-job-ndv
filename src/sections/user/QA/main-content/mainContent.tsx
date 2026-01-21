import { ImageIcon, Video, Smile, Loader2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";
import { Button } from "@/components/ui/shadcn/button";
import { Separator } from "@/components/ui/shadcn/separator";
import React, { useState, useRef } from "react";
import PostCard from "@/components/cards/postCards/post-card";
import EditPostDialog from "@/components/modals/edit-post-modal";
import type { FullPostResponse } from "@/types/api.type";
import { postApi } from "@/apis/post.api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { DEFAULT_AVATARS } from "@/configs/constants";

interface MainContentProps {
  posts: FullPostResponse[];
  loading: boolean;
  onLikePost: (postId: number) => void;
  onToggleComments: (postId: number) => void;
  onAddComment: (postId: number, content: string, attachments?: File[]) => void;
  onEditComment?: (
    postId: number,
    commentId: number,
    content: string,
    attachments?: File[],
  ) => void;
  onDeleteComment?: (postId: number, commentId: number) => void;
  onLoadMoreComments?: (postId: number) => Promise<void>;
  loadingCommentsForPost?: number | null;
  currentUserAvatar?: string;
  currentUserName?: string;
  currentUserId?: number;
}

function MainContent({
  posts,
  loading,
  onLikePost,
  onToggleComments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLoadMoreComments,
  loadingCommentsForPost,
  currentUserAvatar,
  currentUserName = "Đồng ý xóaБạn",
  currentUserId,
}: MainContentProps) {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();

  // Auth check helper
  const checkAuth = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return false;
    }
    return true;
  };

  const [newPost, setNewPost] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Edit post state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<FullPostResponse | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Handle image selection for post
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedImages((prev) => [...prev, ...files].slice(0, 10));
      setSelectedVideo(null);
    }
  };

  // Handle video selection for post
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
      setSelectedImages([]);
    }
  };

  // Remove selected image
  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;
    if (!checkAuth()) return;
    if (!user || !token) return;

    setIsCreatingPost(true);
    try {
      await postApi.create(
        { content: newPost, userId: user.id },
        selectedImages.length > 0 ? selectedImages : undefined,
        selectedVideo || undefined,
        token,
      );

      setNewPost("");
      setSelectedImages([]);
      setSelectedVideo(null);
      // Refresh page to show new post
      window.location.reload();
    } catch (error) {
      alert("Đăng bài thất bại");
    } finally {
      setIsCreatingPost(false);
    }
  };

  // Handle edit post
  const handleEditPost = (postId: number) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setPostToEdit(post);
      setEditDialogOpen(true);
    }
  };

  // Handle save edited post
  const handleSaveEditedPost = async (
    postId: number,
    content: string,
    newImages: File[],
    keepImageUrls: string[],
  ) => {
    if (!token) return;

    try {
      // Find the post to get userId or companyId
      const post = posts.find((p) => p.id === postId);
      if (!post) {
        throw new Error("Post not found");
      }

      // Prepare update data with userId or companyId
      const updateData: any = { content };
      if (post.user?.id) {
        updateData.userId = post.user.id;
      } else if (post.company?.id) {
        updateData.companyId = post.company.id;
      }

      // Always use updateWithImages to handle both new images and keepImageUrls
      await postApi.updateWithImages(
        postId,
        updateData,
        newImages.length > 0 ? newImages : undefined,
        keepImageUrls,
        token,
      );

      // Refresh to show updated post
      window.location.reload();
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Không thể cập nhật bài viết");
      throw error;
    }
  };

  return (
    <div>
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={imageInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
      />
      <input
        type="file"
        ref={videoInputRef}
        className="hidden"
        accept="video/*"
        onChange={handleVideoSelect}
      />

      <main className="md:col-span-2 space-y-6">
        {/* FORM ĐĂNG BÀI */}
        <Card className="hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="">
            <div className="flex gap-3">
              <Avatar className="cursor-target hover:scale-110 transition-transform duration-300">
                <AvatarImage
                  src={
                    currentUserAvatar || user?.avatar || DEFAULT_AVATARS.USER
                  }
                />
                <AvatarFallback>
                  {(currentUserName || user?.fullName || "U").charAt(0)}
                </AvatarFallback>
              </Avatar>
              <textarea
                placeholder="Chia sẻ kiến thức hoặc kinh nghiệm của bạn..."
                value={newPost}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setNewPost(e.target.value)
                }
                className="cursor-target flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:border-primary/50 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Selected images preview */}
            {selectedImages.length > 0 && (
              <div className="flex gap-2 mt-4 flex-wrap">
                {selectedImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Selected ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
                      onClick={() => removeSelectedImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Selected video preview */}
            {selectedVideo && (
              <div className="relative mt-4 inline-block">
                <video
                  src={URL.createObjectURL(selectedVideo)}
                  className="w-40 h-24 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
                  onClick={() => setSelectedVideo(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            <Separator className="my-4" />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-target hover:bg-green-50 dark:hover:bg-green-950 hover:scale-105 transition-all duration-300"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <ImageIcon className="h-4 w-4 mr-2 text-green-600" />
                  Ảnh
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-target hover:bg-red-50 dark:hover:bg-red-950 hover:scale-105 transition-all duration-300"
                  onClick={() => videoInputRef.current?.click()}
                >
                  <Video className="h-4 w-4 mr-2 text-red-600" />
                  Video
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-target hover:bg-yellow-50 dark:hover:bg-yellow-950 hover:scale-105 transition-all duration-300"
                >
                  <Smile className="h-4 w-4 mr-2 text-yellow-600" />
                  Cảm xúc
                </Button>
              </div>
              <Button
                size="sm"
                onClick={handlePostSubmit}
                disabled={isCreatingPost || !newPost.trim()}
                className="cursor-target hover:scale-105 transition-transform duration-300 disabled:bg-gray-400"
              >
                {isCreatingPost ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Đăng bài"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* DANH SÁCH BÀI POST */}
        {posts.length === 0 && !loading ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                Chưa có bài đăng nào
              </p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              index={index}
              currentUserAvatar={currentUserAvatar || user?.avatar}
              currentUserName={currentUserName || user?.fullName || "Bạn"}
              currentUserId={currentUserId || user?.id}
              onLikePost={onLikePost}
              onToggleComments={onToggleComments}
              onAddComment={async (postId, content, attachments) =>
                onAddComment(postId, content, attachments)
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
              onSavePost={(postId) => console.log("Save post:", postId)}
              onReportPost={(postId) => console.log("Report post:", postId)}
              onEditPost={handleEditPost}
              onDeletePost={async (postId) => {
                if (!token) return;
                try {
                  await postApi.delete(postId, token);
                  window.location.reload();
                } catch (error) {
                  console.error("Error deleting post:", error);
                  alert("Không thể xóa bài viết");
                }
              }}
            />
          ))
        )}

        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </main>

      {/* Edit Post Dialog */}
      <EditPostDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        post={postToEdit}
        onSave={handleSaveEditedPost}
      />
    </div>
  );
}

export default MainContent;
