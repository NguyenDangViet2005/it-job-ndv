"use client";

import { useEffect, useState } from "react";
import CompanyJobInfo from "@/sections/user/job/company-job-info.section";
import JobDescription from "@/sections/user/job/job-description.section";
import JobRequirements from "@/sections/user/job/job-requirements.section";
import JobBenefits from "@/sections/user/job/job-benefits.section";
import CompanyInfo from "@/sections/user/job/company-info.section";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/shadcn/tabs";
import { jobApi } from "@/apis";
import type { JobResponse } from "@/types/api.type";

type Props = {
  jobId: string;
};

export default function JobDetailPage({ jobId }: Props) {
  const [jobData, setJobData] = useState<JobResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobDetail() {
      try {
        setLoading(true);
        const response = await jobApi.getById(Number(jobId));
        
        // Response chính là JobResponse object sau khi transform
        // Không có .data vì apiGetById đã unwrap rồi
        setJobData(response as any);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải chi tiết công việc");
      } finally {
        setLoading(false);
      }
    }

    fetchJobDetail();
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-destructive">
          {error || "Không tìm thấy công việc"}
        </div>
      </div>
    );
  }

  const jobHeaderData = {
    id: jobData.id,
    title: jobData.title,
    company: jobData.company?.name || "",
    logo: jobData.company?.avatar || "/logo-company.jpg",
    location: jobData.company?.city || jobData.company?.address || "",
    salary: "Thỏa thuận",
    type: jobData.type,
    level: "Middle",
    postedDate: new Date(jobData.createdAt).toLocaleDateString("vi-VN"),
    applications: 0,
    // Additional data for highlights
    skills: jobData.skills || [],
    quantity: jobData.quantity,
    deadline: jobData.deadline,
  };

  const descriptionData = {
    overview: jobData.description || "Chưa có mô tả chi tiết",
    responsibilities: [
      "Phát triển và duy trì ứng dụng",
      "Làm việc với team để đảm bảo chất lượng",
      "Tham gia vào các cuộc họp dự án",
    ],
    teamWork: [
      "Làm việc với Product Manager",
      "Phối hợp với Designer",
      "Tham gia sprint planning",
    ],
    impact: ["Sản phẩm phục vụ hàng nghìn người dùng"],
  };

  const requirementsData = {
    technical: jobData.skills?.map((s: any) => s.name) || [],
    experience: [`${jobData.quantity} vị trí tuyển dụng`],
    education: ["Cử nhân Công nghệ thông tin hoặc tương đương"],
    soft: ["Kỹ năng giải quyết vấn đề", "Làm việc nhóm tốt", "Giao tiếp hiệu quả"],
  };

  const benefitsData = {
    salary: ["Mức lương cạnh tranh", "Thưởng theo hiệu suất"],
    welfare: ["Bảo hiểm y tế", "Bảo hiểm xã hội", "Du lịch hàng năm"],
    growth: ["Đào tạo nâng cao kỹ năng", "Tham gia hội thảo công nghệ"],
    environment: ["Văn phòng hiện đại", "Trang thiết bị đầy đủ"],
  };

  const companyInfoData = {
    name: jobData.company?.name || "",
    logo: jobData.company?.avatar || "/logo-company.jpg",
    size: "50-100",
    founded: "2015",
    industry: "Công nghệ",
    website: jobData.company?.website || "",
    location: jobData.company?.city || "",
    email: "hr@company.com",
    phone: "",
    description: "Chưa có mô tả công ty",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Job Header */}
        <CompanyJobInfo job={jobHeaderData} />

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="description" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Mô tả công việc</TabsTrigger>
                <TabsTrigger value="requirements">Yêu cầu</TabsTrigger>
                <TabsTrigger value="benefits">Quyền lợi</TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <JobDescription description={descriptionData} />
              </TabsContent>

              <TabsContent value="requirements">
                <JobRequirements requirements={requirementsData} />
              </TabsContent>

              <TabsContent value="benefits">
                <JobBenefits benefits={benefitsData} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-1">
            <CompanyInfo 
              jobId={jobData.id}
              jobTitle={jobData.title}
              company={companyInfoData} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
