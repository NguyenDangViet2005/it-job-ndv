"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface AdminStatsGridProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
}

export function AdminStatsGrid({ stats, columns = 4 }: AdminStatsGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-300 group"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  {stat.trend && (
                    <p
                      className={cn(
                        "text-sm font-medium",
                        stat.trend.isPositive ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {stat.trend.isPositive ? "+" : "-"}
                      {stat.trend.value}%
                    </p>
                  )}
                </div>
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default AdminStatsGrid;
