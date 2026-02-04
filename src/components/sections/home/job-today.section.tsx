"use client";
import  { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import HotJob from "@/components/sections/jobs/hot-jobs.section";
import SectionTitle from "@/components/features/section-title";
import { jobApi } from "@/apis";
import type { JobResponse } from "@/types/api.type";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ROUTES } from "@/constants";
import { JobTodaySkeleton } from "@/components/common/skeletons";

export default function JobTodaySection() {
  const [jobs, setJobs] = useState<JobResponse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTodayJobs() {
      try {
        setLoading(true);
        const response = await jobApi.getToday();
        setJobs(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Không thể tải công việc",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTodayJobs();
  }, []);

  if (error || (!loading && (!jobs || jobs.length === 0))) {
    return null;
  }

  if (loading) {
    return <JobTodaySkeleton />;
  }

  return (
    <div className="w-full mt-10">
      <SectionTitle
        title="Công Việc Hôm Nay"
        subtitle="Cập nhật mới nhất các vị trí tuyển dụng hot trong ngày"
      />
      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <Swiper
          modules={[Navigation, Autoplay]}
          loop={(jobs || []).length > 4}
          spaceBetween={16}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: ".job-today-prev",
            nextEl: ".job-today-next",
          }}
          breakpoints={{
            0: { slidesPerView: 1 }, 
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }, 
            1280: { slidesPerView: 4 }, 
          }}
        >
          {jobs?.map((job) => (
            <SwiperSlide>
              <Link href={ROUTES.JOB_DETAIL(job.id)} key={job.id}>
                <HotJob props={job} />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* custom prev/next */}
        {(jobs || []).length > 4 && (
          <>
            <button
              className="job-today-prev absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 
                         bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 
                         shadow-lg hover:shadow-xl
                         p-2 rounded-full w-10 h-10 sm:w-12 sm:h-12 
                         flex items-center justify-center 
                         hover:scale-110 transition-all duration-200
                         border border-slate-200 dark:border-slate-700
                         disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              className="job-today-next absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 
                         bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 
                         shadow-lg hover:shadow-xl
                         p-2 rounded-full w-10 h-10 sm:w-12 sm:h-12 
                         flex items-center justify-center 
                         hover:scale-110 transition-all duration-200
                         border border-slate-200 dark:border-slate-700
                         disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

