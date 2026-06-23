"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  searchApi,
  SearchData,
  SearchJob,
  SearchCompany,
} from "@/apis/search.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Briefcase,
  Search,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { HeroSection } from "@/components/features/hero.section";
import { JobCard, CompanyResultCard } from "@/components/common/cards";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with VantaGlobe */}
      <HeroSection />

      {/* Content */}
      <div className="bg-background w-full rounded-t-3xl border-t border-border/50 -mt-20 relative z-10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-20 text-center flex flex-col items-center justify-center min-h-[300px]">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Đang tìm kiếm...
              </p>
            </div>
          ) : !searchData ? (
            /* No Results */
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Không tìm thấy kết quả
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Chúng tôi không tìm thấy kết quả nào phù hợp với từ khóa "
                {keyword}". Hãy thử tìm kiếm với từ khóa khác.
              </p>
              <Link href="/jobs">
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  <Search className="w-4 h-4 mr-2" />
                  Xem tất cả công việc
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Kết quả tìm kiếm cho:{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    "{keyword}"
                  </span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {displayMessage} • Tìm thấy {searchData.jobs?.length || 0} kết
                  quả
                </p>
                <div className="mt-4">
                  <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800">
                    {searchType === "job" && "Tìm kiếm theo công việc"}
                    {searchType === "skill" && "Tìm kiếm theo kỹ năng"}
                    {searchType === "company" && "Tìm kiếm theo công ty"}
                  </Badge>
                </div>
              </div>

              {/* Jobs Results */}
              {searchData.jobs && searchData.jobs.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    Công việc ({searchData.jobs.length})
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {searchData.jobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                </div>
              )}

              {/* Companies Results */}
              {searchData.companies && searchData.companies.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    Công ty ({searchData.companies.length})
                  </h2>
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
