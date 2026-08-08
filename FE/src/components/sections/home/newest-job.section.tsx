"use client";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { MoveLeft, MoveRight } from "lucide-react";
import { useState, useEffect } from "react";
import SectionTitle from "@/components/features/section-title";
import { ModernSectionHeader } from "@/components/ui/modern-section-header";
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
        subtitle="Cơ hội việc làm công nghệ thông tin vừa được cập nhật"
        showViewAll
        viewAllLink={ROUTES.JOBS}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5 pb-4 lg:pb-6">
        {jobs.map((job) => (
          <Link href={ROUTES.JOB_DETAIL(job.id, job.title)} key={job.id} className="block group h-full">
            <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-md p-4 lg:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40 flex flex-col justify-between h-full space-y-3.5">
              {/* Header: Company Avatar & Job Title */}
              <div className="space-y-2.5">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 lg:w-12 lg:h-12 bg-white dark:bg-muted/50 rounded-xl border border-border/50 p-1 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                    <Image
                      src={job.company?.avatar || "/logo/default-company.png"}
                      alt={job.company?.name || "Company"}
                      width={44}
                      height={44}
                      className="w-full h-full object-contain p-0.5"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm lg:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-xs font-semibold text-primary/80 line-clamp-1">
                      {job.company?.name}
                    </p>
                  </div>
                </div>

                {/* Tags: City & Type */}
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {(job.company?.city || job.company?.address) && (
                    <span className="px-2 py-0.5 border-secondary text-secondary-foreground rounded-md font-medium border border-border/50">
                      {job.company?.city || job.company?.address}
                    </span>
                  )}
                  {job.type && (
                    <span className="px-2 py-0.5 border-secondary text-secondary-foreground rounded-md font-medium border border-border/50">
                      {job.type}
                    </span>
                  )}
                  {job.quantity && (
                    <span className="px-2 py-0.5 border-secondary text-secondary-foreground rounded-md font-medium border border-border/50">
                      {job.quantity} chỉ tiêu
                    </span>
                  )}
                </div>

                {job.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                )}
              </div>

              {/* Footer: Skills & Status */}
              <div className="pt-3 border-t border-border/40 space-y-2">
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {job.skills.slice(0, 3).map((skill: any) => (
                      <span
                        key={skill.id}
                        className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-md font-semibold border border-primary/20"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-secondary text-muted-foreground rounded-md font-medium border border-border/40">
                        +{job.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span>Hạn: {formatDate(job.deadline)}</span>
                  <span className="text-primary font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                    Ứng tuyển →
                  </span>
                </div>
              </div>
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
