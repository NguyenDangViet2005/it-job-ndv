"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import HotJob from "@/sections/user/job/hot-jobs.section";
import SectionTitle from "@/components/ui/customs/section-title";
import { jobApi } from "@/apis";
import type { JobResponse } from "@/types/api.type";
import Link from "next/link";

function JobToday() {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTodayJobs() {
      try {
        setLoading(true);
        const response = await jobApi.getToday();
        setJobs(response);
        
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải công việc");
      } finally {
        setLoading(false);
      }
    }

    fetchTodayJobs();
  }, []);
  if (loading) {
    return (
      <div className="w-full mt-10">
        <SectionTitle 
          title="Công Việc Hôm Nay" 
          subtitle="Cập nhật mới nhất các vị trí tuyển dụng hot trong ngày"
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mt-10">
        <SectionTitle 
          title="Công Việc Hôm Nay" 
          subtitle="Cập nhật mới nhất các vị trí tuyển dụng hot trong ngày"
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-destructive">Lỗi: {error}</div>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="w-full mt-10">
        <SectionTitle 
          title="Công Việc Hôm Nay" 
          subtitle="Cập nhật mới nhất các vị trí tuyển dụng hot trong ngày"
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Chưa có công việc nào hôm nay</div>
        </div>
      </div>
    );
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
          loop={jobs.length > 4}
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
            0: { slidesPerView: 1 }, // mobile
            640: { slidesPerView: 2 }, // tablet
            1024: { slidesPerView: 3 }, // desktop
            1280: { slidesPerView: 4 }, // desktop lớn
          }}
        >
          {jobs.map((job) => (
            <SwiperSlide >
              <Link href={`/jobs/${job.id}`} key={job.id}>
                <HotJob props={job} />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* custom prev/next */}
        {jobs.length > 4 && (
          <>
            <button
              className="job-today-prev absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-10 
                         bg-primary/10 text-primary p-2 rounded-full w-8 h-8 sm:w-10 sm:h-10 
                         flex items-center justify-center hover:scale-110 transition hover:bg-primary/20"
              aria-label="Previous slide"
            >
              ❮
            </button>
            <button
              className="job-today-next absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-10 
                         bg-primary/10 text-primary p-2 rounded-full w-8 h-8 sm:w-10 sm:h-10 
                         flex items-center justify-center hover:scale-110 transition hover:bg-primary/20"
              aria-label="Next slide"
            >
              ❯
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default JobToday;
