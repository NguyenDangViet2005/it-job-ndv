"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase,
  Eye,
  MousePointerClick,
  UserCheck,
  DollarSign,
  Activity,
  PieChart
} from "lucide-react";
import { cn } from "@/lib/utils";

const Analytics = () => {
  const kpis = [
    {
      title: "Total Page Views",
      value: "125.4K",
      change: "+12.5%",
      trend: "up",
      icon: Eye,
      color: "text-blue-600"
    },
    {
      title: "Unique Visitors",
      value: "45.2K",
      change: "+8.3%",
      trend: "up",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Conversion Rate",
      value: "3.24%",
      change: "+0.5%",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Avg. Session",
      value: "4m 32s",
      change: "-12s",
      trend: "down",
      icon: Activity,
      color: "text-orange-600"
    },
  ];

  const trafficSources = [
    { source: "Direct", visits: 45, color: "bg-blue-500" },
    { source: "Search", visits: 30, color: "bg-green-500" },
    { source: "Social", visits: 15, color: "bg-purple-500" },
    { source: "Referral", visits: 10, color: "bg-orange-500" },
  ];

  const topPages = [
    { page: "/jobs", views: 25400, bounce: "32%" },
    { page: "/companies", views: 18200, bounce: "28%" },
    { page: "/", views: 15800, bounce: "45%" },
    { page: "/blog", views: 12600, bounce: "38%" },
    { page: "/about", views: 8900, bounce: "52%" },
  ];

  const monthlyData = [
    { month: "Jan", applications: 245, jobs: 45, users: 120 },
    { month: "Feb", applications: 312, jobs: 52, users: 145 },
    { month: "Mar", applications: 289, jobs: 48, users: 132 },
    { month: "Apr", applications: 356, jobs: 61, users: 168 },
    { month: "May", applications: 423, jobs: 58, users: 195 },
    { month: "Jun", applications: 478, jobs: 72, users: 224 },
  ];

  const maxApplications = Math.max(...monthlyData.map(d => d.applications));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold font-mono bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Track performance metrics and user behavior
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <kpi.icon className={cn("h-8 w-8", kpi.color)} />
                <div className={cn(
                  "flex items-center gap-1 text-sm font-semibold",
                  kpi.trend === "up" ? "text-green-600" : "text-red-600"
                )}>
                  <TrendingUp className={cn("h-4 w-4", kpi.trend === "down" && "rotate-180")} />
                  <span>{kpi.change}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                {kpi.title}
              </p>
              <p className="text-3xl font-bold mt-2">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Monthly Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="applications" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>
              
              <TabsContent value="applications" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-end justify-between gap-2 h-64">
                    {monthlyData.map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="relative w-full flex items-end justify-center h-full group">
                          <div
                            className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-500 hover:opacity-80 relative overflow-hidden"
                            style={{ height: `${(item.applications / maxApplications) * 100}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                          </div>
                          <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background px-2 py-1 rounded text-xs font-bold">
                            {item.applications}
                          </div>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                          {item.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="jobs" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-end justify-between gap-2 h-64">
                    {monthlyData.map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="relative w-full flex items-end justify-center h-full group">
                          <div
                            className="w-full rounded-t-lg bg-gradient-to-t from-purple-500 to-purple-400 transition-all duration-500 hover:opacity-80"
                            style={{ height: `${(item.jobs / Math.max(...monthlyData.map(d => d.jobs))) * 100}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>
                          <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background px-2 py-1 rounded text-xs font-bold">
                            {item.jobs}
                          </div>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                          {item.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="users" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-end justify-between gap-2 h-64">
                    {monthlyData.map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="relative w-full flex items-end justify-center h-full group">
                          <div
                            className="w-full rounded-t-lg bg-gradient-to-t from-green-500 to-green-400 transition-all duration-500 hover:opacity-80"
                            style={{ height: `${(item.users / Math.max(...monthlyData.map(d => d.users))) * 100}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>
                          <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background px-2 py-1 rounded text-xs font-bold">
                            {item.users}
                          </div>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                          {item.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{source.source}</span>
                    <span className="text-muted-foreground">{source.visits}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full transition-all duration-500", source.color)}
                      style={{ width: `${source.visits}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Top Pages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-mono font-semibold">{page.page}</p>
                    <p className="text-sm text-muted-foreground">{page.views.toLocaleString()} views</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">Bounce Rate</p>
                  <p className="text-lg font-bold text-muted-foreground">{page.bounce}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
