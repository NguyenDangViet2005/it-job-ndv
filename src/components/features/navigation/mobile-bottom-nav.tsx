"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Building2, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { navigationItems } from "@/constants/navigation.config";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const navItems = [
  {
    title: "Trang chủ",
    href: ROUTES.HOME,
    icon: Home,
  },
  {
    title: "Việc làm",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    title: "Công ty",
    href: "/companies",
    icon: Building2,
  },
  {
    title: "Khác",
    icon: Menu,
    isMenu: true,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted ? isAuthenticated : false;

  // Hàm đóng menu
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          if (item.isMenu) {
            return (
              <Sheet key="menu" open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <button className="flex flex-col items-center justify-center flex-1 gap-1 py-2 transition-colors">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {item.title}
                    </span>
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] p-0">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle>Điều hướng</SheetTitle>
                  </SheetHeader>
                  
                  <div className="flex-1 overflow-auto p-4 space-y-4">
                      {/* User Info */}
                      {isLoggedIn && user ? (
                        <div className="p-4 rounded-lg border bg-card">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                              <Image src={user.avatar || ""} alt={user.fullname} width={40} height={40} className="w-full h-full object-contain"/>
                            </div>
                            <div>
                              <p className="font-semibold">{user.fullname}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <Link href={ROUTES.PROFILE()} onClick={closeMenu}>
                            <Button className="w-full mt-3" variant="outline" size="sm">
                              Xem hồ sơ
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="p-4 rounded-lg border bg-card flex flex-col gap-2">
                          <Link href={ROUTES.LOGIN} onClick={closeMenu}>
                            <Button className="w-full" variant="outline" size="sm">
                              Đăng nhập
                            </Button>
                          </Link>
                          <Link href={ROUTES.REGISTER} onClick={closeMenu}>
                            <Button className="w-full" size="sm">
                              Đăng ký
                            </Button>
                          </Link>
                        </div>
                      )}

                      {/* Navigation Items */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-muted-foreground px-2 mb-2">
                          Điều hướng
                        </h3>
                        {navigationItems.map((item) => (
                          <div key={item.title}>
                            {!item.items || item.items.length === 0 ? (
                              <Link
                                href={item.href}
                                onClick={closeMenu}
                                className="block px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                              >
                                <span className="font-medium">{item.title}</span>
                              </Link>
                            ) : (
                              <div>
                                <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">
                                  {item.title}
                                </div>
                                {item.items.map((subItem) => (
                                  <Link
                                    key={subItem.title}
                                    href={subItem.href}
                                    onClick={closeMenu}
                                    className="block px-6 py-2.5 rounded-lg hover:bg-accent transition-colors"
                                  >
                                    <div className="font-medium text-sm">{subItem.title}</div>
                                    {subItem.description && (
                                      <div className="text-xs text-muted-foreground mt-0.5">
                                        {subItem.description}
                                      </div>
                                    )}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Logout */}
                      {isLoggedIn && (
                        <Button
                          variant="ghost"
                          className="w-full text-destructive border-1 border-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            logout();
                            closeMenu();
                          }}
                        >
                          Đăng xuất
                        </Button>
                      )}
                    </div>
                </SheetContent>
              </Sheet>
            );
          }

          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href || ""}
              className={cn(
                "flex flex-col items-center justify-center flex-1 gap-1 py-2 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
