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
import SectionTitle from "@/components/features/section-title";
import { ModernSectionHeader } from "@/components/ui/modern-section-header";
import { companyApi } from "@/apis";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/button";
import { FeatureCompanySkeleton } from "@/components/common/skeletons";
import { Company } from "@/types";

export default function FeaturedCompanieSection() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true);
        const response = await companyApi.getAll(1, 10);

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
    return <FeatureCompanySkeleton />;
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
    <div className="w-full mx-auto py-4 lg:py-6">
      <SectionTitle
        title="Công Ty Nổi Bật"
        subtitle="Khám phá các doanh nghiệp IT hàng đầu đang chiêu mộ nhân tài"
        showViewAll
        viewAllLink={ROUTES.COMPANIES}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {companies.slice(0, 6).map((company: Company) => (
          <Link
            key={company.id}
            href={ROUTES.COMPANY_DETAIL(company.id, company.name)}
            className="block group"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40 flex flex-col justify-between h-full space-y-4">
              <div className="space-y-3">
                {/* Header: Logo & Title */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl border border-border/60 overflow-hidden flex-shrink-0 bg-white p-1 shadow-sm">
                      <Image
                        src={company.avatar || "/logo/default-company.png"}
                        alt={`${company.name} logo`}
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {company.name}
                      </h3>
                      {company.nationality && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin size={12} className="text-primary/70" />
                          <span>{company.nationality}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {company.description || "Chưa có mô tả chi tiết cho công ty."}
                </p>
              </div>

              {/* Footer info */}
              <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                {company.foundedyear ? (
                  <span className="flex items-center gap-1">
                    <Building2 size={13} className="text-primary/70" />
                    <span>Thành lập {company.foundedyear}</span>
                  </span>
                ) : (
                  <span>Doanh nghiệp IT</span>
                )}
                <span className="text-primary font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Xem ngay →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

