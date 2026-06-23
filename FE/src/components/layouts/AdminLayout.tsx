"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Shield,
  Home,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/features/toggle-theme";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/hooks/useAuth";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { ROUTES } from "@/constants";
import { adminSidebarItems } from "@/constants/navigation.config";
import { useClickOutside } from "@/lib/hooks/useClickOutside";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Tự động đóng mobile menu khi click bên ngoài
  useClickOutside(sidebarRef as React.RefObject<HTMLElement>, closeMobileMenu, mobileMenuOpen);

  const logoSrc =
    mounted && (resolvedTheme === "dark" || theme === "dark")
      ? "/logo/logo-dark-removebg.png"
      : "/logo/logo-removebg.png";

  useEffect(() => {
    setMounted(true);
  }, []);

  const NavigationContent = () => (
    <nav className="space-y-1">
      {adminSidebarItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={closeMobileMenu}
            className={cn(
              "flex items-center cursor-target gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800",
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
                    "bg-white/90 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-transparent",
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
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Admin Panel
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Quản trị hệ thống
          </p>
        </div>
      </div>
    </div>
  );

  const SidebarFooter = () => (
    <div className="p-4 space-y-3 border-t border-slate-200 dark:border-slate-800">
      <Button
        variant="outline"
        className="w-full justify-start gap-3 border-slate-200 dark:border-slate-700"
        asChild
      >
        <Link href={ROUTES.HOME} onClick={closeMobileMenu}>
          <Home className="h-4 w-4" />
          <span>Về trang chủ</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start gap-3 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
        onClick={() => {
          logout();
          closeMobileMenu();
        }}
      >
        <LogOut className="h-4 w-4" />
        <span>Đăng xuất</span>
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top Header - Fixed */}
      <header className="flex-shrink-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
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

          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar - Fixed */}
        <aside className="hidden lg:flex lg:flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
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
            ref={sidebarRef}
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-slate-100">
                      Admin Panel
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Quản trị hệ thống
                    </p>
                  </div>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                  <NavigationContent />
                </div>
              </ScrollArea>
              <SidebarFooter />
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
