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
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {value}
            </p>
            {trendLabel && (
              <p className="text-xs text-slate-500 dark:text-slate-400">{trendLabel}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {icon}
            </div>
            {trend !== undefined && (
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
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
      title: "Total Jobs",
      value: "156",
      icon: <Briefcase className="h-5 w-5" />,
      trend: 12,
      trendLabel: "+18 this month",
    },
    {
      title: "Active Users",
      value: "1,245",
      icon: <Users className="h-5 w-5" />,
      trend: 8,
      trendLabel: "+94 this week",
    },
    {
      title: "Companies",
      value: "89",
      icon: <Building2 className="h-5 w-5" />,
      trend: 5,
      trendLabel: "+4 new companies",
    },
    {
      title: "Blog Posts",
      value: "324",
      icon: <FileText className="h-5 w-5" />,
      trend: 15,
      trendLabel: "+48 this month",
    },
    {
      title: "Applications",
      value: "2,847",
      icon: <UserCheck className="h-5 w-5" />,
      trend: 18,
      trendLabel: "+512 this week",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default AdminKPI;
