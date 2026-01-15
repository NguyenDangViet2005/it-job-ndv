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

import { jobApi } from "@/apis/job.api";
import { applicationApi } from "@/apis/application.api";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { ROUTES } from "@/configs";
import { hrSidebarItems } from "@/configs";

export function HRLayout({ children }: { children: React.ReactNode }) {
  const { logout, user, company, token } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [jobCount, setJobCount] = useState(0);
  const [candidateCount, setCandidateCount] = useState(0);
  const [notificationCount] = useState(0);
  const companyName = company?.name || user?.fullName || "Đội ngũ HR";
  const companyAvatar = company?.avatar || user?.avatar || "";
  const pathname = usePathname();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const logoSrc =
    mounted && (resolvedTheme === "dark" || theme === "dark")
      ? "/logo/logo-dark-removebg.png"
      : "/logo/logo-removebg.png";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch dynamic data
  useEffect(() => {
    const fetchData = async () => {
      if (!token || !company?.id) return;
      try {
        const companyId = company.id;

        const jobsResponse = await jobApi.getByCompany(companyId, 1, 1, token);
        setJobCount(jobsResponse.totalItems || 0);

        const candidatesResponse = await applicationApi.getByCompany(
          companyId,
          1,
          1,
          token
        );
        setCandidateCount(candidatesResponse.totalItems || 0);
      } catch (error) {
        console.error("Error fetching layout data:", error);
      }
    };

    fetchData();
  }, [token, company?.id]);

  // Dynamic navigation items with badges
  const navigationItems = hrSidebarItems.map((item) => {
    if (item.href === "/hr/jobs") {
      return { ...item, badge: jobCount > 0 ? jobCount : undefined };
    }
    if (item.href === "/hr/candidates") {
      return {
        ...item,
        badge: candidateCount > 0 ? candidateCount : undefined,
      };
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
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1">{item.title}</span>
            {item.badge && (
              <Badge
                variant={isActive ? "secondary" : "outline"}
                className={cn(
                  "text-xs",
                  isActive &&
                    "bg-white/90 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-transparent"
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
    <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-slate-200 dark:ring-slate-700">
            <AvatarImage
              src={companyAvatar || "https://github.com/shadcn.png"}
            />
            <AvatarFallback className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold">
              HR
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {companyName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tuyển Dụng Nhân Tài
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 block">
              Công việc
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {jobCount}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 block">
              Ứng viên
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {candidateCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const handleLogout = () => {
    logout();
  };

  const SidebarFooter = () => (
    <div className="p-4 space-y-3 border-t border-slate-200 dark:border-slate-800">
      {/* Back to Home */}
      <Button
        variant="outline"
        className="w-full justify-start gap-3 border-slate-200 dark:border-slate-700"
        asChild
      >
        <Link href={ROUTES.HOME}>
          <Home className="h-4 w-4" />
          <span>Về trang chủ</span>
        </Link>
      </Button>

      {/* Logout */}
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        <span>Đăng xuất</span>
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top Header - Clean White Style */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
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
            <div className="flex items-center">
              <Link href={ROUTES.HOME} className="cursor-target">
                <Image
                  src={logoSrc}
                  width={120}
                  height={40}
                  alt="IT-Job Logo"
                  priority
                  className="object-contain h-10"
                />
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm ứng viên, công việc..."
                className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-slate-900 dark:bg-slate-100 text-[10px] text-white dark:text-slate-900 flex items-center justify-center font-bold">
                  {notificationCount}
                </span>
              )}
            </Button>
            <Link href="/hr/jobs/create">
              <Button className="hidden sm:flex bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 shadow-sm">
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
        <aside className="hidden lg:flex lg:flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-[calc(100vh-4rem)] sticky top-16">
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
          <SheetContent
            side="left"
            className="w-72 p-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800"
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold">
                    HR
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-slate-100">
                      Cổng HR
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Quản lý tuyển dụng
                    </p>
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
        <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
