"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { blogApi } from "@/apis/blog.api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HRBlogManagementSkeleton from "@/components/common/skeletons/hr/blog-management.skeleton";
interface Blog {
  id: number;
  userid?: number;
  categoryid?: number;
  category?: any;
  title: string;
  content: string;
  excerpt?: string;
  readtime?: string;
  image?: string;
  createdat: string;
  updatedat?: string;
}

interface Category {
  id: number;
  name: string;
}

export default function HRBlogManagementPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [createMode, setCreateMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    categoryid: 0,
    readtime: "",
    image: "",
  });

  useEffect(() => {
    if (user && token) {
      loadMyBlogs();
      loadCategories();
    }
  }, [user, token]);

  useEffect(() => {
    if (editBlog) {
      setFormData({
        title: editBlog.title || "",
        excerpt: editBlog.excerpt || "",
        content: editBlog.content || "",
        categoryid: Number(editBlog.categoryid || editBlog.category?.id || 0),
        readtime: editBlog.readtime || "",
        image: editBlog.image || "",
      });
    } else if (createMode) {
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        categoryid: 0,
        readtime: "",
        image: "",
      });
    }
  }, [editBlog, createMode]);

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

  const handleSave = async () => {
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
      const blogData = {
        userid: user.id,
        categoryid: formData.categoryid,
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        readtime: formData.readtime || "5 phút",
        image: formData.image || "",
      };

      if (createMode) {
        // Create new blog
        await blogApi.create(blogData, token);
        toast.success("Tạo blog thành công");
        // Reload blogs after create
        await loadMyBlogs();
      } else if (editBlog) {
        // Update existing blog
        await blogApi.update(editBlog.id, blogData, token);
        toast.success("Cập nhật blog thành công");
        // Reload blogs after update
        await loadMyBlogs();
      }

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
     <HRBlogManagementSkeleton/>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Quản lý Blog</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Quản lý các bài viết blog của công ty
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2 text-sm w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Tạo blog mới
        </Button>
      </div>

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
                  Bắt đầu chia sẻ kiến thức bằng cách tạo blog đầu tiên
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
        <div className="grid gap-3 sm:gap-4">
          {blogs.map((blog) => (
            <Card key={blog.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {blog.image && (
                    <div className="w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 mb-3">
                      {blog.excerpt ||
                        blog.content.replace(/<[^>]*>/g, "").substring(0, 150)}
                      ...
                    </p>
                    <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        {new Date(blog.createdat).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/blog/${blog.id}`)}
                      className="gap-2 flex-1 sm:flex-none text-xs"
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Xem</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(blog)}
                      className="gap-2 flex-1 sm:flex-none text-xs"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Sửa</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(blog.id)}
                      className="gap-2 flex-1 sm:flex-none text-xs text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Xóa</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={createMode || !!editBlog}
        onOpenChange={() => {
          setCreateMode(false);
          setEditBlog(null);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {createMode ? "Tạo blog mới" : "Chỉnh sửa blog"}
            </DialogTitle>
            <DialogDescription>
              {createMode ? "Tạo bài viết blog mới" : "Cập nhật thông tin blog"}
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
                  formData.categoryid > 0 ? String(formData.categoryid) : undefined
                }
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryid: Number(value) })
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="readtime">Thời gian đọc</Label>
                <Input
                  id="readtime"
                  value={formData.readtime}
                  onChange={(e) =>
                    setFormData({ ...formData, readtime: e.target.value })
                  }
                  placeholder="VD: 5 phút"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL ảnh</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateMode(false);
                setEditBlog(null);
              }}
              disabled={saving}
            >
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : createMode ? (
                "Tạo blog"
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa blog</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa blog này? Hành động này không thể hoàn
              tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
