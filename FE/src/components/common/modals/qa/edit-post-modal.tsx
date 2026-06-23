"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { Post } from "@/types";

interface EditPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  onSave: (
    postid: number,
    content: string,
    newImages: File[],
    keepImageUrls: string[]
  ) => Promise<void>;
}

export default function EditPostDialog({
  open,
  onOpenChange,
  post,
  onSave,
}: EditPostDialogProps) {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Update content and images when post changes
  useEffect(() => {
    if (post) {
      setContent(post.content || "");
      // Filter only image attachments
      const imageUrls = post.attachments
        ?.filter((att) => att.filetype === "image")
        .map((att) => att.fileurl) || [];
      setCurrentImages(imageUrls);
      setNewImages([]);
    }
  }, [post]);

  const handleSave = async () => {
    if (!post || !content.trim()) return;

    setIsSaving(true);
    try {
      await onSave(post.id, content, newImages, currentImages);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (post) {
      setContent(post.content || "");
      const imageUrls = post.attachments
        ?.filter((att) => att.filetype === "image")
        .map((att) => att.fileurl) || [];
      setCurrentImages(imageUrls);
      setNewImages([]);
    }
    onOpenChange(false);
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setNewImages((prev) => [...prev, ...files].slice(0, 10));
    }
  };

  // Remove current image
  const removeCurrentImage = (index: number) => {
    setCurrentImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove new image
  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
          <DialogDescription>
            Cập nhật nội dung bài viết của bạn
          </DialogDescription>
        </DialogHeader>

        {/* Hidden file input */}
        <input
          type="file"
          ref={imageInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
        />

        <div className="space-y-4 py-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nội dung bài viết..."
            className="min-h-[150px] resize-none"
            disabled={isSaving}
          />

          {/* Current Images */}
          {currentImages.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Ảnh hiện tại:</p>
              <div className="grid grid-cols-3 gap-2">
                {currentImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className="relative w-full h-24 rounded-lg overflow-hidden border">
                      <Image
                        src={img}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeCurrentImage(index)}
                      disabled={isSaving}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          {newImages.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-600">Ảnh mới:</p>
              <div className="grid grid-cols-3 gap-2">
                {newImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className="relative w-full h-24 rounded-lg overflow-hidden border border-green-500">
                      <Image
                        src={URL.createObjectURL(img)}
                        alt={`New image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeNewImage(index)}
                      disabled={isSaving}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Image Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => imageInputRef.current?.click()}
            disabled={isSaving}
            className="w-full"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Thêm ảnh
          </Button>

          <p className="text-sm text-muted-foreground">
            {content.length} ký tự
            {(currentImages.length > 0 || newImages.length > 0) && (
              <span className="ml-2">
                • {currentImages.length + newImages.length} ảnh
              </span>
            )}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !content.trim()}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
