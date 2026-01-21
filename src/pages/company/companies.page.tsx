"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import {
  Building2,
  MapPin,
  Users,
  Briefcase,
  Search,
  Filter,
  X,
} from "lucide-react";
import { companyApi } from "@/apis";
import type { Company } from "@/types/api.type";
import { CompanyCard } from "@/components/cards/companyCards/company.card";
import { HeroSection } from "@/sections/user/common/hero.section";
import Link from "next/link";
import { ROUTES } from "@/configs";

interface CompanyFilters {
  search: string;
  location: string;
  size: string;
  type: string;
}

const CompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 6;

  const [filters, setFilters] = useState<CompanyFilters>({
    search: "",
    location: "",
    size: "",
    type: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch companies from API
  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true);
        const response = await companyApi.getAll(currentPage, pageSize);
        setCompanies(response.data);
        setTotalPages(response.totalPages);
        setTotalItems(response.totalItems);
      } catch (err) {
        console.error("❌ Error fetching companies:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, [currentPage]);

  // Filter companies based on criteria (client-side filtering)
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const searchLower = filters.search?.toLowerCase() || "";
      const matchSearch =
        !filters.search ||
        company.name.toLowerCase().includes(searchLower) ||
        company.description?.toLowerCase().includes(searchLower);

      const matchLocation =
        !filters.location ||
        company.city?.includes(filters.location) ||
        company.address?.includes(filters.location);

      // Note: Size and type filtering would need additional fields from API
      // For now, we'll skip these filters or you can add them to the Company type

      return matchSearch && matchLocation;
    });
  }, [companies, filters]);

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleFilterChange = (key: keyof CompanyFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      size: "",
      type: "",
    });
  };

  const hasActiveFilters =
    filters.search || filters.location || filters.size || filters.type;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <HeroSection />
      <div className="bg-muted/30 border-b border-border py-2 px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <Link
            href={ROUTES.HOME}
            className="hover:text-primary transition-colors"
          >
            TRANG CHỦ
          </Link>
          <span>/</span>
          <span className="text-foreground">
            DANH SÁCH CÔNG TY ĐANG TUYỂN DỤNG
          </span>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb Section */}

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Khám phá các công ty hàng đầu
          </h1>
          <p className="text-muted-foreground">
            Tìm kiếm và kết nối với những công ty công nghệ tốt nhất tại Việt
            Nam
          </p>
        </div>

        {/* Filter Toggle & Active Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="cursor-target"
          >
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
          </Button>

          {hasActiveFilters && (
            <>
              {filters.location && (
                <Badge variant="secondary" className="cursor-target">
                  {filters.location}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleFilterChange("location", "")}
                  />
                </Badge>
              )}
              {filters.size && (
                <Badge variant="secondary" className="cursor-target">
                  {filters.size} nhân sự
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleFilterChange("size", "")}
                  />
                </Badge>
              )}
              {filters.type && (
                <Badge variant="secondary" className="cursor-target">
                  {filters.type}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleFilterChange("type", "")}
                  />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="cursor-target"
              >
                <X className="h-4 w-4 mr-1" />
                Xóa tất cả
              </Button>
            </>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Location Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Địa điểm
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Hà Nội", "TP.HCM", "Đà Nẵng", "Remote"].map((loc) => (
                      <Badge
                        key={loc}
                        variant={
                          filters.location === loc ? "default" : "outline"
                        }
                        className="cursor-pointer cursor-target"
                        onClick={() =>
                          handleFilterChange(
                            "location",
                            filters.location === loc ? "" : loc,
                          )
                        }
                      >
                        {loc}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Size Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Quy mô
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["1-10", "11-50", "51-200", "201-500", "500+"].map(
                      (size) => (
                        <Badge
                          key={size}
                          variant={
                            filters.size === size ? "default" : "outline"
                          }
                          className="cursor-pointer cursor-target"
                          onClick={() =>
                            handleFilterChange(
                              "size",
                              filters.size === size ? "" : size,
                            )
                          }
                        >
                          {size}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Loại hình
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Product", "Outsourcing", "Startup", "Corporation"].map(
                      (type) => (
                        <Badge
                          key={type}
                          variant={
                            filters.type === type ? "default" : "outline"
                          }
                          className="cursor-pointer cursor-target"
                          onClick={() =>
                            handleFilterChange(
                              "type",
                              filters.type === type ? "" : type,
                            )
                          }
                        >
                          {type}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Tìm thấy{" "}
          <span className="font-semibold">{filteredCompanies.length}</span> công
          ty
          {hasActiveFilters && " phù hợp với bộ lọc"}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Đang tải...</div>
          </div>
        )}

        {/* Companies Grid */}
        {!loading && filteredCompanies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="cursor-target"
                >
                  Trước
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1);

                      const showEllipsis =
                        (page === currentPage - 2 && currentPage > 3) ||
                        (page === currentPage + 2 &&
                          currentPage < totalPages - 2);

                      if (showEllipsis) {
                        return (
                          <span
                            key={page}
                            className="px-3 py-2 text-muted-foreground"
                          >
                            ...
                          </span>
                        );
                      }

                      if (!showPage) return null;

                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="min-w-[40px] cursor-target"
                        >
                          {page}
                        </Button>
                      );
                    },
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="cursor-target"
                >
                  Sau
                </Button>
              </div>
            )}

            {/* Results Info */}
            <div className="text-center mt-6 text-sm text-muted-foreground">
              Trang {currentPage} / {totalPages} - Tổng số {totalItems} công ty
            </div>
          </>
        ) : !loading ? (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Không tìm thấy công ty phù hợp
            </h3>
            <p className="text-muted-foreground mb-4">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="cursor-target"
            >
              Xóa bộ lọc
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CompaniesPage;
