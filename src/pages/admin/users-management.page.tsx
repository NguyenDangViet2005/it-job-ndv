"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { Plus, Users, CheckCircle, Clock, Shield } from "lucide-react";
import {
  AdminDataTable,
  AdminStatsGrid,
  AdminUserRow,
  getUserTableColumns,
  type AdminUser,
} from "@/components/tables";
import { userApi } from "@/apis";
import { useAuth } from "@/hooks/useAuth";

const UsersManagement = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const pageSize = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.getAll(
        currentPage,
        pageSize,
        token || undefined,
      );

      // Handle backend response format with $values
      let usersData = response.data;
      if (
        usersData &&
        typeof usersData === "object" &&
        "$values" in usersData
      ) {
        usersData = (usersData as any).$values;
      }

      setUsers(Array.isArray(usersData) ? usersData : []);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.totalItems || 0);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không thể tải danh sách người dùng",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  // Filter users client-side
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterRole === "all" || user.role?.toLowerCase() === filterRole;
    return matchesSearch && matchesFilter;
  });

  // Stats
  const stats = [
    {
      label: "Tổng người dùng",
      value: totalItems,
      icon: Users,
      color: "from-blue-500/20 to-blue-600/20",
    },
    {
      label: "Đang hoạt động",
      value: users.length,
      icon: CheckCircle,
      color: "from-green-500/20 to-green-600/20",
    },
    {
      label: "Nhà tuyển dụng",
      value: users.filter((u) => u.role?.toLowerCase() === "employer").length,
      icon: Clock,
      color: "from-yellow-500/20 to-yellow-600/20",
    },
    {
      label: "Admin",
      value: users.filter((u) => u.role?.toLowerCase() === "admin").length,
      icon: Shield,
      color: "from-red-500/20 to-red-600/20",
    },
  ];

  // Handle actions
  const handleEdit = (user: AdminUser) => {};

  const handleDelete = async (user: AdminUser) => {
    if (
      !confirm(
        `Bạn có chắc muốn xóa "${user.fullName}"?\n\nCẢNH BÁO: Hành động này sẽ xóa tất cả dữ liệu liên quan (bài đăng, ứng tuyển, blog, v.v.) và không thể hoàn tác.`,
      )
    ) {
      return;
    }

    try {
      if (!token) {
        alert("Vui lòng đăng nhập với quyền Admin");
        return;
      }

      await userApi.delete(user.id, token);
      alert("Xóa người dùng thành công");
      fetchUsers(); // Refresh list
    } catch (err) {
      alert(
        "Không thể xóa người dùng: " +
          (err instanceof Error ? err.message : "Lỗi không xác định"),
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <AdminStatsGrid stats={stats} />

      {/* Data Table */}
      <AdminDataTable
        title="Quản lý người dùng"
        subtitle="Quản lý tất cả người dùng trên hệ thống"
        data={filteredUsers}
        columns={getUserTableColumns()}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredUsers.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        searchPlaceholder="Tìm kiếm theo tên hoặc email..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          { value: "admin", label: "Admin" },
          { value: "employer", label: "Nhà tuyển dụng" },
          { value: "user", label: "Ứng viên" },
        ]}
        activeFilter={filterRole}
        onFilterChange={setFilterRole}
        onRefresh={fetchUsers}
        renderRow={(user) => (
          <AdminUserRow
            key={user.id}
            user={user}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        headerActions={
          <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-red-600 hover:to-rose-700">
            <Plus className="h-4 w-4" />
            Thêm mới
          </Button>
        }
        emptyIcon={
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        }
        emptyTitle="Chưa có người dùng nào"
        emptyDescription="Mời người dùng mới để bắt đầu"
      />
    </div>
  );
};

export default UsersManagement;
