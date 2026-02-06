"use client";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { MoveLeft, MoveRight } from "lucide-react";
import { useState, useEffect } from "react";
import SectionTitle from "@/components/features/section-title";
import { jobApi } from "@/apis";
import Link from "next/link";
import { formatDate } from "@/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import { ROUTES } from "@/constants";
import Image from "next/image";
import { NewestJobSkeleton } from "@/components/common/skeletons";
import { Job } from "@/types";

export default function NewestJobSection() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  const pageSize = 12;

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]);

  async function fetchJobs(page: number) {
    try {
      setLoading(true);
      const response = await jobApi.getAll(page, pageSize);
      setJobs(response.data);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải công việc");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <NewestJobSkeleton />;
  }

  if (error) {
    return (
      <div>
        <SectionTitle
          title="Công Việc Mới Nhất"
          subtitle="Cơ hội việc làm vừa được đăng tuyển"
          showViewAll
          viewAllLink="/jobs"
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-destructive">Lỗi: {error}</div>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div>
        <SectionTitle
          title="Công Việc Mới Nhất"
          subtitle="Cơ hội việc làm vừa được đăng tuyển"
          showViewAll
          viewAllLink="/jobs"
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Chưa có công việc nào</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle
        title="Công Việc Mới Nhất"
        subtitle="Cơ hội việc làm vừa được đăng tuyển"
        showViewAll
        viewAllLink="/jobs"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 pb-4 lg:pb-6">
        {jobs.map((job) => (
          <Link href={ROUTES.JOB_DETAIL(job.id)} key={job.id}>
            <div
              className="p-3 lg:p-5 border rounded-xl bg-card flex flex-col gap-2 lg:gap-4 cursor-pointer 
                shadow-sm hover:shadow-xl hover:shadow-primary/30 
                transition-all duration-300 ease-in-out h-full"
            >
              <div className="flex gap-2 lg:gap-3 items-start">
                <div className="flex-shrink-0">
                  <Image
                    src={job.company?.avatar || ""}
                    alt={job.company?.name || "Company"}
                    width={40} height={40}
                    className="w-10 h-10 lg:w-14 lg:h-14 object-contain rounded-lg border p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xs lg:text-base line-clamp-2 mb-0.5 lg:mb-1 hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-[10px] lg:text-sm font-medium text-muted-foreground line-clamp-1">
                    {job.company?.name}
                  </p>
                </div>
              </div>

              {job.description && (
                <p className="text-[10px] lg:text-sm text-muted-foreground line-clamp-2 leading-tight lg:leading-relaxed">
                  {job.description}
                </p>
              )}

              <div className="flex flex-wrap gap-1 lg:gap-2 text-[9px] lg:text-xs">
                {(job.company?.city || job.company?.address) && (
                  <span className="px-1.5 lg:px-2 py-0.5 lg:py-1 bg-blue-50 text-blue-700 rounded lg:rounded-md border border-blue-200">
                    {job.company?.city || job.company?.address}
                  </span>
                )}
                {job.type && (
                  <span className="px-1.5 lg:px-2 py-0.5 lg:py-1 bg-green-50 text-green-700 rounded lg:rounded-md border border-green-200">
                    {job.type === "full-time"
                      ? "Full-time"
                      : job.type === "part-time"
                        ? "Part-time"
                        : job.type === "contract"
                          ? "Contract"
                          : job.type === "internship"
                            ? "Intern"
                            : job.type}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1 lg:gap-2 text-[9px] lg:text-xs text-muted-foreground">
                <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
                  {job.quantity && (
                    <span className="flex items-center gap-0.5 lg:gap-1">
                      <span className="font-semibold text-foreground">
                        {job.quantity}
                      </span>{" "}
                      vị trí
                    </span>
                  )}
                  {job.deadline && (
                    <span className="flex items-center gap-0.5 lg:gap-1">
                      Hạn:{" "}
                      <span className="font-medium text-foreground">
                        {formatDate(job.deadline)}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 lg:gap-1.5 pt-1 lg:pt-2 border-t">
                  {job.skills.slice(0, 2).map((skill: any, idx: number) => (
                    idx < 2 && (
                      <span
                        key={skill.id}
                        className="text-[9px] lg:text-xs px-1.5 lg:px-2.5 py-0.5 lg:py-1 bg-primary/10 text-primary rounded lg:rounded-md font-medium"
                      >
                        {skill.name}
                      </span>
                    )
                  ))}
                  {job.skills.slice(2, 4).map((skill: any, idx: number) => (
                    <span
                      key={skill.id}
                      className="hidden lg:inline-block text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-md font-medium"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {job.skills.length > 2 && (
                    <span className="text-[9px] lg:text-xs px-1.5 lg:px-2.5 py-0.5 lg:py-1 bg-gray-100 text-gray-600 rounded lg:rounded-md font-medium lg:hidden">
                      +{job.skills.length - 2}
                    </span>
                  )}
                  {job.skills.length > 4 && (
                    <span className="hidden lg:inline-block text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md font-medium">
                      +{job.skills.length - 4}
                    </span>
                  )}
                </div>
              )}

              {job.status && (
                <div className="flex items-center justify-between pt-1 lg:pt-2 border-t">
                  <span
                    className={`text-[9px] lg:text-xs px-1.5 lg:px-2.5 py-0.5 lg:py-1 rounded lg:rounded-md font-medium ${
                      job.status === "open"
                        ? "bg-green-100 text-green-700"
                        : job.status === "closed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {job.status === "open"
                      ? "Đang tuyển"
                      : job.status === "closed"
                        ? "Đã đóng"
                        : job.status}
                  </span>
                  {job.createdat && (
                    <span className="text-[9px] lg:text-xs text-muted-foreground">
                      {formatDate(job.createdat)}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="bg-card shadow p-2 rounded-full hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Previous page"
        >
          <MoveLeft className="w-6 h-6" />
        </button>

        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">
            Trang {currentPage} / {totalPages}
          </span>
        </div>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
          className="bg-card shadow p-2 rounded-full hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Next page"
        >
          <MoveRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
