"use client";

import { Card, CardContent } from "@/components/ui/shadcn/card";
import { TrendingUp, TrendingDown, Briefcase, Users, Building2, FileText, DollarSign, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  gradient: string;
}

const StatCard = ({ title, value, icon, trend, trendLabel, gradient }: StatCardProps) => {
  const isPositive = trend && trend > 0;
  
  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className={cn("absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity", gradient)} />
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-xl", gradient, "bg-opacity-10")}>
            <div className="text-white">{icon}</div>
          </div>
          {trend !== undefined && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full",
              isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold font-mono bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {value}
          </p>
          {trendLabel && (
            <p className="text-xs text-muted-foreground">{trendLabel}</p>
          )}
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
      icon: <Briefcase className="h-6 w-6" />,
      trend: 12,
      trendLabel: "+18 this month",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500"
    },
    {
      title: "Active Users",
      value: "1,245",
      icon: <Users className="h-6 w-6" />,
      trend: 8,
      trendLabel: "+94 this week",
      gradient: "bg-gradient-to-br from-purple-500 to-pink-500"
    },
    {
      title: "Companies",
      value: "89",
      icon: <Building2 className="h-6 w-6" />,
      trend: 5,
      trendLabel: "+4 new companies",
      gradient: "bg-gradient-to-br from-orange-500 to-red-500"
    },
    {
      title: "Blog Posts",
      value: "324",
      icon: <FileText className="h-6 w-6" />,
      trend: 15,
      trendLabel: "+48 this month",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-500"
    },
    {
      title: "Revenue",
      value: "$45.2K",
      icon: <DollarSign className="h-6 w-6" />,
      trend: 23,
      trendLabel: "+$8.4K this month",
      gradient: "bg-gradient-to-br from-yellow-500 to-orange-500"
    },
    {
      title: "Applications",
      value: "2,847",
      icon: <UserCheck className="h-6 w-6" />,
      trend: 18,
      trendLabel: "+512 this week",
      gradient: "bg-gradient-to-br from-indigo-500 to-purple-500"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default AdminKPI;
