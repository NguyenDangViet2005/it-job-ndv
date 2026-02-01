"use client";

import { useEffect, useState } from "react";
import LogoLoop from "@/components/ui/react.bits/logo.loop";
import SectionTitle from "@/components/ui/customs/section-title";
import { companyApi } from "@/apis";

interface CompanyLogo {
  id: number;
  name: string;
  avatar?: string;
}

function FeatureHr() {
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
          src: company.avatar,
          alt: company.name,
          href: `/companies/${company.id}`,
          title: company.name,
        }));
        setLogos(transformedLogos);
      } catch (error) {
        // Fallback to empty array on error
        setLogos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyLogos();
  }, []);
  if (loading) {
    return (
      <div>
        <SectionTitle title="Nhà Tuyển Dụng Hàng Đầu" />
        <div className="mt-10 flex items-center justify-center h-24">
          <div className="text-muted-foreground">Đang tải...</div>
        </div>
      </div>
    );
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
      <div className="mt-10">
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

export default FeatureHr;
