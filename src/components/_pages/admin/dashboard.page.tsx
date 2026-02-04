"use client";

import AdminKPI from "@/components/sections/admin/admin-kpi.section";
import StatsChart from "@/components/sections/admin/stats-chart.section";
import RecentActivity from "@/components/sections/admin/recent-activity.section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Star, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const topCompanies = [
    { name: "VNG Corporation", jobs: 24, logo: "https://api.dicebear.com/7.x/initials/svg?seed=VNG" },
    { name: "FPT Software", jobs: 18, logo: "https://api.dicebear.com/7.x/initials/svg?seed=FPT" },
    { name: "Grab Vietnam", jobs: 15, logo: "https://api.dicebear.com/7.x/initials/svg?seed=Grab" },
    { name: "Shopee", jobs: 12, logo: "https://api.dicebear.com/7.x/initials/svg?seed=Shopee" },
  ];

  const topCandidates = [
    { name: "Nguyen Van A", applications: 5, rating: 4.8, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
    { name: "Tran Thi B", applications: 4, rating: 4.6, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" },
    { name: "Le Van C", applications: 4, rating: 4.5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold font-mono bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Complete overview of your IT-Job platform
        </p>
      </div>

      {/* KPI Cards */}
      <AdminKPI />

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StatsChart />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>

      {/* Top Companies and Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Companies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Top Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCompanies.map((company, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                        <AvatarImage src={company.logo} alt={company.name} />
                        <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                          <Crown className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{company.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {company.jobs} active jobs
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-mono">
                    #{index + 1}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Candidates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Top Candidates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCandidates.map((candidate, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                      <AvatarImage src={candidate.avatar} alt={candidate.name} />
                      <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{candidate.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{candidate.applications} applications</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span>{candidate.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    Top {index + 1}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">Success Rate</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                87%
              </p>
              <div className="flex items-center justify-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>+5% from last month</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">Avg. Time to Hire</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                14 days
              </p>
              <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
                <TrendingUp className="h-3 w-3" />
                <span>2 days faster</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">Active Recruiters</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                45
              </p>
              <div className="flex items-center justify-center gap-1 text-xs text-purple-600">
                <TrendingUp className="h-3 w-3" />
                <span>+8 this month</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">Platform Score</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                9.2/10
              </p>
              <div className="flex items-center justify-center gap-1 text-xs text-orange-600">
                <Star className="h-3 w-3 fill-current" />
                <span>Excellent</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
