"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { jobApi, applicationApi } from "@/apis";
import HrKPICard from "@/components/common/cards/hrCards/hr.kpi.card";
import { Skeleton } from "@/components/ui/skeleton";

export default function KPI() {
  const { token, company } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    openPositions: 0,
    newCandidates: 0,
    totalEmployees: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!company?.id || !token) return;

      try {
        setLoading(true);

        // Fetch all data in parallel
        const [jobsResponse, applicationsResponse] = await Promise.all([
          jobApi.getByCompany(company.id, 1, 999, token),
          applicationApi.getByCompany(company.id, 1, 999, token),
        ]);

        // Vị trí đang tuyển (jobs với status active)
        const openPositions = jobsResponse.data?.filter(
          (job) => job.status === "open"
        ).length || 0;

        // Ứng viên mới hôm nay
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newCandidates = applicationsResponse.data?.filter((app) => {
          const appDate = new Date(app.createdat);
          appDate.setHours(0, 0, 0, 0);
          return appDate.getTime() === today.getTime();
        }).length || 0;

        // Số lượng nhân viên (company members)
        const totalEmployees = company.membersCount || 0;

        // Tổng số đơn ứng tuyển
        const totalApplications = applicationsResponse.totalItems || 0;

        setStats({
          openPositions,
          newCandidates,
          totalEmployees,
          totalApplications,
        });
      } catch (error) {
        console.error("Error fetching KPI stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [company?.id, token]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 sm:h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      <HrKPICard title="Vị trí đang tuyển" value={stats.openPositions} />
      <HrKPICard title="Ứng viên mới hôm nay" value={stats.newCandidates} />
      <HrKPICard title="Số lượng nhân viên" value={stats.totalEmployees} />
      <HrKPICard title="Tổng đơn ứng tuyển" value={stats.totalApplications} />
    </div>
  );
}

