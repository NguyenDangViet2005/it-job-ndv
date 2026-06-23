"use client";

import  { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase, Users, TrendingUp, Eye } from "lucide-react";
import {
  AdminDataTable,
  AdminJobRow,
  getJobTableColumns,
  type AdminJob} from "@/components/common/tables/admin"
import { AdminStatsGrid } from "@/components/common/cards";
import { jobApi } from "@/apis";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/common/modals";

const JobsManagement = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<AdminJob | null>(null);
  const pageSize = 10;

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobApi.getAll(currentPage, pageSize);

      // Handle backend response format with $values
      let jobsData = response.data;
      if (jobsData && typeof jobsData === "object" && "$values" in jobsData) {
        jobsData = (jobsData as any).$values;
      }

      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.totalItems || 0);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không thể tải danh sách công việc",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage]);

  // Filter jobs client-side
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || job.status?.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Stats
  const stats = [
    {
      label: "Tổng số Jobs",
      value: totalItems,
      icon: Briefcase,
      color: "from-blue-500/20 to-blue-600/20",
    },
    {
      label: "Đang mở",
      value: jobs.filter((j) => j.status?.toLowerCase() === "open").length,
      icon: TrendingUp,
      color: "from-green-500/20 to-green-600/20",
    },
    {
      label: "Tổng vị trí",
      value: jobs.reduce((sum, j) => sum + (j.quantity || 0), 0),
      icon: Users,
      color: "from-purple-500/20 to-purple-600/20",
    },
    {
      label: "Đã đóng",
      value: jobs.filter((j) => j.status?.toLowerCase() === "closed").length,
      icon: Eye,
      color: "from-orange-500/20 to-orange-600/20",
    },
  ];

  // Handle actions
  const handleEdit = (job: AdminJob) => {};

  const handleDelete = (job: AdminJob) => {
    setJobToDelete(job);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      if (!token) {
        toast.error("Vui lòng đăng nhập với quyền Admin");
        return;
      }

      await jobApi.delete(jobToDelete.id, token);
      toast.success("Xóa công việc thành công");
      fetchJobs(); // Refresh list
    } catch (err) {
      toast.error(
        "Không thể xóa công việc: " +
          (err instanceof Error ? err.message : "Lỗi không xác định"),
      );
    } finally {
      setShowDeleteConfirm(false);
      setJobToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <AdminStatsGrid stats={stats} />

      {/* Data Table */}
      <AdminDataTable
        title="Quản lý công việc"
        subtitle="Quản lý tất cả tin tuyển dụng trên hệ thống"
        data={filteredJobs}
        columns={getJobTableColumns()}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredJobs.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        searchPlaceholder="Tìm kiếm công việc, công ty..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          { value: "open", label: "Đang mở" },
          { value: "closed", label: "Đã đóng" },
          { value: "draft", label: "Nháp" },
        ]}
        activeFilter={filterStatus}
        onFilterChange={setFilterStatus}
        onRefresh={fetchJobs}
        renderRow={(job) => (
          <AdminJobRow
            key={job.id}
            job={job}
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
          <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        }
        emptyTitle="Chưa có công việc nào"
        emptyDescription="Tạo tin tuyển dụng mới để bắt đầu"
      />
      {jobToDelete && (
        <ConfirmModal
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title="Xóa công việc"
          description={`Bạn có chắc muốn xóa "${jobToDelete.title}"? CẢNH BÁO: Các đơn ứng tuyển liên quan cũng sẽ bị xóa vĩnh viễn và không thể hoàn tác.`}
          onConfirm={confirmDeleteJob}
        />
      )}
    </div>
  );
};

export default JobsManagement;
