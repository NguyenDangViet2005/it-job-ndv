"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { Label } from "@/components/ui/shadcn/label";
import {
  Plus,
  FileText,
  User,
  Tag,
  Clock,
  Loader2,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import {
  AdminDataTable,
  AdminStatsGrid,
  AdminBlogRow,
  getBlogTableColumns,
  type AdminBlog,
} from "@/components/tables";
import { blogApi } from "@/apis";
import { toast } from "sonner";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/shadcn/alert-dialog";
import { useAuth } from "@/hooks/useAuth";

interface Category {
  id: number;
  name: string;
}

const BlogManagement = () => {
  const { user, token } = useAuth();
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [createMode, setCreateMode] = useState(false);
  const [editBlog, setEditBlog] = useState<AdminBlog | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const pageSize = 10;

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    categoryid: 0,
    readtime: "",
    image: "",
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogApi.getAll(
        currentPage,
        pageSize,
        undefined,
        token || undefined,
      );

      // Handle backend response format with $values
      let blogsData = response.data;
      if (
        blogsData &&
        typeof blogsData === "object" &&
        "$values" in blogsData
      ) {
        blogsData = (blogsData as any).$values;
      }

      setBlogs(Array.isArray(blogsData) ? blogsData : []);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.totalItems || 0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể tải danh sách bài viết",
      );
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

  useEffect(() => {
    fetchBlogs();
    loadCategories();
  }, [currentPage]);

  useEffect(() => {
    if (editBlog) {
      setFormData({
        title: editBlog.title || "",
        excerpt: editBlog.excerpt || "",
        content: editBlog.content || "",
        categoryid: (editBlog as any).categoryid || 0,
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

  // Get unique category names from blogs for filtering
  const blogCategories = [
    ...new Set(blogs.map((b) => b.category).filter(Boolean)),
  ];

  // Filter blogs client-side
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterCategory === "all" || blog.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  // Stats - use useMemo to avoid hydration mismatch with date calculations
  const stats = useMemo(() => {
    const now = new Date();
    return [
      {
        label: "Tổng bài viết",
        value: totalItems,
        icon: FileText,
        color: "from-purple-500/20 to-purple-600/20",
      },
      {
        label: "Tác giả",
        value: new Set(blogs.map((b) => b.author)).size,
        icon: User,
        color: "from-blue-500/20 to-blue-600/20",
      },
      {
        label: "Danh mục",
        value: blogCategories.length,
        icon: Tag,
        color: "from-green-500/20 to-green-600/20",
      },
      {
        label: "Mới tháng này",
        value: blogs.filter((b) => {
          if (!b.createdat) return false;
          const date = new Date(b.createdat);
          return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );
        }).length,
        icon: Clock,
        color: "from-orange-500/20 to-orange-600/20",
      },
    ];
  }, [totalItems, blogs, blogCategories.length]);

  // Handle actions
  const handleCreate = () => {
    setCreateMode(true);
    setEditBlog(null);
  };

  const handleEdit = (blog: AdminBlog) => {
    setEditBlog(blog);
    setCreateMode(false);
  };

  const handleDelete = (blog: AdminBlog) => {
    setDeleteId(blog.id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    if (!token) {
      toast.error("Vui lòng đăng nhập");
      return;
    }

    try {
      setDeleting(true);
      await blogApi.delete(deleteId, token);
      setBlogs((prev) => prev.filter((blog) => blog.id !== deleteId));
      toast.success("Xóa blog thành công");
      setDeleteId(null);
      fetchBlogs();
    } catch (error) {
      toast.error("Xóa blog thất bại");
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập");
      return;
    }
    if (!token) {
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
        await blogApi.create(blogData, token);
        toast.success("Tạo blog thành công");
      } else if (editBlog) {
        await blogApi.update(editBlog.id, blogData, token);
        toast.success("Cập nhật blog thành công");
      }

      setEditBlog(null);
      setCreateMode(false);
      fetchBlogs();
    } catch (error: any) {
      console.error("Save error:", error);
      const errorMessage =
        error?.response?.data?.message || error?.message || "Lưu blog thất bại";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Build filter options from blog categories
  const filterOptions = blogCategories.map((cat) => ({
    value: cat!,
    label: cat!,
  }));

  return (
    <div className="space-y-6">
      {/* Stats */}
      <AdminStatsGrid stats={stats} />

      {/* Data Table */}
      <AdminDataTable
        title="Quản lý Blog"
        subtitle="Quản lý tất cả bài viết trên hệ thống"
        data={filteredBlogs}
        columns={getBlogTableColumns()}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredBlogs.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        searchPlaceholder="Tìm kiếm bài viết, tác giả..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filterOptions}
        activeFilter={filterCategory}
        onFilterChange={setFilterCategory}
        onRefresh={fetchBlogs}
        renderRow={(blog) => (
          <AdminBlogRow
            key={blog.id}
            blog={blog}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        headerActions={
          <Button
            onClick={handleCreate}
            className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-red-600 hover:to-rose-700"
          >
            <Plus className="h-4 w-4" />
            Viết bài mới
          </Button>
        }
        emptyIcon={
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        }
        emptyTitle="Chưa có bài viết nào"
        emptyDescription="Tạo bài viết mới để bắt đầu"
      />

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
                  formData.categoryid > 0 ? formData.categoryid.toString() : ""
                }
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryid: parseInt(value) })
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
              onClick={confirmDelete}
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
};

export default BlogManagement;
