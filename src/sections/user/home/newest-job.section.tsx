"use client";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { MoveLeft, MoveRight } from "lucide-react";
import { useState, useEffect } from "react";
import SectionTitle from "@/components/ui/customs/section-title";
import { jobApi } from "@/apis";
import type { JobResponse } from "@/types/api.type";
import type { Swiper as SwiperType } from "swiper";
import Link from "next/link";



export default function NewestJob() {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
    return (
      <div>
        <SectionTitle 
          title="Công Việc Mới Nhất" 
          subtitle="Cơ hội việc làm vừa được đăng tuyển"
          showViewAll 
          viewAllLink="/jobs"
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Đang tải...</div>
        </div>
      </div>
    );
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
        {jobs.map((job) => (
          <Link href={`/jobs/${job.id}`} key={job.id}>
            <div
              className="p-5 border rounded-xl bg-card flex flex-col gap-4 cursor-pointer 
                shadow-sm hover:shadow-xl hover:shadow-primary/30 
                transition-all duration-300 ease-in-out h-full"
            >
              {/* Header with Company Logo and Info */}
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0">
                  <img
                    src={job.company?.avatar || "/logo-company.jpg"}
                    alt={job.company?.name || "Company"}
                    className="w-14 h-14 object-contain rounded-lg border p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base line-clamp-2 mb-1 hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground line-clamp-1">
                    {job.company?.name}
                  </p>
                </div>
              </div>

              {/* Description */}
              {job.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {job.description}
                </p>
              )}

              {/* Location and Type */}
              <div className="flex flex-wrap gap-2 text-xs">
                {(job.company?.city || job.company?.address) && (
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                     {job.company?.city || job.company?.address}
                  </span>
                )}
                {job.type && (
                  <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md border border-green-200">
                     {job.type === 'full-time' ? 'Toàn thời gian' : 
                        job.type === 'part-time' ? 'Bán thời gian' : 
                        job.type === 'contract' ? 'Hợp đồng' : 
                        job.type === 'internship' ? 'Thực tập' : job.type}
                  </span>
                )}
              </div>

              {/* Quantity and Deadline */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {job.quantity && (
                  <span className="flex items-center gap-1">
                    <span className="font-semibold text-foreground">{job.quantity}</span> vị trí
                  </span>
                )}
                {job.deadline && (
                  <span className="flex items-center gap-1">
                     Hạn: <span className="font-medium text-foreground">
                      {new Date(job.deadline).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </span>
                )}
              </div>

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t">
                  {job.skills.slice(0, 4).map((skill: any) => (
                    <span
                      key={skill.id}
                      className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-md font-medium"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {job.skills.length > 4 && (
                    <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md font-medium">
                      +{job.skills.length - 4}
                    </span>
                  )}
                </div>
              )}

              {/* Status Badge */}
              {job.status && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                    job.status === 'open' ? 'bg-green-100 text-green-700' :
                    job.status === 'closed' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {job.status === 'open' ? 'Đang tuyển' :
                     job.status === 'closed' ? 'Đã đóng' :
                     '🟡 ' + job.status}
                  </span>
                  {job.createdAt && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(job.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit'
                      })}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
