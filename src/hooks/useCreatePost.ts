import { useState, useRef } from "react";
import { toast } from "sonner";
import { postApi } from "@/apis/post.api";

interface UseCreatePostProps {
  userId?: number;
  token: string | null;
  isAuthenticated: boolean;
  onSuccess?: () => void;
}

export function useCreatePost({
  userId,
  token,
  isAuthenticated,
  onSuccess,
}: UseCreatePostProps) {
  const [newPost, setNewPost] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedImages((prev) => [...prev, ...files].slice(0, 10));
      setSelectedVideo(null);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
      setSelectedImages([]);
    }
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeSelectedVideo = () => {
    setSelectedVideo(null);
  };

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;
    
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thực hiện thao tác này");
      return;
    }

    if (!userId || !token) return;

    setIsCreatingPost(true);
    try {
      await postApi.create(
        { content: newPost, userId },
        selectedImages.length > 0 ? selectedImages : undefined,
        selectedVideo || undefined,
        token,
      );

      setNewPost("");
      setSelectedImages([]);
      setSelectedVideo(null);
      
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.reload();
      }
    } catch (error) {
      toast.error("Đăng bài thất bại");
    } finally {
      setIsCreatingPost(false);
    }
  };

  return {
    newPost,
    setNewPost,
    selectedImages,
    selectedVideo,
    isCreatingPost,
    imageInputRef,
    videoInputRef,
    handleImageSelect,
    handleVideoSelect,
    removeSelectedImage,
    removeSelectedVideo,
    handlePostSubmit,
  };
}
