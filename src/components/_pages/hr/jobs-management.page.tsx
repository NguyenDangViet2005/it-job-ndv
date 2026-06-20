"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/common/tables/common/data-table.card";
import { jobApi } from "@/apis/job.api";
import { JobDetailModal } from "@/components/common/modals/jobs/job-detail.modal";
import {
  CreateJobForm,
  CreateJobData,
} from "@/components/common/forms/jobs/create-job.form";
import { useAuth } from "@/lib/hooks/useAuth";
import HrJobManagementSkeleton from "@/components/common/skeletons/hr/job-management.skeleton";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/common/modals";

interface JobData {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  quantity: number;
  deadline: string;
  createdat: string;
  company: {
    id: number;
    name: string;
    avatar?: string;
    website?: string;
    address?: string;
    city?: string;
  };
  skills: Array<{
    id: number;
    name: string;
  }>;
}

const JobsManagement = () => {
  const { user, company, token } = useAuth();
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobData | null>(null);

  // Create job modal
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Edit form
  const [editForm, setEditForm] = useState({
    companyid: 0,
    title: "",
    description: "",
    type: "",
    quantity: 0,
    deadline: "",
    status: "",
  });

  useEffect(() => {
    if (user?.id) {
      fetchJobs();
    }
  }, [user?.id]);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      if (!user?.id) {
        console.error("No user found");
        setLoading(false);
        return;
      }

      const response = await jobApi.getByUser(
        user.id,
        1,
        50,
        token || undefined
      );

      if (response && response.data) {
        setJobs(response.data as JobData[]);
        setTotalItems(response.totalItems || 0);
      }
    } catch (error) {
      console.error("❌ Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: {
        variant: "default" as const,
        label: "Đang Mở",
      },
      draft: {
        variant: "secondary" as const,
        label: "Bản Nháp",
      },
      closed: {
        variant: "destructive" as const,
        label: "Đã Đóng",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return (
      <Badge variant={config.variant} className="text-xs whitespace-nowrap">
        {config.label}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeLabels = {
      "full-time": "Toàn thời gian",
      "part-time": "Bán thời gian",
      contract: "Hợp đồng",
      internship: "Thực tập",
    };

    return (
      <Badge variant="outline" className="text-xs whitespace-nowrap">
        {typeLabels[type as keyof typeof typeLabels] || type}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const columns = [
    {
      key: "title" as keyof JobData,
      header: "Công Việc",
      sortable: true,
      render: (value: string, row: JobData) => (
        <div className="space-y-0.5 min-w-[150px] max-w-[200px]">
          <div className="font-medium text-xs line-clamp-1">{value}</div>
          <div className="text-[10px] text-muted-foreground line-clamp-1">
            {row.description}
          </div>
        </div>
      ),
    },
    {
      key: "type" as keyof JobData,
      header: "Loại",
      sortable: true,
      render: (value: string) => getTypeBadge(value),
    },
    {
      key: "status" as keyof JobData,
      header: "TT",
      sortable: true,
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: "quantity" as keyof JobData,
      header: "SL",
      sortable: true,
      render: (value: number) => (
        <span className="font-bold text-xs">{value}</span>
      ),
    },
    {
      key: "skills" as keyof JobData,
      header: "Kỹ Năng",
      sortable: false,
      render: (value: Array<{ id: number; name: string }>) => (
        <div className="flex gap-1 max-w-[100px] flex-wrap">
          {value.slice(0, 1).map((skill) => (
            <Badge
              key={skill.id}
              variant="outline"
              className="text-[10px] px-1 py-0"
            >
              {skill.name}
            </Badge>
          ))}
          {value.length > 1 && (
            <Badge variant="outline" className="text-[10px] px-1 py-0">
              +{value.length - 1}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "deadline" as keyof JobData,
      header: "Hạn",
      sortable: true,
      render: (value: string) => (
        <span className="text-[10px] whitespace-nowrap">
          {formatDate(value)}
        </span>
      ),
    },
  ];

  const filterOptions = [
    { value: "open", label: "Đang Mở" },
    { value: "closed", label: "Đã Đóng" },
  ];

  const jobActions = [
    { key: "view", label: "Xem", className: "text-blue-600" },
    { key: "edit", label: "Sửa", className: "text-orange-600" },
    { key: "delete", label: "Gỡ Bỏ", className: "text-destructive" },
  ];

  const handleViewJob = async (jobid: number) => {
    try {
      const response = await jobApi.getById(jobid);
      setSelectedJob(response as any);
      setModalMode("view");
      setModalOpen(true);
    } catch (error) {
      toast.error("Không thể tải thông tin công việc");
    }
  };

  const handleEditJob = async (job: JobData) => {
    try {
      const response = await jobApi.getById(job.id);
      const jobDetail = response as any;

      setSelectedJob(jobDetail);
      setEditForm({
        companyid: jobDetail.company.id,
        title: jobDetail.title,
        description: jobDetail.description,
        type: jobDetail.type,
        quantity: jobDetail.quantity,
        deadline: jobDetail.deadline.split("T")[0],
        status: jobDetail.status,
      });
      setModalMode("edit");
      setModalOpen(true);
    } catch (error) {
      toast.error("Không thể tải thông tin công việc");
    }
  };

  const handleCreateJob = async (data: CreateJobData) => {
    if (!user?.id || !token) {
      toast.error("Vui lòng đăng nhập để thực hiện chức năng này");
      return;
    }

    try {
      await jobApi.create(user.id, data, token);
      toast.success("Đăng tin tuyển dụng thành công!");
      fetchJobs();
    } catch (error) {
      toast.error("Đăng tin thất bại!");
      throw error;
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedJob || !token) return;

    try {
      await jobApi.update(selectedJob.id, editForm, token);
      toast.success("Cập nhật thành công!");
      setModalOpen(false);
      fetchJobs();
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    }
  };

  const handleDeleteJob = (job: JobData) => {
    setJobToDelete(job);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteJob = async () => {
    if (!jobToDelete || !token) return;

    try {
      await jobApi.delete(jobToDelete.id, token);
      toast.success("Đã gỡ bỏ thành công!");
      fetchJobs();
    } catch (error) {
      toast.error("Gỡ bỏ thất bại!");
    } finally {
      setShowDeleteConfirm(false);
      setJobToDelete(null);
    }
  };

  const handleRowAction = (action: string, job: JobData) => {
    switch (action) {
      case "view":
        handleViewJob(job.id);
        break;
      case "edit":
        handleEditJob(job);
        break;
      case "delete":
        handleDeleteJob(job);
        break;
    }
  };

  if (loading) {
    return (
      <HrJobManagementSkeleton/>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold font-mono">
            Quản Lý Công Việc
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Quản lý {totalItems} tin tuyển dụng
          </p>
        </div>
        <Button
          className="font-mono text-sm w-full sm:w-auto"
          onClick={() => setCreateModalOpen(true)}
        >
          Đăng Tin Tuyển Dụng
        </Button>
      </div>

      <DataTable
        data={jobs}
        columns={columns}
        searchKey="title"
        filterKey="status"
        filterOptions={filterOptions}
        actions={jobActions}
        onRowAction={handleRowAction}
      />

      {/* Create Job Modal */}
      <CreateJobForm
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateJob}
        companyid={user?.id || 0}
      />

      {/* Job Detail Modal */}
      <JobDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        job={selectedJob}
        form={editForm}
        onFormChange={setEditForm}
        onSave={handleSaveEdit}
      />
      {jobToDelete && (
        <ConfirmModal
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title="Gỡ bỏ tin tuyển dụng"
          description={`Bạn có chắc muốn gỡ bỏ tin "${jobToDelete.title}"? Hành động này không thể hoàn tác.`}
          onConfirm={confirmDeleteJob}
        />
      )}
    </div>
  );
};

export default JobsManagement;

