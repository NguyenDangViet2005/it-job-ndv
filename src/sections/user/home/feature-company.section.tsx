"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Bookmark, Building2, MapPin, MoveLeft, MoveRight } from "lucide-react";
import SectionTitle from "@/components/ui/customs/section-title";
import { companyApi } from "@/apis";
import type { Company } from "@/types/api.type";

function FeaturedCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true);
        const response = await companyApi.getAll(1, 10);

        // Xử lý data có thể là array hoặc object với $values
        const companiesData = Array.isArray(response.data)
          ? response.data
          : response.data;

        setCompanies(companiesData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Không thể tải dữ liệu công ty",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="w-full mx-auto py-10 md:block hidden">
        <SectionTitle title="Công Ty Nổi Bật" />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mx-auto py-10 md:block hidden">
        <SectionTitle title="Công Ty Nổi Bật" />
        <div className="flex items-center justify-center h-64">
          <div className="text-destructive">Lỗi: {error}</div>
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="w-full mx-auto py-10 md:block hidden">
        <SectionTitle title="Công Ty Nổi Bật" />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Không có công ty nào</div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full mx-auto py-10 relative md:block hidden">
      <SectionTitle title="Công Ty Nổi Bật" />

      {/* Swiper */}
      <Swiper
        modules={[Navigation, Pagination, EffectCoverflow]}
        effect="coverflow"
        centeredSlides
        grabCursor
        loop
        slidesPerView="auto"
        spaceBetween={20}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        pagination={{
          el: ".custom-pagination",
          clickable: true,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2,
          slideShadows: false,
        }}
      >
        {companies.map((company) => (
          <SwiperSlide key={company.id} className="!w-[900px] !h-[450px]">
            <Link href={`/companies/${company.id}`} className="block group ">
              <div className="shadow-lg bg-card transition-all duration-300 group-hover:scale-105 w-full mb-12 relative">
                {/* Cover Image */}
                <div className="relative w-full h-[350px] overflow-hidden rounded-t-lg">
                  <Image
                    src={company.coverimage || "/cover.png"}
                    alt={company.name}
                    fill
                    className="object-cover cursor-target"
                    priority={false}
                    sizes="900px"
                    unoptimized={company.coverimage?.includes("picsum.photos")}
                  />
                </div>

                {/* Info card - positioned below the image */}
                <div className="p-4 absolute rounded-2xl cursor-target -bottom-16 left-1/2 transform -translate-x-1/2 bg-card w-[820px] shadow-xl cursor-pointer z-10 border group-hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    {/* Company Avatar */}
                    <div className="relative w-12 h-12 rounded-full border overflow-hidden flex-shrink-0 bg-white">
                      <Image
                        src={company.avatar}
                        alt={`${company.name} logo`}
                        fill
                        className="object-contain p-1"
                        priority={false}
                        sizes="48px"
                      />
                    </div>

                    <h3 className="font-bold text-base line-clamp-2 flex-1 group-hover:text-primary transition-colors">
                      {company.name}
                    </h3>

                    <button
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Bookmark company"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <Bookmark size={18} />
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {company.description || "Chưa có mô tả"}
                  </p>

                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    {company.website && (
                      <span className="text-primary font-semibold">
                        Website →
                      </span>
                    )}
                    {company.nationality && (
                      <span className="text-muted-foreground flex gap-1">
                        <MapPin size={15} /> <div>{company.nationality}</div>
                      </span>
                    )}
                    {company.foundedyear && (
                      <span className="text-muted-foreground flex gap-1">
                        <Building2 size={15} />
                        <div> {company.foundedyear}</div>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation + Pagination */}
      <div className="flex items-center justify-center gap-4 mt-2 w-fit mx-auto ">
        <button className=" cursor-target custom-prev bg-card  shadow p-2 rounded-full hover:scale-105 cursor-pointer">
          <MoveLeft className="w-6 h-6" />
        </button>

        {/* Pagination dots sẽ render vào đây */}
        <div className="custom-pagination cursor-target flex gap-2" />

        <button className=" cursor-target custom-next bg-card  shadow p-2 rounded-full hover:scale-105 cursor-pointer">
          <MoveRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default FeaturedCompanies;
