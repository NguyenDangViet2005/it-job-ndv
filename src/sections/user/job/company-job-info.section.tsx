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
import { useAuth } from "@/providers/auth.provider";
import ApplicationModal from "@/components/modals/application.modal";

interface JobHeaderProps {
  job?: {
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
    // Additional fields for dynamic highlights
    skills?: Array<{ id: number; name: string }>;
    quantity?: number;
    deadline?: string;
  };
}

const CompanyJobInfo = ({ job }: JobHeaderProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  
  const defaultJob = {
    id: undefined,
    title: "Flutter Mobile Apps Developer (Android, iOS, Dart)",
    company: "CÔNG TY TNHH L.C.S",
    logo: "/logo-company.jpg",
    location: "Đà Nẵng",
    salary: "15 - 25 triệu VND",
    type: "Full-time",
    level: "Middle",
    postedDate: "2 ngày trước",
    applications: 24,
    skills: [],
    quantity: 1,
    deadline: undefined,
  };

  const jobInfo = job || defaultJob;

  const handleApply = () => {
    // Open modal instead of redirecting
    setIsApplicationModalOpen(true);
  };

  const handleSave = () => {
    const accessToken = localStorage.getItem("accessToken");
    
    if (!accessToken && !isAuthenticated) {
      alert("Vui lòng đăng nhập để lưu công việc");
      router.push("/login");
      return;
    }

    // TODO: Implement save job functionality
    alert("Đã lưu công việc");
  };

  return (
    <>
    <Card className="mb-8 overflow-hidden border-0 shadow-lg bg-gradient-to-r from-background via-background to-accent/10">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <div className="relative">
              <Image
                src={jobInfo.logo}
                alt={jobInfo.company}
                width={100}
                height={100}
                className="cursor-target rounded-xl shadow-md border-2 border-background"
              />
            </div>
          </div>

          {/* Job Information */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                {jobInfo.title}
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                {jobInfo.company}
              </p>
            </div>

            {/* Job Meta Information */}
            <div className="flex flex-wrap gap-3">
              <Badge
                variant="secondary"
                className="cursor-target text-sm py-1 px-3"
              >
                <MapPin className="cursor-target h-4 w-4 mr-1" />
                {jobInfo.location}
              </Badge>
              <Badge
                variant="secondary"
                className="cursor-target text-sm py-1 px-3"
              >
                <DollarSign className="cursor-target h-4 w-4 mr-1" />
                {jobInfo.salary}
              </Badge>
              <Badge
                variant="secondary"
                className="cursor-target text-sm py-1 px-3"
              >
                <Clock className="cursor-target h-4 w-4 mr-1" />
                {jobInfo.type}
              </Badge>
              <Badge
                variant="secondary"
                className="cursor-target text-sm py-1 px-3"
              >
                <Users className="cursor-target h-4 w-4 mr-1" />
                {jobInfo.level}
              </Badge>
            </div>

            {/* Additional Info */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="cursor-target h-4 w-4" />
                <span>Đăng {jobInfo.postedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="cursor-target h-4 w-4" />
                <span>{jobInfo.applications} ứng viên</span>
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
                <Bookmark className="cursor-target h-4 w-4 mr-2" />
                Lưu
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="cursor-target flex-1 lg:flex-none"
              >
                <Share2 className="cursor-target h-4 w-4 mr-2" />
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
                {jobInfo.level || "Middle"}
              </div>
              <div className="text-xs text-muted-foreground">
                Cấp bậc
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {jobInfo.skills && jobInfo.skills.length > 0 
                  ? jobInfo.skills[0].name 
                  : "N/A"}
              </div>
              <div className="text-xs text-muted-foreground">
                Công nghệ chính
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {jobInfo.type || "Full-time"}
              </div>
              <div className="text-xs text-muted-foreground">
                Hình thức làm việc
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {jobInfo.deadline 
                  ? new Date(jobInfo.deadline).toLocaleDateString("vi-VN")
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
    {jobInfo.id !== undefined && (
      <ApplicationModal
        open={isApplicationModalOpen}
        onOpenChange={setIsApplicationModalOpen}
        jobId={jobInfo.id as number}
        jobTitle={jobInfo.title}
        companyName={jobInfo.company}
      />
    )}
    </>
  );
};

export default CompanyJobInfo;
