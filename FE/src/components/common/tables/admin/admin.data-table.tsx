"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Database,
} from "lucide-react";

// Generic column definition
export interface TableColumn {
  key: string;
  header: string;
  width?: string;
}

// Filter option
export interface FilterOption {
  value: string;
  label: string;
}

// Table props
interface AdminDataTableProps<T> {
  title: string;
  subtitle?: string;
  data: T[];
  columns: TableColumn[];
  loading?: boolean;
  error?: string | null;
  
  // Row renderer - required
  renderRow: (item: T, index: number) => React.ReactNode;
  
  // Pagination
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  
  // Search
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  
  // Filters
  filters?: FilterOption[];
  activeFilter?: string;
  onFilterChange?: (value: string) => void;
  
  // Actions
  onRefresh?: () => void;
  headerActions?: React.ReactNode;
  
  // Row key
  getRowKey?: (item: T) => string | number;
  
  // Empty state
  emptyIcon?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function AdminDataTable<T>({
  title,
  subtitle,
  data,
  columns,
  loading = false,
  error = null,
  renderRow,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  searchPlaceholder = "Tìm kiếm...",
  searchValue = "",
  onSearchChange,
  filters = [],
  activeFilter = "all",
  onFilterChange,
  onRefresh,
  headerActions,
  getRowKey = (item: any) => item.id,
  emptyIcon,
  emptyTitle = "Không có dữ liệu",
  emptyDescription = "Không tìm thấy dữ liệu phù hợp",
}: AdminDataTableProps<T>) {
  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Làm mới
            </Button>
          )}
          {headerActions}
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            {onSearchChange && (
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  className="pl-10"
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
            )}

            {/* Filters */}
            {filters.length > 0 && onFilterChange && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFilterChange("all")}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Tất cả
                </Button>
                {filters.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={activeFilter === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFilterChange(filter.value)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5 text-muted-foreground" />
              Danh sách ({totalItems})
            </CardTitle>
            {totalPages > 1 && (
              <div className="text-sm text-muted-foreground">
                Trang {currentPage} / {totalPages}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Error State */}
          {error && (
            <div className="p-8 text-center">
              <p className="text-destructive font-medium">{error}</p>
              {onRefresh && (
                <Button variant="outline" size="sm" onClick={onRefresh} className="mt-4">
                  Thử lại
                </Button>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && !error && (
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Đang tải dữ liệu...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && data.length === 0 && (
            <div className="p-12 text-center">
              {emptyIcon || <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />}
              <h3 className="text-lg font-semibold mb-2">{emptyTitle}</h3>
              <p className="text-muted-foreground">{emptyDescription}</p>
            </div>
          )}

          {/* Data Table */}
          {!loading && !error && data.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/40 cursor-target">
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className="text-left p-4 font-semibold text-sm cursor-target"
                        style={{ width: column.width }}
                      >
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => renderRow(item, index))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && onPageChange && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t bg-muted/20">
              <div className="text-sm text-muted-foreground">
                Hiển thị {Math.min((currentPage - 1) * pageSize + 1, totalItems)} -{" "}
                {Math.min(currentPage * pageSize, totalItems)} / {totalItems} mục
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {getPaginationNumbers().map((page, index) => (
                  typeof page === "number" ? (
                    <Button
                      key={index}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(page)}
                      className="h-8 w-8 p-0"
                    >
                      {page}
                    </Button>
                  ) : (
                    <span key={index} className="px-2 text-muted-foreground">...</span>
                  )
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDataTable;
