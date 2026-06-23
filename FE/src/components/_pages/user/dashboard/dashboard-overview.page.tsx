"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Briefcase,
  MessageSquare,
  FileText,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { ROUTES } from "@/constants";
import LoadingScreen from "@/components/common/loading-screen";

export default function DashboardOverviewPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen fullScreen={true} message="Đang tải tổng quan..." />;
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
    <div className="space-y-3 sm:space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-xl sm:text-3xl font-bold">
          Chào mừng trở lại, {user?.fullname}!
        </h1>
        <p className="text-xs sm:text-base text-muted-foreground mt-1">
          Đây là tổng quan về hoạt động tìm việc của bạn
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer bg-card">
              <CardContent className="p-3 sm:pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {stat.title}
                    </p>
                    <p className="text-xl sm:text-3xl font-bold mt-1 text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-1.5 sm:p-3 rounded-lg bg-primary/10 self-end sm:self-auto">
                    <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
        {/* Recent Activities */}
        <Card className="bg-card">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-foreground text-sm sm:text-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="space-y-2 sm:space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 pb-2 sm:pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="mt-1 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs">
                      <span className="text-muted-foreground">
                        {activity.action}
                      </span>
                      <span className="font-semibold text-foreground">
                        {" "}
                        {activity.target}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.company}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
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
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-foreground text-sm sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Thao tác nhanh
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-3 sm:p-6 pt-0">
            <Button
              className="w-full justify-start hover:bg-primary/10 hover:text-primary text-xs sm:text-sm h-8 sm:h-10"
              variant="outline"
              asChild
            >
              <Link href={ROUTES.JOBS}>
                <Briefcase className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Tìm việc làm mới
              </Link>
            </Button>
            <Button
              className="w-full justify-start hover:bg-primary/10 hover:text-primary text-xs sm:text-sm h-8 sm:h-10"
              variant="outline"
              asChild
            >
              <Link href={ROUTES.USER_RESUME}>
                <FileText className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Cập nhật CV
              </Link>
            </Button>
            <Button
              className="w-full justify-start hover:bg-primary/10 hover:text-primary text-xs sm:text-sm h-8 sm:h-10"
              variant="outline"
              asChild
            >
              <Link href={user?.id ? ROUTES.PROFILE(user.id) : "#"}>
                <TrendingUp className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Xem hồ sơ công khai
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Profile Completion */}
      <Card className="bg-card">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-foreground text-sm sm:text-lg">Hoàn thiện hồ sơ</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="space-y-2 sm:space-y-4">
            <div>
              <div className="flex justify-between mb-1.5 sm:mb-2">
                <span className="text-xs font-medium text-foreground">
                  Độ hoàn thiện hồ sơ
                </span>
                <span className="text-xs font-medium text-primary">75%</span>
              </div>
              <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: "75%" }}
                />
              </div>
            </div>
            <div className="flex gap-1.5 sm:gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                className="hover:bg-primary/10 hover:text-primary hover:border-primary text-xs h-7 sm:h-9 px-2 sm:px-3"
              >
                Thêm kỹ năng
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="hover:bg-primary/10 hover:text-primary hover:border-primary text-xs h-7 sm:h-9 px-2 sm:px-3"
              >
                Thêm kinh nghiệm
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="hover:bg-primary/10 hover:text-primary hover:border-primary text-xs h-7 sm:h-9 px-2 sm:px-3"
              >
                Tải CV lên
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
