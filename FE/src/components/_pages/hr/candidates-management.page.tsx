"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, ExternalLink } from "lucide-react";
import { DataTable } from "@/components/common/tables/common/data-table.card";
import { applicationApi } from "@/apis/application.api";
import { useAuth } from "@/lib/hooks/useAuth";
import { openCV } from "@/utils";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/common/modals";
import HrCandidateManagementSkeleton from "@/components/common/skeletons/hr/candidate-management.skeleton";
import Image from "next/image";
import { Application } from "@/types";


const getStatusBadge = (status: string) => {
  const statusColors = {
    pending: "bg-blue-500",
    reviewed: "bg-yellow-500",
    interview: "bg-purple-500",
    offered: "bg-green-500",
    accepted: "bg-emerald-600",
    rejected: "bg-red-500",
  } as const;

  const statusLabels = {
    pending: "Chờ Xử Lý",
    reviewed: "Đã Xem",
    interview: "Phỏng Vấn",
    offered: "Đề Nghị",
    accepted: "Chấp Nhận",
    rejected: "Từ Chối",
  } as const;

  return (
    <Badge
      variant="secondary"
      className={`${
        statusColors[status as keyof typeof statusColors] || "bg-gray-500"
      } text-white text-xs`}
    >
      {statusLabels[status as keyof typeof statusLabels] ||
        status.toUpperCase()}
    </Badge>
  );
};

function CandidatesManagement() {
  const { token, company } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [appToDelete, setAppToDelete] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [token, company?.id]);

  const fetchApplications = async () => {
    if (!token || !company?.id) return;
    try {
      setLoading(true);
      const companyid = company.id;

      const response = await applicationApi.getByCompany(
        companyid,
        1,
        50,
        token,
      );

      // Response structure: { page, pageSize, totalItems, totalPages, data: Application[] }
      if (response && response.data) {
        setApplications(response.data as any);
        setTotalItems(response.totalItems || 0);
      }
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (row: Application) => {
    if (!token) return;
    try {
      await applicationApi.accept(
        row.jobid,
        row.userid,
        row.cvurl,
        row.coverletter,
        token,
      );
      toast.success(`Đã chấp nhận ứng viên ${row.userfullname}`);
      await fetchApplications(); // Refresh data
    } catch (error) {
      toast.error("Có lỗi xảy ra khi chấp nhận ứng viên");
    }
  };

  const handleReject = async (row: Application) => {
    try {
      const token = "your-token-here"; // TODO: Get from auth context
      await applicationApi.reject(
        row.jobid,
        row.userid,
        row.cvurl,
        row.coverletter,
        token,
      );
      toast.success(`Đã từ chối ứng viên ${row.userfullname}`);
      await fetchApplications(); // Refresh data
    } catch (error) {
      toast.error("Có lỗi xảy ra khi từ chối ứng viên");
    }
  };

  const handleDelete = (row: Application) => {
    setAppToDelete(row);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteApplication = async () => {
    if (!appToDelete) return;

    try {
      const token = "your-token-here"; // TODO: Get from auth context
      await applicationApi.delete(appToDelete.jobid, appToDelete.userid, token);
      toast.success(`Đã xóa đơn ứng tuyển của ${appToDelete.userfullname} thành công`);
      await fetchApplications(); // Refresh data
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa đơn ứng tuyển");
    } finally {
      setShowDeleteConfirm(false);
      setAppToDelete(null);
    }
  };

  const handleSendEmail = (row: Application) => {
    // Prepare email content
    const recipient = encodeURIComponent(row.userEmail);
    const subject = encodeURIComponent(`Về đơn ứng tuyển ${row.jobTitle}`);
    const body = encodeURIComponent(
      `Xin chào ${row.userfullname},\n\nChúng tôi đã xem xét đơn ứng tuyển của bạn cho vị trí ${row.jobTitle}.\n\n`,
    );

    // Open Gmail compose in new tab
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;

    window.open(gmailUrl, "_blank", "noopener,noreferrer");
  };

  const columns = [
    {
      key: "userfullname" as keyof Application,
      header: "Ứng Viên",
      sortable: true,
      render: (value: string, row: Application) => (
        <div className="flex items-center space-x-3 min-w-[180px]">
          <Image src={row.userAvatar} alt={row.userfullname} height={35} width={35} className="object-contain rounded-full"/>
          <div>
            <div className="font-medium text-sm">{value}</div>
            <div className="text-xs text-muted-foreground">{row.userEmail}</div>
          </div>
        </div>
      ),
    },
    {
      key: "jobTitle" as keyof Application,
      header: "Vị Trí",
      sortable: true,
      render: (value: string) => (
        <span className="text-xs max-w-[200px] line-clamp-2">{value}</span>
      ),
    },
    {
      key: "status" as keyof Application,
      header: "Trạng Thái",
      sortable: true,
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: "createdat" as keyof Application,
      header: "Ngày Nộp",
      sortable: true,
      render: (value: string) => (
        <span className="text-xs whitespace-nowrap">
          {new Date(value).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "cvurl" as keyof Application,
      header: "CV",
      sortable: false,
      render: (value: string, row: Application) => (
        <button
          onClick={() => openCV(value, `CV_${row.userfullname}.pdf`)}
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
        >
          <ExternalLink className="h-3 w-3" />
          Xem CV
        </button>
      ),
    },
    {
      key: "actions" as keyof Application,
      header: "Chi Tiết",
      sortable: false,
      render: (_: any, row: Application) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi Tiết Ứng Tuyển</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Thông Tin Ứng Viên</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Họ tên:</strong> {row.userfullname}
                  </p>
                  <p>
                    <strong>Email:</strong> {row.userEmail}
                  </p>
                  <p>
                    <strong>Vị trí:</strong> {row.jobTitle}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Thư Giới Thiệu</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {row.coverletter}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">CV</h3>
                <button
                  onClick={() => openCV(row.cvurl, `CV_${row.userfullname}.pdf`)}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-4 w-4" />
                  Xem CV đầy đủ
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  const filterOptions = [
    { value: "pending", label: "Chờ Xử Lý" },
    { value: "reviewed", label: "Đã Xem" },
    { value: "interview", label: "Phỏng Vấn" },
    { value: "accepted", label: "Chấp Nhận" },
    { value: "rejected", label: "Từ Chối" },
  ];

  if (loading) {
    return (
      <HrCandidateManagementSkeleton/>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold font-mono">Ứng Viên</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Quản lý {totalItems} đơn ứng tuyển
          </p>
        </div>
        <Button
          className="font-mono text-sm w-full sm:w-auto"
          onClick={fetchApplications}
        >
          Làm Mới
        </Button>
      </div>

      <DataTable
        data={applications}
        columns={columns}
        searchKey="userfullname"
        filterKey="status"
        filterOptions={filterOptions}
        onRowAction={(action, row) => {
          switch (action) {
            case "accept":
              handleAccept(row);
              break;
            case "reject":
              handleReject(row);
              break;
            case "email":
              handleSendEmail(row);
              break;
            case "delete":
              handleDelete(row);
              break;
          }
        }}
      />
      {appToDelete && (
        <ConfirmModal
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title="Xóa đơn ứng tuyển"
          description={`Bạn có chắc chắn muốn xóa đơn ứng tuyển của ${appToDelete.userfullname}? Hành động này không thể hoàn tác.`}
          onConfirm={confirmDeleteApplication}
        />
      )}
    </div>
  );
}

export default CandidatesManagement;
