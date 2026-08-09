"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  searchApi,
  SearchData,
} from "@/apis/search.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Briefcase,
  Search,
  Loader2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { HeroSection } from "@/components/features/hero.section";
import { JobCard, CompanyResultCard } from "@/components/common/cards";
import { LottieAnimation } from "@/components/common/lottie-animation";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams?.get("keyword") || "";

  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState<SearchData | null>(null);

  useEffect(() => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) {
      fetchSearchResults();
    } else {
      setLoading(false);
      setSearchData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const trimmedKeyword = keyword.trim();

      if (!trimmedKeyword) {
        setSearchData(null);
        return;
      }

      const response = await searchApi.search(trimmedKeyword);

      if (response.success && response.data) {
        const data = response.data;
        const jobs = data.jobs || [];
        const skills = (data as any).skills || [];

        // Safely identify search type
        let identifiedType = data.searchType || "none";
        if (identifiedType === "none" || !identifiedType) {
          if (jobs.length > 0) identifiedType = "job";
          else if (skills.length > 0) identifiedType = "skill";
          else if (data.companies && data.companies.length > 0) identifiedType = "company";
        }

        setSearchData({
          ...data,
          searchType: identifiedType as any,
          message: data.message || response.message || "Tìm kiếm thành công",
        });
      }
    } catch (error) {
      console.error("Error searching:", error);
      setSearchData(null);
    } finally {
      setLoading(false);
    }
  };

  const searchType = searchData
    ? searchData.searchType && searchData.searchType !== "none"
      ? searchData.searchType
      : searchData.jobs && searchData.jobs.length > 0
        ? "job"
        : (searchData as any).skills && (searchData as any).skills.length > 0
          ? "skill"
          : searchData.companies && searchData.companies.length > 0
            ? "company"
            : "none"
    : "none";

  const displayMessage = searchData?.message || "Tìm kiếm thành công";
  const hasResults = searchData && ((searchData.jobs && searchData.jobs.length > 0) || (searchData.companies && searchData.companies.length > 0));

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero Section with VantaGlobe */}
      <HeroSection />

      {/* Content */}
      <div className="bg-background w-full rounded-t-3xl border-t border-border/50 -mt-20 relative z-10 shadow-2xl backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="bg-card border border-border/60 rounded-2xl shadow-sm p-16 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative flex items-center justify-center mb-4">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Đang kết nối hệ thống...
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                Chúng tôi đang quét toàn bộ dữ liệu công việc và công ty phù hợp với bạn.
              </p>
            </div>
          ) : !hasResults ? (
            /* No Results with lonely-404 Lottie animation */
            <div className="bg-card border border-border/60 rounded-2xl shadow-sm p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6">
              <div className="flex justify-center">
                <LottieAnimation
                  src="/media/lonely-404.json"
                  className="w-full max-w-xs sm:max-w-sm h-64 sm:h-72"
                />
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  Không tìm thấy kết quả phù hợp
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                  Rất tiếc, hệ thống không tìm thấy công việc hoặc công ty nào khớp với từ khóa{" "}
                  <span className="font-semibold text-primary">"{keyword}"</span>. Hãy thử kiểm tra lỗi chính tả hoặc từ khóa tổng quát hơn.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  size="lg"
                  className="cursor-pointer border-border hover:bg-accent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>

                <Link href="/jobs">
                  <Button size="lg" className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Search className="w-4 h-4 mr-2" />
                    Khám phá tất cả việc làm
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-10 p-6 rounded-2xl bg-card border border-border/60 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                    <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                      Kết quả tìm kiếm
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                    Kết quả cho từ khóa:{" "}
                    <span className="text-primary border-b-2 border-primary/30 pb-0.5">
                      "{keyword}"
                    </span>
                  </h1>
                  <p className="text-muted-foreground text-sm mt-2">
                    {displayMessage} • Tìm thấy{" "}
                    <span className="font-semibold text-foreground">
                      {(searchData.jobs?.length || 0) + (searchData.companies?.length || 0)}
                    </span>{" "}
                    kết quả phù hợp
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {searchType === "job" && "Phân loại: Công việc"}
                    {searchType === "skill" && "Phân loại: Kỹ năng"}
                    {searchType === "company" && "Phân loại: Công ty"}
                    {searchType === "none" && "Tổng hợp"}
                  </Badge>
                </div>
              </div>

              {/* Jobs Results */}
              {searchData.jobs && searchData.jobs.length > 0 && (
                <div className="mb-12 space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      Công việc gợi ý ({searchData.jobs.length})
                    </h2>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {searchData.jobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                </div>
              )}

              {/* Companies Results */}
              {searchData.companies && searchData.companies.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Building2 className="w-5 h-5" />
                      </div>
                      Công ty liên quan ({searchData.companies.length})
                    </h2>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {searchData.companies.map((company) => (
                      <CompanyResultCard key={company.id} company={company} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

