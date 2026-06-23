"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { blogApi } from "@/apis/blog.api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Loader2,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { BlogFormModal, BlogDeleteModal } from "@/components/common/modals";
import { Blog, BlogCategory } from "@/types";

export default function MyBlogsPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [createMode, setCreateMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (user && token) {
      loadMyBlogs();
      loadCategories();
    } else {
      setLoading(false);
    }
  }, [user, token, authLoading]);

  const loadMyBlogs = async () => {
    if (!user || !token) return;

    try {
      setLoading(true);
      const response = await blogApi.getByUserId(user.id, 1, 10, token);
      setBlogs(response.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách blog");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    if (!token) return;
    try {
      const response = await blogApi.getCategories(token);
      setCategories(response || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !token) return;

    try {
      setDeleting(true);
      await blogApi.delete(deleteId, token);
      setBlogs((prev) => prev.filter((blog) => blog.id !== deleteId));
      toast.success("Xóa blog thành công");
      setDeleteId(null);
    } catch (error) {
      toast.error("Xóa blog thất bại");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditBlog(blog);
    setCreateMode(false);
  };

  const handleCreate = () => {
    setCreateMode(true);
    setEditBlog(null);
  };

  const handleSave = async (
    formData: {
      title: string;
      excerpt: string;
      content: string;
      categoryid: number;
      readtime: string;
      image?: string | File;
    },
    imageFile?: File,
  ) => {
    if (!user || !token) {
      toast.error("Vui lòng đăng nhập");
      return;
    }
    if (!formData.title || !formData.content || !formData.excerpt) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }
    if (!formData.categoryid || formData.categoryid === 0) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    try {
      setSaving(true);

      // Tạo FormData để gửi multipart/form-data
      const data = new FormData();

      if (createMode) {
        // Create mode: gửi đầy đủ fields
        data.append("userid", user.id.toString());
        data.append("categoryid", formData.categoryid.toString());
        data.append("title", formData.title);
        data.append("excerpt", formData.excerpt);
        data.append("content", formData.content);
        data.append("readtime", formData.readtime || "5 phút đọc");
      } else {
        // Update mode: chỉ gửi các fields có trong BlogUpdateRequest
        data.append("categoryid", formData.categoryid.toString());
        data.append("title", formData.title);
        data.append("excerpt", formData.excerpt);
        data.append("content", formData.content);
        data.append("readtime", formData.readtime || "5 phút đọc");
      }

      if (imageFile) {
        data.append("image", imageFile);
      }

      if (createMode) {
        await blogApi.create(data, token);
        toast.success("Tạo blog thành công");
      } else if (editBlog) {
        await blogApi.update(editBlog.id, data, token);
        toast.success("Cập nhật blog thành công");
      }

      await loadMyBlogs();
      setEditBlog(null);
      setCreateMode(false);
    } catch (error: any) {
      console.error("Save error:", error);
      const errorMessage =
        error?.response?.data?.message || error?.message || "Lưu blog thất bại";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold">Blog của tôi</h1>
          <p className="text-xs sm:text-base text-muted-foreground mt-0.5 sm:mt-1">
            Quản lý các bài viết blog của bạn
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-1.5 sm:gap-2 w-full sm:w-auto text-xs sm:text-sm h-7 sm:h-10">
          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          Tạo blog mới
        </Button>
      </div>

      {/* Blog List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-border/50 min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground text-sm font-medium">Đang tải danh sách blog</p>
        </div>
      ) : blogs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-6 sm:py-12 px-3">
            <div className="text-center space-y-2 sm:space-y-4">
              <div className="w-10 h-10 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-5 w-5 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-lg">Chưa có blog nào</h3>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Bắt đầu chia sẻ kiến thức của bạn bằng cách tạo blog đầu tiên
                </p>
              </div>
              <Button onClick={handleCreate} className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-7 sm:h-10">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                Tạo blog đầu tiên
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2 sm:gap-4">
          {blogs.map((blog) => (
            <Card key={blog.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  {/* Thumbnail */}
                  {blog.image && (
                    <div className="w-full sm:w-32 h-24 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-xl font-semibold mb-1 sm:mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-muted-foreground text-xs line-clamp-2 mb-1 sm:mb-3">
                      {blog.excerpt ||
                        blog.content.replace(/<[^>]*>/g, "").substring(0, 150)}
                      ...
                    </p>
                    <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(blog.createdat).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-1.5 sm:gap-2 justify-end sm:justify-start">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/blog/${blog.id}`)}
                      className="gap-1 flex-1 sm:flex-none text-xs h-7 sm:h-9"
                    >
                      <Eye className="h-3 w-3" />
                      <span className="hidden sm:inline">Xem</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(blog)}
                      className="gap-1 flex-1 sm:flex-none text-xs h-7 sm:h-9"
                    >
                      <Edit className="h-3 w-3" />
                      <span className="hidden sm:inline">Sửa</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(blog.id)}
                      className="gap-1 text-destructive hover:text-destructive flex-1 sm:flex-none text-xs h-7 sm:h-9"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span className="hidden sm:inline">Xóa</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <BlogFormModal
        open={createMode || !!editBlog}
        onOpenChange={(open) => {
          if (!open) {
            setCreateMode(false);
            setEditBlog(null);
          }
        }}
        mode={createMode ? "create" : "edit"}
        blog={editBlog}
        categories={categories}
        onSave={handleSave}
        saving={saving}
      />

      {/* Delete Modal */}
      <BlogDeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </div>
  );
}

