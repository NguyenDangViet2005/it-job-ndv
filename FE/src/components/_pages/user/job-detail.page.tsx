"use client";

import { useEffect, useState } from "react";
import CompanyJobInfo from "@/components/sections/jobs/company-job-info.section";
import JobDescription from "@/components/sections/jobs/job-description.section";
import JobRequirements from "@/components/sections/jobs/job-requirements.section";
import JobBenefits from "@/components/sections/jobs/job-benefits.section";
import CompanyInfo from "@/components/sections/jobs/company-info.section";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { jobApi } from "@/apis";
import { applicationApi } from "@/apis/application.api";
import { useAuth } from "@/lib/hooks/useAuth";
import { JobDetailSkeleton } from "@/components/common/skeletons";
import { Job } from "@/types";


export default function JobDetailPage({ jobid }: {jobid : string}) {
  const { user, token } = useAuth();
  const [jobData, setJobData] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    async function fetchJobDetail() {
      try {
        setLoading(true);
        const response = await jobApi.getById(Number(jobid));
        setJobData(response as any);

        if (user && token) {
          const appsResponse = await applicationApi.getByUser(user.id, 1, 100, token);
          if (appsResponse && appsResponse.data) {
            const applied = appsResponse.data.some(
              (app: any) => app.jobid === Number(jobid)
            );
            setHasApplied(applied);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Không thể tải chi tiết công việc",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchJobDetail();
  }, [jobid, user, token]);

  if (loading) {
    return <JobDetailSkeleton />;
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
    soft: [
      "Kỹ năng giải quyết vấn đề",
      "Làm việc nhóm tốt",
      "Giao tiếp hiệu quả",
    ],
  };

  const benefitsData = {
    salary: [
      `Mức lương: ${jobData.salary || "Thỏa thuận"}`,
      "Mức lương cạnh tranh",
      "Thưởng theo hiệu suất",
    ],
    welfare: ["Bảo hiểm y tế", "Bảo hiểm xã hội", "Du lịch hàng năm"],
    growth: ["Đào tạo nâng cao kỹ năng", "Tham gia hội thảo công nghệ"],
    environment: ["Văn phòng hiện đại", "Trang thiết bị đầy đủ"],
  };

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <div className="container mx-auto px-3 lg:px-4 py-4 lg:py-8 max-w-7xl">
        {/* Job Header */}
        <CompanyJobInfo
          {...jobData}
          hasApplied={hasApplied}
          onApplySuccess={() => setHasApplied(true)}
        />

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-4 lg:gap-8 mt-4 lg:mt-8">
          {/* Left Content - Single Card */}
          <div className="lg:col-span-2">
            <Card className="rounded-none">
              <CardContent className="p-3 lg:p-6 space-y-4 lg:space-y-8">
                <div>
                  <h3 className="text-base lg:text-xl font-semibold mb-3 lg:mb-4">
                    Mô tả công việc
                  </h3>
                  <JobDescription description={descriptionData} />
                </div>

                <Separator />

                {/* Requirements Section */}
                <div>
                  <h3 className="text-base lg:text-xl font-semibold mb-3 lg:mb-4">
                    Yêu cầu công việc
                  </h3>
                  <JobRequirements requirements={requirementsData} />
                </div>

                <Separator />

                {/* Benefits Section */}
                <div>
                  <h3 className="text-base lg:text-xl font-semibold mb-3 lg:mb-4">Quyền lợi</h3>
                  <JobBenefits benefits={benefitsData} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Single Card */}
          <div className="lg:col-span-1">
            <Card className="rounded-none lg:sticky lg:top-8">
              <CardContent className="p-3 lg:p-6">
                <CompanyInfo
                  jobid={jobData.id}
                  jobTitle={jobData.title}
                  company={jobData.company}
                  hasApplied={hasApplied}
                  onApplySuccess={() => setHasApplied(true)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
