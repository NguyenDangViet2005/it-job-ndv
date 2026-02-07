"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Briefcase, Users, Building2, FileText, DollarSign, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
}

const StatCard = ({ title, value, icon, trend, trendLabel }: StatCardProps) => {
  const isPositive = trend && trend > 0;
  
  return (
    <Card className="hover:shadow-md transition-all duration-200 border-slate-200 dark:border-slate-800">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1 truncate">
              {title}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {value}
            </p>
            {trendLabel && (
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">{trendLabel}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 sm:gap-2 flex-shrink-0">
            <div className="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {icon}
            </div>
            {trend !== undefined && (
              <div className={cn(
                "flex items-center gap-1 text-[10px] sm:text-xs font-medium",
                isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AdminKPI = () => {
  const stats = [
    {
      title: "Tổng Công Việc",
      value: "156",
      icon: <Briefcase className="h-5 w-5" />,
      trend: 12,
      trendLabel: "+18 tháng này",
    },
    {
      title: "Người Dùng Hoạt Động",
      value: "1,245",
      icon: <Users className="h-5 w-5" />,
      trend: 8,
      trendLabel: "+94 tuần này",
    },
    {
      title: "Công Ty",
      value: "89",
      icon: <Building2 className="h-5 w-5" />,
      trend: 5,
      trendLabel: "+4 công ty mới",
    },
    {
      title: "Bài Viết Blog",
      value: "324",
      icon: <FileText className="h-5 w-5" />,
      trend: 15,
      trendLabel: "+48 tháng này",
    },
    {
      title: "Đơn Ứng Tuyển",
      value: "2,847",
      icon: <UserCheck className="h-5 w-5" />,
      trend: 18,
      trendLabel: "+512 tuần này",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default AdminKPI;
