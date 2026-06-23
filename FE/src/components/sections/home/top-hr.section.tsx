"use client";

import { useEffect, useState } from "react";
import LogoLoop from "@/components/common/reactbits/logo.loop";
import SectionTitle from "@/components/features/section-title";
import { companyApi } from "@/apis";
import { CompanyLogo } from "@/types";
import { ROUTES } from "@/constants";
import { TopHRSkeleton } from "@/components/common/skeletons";



export default function TopHRSection() {
  const [logos, setLogos] = useState<
    Array<{ src: string; alt: string; href: string; title: string }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanyLogos() {
      try {
        setLoading(true);
        const response = await companyApi.getLogos(1, 20);

        // Transform API data to LogoLoop format
        const transformedLogos = response.data.map((company: CompanyLogo) => ({
          src: company.avatar || "/logo/default-company.png",
          alt: company.name,
          href: ROUTES.COMPANY_DETAIL(company.id),
          title: company.name,
        }));
        setLogos(transformedLogos);
      } catch (error) {
        setLogos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyLogos();
  }, []);
  if (loading) {
    return <TopHRSkeleton />;
  }

  if (logos.length === 0) {
    return (
      <div>
        <SectionTitle title="Nhà Tuyển Dụng Hàng Đầu" />
        <div className="mt-10 flex items-center justify-center h-24">
          <div className="text-muted-foreground">Không có dữ liệu</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle title="Nhà Tuyển Dụng Hàng Đầu" />
      {/* Mobile/Tablet version */}
      <div className="mt-6 lg:hidden">
        <LogoLoop
          logos={logos}
          speed={120}
          direction="left"
          logoHeight={45}
          gap={30}
          pauseOnHover
          scaleOnHover
          ariaLabel="Nhà tuyển dụng hàng đầu"
        />
      </div>
      {/* Desktop version */}
      <div className="hidden lg:block mt-10">
        <LogoLoop
          logos={logos}
          speed={120}
          direction="left"
          logoHeight={60}
          gap={40}
          pauseOnHover
          scaleOnHover
          ariaLabel="Nhà tuyển dụng hàng đầu"
        />
      </div>
    </div>
  );
}

