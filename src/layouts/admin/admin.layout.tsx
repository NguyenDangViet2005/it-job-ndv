"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  BarChart3,
  FileText,
  Globe,
  Bell,
  Search,
  Menu,
  Shield,
  Plus,
  Building2,
  Home,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Badge } from "@/components/ui/shadcn/badge";
import { Sheet, SheetContent } from "@/components/ui/shadcn/sheet";
import { cn } from "@/lib/utils";
import { NavigationItem } from "@/types/test.type";
import { ModeToggle } from "../../components/ui/customs/toggle-them";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";
import { useAuth } from "@/providers/auth.provider";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { ROUTES } from "@/configs";

const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/jobs", icon: Briefcase, label: "Quản lý Jobs", badge: 15 },
  { href: "/admin/users", icon: Users, label: "Người dùng", badge: 120 },
  { href: "/admin/company", icon: Building2, label: "Công ty", badge: 6 },
  { href: "/admin/analytics", icon: BarChart3, label: "Thống kê" },
  { href: "/admin/blog", icon: FileText, label: "Blog", badge: 5 },
  { href: "/admin/social", icon: Globe, label: "Social Media" },
  { href: "/admin/settings", icon: Settings, label: "Cài đặt" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const logoSrc = mounted && (resolvedTheme === "dark" || theme === "dark")
    ? "/logo/logo-dark-removebg.png"
    : "/logo/logo-removebg.png";

  useEffect(() => {
    setMounted(true);
  }, []);

  const NavigationContent = () => (
    <nav className="space-y-1">
      {NAVIGATION_ITEMS.map((item) => {
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
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <Badge
                variant={isActive ? "secondary" : "outline"}
                className={cn(
                  "text-xs",
                  isActive && "bg-white/90 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-transparent"
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
    <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900">
          <Shield className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Admin Panel</h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            System Administrator
          </p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1.5 text-[10px]">
        <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
          <span className="text-slate-500 dark:text-slate-400 block">Jobs</span>
          <span className="font-bold text-slate-900 dark:text-slate-100">156</span>
        </div>
        <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
          <span className="text-slate-500 dark:text-slate-400 block">Users</span>
          <span className="font-bold text-slate-900 dark:text-slate-100">1.2K</span>
        </div>
        <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
          <span className="text-slate-500 dark:text-slate-400 block">Co.</span>
          <span className="font-bold text-slate-900 dark:text-slate-100">89</span>
        </div>
        <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
          <span className="text-slate-500 dark:text-slate-400 block">Posts</span>
          <span className="font-bold text-slate-900 dark:text-slate-100">324</span>
        </div>
      </div>
    </div>
  );

  const SidebarFooter = () => (
    <div className="pt-4 space-y-3 border-t border-slate-200 dark:border-slate-800 bg-background">
      {/* Back to Home */}
      <Button variant="outline" className="w-full justify-start gap-3 border-slate-200 dark:border-slate-700" asChild>
        <Link href={ROUTES.HOME}>
          <Home className="h-4 w-4" />
          <span>Về trang chủ</span>
        </Link>
      </Button>

      {/* Logout */}
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
        onClick={logout}
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
              <Link
                href={ROUTES.HOME}
                className="cursor-target"
              >
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
                placeholder="Tìm kiếm users, jobs, posts..."
                className="cursor-target pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-slate-900 dark:bg-slate-100 text-[10px] text-white dark:text-slate-900 flex items-center justify-center font-bold">
                5
              </span>
            </Button>
            <Button className="hidden sm:flex bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Tạo mới
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-[calc(100vh-4rem)] sticky top-16">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              <ProfileCard />
              <NavigationContent />
              <SidebarFooter />
            </div>
          </ScrollArea>
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
                    A
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-slate-100">Admin Panel</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Quản trị hệ thống
                    </p>
                  </div>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                  <ProfileCard />
                  <NavigationContent />
                  <SidebarFooter />
                </div>
              </ScrollArea>
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
