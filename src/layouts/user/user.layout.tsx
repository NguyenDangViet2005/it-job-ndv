"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Menu,
  Home,
  LogOut,
  User,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Sheet, SheetContent } from "@/components/ui/shadcn/sheet";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/customs/toggle-them";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";
import Routes from "@/routes";
import { useAuth } from "@/providers/auth.provider";

const sidebarItems = [
  { title: "Tổng quan", href: Routes.dashboard, icon: LayoutDashboard },
  { title: "Hồ sơ / CV", href: Routes.dashboardResume, icon: FileText },
  {
    title: "Việc đã ứng tuyển",
    href: Routes.dashboardAppliedJobs,
    icon: Briefcase,
  },
  { title: "Blog của tôi", href: Routes.dashboardMyBlogs, icon: BookOpen },
  { title: "Tin nhắn", href: Routes.dashboardMessages, icon: MessageSquare },
  { title: "Cài đặt", href: Routes.dashboardSettings, icon: Settings },
];

export function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const filteredSidebarItems = React.useMemo(() => {
    // Nếu là admin hoặc employer (HR) thì chỉ hiện Blog và Cài đặt
    if (user?.role === "admin" || user?.role === "employer") {
      return sidebarItems.filter(
        (item) =>
          item.href === Routes.dashboardMyBlogs ||
          item.href === Routes.dashboardSettings
      );
    }
    return sidebarItems;
  }, [user]);

  const NavigationContent = () => (
    <nav className="space-y-1">
      {filteredSidebarItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );

  const ProfileCard = () => (
    <div className="p-4 bg-card rounded-xl border">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 ring-2 ring-primary/20">
          <AvatarImage src={user?.avatar || ""} />
          <AvatarFallback className="bg-primary text-primary-foreground font-bold">
            {user?.fullName?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate text-foreground">
            {user?.fullName || "Người dùng"}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email || "user@example.com"}
          </p>
        </div>
      </div>
    </div>
  );

  const SidebarFooter = () => (
    <div className="p-4 space-y-3 border-t bg-card">
      {/* Theme Toggle */}
      <div className="flex items-center justify-between px-2">
        <span className="text-sm text-muted-foreground">Giao diện</span>
        <ModeToggle />
      </div>

      {/* Back to Home */}
      <Button
        variant="outline"
        className="w-full justify-start gap-3 hover:bg-primary/10 hover:text-primary"
        asChild
      >
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
      {/* Mobile Header - Only visible on mobile */}
      <header className="lg:hidden sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href={Routes.home}>
              <h1 className="text-lg font-bold">
                <span className="text-primary">IT-Job</span>
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarImage src={user?.avatar || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                {user?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar - Full height, no header above */}
        <aside className="hidden lg:flex lg:flex-col w-64 border-r bg-card h-screen fixed left-0 top-0 overflow-hidden">
          <div className="p-4 border-b bg-card">
            <Link href={Routes.home} className="flex items-center gap-3">
              <div>
                <h2 className="font-bold text-primary">IT-Job</h2>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </Link>
          </div>

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
          <SheetContent side="left" className="w-72 p-0 bg-card">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b bg-card">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
                    IJ
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground">Dashboard</h2>
                    <p className="text-xs text-muted-foreground">
                      Quản lý tài khoản
                    </p>
                  </div>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4 bg-muted/30">
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
        <main className="flex-1 lg:ml-64 overflow-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
