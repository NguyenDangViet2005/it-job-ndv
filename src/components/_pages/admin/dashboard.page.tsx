"use client";

import AdminKPI from "@/components/sections/admin/admin-kpi.section";
import StatsChart from "@/components/sections/admin/stats-chart.section";
import RecentActivity from "@/components/sections/admin/recent-activity.section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown } from "lucide-react";

const AdminDashboard = () => {
  const topCompanies = [
    { name: "VNG Corporation", jobs: 24, logo: "https://api.dicebear.com/7.x/initials/svg?seed=VNG" },
    { name: "FPT Software", jobs: 18, logo: "https://api.dicebear.com/7.x/initials/svg?seed=FPT" },
    { name: "Grab Vietnam", jobs: 15, logo: "https://api.dicebear.com/7.x/initials/svg?seed=Grab" },
    { name: "Shopee", jobs: 12, logo: "https://api.dicebear.com/7.x/initials/svg?seed=Shopee" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold font-mono bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Bảng Điều Khiển Admin
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Tổng quan toàn diện về nền tảng IT-Job
        </p>
      </div>

      {/* KPI Cards */}
      <AdminKPI />

      {/* Charts and Activity - Same Height */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsChart />
        <RecentActivity />
      </div>

      {/* Top Companies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Crown className="h-5 w-5 text-yellow-500" />
            Top Công Ty
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topCompanies.map((company, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                      <AvatarImage src={company.logo} alt={company.name} />
                      <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                        <Crown className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base truncate">{company.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {company.jobs} công việc đang tuyển
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  #{index + 1}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
