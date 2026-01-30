"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/shadcn/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";
import { Button } from "@/components/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";
import { User, ExternalLink } from "lucide-react";
import { DataTable } from "@/components/tables/data-table.card";
import { applicationApi } from "@/apis/application.api";
import { useAuth } from "@/hooks/useAuth";

interface Application {
  jobId: number;
  userId: number;
  cvUrl: string;
  coverLetter: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  jobTitle: string;
  companyName: string;
  userFullName: string;
  userEmail: string;
}

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

  useEffect(() => {
    fetchApplications();
  }, [token, company?.id]);

  const fetchApplications = async () => {
    if (!token || !company?.id) return;
    try {
      setLoading(true);
      const companyId = company.id;

      const response = await applicationApi.getByCompany(
        companyId,
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
        row.jobId,
        row.userId,
        row.cvUrl,
        row.coverLetter,
        token,
      );
      alert(`✅ Đã chấp nhận ứng viên ${row.userFullName}`);
      await fetchApplications(); // Refresh data
    } catch (error) {
      alert("❌ Có lỗi xảy ra khi chấp nhận ứng viên");
    }
  };

  const handleReject = async (row: Application) => {
    try {
      const token = "your-token-here"; // TODO: Get from auth context
      await applicationApi.reject(
        row.jobId,
        row.userId,
        row.cvUrl,
        row.coverLetter,
        token,
      );
      alert(`❌ Đã từ chối ứng viên ${row.userFullName}`);
      await fetchApplications(); // Refresh data
    } catch (error) {
      alert("❌ Có lỗi xảy ra khi từ chối ứng viên");
    }
  };

  const handleDelete = async (row: Application) => {
    if (
      confirm(`⚠️ Bạn có chắc muốn xóa đơn ứng tuyển của ${row.userFullName}?`)
    ) {
      try {
        const token = "your-token-here"; // TODO: Get from auth context
        await applicationApi.delete(row.jobId, row.userId, token);
        alert(`✅ Đã xóa đơn ứng tuyển của ${row.userFullName} thành công`);
        await fetchApplications(); // Refresh data
      } catch (error) {
        alert("❌ Có lỗi xảy ra khi xóa đơn ứng tuyển");
      }
    }
  };

  const handleSendEmail = (row: Application) => {
    // Prepare email content
    const recipient = encodeURIComponent(row.userEmail);
    const subject = encodeURIComponent(`Về đơn ứng tuyển ${row.jobTitle}`);
    const body = encodeURIComponent(
      `Xin chào ${row.userFullName},\n\nChúng tôi đã xem xét đơn ứng tuyển của bạn cho vị trí ${row.jobTitle}.\n\n`,
    );

    // Open Gmail compose in new tab
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;

    window.open(gmailUrl, "_blank", "noopener,noreferrer");
  };

  const columns = [
    {
      key: "userFullName" as keyof Application,
      header: "Ứng Viên",
      sortable: true,
      render: (value: string, row: Application) => (
        <div className="flex items-center space-x-3 min-w-[180px]">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
              {value
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
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
      key: "createdAt" as keyof Application,
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
      key: "cvUrl" as keyof Application,
      header: "CV",
      sortable: false,
      render: (value: string) => (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
        >
          <ExternalLink className="h-3 w-3" />
          Xem CV
        </a>
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
                    <strong>Họ tên:</strong> {row.userFullName}
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
                  {row.coverLetter}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">CV</h3>
                <a
                  href={row.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-4 w-4" />
                  Xem CV đầy đủ
                </a>
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
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-mono">Ứng Viên</h1>
          <p className="text-muted-foreground">
            Quản lý {totalItems} đơn ứng tuyển
          </p>
        </div>
        <Button className="font-mono" onClick={fetchApplications}>
          Làm Mới
        </Button>
      </div>

      <DataTable
        data={applications}
        columns={columns}
        searchKey="userFullName"
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
    </div>
  );
}

export default CandidatesManagement;
