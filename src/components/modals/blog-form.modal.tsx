"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { Label } from "@/components/ui/shadcn/label";
import { Loader2, X, Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";

interface Blog {
  id: number;
  userId?: number;
  categoryId?: number;
  category?: any;
  title: string;
  content: string;
  excerpt?: string;
  readTime?: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
}

interface Category {
  id: number;
  name: string;
}

interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  categoryId: number;
  readTime: string;
  image?: string | File; // Có thể là URL string hoặc File object
}

interface BlogFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  blog?: Blog | null;
  categories: Category[];
  onSave: (data: BlogFormData, imageFile?: File) => Promise<void>;
  saving?: boolean;
}

export function BlogFormModal({
  open,
  onOpenChange,
  mode,
  blog,
  categories,
  onSave,
  saving = false,
}: BlogFormModalProps) {
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    excerpt: "",
    content: "",
    categoryId: 0,
    readTime: "",
    image: "",
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (blog && mode === "edit") {
      setFormData({
        title: blog.title || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        categoryId: blog.categoryId || blog.category?.id || 0,
        readTime: blog.readTime || "",
        image: blog.image || "",
      });
      setImagePreview(blog.image || null);
      setImageFile(null);
    } else if (mode === "create") {
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        categoryId: 0,
        readTime: "",
        image: "",
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [blog, mode, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, image: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    await onSave(formData, imageFile || undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tạo blog mới" : "Chỉnh sửa blog"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Tạo bài viết blog mới"
              : "Cập nhật thông tin blog"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Nhập tiêu đề blog"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Danh mục *</Label>
            <Select
              value={
                formData.categoryId > 0 ? formData.categoryId.toString() : ""
              }
              onValueChange={(value) =>
                setFormData({ ...formData, categoryId: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Mô tả ngắn *</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              placeholder="Nhập mô tả ngắn"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Nội dung *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Nhập nội dung blog"
              rows={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="readTime">Thời gian đọc</Label>
            <Input
              id="readTime"
              value={formData.readTime}
              onChange={(e) =>
                setFormData({ ...formData, readTime: e.target.value })
              }
              placeholder="VD: 5 phút đọc"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Ảnh bìa</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-muted/50 rounded-lg transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Click để chọn ảnh hoặc kéo thả vào đây
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF (tối đa 5MB)
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : mode === "create" ? (
              "Tạo blog"
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
