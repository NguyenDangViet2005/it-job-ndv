"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminKPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  className?: string;
  color?: string;
}

function AdminKPICard({
  title,
  value,
  icon: Icon,
  trend,
  className,
  color = "from-red-500/20 to-rose-500/20",
}: AdminKPICardProps) {
  return (
    <Card className={cn("hover:shadow-lg transition-all", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {trend && (
              <p className="text-sm text-green-600 mt-1">{trend}</p>
            )}
          </div>
          <div className={cn("p-3 rounded-xl bg-gradient-to-br", color)}>
            <Icon className="h-8 w-8 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminKPICard;
