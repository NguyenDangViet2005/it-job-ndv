"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";

import {
  Briefcase,
  MessageSquare,
  FileText,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/shadcn/button";
import { useAuth } from "@/providers/auth.provider";
import { ROUTES } from "@/configs";

export default function DashboardOverviewPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Việc đã ứng tuyển",
      value: "8",
      icon: Briefcase,
      href: ROUTES.USER_APPLIED_JOBS,
    },
    {
      title: "Tin nhắn mới",
      value: "3",
      icon: MessageSquare,
      href: ROUTES.USER_MESSAGES,
    },
    {
      title: "CV đã tải lên",
      value: "2",
      icon: FileText,
      href: ROUTES.USER_RESUME,
    },
  ];

  const recentActivities = [
    {
      action: "Đã ứng tuyển vào vị trí",
      target: "Senior Frontend Developer",
      company: "Tech Corp",
      time: "2 giờ trước",
    },
    {
      action: "Đã lưu công việc",
      target: "Full Stack Developer",
      company: "Startup XYZ",
      time: "5 giờ trước",
    },
    {
      action: "Nhận tin nhắn từ",
      target: "HR Manager",
      company: "Innovation Ltd",
      time: "1 ngày trước",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">Chào mừng trở lại, {user?.fullName}!</h1>
        <p className="text-muted-foreground mt-2">
          Đây là tổng quan về hoạt động tìm việc của bạn
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold mt-2 text-foreground">{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Clock className="h-5 w-5 text-primary" />
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="text-muted-foreground">
                        {activity.action}
                      </span>
                      <span className="font-semibold text-foreground"> {activity.target}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.company}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5 text-primary" />
              Thao tác nhanh
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start hover:bg-primary/10 hover:text-primary" variant="outline" asChild>
              <Link href={ROUTES.JOBS}>
                <Briefcase className="mr-2 h-4 w-4" />
                Tìm việc làm mới
              </Link>
            </Button>
            <Button className="w-full justify-start hover:bg-primary/10 hover:text-primary" variant="outline" asChild>
              <Link href={ROUTES.USER_RESUME}>
                <FileText className="mr-2 h-4 w-4" />
                Cập nhật CV
              </Link>
            </Button>
            <Button className="w-full justify-start hover:bg-primary/10 hover:text-primary" variant="outline" asChild>
              <Link href={user?.id ? ROUTES.PROFILE(user.id) : "#"}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Xem hồ sơ công khai
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Profile Completion */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Hoàn thiện hồ sơ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Độ hoàn thiện hồ sơ</span>
                <span className="text-sm font-medium text-primary">75%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: "75%" }} />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" className="hover:bg-primary/10 hover:text-primary hover:border-primary">
                Thêm kỹ năng
              </Button>
              <Button size="sm" variant="outline" className="hover:bg-primary/10 hover:text-primary hover:border-primary">
                Thêm kinh nghiệm
              </Button>
              <Button size="sm" variant="outline" className="hover:bg-primary/10 hover:text-primary hover:border-primary">
                Tải CV lên
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
