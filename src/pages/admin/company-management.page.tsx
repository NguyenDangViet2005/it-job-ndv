"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { Plus, Building2, Globe, MapPin, Briefcase } from "lucide-react";
import { 
  AdminDataTable, 
  AdminStatsGrid, 
  AdminCompanyRow, 
  getCompanyTableColumns,
  type AdminCompany 
} from "@/components/tables";
import { companyApi } from "@/apis";

// Helper to get token from localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken") || undefined;
  }
  return undefined;
};

const CompanyManagement = () => {
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await companyApi.getAll(currentPage, pageSize);
      
      // Handle backend response format with $values
      let companiesData = response.data;
      if (companiesData && typeof companiesData === "object" && "$values" in companiesData) {
        companiesData = (companiesData as any).$values;
      }
      
      setCompanies(Array.isArray(companiesData) ? companiesData : []);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.totalItems || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách công ty");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [currentPage]);

  // Filter companies client-side
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.nationality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.address?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Stats - safely calculate totals
  const safeGetArrayLength = (arr?: { $values?: any[] } | any[]) => {
    if (!arr) return 0;
    if (Array.isArray(arr)) return arr.length;
    if (typeof arr === "object" && "$values" in arr) return arr.$values?.length || 0;
    return 0;
  };
  
  const totalJobs = companies.reduce((sum, c) => sum + safeGetArrayLength(c.jobs), 0);
  const totalFollows = companies.reduce((sum, c) => sum + safeGetArrayLength(c.follows), 0);
  
  const stats = [
    {
      label: "Tổng công ty",
      value: totalItems,
      icon: Building2,
      color: "from-blue-500/20 to-blue-600/20",
    },
    {
      label: "Quốc tế",
      value: companies.filter((c) => c.nationality && c.nationality !== "Việt Nam").length,
      icon: Globe,
      color: "from-green-500/20 to-green-600/20",
    },
    {
      label: "Tổng việc làm",
      value: totalJobs,
      icon: Briefcase,
      color: "from-purple-500/20 to-purple-600/20",
    },
    {
      label: "Có địa chỉ",
      value: companies.filter((c) => c.address).length,
      icon: MapPin,
      color: "from-orange-500/20 to-orange-600/20",
    },
  ];

  // Handle actions
  const handleEdit = (company: AdminCompany) => {
  };

  const handleDelete = async (company: AdminCompany) => {
    if (!confirm(`Bạn có chắc muốn xóa "${company.name}"?\n\nCẢNH BÁO: Tất cả Jobs, đơn ứng tuyển và dữ liệu liên quan sẽ bị xóa vĩnh viễn.`)) {
      return;
    }
    
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Vui lòng đăng nhập với quyền Admin");
        return;
      }
      
      await companyApi.delete(company.id, token);
      alert("Xóa công ty thành công");
      fetchCompanies(); // Refresh list
    } catch (err) {
      alert("Không thể xóa công ty: " + (err instanceof Error ? err.message : "Lỗi không xác định"));
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <AdminStatsGrid stats={stats} />

      {/* Data Table */}
      <AdminDataTable
        title="Quản lý công ty"
        subtitle="Quản lý tất cả công ty đăng ký trên hệ thống"
        data={filteredCompanies}
        columns={getCompanyTableColumns()}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredCompanies.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        searchPlaceholder="Tìm kiếm công ty, quốc gia, địa chỉ..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={fetchCompanies}
        renderRow={(company) => (
          <AdminCompanyRow 
            key={company.id} 
            company={company} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        headerActions={
          <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-red-600 hover:to-rose-700">
            <Plus className="h-4 w-4" />
            Thêm mới
          </Button>
        }
        emptyIcon={<Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />}
        emptyTitle="Chưa có công ty nào"
        emptyDescription="Mời công ty đăng ký để bắt đầu"
      />
    </div>
  );
};

export default CompanyManagement;
