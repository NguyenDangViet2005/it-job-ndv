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
  X,
  Shield,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";
import Routes from "@/routes";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";
import { useAuth } from "@/providers/auth.provider";

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
                ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25"
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
    <div className="p-3 bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-lg border border-red-500/20">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-md bg-gradient-to-br from-red-500 to-rose-600 text-white">
          <Shield className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">Admin Panel</h3>
          <p className="text-[10px] text-muted-foreground">
            System Administrator
          </p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1.5 text-[10px]">
        <div className="p-1.5 rounded bg-background/50 text-center">
          <span className="text-muted-foreground block">Jobs</span>
          <span className="font-bold text-red-500">156</span>
        </div>
        <div className="p-1.5 rounded bg-background/50 text-center">
          <span className="text-muted-foreground block">Users</span>
          <span className="font-bold text-green-500">1.2K</span>
        </div>
        <div className="p-1.5 rounded bg-background/50 text-center">
          <span className="text-muted-foreground block">Co.</span>
          <span className="font-bold text-blue-500">89</span>
        </div>
        <div className="p-1.5 rounded bg-background/50 text-center">
          <span className="text-muted-foreground block">Posts</span>
          <span className="font-bold text-purple-500">324</span>
        </div>
      </div>
    </div>
  );

  const SidebarFooter = () => (
    <div className="pt-4 space-y-3 border-t bg-background">
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
        className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        onClick={logout}
      >
        <LogOut className="h-4 w-4" />
        <span>Đăng xuất</span>
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header - Gradient Style */}
      <header className="sticky top-0 z-40 w-full border-b bg-gradient-to-r from-red-500/20 via-rose-500/15 to-pink-500/20 backdrop-blur-xl">
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
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white font-bold shadow-lg shadow-red-500/25">
                  A
                </div>
              </Link>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold">
                  <span className="bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">
                    Admin
                  </span>
                  <span className="text-muted-foreground"> Panel</span>
                </h1>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm users, jobs, posts..."
                className="cursor-target pl-10 bg-background/50 border-muted-foreground/20"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
                5
              </span>
            </Button>
            <Button className="hidden sm:flex bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg shadow-red-500/25">
              <Plus className="h-4 w-4 mr-2" />
              Tạo mới
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-64 border-r bg-background h-[calc(100vh-4rem)] sticky top-16">
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
            className="w-72 p-0 bg-gradient-to-b from-red-500/25 via-rose-500/15 to-background/95 backdrop-blur-xl border-r-red-500/30"
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b bg-gradient-to-r from-red-500/10 to-rose-500/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white font-bold">
                    A
                  </div>
                  <div>
                    <h2 className="font-bold">Admin Panel</h2>
                    <p className="text-xs text-muted-foreground">
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
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
