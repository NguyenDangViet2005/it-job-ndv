"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/shadcn/button";
import { ModeToggle } from "@/components/ui/customs/toggle-them";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/shadcn/sheet";
import {
  FileText,
  Briefcase,
  MessageSquare,
  Settings,
  LayoutDashboard,
  Menu,
  Home,
  LogOut,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/configs";

const sidebarItems = [
  {
    title: "Tổng quan",
    href: ROUTES.USER_DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: "Hồ sơ / CV",
    href: ROUTES.USER_RESUME,
    icon: FileText,
  },
  {
    title: "Việc đã ứng tuyển",
    href: ROUTES.USER_APPLIED_JOBS,
    icon: Briefcase,
  },
  {
    title: "Blog của tôi",
    href: ROUTES.USER_MY_BLOGS,
    icon: BookOpen,
  },
  {
    title: "Tin nhắn",
    href: ROUTES.USER_MESSAGES,
    icon: MessageSquare,
  },
  {
    title: "Cài đặt",
    href: ROUTES.USER_SETTINGS,
    icon: Settings,
  },
];

export default function UserDashboardSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const ProfileCard = () => (
    <div className="p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl border border-blue-500/20">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 ring-2 ring-blue-500/30">
          <AvatarImage src={user?.avatar || ""} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
            {user?.fullName?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">
            {user?.fullName || "Người dùng"}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email || "user@example.com"}
          </p>
        </div>
      </div>
    </div>
  );

  const NavigationContent = () => (
    <nav className="space-y-1">
      {sidebarItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );

  const SidebarHeader = () => (
    <div className="flex h-16 items-center border-b px-4 bg-gradient-to-r from-blue-500/25 to-indigo-500/25 backdrop-blur-md">
      <Link href={ROUTES.HOME} className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/25">
          IJ
        </div>
        <div>
          <h1 className="text-lg font-bold">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
        </div>
      </Link>
    </div>
  );

  const SidebarFooter = () => (
    <div className="p-4 space-y-3 border-t bg-gradient-to-t from-blue-500/20 to-transparent backdrop-blur-md">
      {/* Theme Toggle */}
      <div className="flex items-center justify-between px-2">
        <span className="text-sm text-muted-foreground">Giao diện</span>
        <ModeToggle />
      </div>

      {/* Back to Home */}
      <Button variant="outline" className="w-full justify-start gap-3" asChild>
        <Link href={ROUTES.HOME}>
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

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-gradient-to-b from-blue-500/15 via-indigo-500/10 to-background/95 backdrop-blur-md">
      <SidebarHeader />

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <ProfileCard />
          <NavigationContent />
        </div>
      </ScrollArea>

      <SidebarFooter />
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-indigo-700"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r bg-gradient-to-b from-blue-500/15 via-indigo-500/10 to-background/95 backdrop-blur-xl">
        <SidebarContent />
      </aside>
    </>
  );
}
