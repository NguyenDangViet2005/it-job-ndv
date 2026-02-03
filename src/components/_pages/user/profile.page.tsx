"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Briefcase,
  Calendar,
  Mail,
  Image as ImageIcon,
  Video,
  Smile,
  UserPlus,
  Users,
  MessageCircle,
  MoreHorizontal,
  Loader2,
  Camera,
  X,
  Play,
  FileText,
} from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PostCard from "@/components/common/cards/postCards/post-card";
import EditPostDialog from "@/components/common/modals/qa/edit-post-modal";

import { userApi } from "@/apis/user.api";
import { postApi } from "@/apis/post.api";
import { interactionApi } from "@/apis/interaction.api";

import type { FullPostResponse, AttachmentResponse } from "@/types/api.type";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useInfiniteScroll, useUserMedia, useUserPosts } from "@/lib/hooks/usePost";

interface Skill {
  id: number;
  name: string;
}

interface ProfilePageProps {
  userid?: string;
}

export default function ProfilePage({ userid }: ProfilePageProps) {
  const { user, token, updateUser } = useAuth();
  const router = useRouter();

  // Profile user data (người được xem profile)
  const [profileUser, setProfileUser] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Check if current user is viewing their own profile
  const isOwnProfile = user?.id === Number(userid) || (!userid && user);
  const displayUser = isOwnProfile ? user : profileUser;
  const targetUserId = userid ? Number(userid) : user?.id || 0;

  // State for creating posts
  const [newPost, setNewPost] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // State for editing posts
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<FullPostResponse | null>(null);

  // State for lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState<AttachmentResponse[]>([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // State for uploading avatar/cover
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // State for skills
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);

  // Refs for file inputs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Media gallery state
  const [showAllMedia, setShowAllMedia] = useState(false);

  // Hooks for data
  const {
    posts,
    loading: postsLoading,
    hasMore: hasMorePosts,
    loadMore: loadMorePosts,
    setPosts,
  } = useUserPosts(targetUserId, user?.id, token);

  const {
    media,
    loading: mediaLoading,
    hasMore: hasMoreMedia,
    totalItems: totalMedia,
    loadMore: loadMoreMedia,
  } = useUserMedia(targetUserId, token);

  // Infinite scroll ref
  const loadMoreRef = useInfiniteScroll(
    loadMorePosts,
    hasMorePosts,
    postsLoading,
  );

  // Load profile user data if viewing someone else's profile
  useEffect(() => {
    const loadData = async () => {
      if (!userid) {
        setProfileLoading(false);
        return;
      }

      const targetId = Number(userid);
      const isOwn = user?.id === targetId;

      if (isOwn) {
        // Viewing own profile, use current user data
        setProfileLoading(false);
        return;
      }

      // Viewing someone else's profile, fetch their data
      try {
        setProfileLoading(true);
        setProfileError(null);

        // Try with token first, if no token, try without (public profile)
        const response = await userApi.getById(targetId, token || undefined);
        setProfileUser(response);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Không thể tải thông tin người dùng";
        setProfileError(errorMessage);
        setProfileUser(null);
      } finally {
        setProfileLoading(false);
      }
    };

    loadData();
  }, [userid, user?.id, token, user?.cvurl]); // Re-run when cvurl changes

  // Load user skills
  useEffect(() => {
    if (targetUserId && token) {
      loadUserSkills();
    }
  }, [targetUserId, token]);

  const loadUserSkills = async () => {
    if (!targetUserId || !token) return;

    try {
      setSkillsLoading(true);
      const response = await userApi.getSkills(targetUserId, token);
      // Handle both array response and object with data property
      const skillsData = Array.isArray(response)
        ? response
        : (response as any)?.data || [];
      setUserSkills(skillsData);
    } catch (error) {
      setUserSkills([]);
    } finally {
      setSkillsLoading(false);
    }
  };

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !token) return;

    setIsUploadingAvatar(true);
    try {
      const response = await userApi.updateAvatar(user.id, file, token);
      // Update user state instead of reloading
      if (response.data?.avatar) {
        // Use cache busting but in client-side event handler (safe from hydration issues)
        const timestamp = Date.now();
        const avatarUrl = response.data.avatar.includes("?")
          ? `${response.data.avatar}&t=${timestamp}`
          : `${response.data.avatar}?t=${timestamp}`;
        updateUser({ avatar: avatarUrl });
        toast.success("Cập nhật avatar thành công!");
      }
    } catch (error) {
      toast.error("Cập nhật avatar thất bại!");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Handle cover image upload
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !token) return;

    setIsUploadingCover(true);
    try {
      const response = await userApi.updateCoverImage(user.id, file, token);
      // Update user state instead of reloading
      if (response.data?.coverimage) {
        // Thêm timestamp để tránh browser cache
        const coverimageUrl = response.data.coverimage.includes("?")
          ? `${response.data.coverimage}&t=${Date.now()}`
          : `${response.data.coverimage}?t=${Date.now()}`;
        updateUser({ coverimage: coverimageUrl });
        toast.success("Cập nhật ảnh bìa thành công!");
      }
    } catch (error) {
      toast.error("Cập nhật ảnh bìa thất bại!");
    } finally {
      setIsUploadingCover(false);
    }
  };

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

  // Create new post
  const handleCreatePost = async () => {
    if (!newPost.trim() && selectedImages.length === 0 && !selectedVideo)
      return;
    if (!user || !token) {
      router.push("/login");
      return;
    }

    setIsCreatingPost(true);
    try {
      const newPostResponse = await postApi.create(
        { content: newPost, userid: user.id },
        selectedImages.length > 0 ? selectedImages : undefined,
        selectedVideo || undefined,
        token,
      );

      setPosts((prev: FullPostResponse[]) => [
        newPostResponse as unknown as FullPostResponse,
        ...prev,
      ]);
      setNewPost("");
      setSelectedImages([]);
      setSelectedVideo(null);
      toast.success("Đăng bài thành công!");
    } catch (error) {
      toast.error("Đăng bài thất bại!");
    } finally {
      setIsCreatingPost(false);
    }
  };

  // Handle like post
  const handleLikePost = async (postid: number) => {
    if (!user || !token) {
      router.push("/login");
      return;
    }

    try {
      const result = await interactionApi.toggleLike(postid, user.id, token);

      setPosts((prev: FullPostResponse[]) =>
        prev.map((post: FullPostResponse) =>
          post.id === postid
            ? {
                ...post,
                interaction: {
                  ...post.interaction,
                  islikedByCurrentUser: result.isliked,
                  totalLikes: result.totalLikes,
                },
              }
            : post,
        ),
      );
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  // Handle toggle comments
  const handleToggleComments = (postid: number) => {
    setPosts((prev: FullPostResponse[]) =>
      prev.map((post: FullPostResponse) =>
        post.id === postid
          ? { ...post, showComments: !(post as any).showComments }
          : post,
      ),
    );
  };

  // Handle add comment
  const handleAddComment = async (postid: number, content: string) => {
    if (!user || !token) {
      router.push("/login");
      return;
    }

    try {
      const newComment = await interactionApi.addComment(
        postid,
        user.id,
        content,
        token,
      );

      setPosts((prev: FullPostResponse[]) =>
        prev.map((post: FullPostResponse) =>
          post.id === postid
            ? {
                ...post,
                interaction: {
                  ...post.interaction,
                  totalComments: post.interaction.totalComments + 1,
                  comments: [newComment, ...(post.interaction.comments || [])],
                },
                showComments: true,
              }
            : post,
        ),
      );
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  // Handle edit post
  const handleEditPost = (postid: number) => {
    const post = posts.find((p: FullPostResponse) => p.id === postid);
    if (post) {
      setPostToEdit(post);
      setEditDialogOpen(true);
    }
  };

  // Handle save edited post
  const handleSaveEditedPost = async (
    postid: number,
    content: string,
    newImages: File[],
    keepImageUrls: string[],
  ) => {
    if (!token) return;

    try {
      // Find the post to get userid or companyid
      const post = posts.find((p: FullPostResponse) => p.id === postid);
      if (!post) {
        throw new Error("Post not found");
      }

      // Prepare update data with userid or companyid
      const updateData: any = { content };
      if (post.user?.id) {
        updateData.userid = post.user.id;
      } else if (post.company?.id) {
        updateData.companyid = post.company.id;
      }

      // Always use updateWithImages to handle both new images and keepImageUrls
      await postApi.updateWithImages(
        postid,
        updateData,
        newImages.length > 0 ? newImages : undefined,
        keepImageUrls,
        token,
      );

      // Update local state
      setPosts((prev: FullPostResponse[]) =>
        prev.map((p: FullPostResponse) =>
          p.id === postid ? { ...p, content } : p,
        ),
      );
      toast.success("Cập nhật bài viết thành công!");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Không thể cập nhật bài viết!");
      throw error;
    }
  };

  // Open lightbox
  const openLightbox = (
    mediaList: AttachmentResponse[],
    startIndex: number = 0,
  ) => {
    setLightboxMedia(mediaList);
    setCurrentMediaIndex(startIndex);
    setLightboxOpen(true);
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Navigate lightbox
  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % lightboxMedia.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex(
      (prev) => (prev - 1 + lightboxMedia.length) % lightboxMedia.length,
    );
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!displayUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground mb-2">
              {!user
                ? "Vui lòng đăng nhập để xem trang cá nhân"
                : "Không tìm thấy người dùng"}
            </p>
            {profileError && (
              <p className="text-center text-destructive text-sm mb-4">
                Chi tiết lỗi: {profileError}
              </p>
            )}
            <div className="flex justify-center mt-4">
              <Button onClick={() => router.push(user ? "/home" : "/login")}>
                {user ? "Về trang chủ" : "Đăng nhập"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayMedia = showAllMedia ? media : media.slice(0, 6);

  return (
    <div className="min-h-screen bg-background mb-4">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={avatarInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleAvatarChange}
      />
      <input
        type="file"
        ref={coverInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleCoverChange}
      />
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

      {/* Cover Photo */}
      <div className="relative h-72 md:h-96 bg-white overflow-hidden group border-b-1">
        {displayUser.coverimage ? (
          <div className="relative w-full h-full">
            <img
              src={displayUser.coverimage}
              alt="Cover"
              className={cn(
                "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                isUploadingCover && "blur-sm opacity-50",
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {isUploadingCover && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                <Loader2 className="h-12 w-12 text-white animate-spin mb-2" />
                <span className="text-white font-medium bg-black/40 px-3 py-1 rounded-full text-sm">
                  Đang cập nhật ảnh bìa...
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            {isUploadingCover ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <span className="text-muted-foreground text-sm font-medium">
                  Đang tải ảnh bìa...
                </span>
              </div>
            ) : (
              <p className="text-muted-foreground text-lg">
                {isOwnProfile ? "Chưa có ảnh bìa" : ""}
              </p>
            )}
          </div>
        )}
        {isOwnProfile && (
          <div className="absolute bottom-4 right-4">
            <Button
              size="sm"
              variant="secondary"
              className="cursor-target shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => coverInputRef.current?.click()}
              disabled={isUploadingCover}
            >
              {isUploadingCover ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              {displayUser.coverimage ? "Chỉnh sửa ảnh bìa" : "Thêm ảnh bìa"}
            </Button>
          </div>
        )}
      </div>

      {/* Profile Header */}
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-background rounded-b-lg shadow-sm border-x border-b">
          <div className="relative -mt-24 px-6 pb-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-center md:items-end pt-6">
                {/* Avatar */}
                <div className="relative group">
                  <Avatar
                    className={cn(
                      "h-48 w-48 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105",
                      isUploadingAvatar && "blur-[2px] opacity-70",
                    )}
                  >
                    <AvatarImage
                      src={displayUser.avatar}
                      alt={displayUser.fullname}
                    />
                    <AvatarFallback className="text-5xl bg-primary text-primary-foreground">
                      {displayUser.fullname?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isOwnProfile && (
                    <>
                      <div
                        className={cn(
                          "absolute inset-0 rounded-full bg-black/40 transition-all duration-300 flex items-center justify-center cursor-pointer",
                          isUploadingAvatar
                            ? "opacity-100 cursor-wait"
                            : "opacity-0 group-hover:opacity-100",
                        )}
                        onClick={() =>
                          !isUploadingAvatar && avatarInputRef.current?.click()
                        }
                      >
                        {isUploadingAvatar ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-10 w-10 text-white animate-spin" />
                            <span className="text-white text-xs font-medium animate-pulse">
                              Đang tải...
                            </span>
                          </div>
                        ) : (
                          <Camera className="h-8 w-8 text-white" />
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="cursor-target absolute bottom-2 right-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>

                {/* Name & Title */}
                <div className="text-center md:text-left mb-4">
                  <h1 className="text-3xl font-bold hover:text-primary transition-colors duration-300">
                    {displayUser.fullname}
                  </h1>
                  <p className="text-muted-foreground">
                    {displayUser.role === "hr"
                      ? "Nhà tuyển dụng"
                      : "Người tìm việc"}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1 mt-1 cursor-target hover:text-primary transition-colors duration-300">
                    <Users className="h-4 w-4" />
                    <span>245 người theo dõi • 189 đang theo dõi</span>
                  </p>
                </div>
              </div>

              {!isOwnProfile ? (
                <div className="flex gap-2">
                  <Button className="cursor-target hover:scale-105 transition-transform duration-300">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Theo dõi
                  </Button>
                  <Button
                    variant="outline"
                    className="cursor-target hover:scale-105 transition-transform duration-300"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Nhắn tin
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-target hover:scale-105 hover:rotate-90 transition-all duration-300"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {/* Left Sidebar - Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Intro Card */}
            <Card className="hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-left-4">
              <CardHeader>
                <CardTitle className="text-lg">Giới thiệu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground cursor-target hover:text-primary hover:translate-x-2 transition-all duration-300">
                  <Briefcase className="h-4 w-4" />
                  <span>
                    {displayUser.role === "hr"
                      ? "Nhà tuyển dụng"
                      : "Người tìm việc"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground cursor-target hover:text-primary hover:translate-x-2 transition-all duration-300">
                  <Mail className="h-4 w-4" />
                  <span>{displayUser.email}</span>
                </div>
                {displayUser.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground cursor-target hover:text-primary hover:translate-x-2 transition-all duration-300">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>{displayUser.phone}</span>
                  </div>
                )}
                {displayUser.address && (
                  <div className="flex items-center gap-2 text-muted-foreground cursor-target hover:text-primary hover:translate-x-2 transition-all duration-300">
                    <MapPin className="h-4 w-4" />
                    <span>{displayUser.address}</span>
                  </div>
                )}
                {displayUser.dateofbirth && (
                  <div className="flex items-center gap-2 text-muted-foreground cursor-target hover:text-primary hover:translate-x-2 transition-all duration-300">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Sinh ngày{" "}
                      {new Date(displayUser.dateofbirth).toLocaleDateString(
                        "vi-VN",
                      )}
                    </span>
                  </div>
                )}
                {displayUser.gender && (
                  <div className="flex items-center gap-2 text-muted-foreground cursor-target hover:text-primary hover:translate-x-2 transition-all duration-300">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>
                      {displayUser.gender === "male"
                        ? "Nam"
                        : displayUser.gender === "female"
                          ? "Nữ"
                          : "Khác"}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground cursor-target hover:text-primary hover:translate-x-2 transition-all duration-300">
                  <Calendar className="h-4 w-4" />
                  <span>Tham gia tháng 1, 2024</span>
                </div>
                {isOwnProfile && (
                  <Button
                    variant="outline"
                    className="cursor-target w-full mt-4 hover:shadow-md hover:scale-105 transition-all duration-300"
                    size="sm"
                  >
                    Chỉnh sửa chi tiết
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* CV Card */}
            <Card className="hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-left-4 delay-100">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">CV / Hồ sơ</CardTitle>
                {isOwnProfile && (
                  <Button
                    variant="link"
                    size="sm"
                    className="cursor-target hover:scale-105 transition-transform duration-300"
                    onClick={() => router.push("/user/resume")}
                  >
                    Chỉnh sửa
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {(displayUser as any).cvurl ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">
                          CV của {isOwnProfile ? "bạn" : displayUser.fullname}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Đã tải lên
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full cursor-target hover:scale-105 transition-transform duration-300"
                      onClick={() =>
                        window.open((displayUser as any).cvurl, "_blank")
                      }
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Xem CV
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    {isOwnProfile ? "Bạn chưa tải CV lên" : "Chưa có CV"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Skills Card */}
            <Card className="hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-left-4 delay-150">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Kỹ năng</CardTitle>
                {isOwnProfile && (
                  <Button
                    variant="link"
                    size="sm"
                    className="cursor-target hover:scale-105 transition-transform duration-300"
                    onClick={() => router.push("/user/resume")}
                  >
                    Chỉnh sửa
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {skillsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : userSkills.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Chưa có kỹ năng nào
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {userSkills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors cursor-default"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Photos/Videos Card */}
            <Card className="hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-left-4 delay-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">
                  Ảnh & Video ({totalMedia})
                </CardTitle>
                {totalMedia > 6 && (
                  <Button
                    variant="link"
                    size="sm"
                    className="cursor-target hover:scale-105 transition-transform duration-300"
                    onClick={() => setShowAllMedia(!showAllMedia)}
                  >
                    {showAllMedia ? "Thu gọn" : "Xem tất cả"}
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {mediaLoading && media.length === 0 ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : media.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Chưa có ảnh hoặc video
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {displayMedia.map(
                      (item: AttachmentResponse, index: number) => (
                        <div
                          key={item.id}
                          className="cursor-target aspect-square rounded-lg overflow-hidden group relative"
                          onClick={() => openLightbox(media, index)}
                        >
                          {item.filetype === "video" ? (
                            <>
                              <video
                                src={item.fileurl}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <Play className="h-8 w-8 text-white" />
                              </div>
                            </>
                          ) : (
                            <img
                              src={item.fileurl}
                              alt={`Media ${index + 1}`}
                              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
                {showAllMedia && hasMoreMedia && (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={loadMoreMedia}
                    disabled={mediaLoading}
                  >
                    {mediaLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Xem thêm"
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Center - Posts */}
          <div className="lg:col-span-2 space-y-4">
            {/* Create Post Card - Only show for own profile */}
            {isOwnProfile && user && (
              <Card className="hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
                <CardContent>
                  <div className="flex gap-3">
                    <Avatar className="cursor-target hover:scale-110 transition-transform duration-300">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.fullname?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <textarea
                      placeholder="Bạn đang nghĩ gì?"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
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
                      className="cursor-target hover:scale-105 transition-transform duration-300"
                      onClick={handleCreatePost}
                      disabled={
                        isCreatingPost ||
                        (!newPost.trim() &&
                          selectedImages.length === 0 &&
                          !selectedVideo)
                      }
                    >
                      {isCreatingPost ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Đăng"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts List */}
            {postsLoading && posts.length === 0 ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : posts.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    Chưa có bài đăng nào
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {posts.map((post: FullPostResponse, index: number) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    index={index}
                    currentUserAvatar={user?.avatar}
                    currentUserName={user?.fullname}
                    onLikePost={handleLikePost}
                    onToggleComments={handleToggleComments}
                    onAddComment={handleAddComment}
                    onSavePost={(postid) => console.log("Save post:", postid)}
                    onReportPost={(postid) =>
                      console.log("Report post:", postid)
                    }
                    onEditPost={handleEditPost}
                    onDeletePost={async (postid) => {
                      if (!token) return;
                      try {
                        const { postApi } = await import("@/apis/post.api");
                        await postApi.delete(postid, token);
                        setPosts(posts.filter((p) => p.id !== postid));
                        toast.success("Xóa bài viết thành công!");
                      } catch (error) {
                        console.error("Error deleting post:", error);
                        toast.error("Không thể xóa bài viết!");
                      }
                    }}
                  />
                ))}
                <div ref={loadMoreRef} className="py-4 flex justify-center">
                  {postsLoading && <Loader2 className="h-6 w-6 animate-spin" />}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Media Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl w-full h-[90vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={closeLightbox}
              className="cursor-target absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
            >
              <X className="h-6 w-6" />
            </Button>
            {lightboxMedia.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={prevMedia}
                className="cursor-target absolute left-4 z-50 text-white hover:bg-white/20 rounded-full h-12 w-12"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}
            <div className="relative w-full h-full flex items-center justify-center p-12">
              {lightboxMedia[currentMediaIndex]?.filetype === "video" ? (
                <video
                  src={lightboxMedia[currentMediaIndex]?.fileurl}
                  controls
                  autoPlay
                  className="max-w-full max-h-full"
                />
              ) : (
                <img
                  src={lightboxMedia[currentMediaIndex]?.fileurl}
                  alt={`Media ${currentMediaIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>
            {lightboxMedia.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={nextMedia}
                className="cursor-target absolute right-4 z-50 text-white hover:bg-white/20 rounded-full h-12 w-12"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}
            {lightboxMedia.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                {currentMediaIndex + 1} / {lightboxMedia.length}
              </div>
            )}
            {lightboxMedia.length > 1 && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4 py-2">
                {lightboxMedia.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => setCurrentMediaIndex(idx)}
                    className={`cursor-target relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 ${
                      idx === currentMediaIndex
                        ? "ring-2 ring-white scale-110"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    {item.filetype === "video" ? (
                      <>
                        <video
                          src={item.fileurl}
                          className="w-full h-full object-cover"
                        />
                        <Play className="absolute inset-0 m-auto h-4 w-4 text-white" />
                      </>
                    ) : (
                      <img
                        src={item.fileurl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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

