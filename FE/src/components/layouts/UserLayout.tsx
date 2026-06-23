"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Home, LogOut } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/features/toggle-theme";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useAuth } from "@/lib/hooks/useAuth";
import { ROUTES } from "@/constants";
import {
  userSidebarItems,
  filterSidebarItemsByRole,
} from "@/constants/navigation.config";

export function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const filteredSidebarItems = React.useMemo(() => {
    // Filter items based on user role
    if (user?.role === "admin" || user?.role === "employer") {
      return filterSidebarItemsByRole(userSidebarItems, user.role);
    }
    return userSidebarItems;
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
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span>{item.title}</span>
            {item.badge && (
              <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const ProfileCard = () => (
    <Link href={ROUTES.PROFILE()} className="block w-full">
      <div className="p-3.5 rounded-lg border border-primary/20 overflow-hidden">
        <div className="flex items-center gap-3 w-full">
          <Avatar className="h-11 w-11 ring-2 ring-primary/30 flex-shrink-0">
            <AvatarImage src={user?.avatar || undefined} alt={user?.fullname} />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
              {user?.fullname?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 overflow-hidden">
            <h3 className="font-semibold text-sm text-foreground leading-tight block w-full">
              {user?.fullname || "Người dùng"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 block w-full overflow-hidden text-ellipsis">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );

  const SidebarFooter = () => (
    <div className="p-4 space-y-2 border-t bg-card/80 backdrop-blur-sm flex-shrink-0">
      {/* Theme Toggle */}
      <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors">
        <span className="text-sm text-muted-foreground font-medium">
          Giao diện
        </span>
        <ModeToggle />
      </div>

      {/* Back to Home */}
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all"
        asChild
      >
        <Link href={ROUTES.HOME}>
          <Home className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">Về trang chủ</span>
        </Link>
      </Button>

      {/* Logout */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        onClick={logout}
      >
        <LogOut className="h-4 w-4 flex-shrink-0" />
        <span className="text-sm">Đăng xuất</span>
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
            <Link href={ROUTES.HOME}>
              <h1 className="text-lg font-bold">
                <span className="text-primary">IT-Job</span>
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarImage src={user?.avatar || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                {user?.fullname?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar - Full height, no header above */}
        <aside className="hidden lg:flex lg:flex-col w-72 border-r bg-card/50 backdrop-blur-sm h-screen fixed left-0 top-0 overflow-hidden">
          {/* Logo Header */}
          <div className="p-4 border-b bg-card/80 backdrop-blur-sm flex-shrink-0">
            <Link href={ROUTES.HOME} className="flex items-center gap-2 group">
              <Image
                src="/icons/icon.svg"
                width={36}
                height={36}
                alt="IT-Job Logo"
                className="flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-primary text-sm truncate">
                  IT-Job
                </h2>
                <p className="text-xs text-muted-foreground truncate">
                  Dashboard
                </p>
              </div>
            </Link>
          </div>

          {/* Scrollable Content */}
          <ScrollArea className="flex-1 px-4 py-4 overflow-x-hidden">
            <div className="space-y-4 w-full">
              <ProfileCard />
              <NavigationContent />
            </div>
          </ScrollArea>

          {/* Footer */}
          <SidebarFooter />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent
            side="left"
            className="w-72 p-0 bg-card/95 backdrop-blur-sm"
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="p-4 border-b bg-card/80">
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/icon.svg"
                    width={36}
                    height={36}
                    alt="IT-Job Logo"
                  />
                  <div>
                    <h2 className="font-bold text-foreground text-sm">
                      IT-Job Dashboard
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Quản lý tài khoản
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Content */}
              <ScrollArea className="flex-1 px-3 py-4">
                <div className="space-y-4">
                  <ProfileCard />
                  <NavigationContent />
                </div>
              </ScrollArea>

              {/* Mobile Footer */}
              <SidebarFooter />
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 overflow-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
