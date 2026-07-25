"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users, CheckCircle, Clock, Shield } from "lucide-react";
import {
  AdminDataTable,
  AdminUserRow,
  getUserTableColumns,
  type AdminUser,
} from "@/components/common/tables/admin";
import { AdminStatsGrid } from "@/components/common/cards";
import { userApi } from "@/apis";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/common/modals";

const UsersManagement = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [filterRole, setFilterRole] = useState("all");
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const pageSize = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current page data for table
      const response = await userApi.getAll(
        currentPage,
        pageSize,
        token || undefined,
      );

      // Handle response.users, response.data, response.$values or direct array
      const resAny = response as any;
      let rawData = resAny.users || resAny.data || (Array.isArray(resAny) ? resAny : []);
      if (
        rawData &&
        typeof rawData === "object" &&
        "$values" in rawData
      ) {
        rawData = rawData.$values;
      }

      const usersList = Array.isArray(rawData) ? rawData : [];
      setUsers(usersList);
      setTotalPages(resAny.totalPages || (usersList.length > 0 ? Math.ceil(usersList.length / pageSize) : 1));
      const totalCount = resAny.totalItems || usersList.length;
      setTotalItems(totalCount);

      // Fetch all users for global stats calculation if total items > current page size
      if (totalCount > pageSize) {
        const allRes = await userApi.getAll(1, totalCount, token || undefined);
        const allResAny = allRes as any;
        let allRawData = allResAny.users || allResAny.data || (Array.isArray(allResAny) ? allResAny : []);
        if (allRawData && typeof allRawData === "object" && "$values" in allRawData) {
          allRawData = allRawData.$values;
        }
        setAllUsers(Array.isArray(allRawData) ? allRawData : usersList);
      } else {
        setAllUsers(usersList);
      }
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
  }, [currentPage, token]);

  // Filter users client-side
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterRole === "all" || user.role?.toLowerCase() === filterRole;
    return matchesSearch && matchesFilter;
  });

  // Calculate global stats across all users
  const statsSource = allUsers.length > 0 ? allUsers : users;
  const stats = [
    {
      label: "Tổng người dùng",
      value: totalItems || statsSource.length,
      icon: Users,
      color: "from-blue-500/20 to-blue-600/20",
    },
    {
      label: "Đang hoạt động",
      value: statsSource.length,
      icon: CheckCircle,
      color: "from-green-500/20 to-green-600/20",
    },
    {
      label: "Nhà tuyển dụng",
      value: statsSource.filter((u) => u.role?.toLowerCase() === "employer").length,
      icon: Clock,
      color: "from-yellow-500/20 to-yellow-600/20",
    },
    {
      label: "Admin",
      value: statsSource.filter((u) => u.role?.toLowerCase() === "admin").length,
      icon: Shield,
      color: "from-red-500/20 to-red-600/20",
    },
  ];

  // Handle actions
  const handleEdit = (user: AdminUser) => {};

  const handleDelete = (user: AdminUser) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      if (!token) {
        toast.error("Vui lòng đăng nhập với quyền Admin");
        return;
      }

      await userApi.delete(userToDelete.id, token);
      toast.success("Xóa người dùng thành công");
      fetchUsers(); // Refresh list
    } catch (err) {
      toast.error(
        "Không thể xóa người dùng: " +
          (err instanceof Error ? err.message : "Lỗi không xác định"),
      );
    } finally {
      setShowDeleteConfirm(false);
      setUserToDelete(null);
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
        totalItems={totalItems || filteredUsers.length}
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
      {userToDelete && (
        <ConfirmModal
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title="Xóa người dùng"
          description={`Bạn có chắc muốn xóa "${userToDelete.fullname}"? CẢNH BÁO: Hành động này sẽ xóa tất cả dữ liệu liên quan (bài đăng, ứng tuyển, blog, v.v.) và không thể hoàn tác.`}
          onConfirm={confirmDeleteUser}
        />
      )}
    </div>
  );
};

export default UsersManagement;
