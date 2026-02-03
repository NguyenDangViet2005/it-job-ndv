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
  const { user, token } = useAuth();
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
    if (user && token) {
      loadMyBlogs();
      loadCategories();
    }
  }, [user, token]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog của tôi</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý các bài viết blog của bạn
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Tạo blog mới
        </Button>
      </div>

      {/* Blog List */}
      {blogs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Chưa có blog nào</h3>
                <p className="text-muted-foreground text-sm">
                  Bắt đầu chia sẻ kiến thức của bạn bằng cách tạo blog đầu tiên
                </p>
              </div>
              <Button onClick={handleCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                Tạo blog đầu tiên
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {blogs.map((blog) => (
            <Card key={blog.id} className="hover:shadow-md transition-shadow">
              <CardContent>
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  {blog.image && (
                    <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {blog.excerpt ||
                        blog.content.replace(/<[^>]*>/g, "").substring(0, 150)}
                      ...
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(blog.createdat).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/blog/${blog.id}`)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Xem
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(blog)}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(blog.id)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Xóa
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

