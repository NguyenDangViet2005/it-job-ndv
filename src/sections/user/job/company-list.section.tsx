"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { companyApi } from "@/apis";
import type { Company } from "@/types/api.type";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

interface CompanyListSectionProps {
  selectedCompanyId: number | null;
  onCompanyChange: (companyId: number | null) => void;
}

export default function CompanyListSection({
  selectedCompanyId,
  onCompanyChange,
}: CompanyListSectionProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true);
        const response = await companyApi.getLogos(1, 20);
        setCompanies(response.data || []);
      } catch (err) {
        console.error("❌ Error fetching companies:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-40">
            <Skeleton className="h-24 w-full rounded-xl mb-2" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-card shadow-sm border border-border p-5 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Công ty hàng đầu</h2>
        {selectedCompanyId && (
          <button
            onClick={() => onCompanyChange(null)}
            className="text-xs text-primary hover:underline font-semibold"
          >
            Tất cả
          </button>
        )}
      </div>

      <div className="space-y-3">
        {companies.map((company) => (
          <div
            key={company.id}
            onClick={() => onCompanyChange(company.id === selectedCompanyId ? null : company.id)}
            className={cn(
              "group cursor-pointer transition-all duration-300",
              "flex items-center gap-3 p-3 rounded-xl border-2",
              selectedCompanyId === company.id
                ? "border-primary shadow-sm"
                : "border-transparent hover:bg-accent"
            )}
          >
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white dark:bg-muted border border-border p-1 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm">
              <Image
                src={company.avatar || "/logo-company.jpg"}
                alt={company.name}
                fill
                className="object-contain p-1"
                sizes="48px"
              />
            </div>
            <div className="flex-1 min-w-0">
                <p className={cn(
                    "text-sm font-bold truncate transition-colors",
                    selectedCompanyId === company.id ? "text-primary" : "text-foreground/80 group-hover:text-primary"
                )}>
                    {company.name}
                </p>
                <p className="text-[10px] text-gray-400 font-medium">Top Employer</p>
            </div>
            {selectedCompanyId === company.id && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </div>
        ))}
      </div>
      
      {companies.length === 0 && !loading && (
          <p className="text-sm text-muted-foreground text-center py-4">Chưa có dữ liệu</p>
      )}
    </div>
  );
}
