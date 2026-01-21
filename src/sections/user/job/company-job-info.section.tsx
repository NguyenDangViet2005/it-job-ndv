"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Bookmark,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ROUTES } from "@/configs";
import ApplicationModal from "@/components/modals/application.modal";

interface JobHeaderProps {
  job: {
    id?: number;
    title: string;
    company: string;
    logo: string;
    location: string;
    salary: string;
    type: string;
    level: string;
    postedDate: string;
    applications: number;
    skills?: Array<{ id: number; name: string }>;
    quantity?: number;
    deadline?: string;
  };
}

export default function CompanyJobInfo({ job }: JobHeaderProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để ứng tuyển");
      router.push(ROUTES.LOGIN);
      return;
    }
    setIsApplicationModalOpen(true);
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để lưu công việc");
      router.push(ROUTES.LOGIN);
      return;
    }
    // TODO: Implement save job API
    toast.success("Đã lưu công việc");
  };

  const handleShare = () => {
    // Copy URL to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép link công việc");
    } else {
      toast.error("Không thể sao chép link");
    }
  };

  return (
    <>
      <Card className="rounded-none my-8 overflow-hidden border-0 shadow-lg bg-gradient-to-r from-background via-background to-accent/10">
        <CardContent className="p-5">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Company Logo */}
            <div className="flex-shrink-0">
              <div className="relative">
                <Image
                  src={job.logo}
                  alt={job.company}
                  width={100}
                  height={100}
                  className="cursor-target"
                />
              </div>
            </div>

            {/* Job Information */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                  {job.title}
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                  {job.company}
                </p>
              </div>

              {/* Job Meta Information */}
              <div className="flex flex-wrap gap-3">
                <Badge
                  variant="secondary"
                  className="cursor-target text-sm py-1 px-3"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  {job.location}
                </Badge>
                <Badge
                  variant="secondary"
                  className="cursor-target text-sm py-1 px-3"
                >
                  <DollarSign className="h-4 w-4 mr-1" />
                  {job.salary}
                </Badge>
                <Badge
                  variant="secondary"
                  className="cursor-target text-sm py-1 px-3"
                >
                  <Clock className="h-4 w-4 mr-1" />
                  {job.type}
                </Badge>
                <Badge
                  variant="secondary"
                  className="cursor-target text-sm py-1 px-3"
                >
                  <Users className="h-4 w-4 mr-1" />
                  {job.level}
                </Badge>
              </div>

              {/* Additional Info */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Đăng {job.postedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{job.applications} ứng viên</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col lg:flex-row gap-3 lg:items-start">
              <Button
                size="lg"
                className="cursor-target lg:min-w-[140px]"
                onClick={handleApply}
              >
                Ứng tuyển ngay
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  className="cursor-target flex-1 lg:flex-none"
                  onClick={handleSave}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Lưu
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="cursor-target flex-1 lg:flex-none"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Chia sẻ
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Highlights */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {job.level || "N/A"}
                </div>
                <div className="text-xs text-muted-foreground">Cấp bậc</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {job.skills && job.skills.length > 0
                    ? job.skills[0].name
                    : "N/A"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Công nghệ chính
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {job.type || "Full-time"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Hình thức làm việc
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {job.deadline
                    ? new Date(job.deadline).toLocaleDateString("vi-VN")
                    : "Đang tuyển"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Hạn nộp hồ sơ
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Modal */}
      {job.id !== undefined && (
        <ApplicationModal
          open={isApplicationModalOpen}
          onOpenChange={setIsApplicationModalOpen}
          jobId={job.id}
          jobTitle={job.title}
          companyName={job.company}
        />
      )}
    </>
  );
}
