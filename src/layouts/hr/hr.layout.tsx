"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Bell,
  Search,
  Menu,
  X,
  Building2,
  Home,
  LogOut,
  Plus,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Badge } from "@/components/ui/shadcn/badge";
import { Sheet, SheetContent } from "@/components/ui/shadcn/sheet";
import { cn } from "@/lib/utils";
import { NavigationItem } from "@/types/test.type";
import { ModeToggle } from "@/components/ui/customs/toggle-them";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";

import Routes from "@/routes";
import { jobApi } from "@/apis/job.api";
import { applicationApi } from "@/apis/application.api";
import { useAuth } from "@/providers/auth.provider";

const BASE_NAVIGATION_ITEMS: NavigationItem[] = [
  { href: "/hr", icon: LayoutDashboard, label: "Bảng Điều Khiển" },
  { href: "/hr/jobs", icon: Briefcase, label: "Công Việc" },
  { href: "/hr/candidates", icon: Users, label: "Ứng Viên" },
  { href: "/hr/blog", icon: FileText, label: "Quản lý Blog" },
  { href: "/hr/infor", icon: Building2, label: "Thông Tin Công Ty" },
];

export function HRLayout({ children }: { children: React.ReactNode }) {
  const { logout, user, company, token } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [jobCount, setJobCount] = React.useState(0);
  const [candidateCount, setCandidateCount] = React.useState(0);
  const [notificationCount, setNotificationCount] = React.useState(0);
  const [companyName, setCompanyName] = React.useState(company?.name || user?.fullName || "Đội ngũ HR");
  const [companyAvatar, setCompanyAvatar] = React.useState(company?.avatar || user?.avatar || "");
  const pathname = usePathname();

  // Fetch dynamic data
  React.useEffect(() => {
    const fetchData = async () => {
      if (!token || !company?.id) return;
      try {
        const companyId = company.id;

        const jobsResponse = await jobApi.getByCompany(companyId, 1, 1, token);
        setJobCount(jobsResponse.totalItems || 0);

        const candidatesResponse = await applicationApi.getByCompany(companyId, 1, 1, token);
        setCandidateCount(candidatesResponse.totalItems || 0);
      } catch (error) {
        console.error("Error fetching layout data:", error);
      }
    };

    fetchData();
  }, [token, company?.id]);

  // Dynamic navigation items with badges
  const navigationItems = BASE_NAVIGATION_ITEMS.map(item => {
    if (item.href === "/hr/jobs") {
      return { ...item, badge: jobCount > 0 ? jobCount : undefined };
    }
    if (item.href === "/hr/candidates") {
      return { ...item, badge: candidateCount > 0 ? candidateCount : undefined };
    }
    return item;
  });

  const NavigationContent = () => (
    <nav className="space-y-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center cursor-target gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <Badge
                variant={isActive ? "secondary" : "outline"}
                className={cn(
                  "text-xs",
                  isActive && "bg-white/20 text-white border-white/30"
                )}
              >
                {item.badge}
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const ProfileCard = () => (
    <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-emerald-500/30">
            <AvatarImage src={companyAvatar || "https://github.com/shadcn.png"} />
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold">
              HR
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{companyName}</h3>
            <p className="text-xs text-muted-foreground">Tuyển Dụng Nhân Tài</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-background/50">
            <span className="text-muted-foreground block">Công việc</span>
            <span className="font-bold text-emerald-500">{jobCount}</span>
          </div>
          <div className="p-2 rounded-lg bg-background/50">
            <span className="text-muted-foreground block">Ứng viên</span>
            <span className="font-bold text-teal-500">{candidateCount}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const handleLogout = () => {
    logout();
  };

  const SidebarFooter = () => (
    <div className="p-4 space-y-3 border-t">
      {/* Back to Home */}
      <Button variant="outline" className="w-full justify-start gap-3" asChild>
        <Link href={Routes.home}>
          <Home className="h-4 w-4" />
          <span>Về trang chủ</span>
        </Link>
      </Button>
      
      {/* Logout */}
      <Button 
        variant="ghost" 
        className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        <span>Đăng xuất</span>
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header - Gradient Style */}
      <header className="sticky top-0 z-40 w-full border-b bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-cyan-500/20 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Link href={Routes.home}>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/25">
                  HR
                </div>
              </Link>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold">
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                    IT-Job
                  </span>
                  <span className="text-muted-foreground"> HR Portal</span>
                </h1>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm ứng viên, công việc..."
                className="pl-10 bg-background/50 border-muted-foreground/20"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 text-[10px] text-white flex items-center justify-center font-bold">
                  {notificationCount}
                </span>
              )}
            </Button>
            <Link href="/hr/jobs/create">
              <Button className="hidden sm:flex bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25">
                <Plus className="h-4 w-4 mr-2" />
                Đăng Tin
              </Button>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-64 border-r bg-gradient-to-b from-emerald-500/15 via-teal-500/10 to-background backdrop-blur-md h-[calc(100vh-4rem)] sticky top-16">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              <ProfileCard />
              <NavigationContent />
            </div>
          </ScrollArea>
          <SidebarFooter />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-72 p-0 bg-gradient-to-b from-emerald-500/25 via-teal-500/15 to-background/95 backdrop-blur-xl border-r-emerald-500/30">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold">
                    HR
                  </div>
                  <div>
                    <h2 className="font-bold">Cổng HR</h2>
                    <p className="text-xs text-muted-foreground">Quản lý tuyển dụng</p>
                  </div>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                  <ProfileCard />
                  <NavigationContent />
                </div>
              </ScrollArea>
              <SidebarFooter />
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
