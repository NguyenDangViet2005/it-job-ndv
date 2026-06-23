"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Menu,
  User,
  FileText,
  Briefcase,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { navigationItems } from "@/constants/navigation.config";
import { ROUTES } from "@/constants";
import { User as UserResponse } from "@/types";
import { useMobileMenu } from "@/lib/hooks/useMobileMenu";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { useRef } from "react";

interface MobileMenuProps {
  isLoggedIn: boolean;
  user: UserResponse | null;
  onLogout: () => void;
}

export const MobileMenu = ({ isLoggedIn, user, onLogout }: MobileMenuProps) => {
  const { isOpen, openMenu, closeMenu, toggleMenu } = useMobileMenu();
  const menuRef = useRef<HTMLDivElement>(null);

  // Tự động đóng menu khi click bên ngoài
  useClickOutside(menuRef as React.RefObject<HTMLElement>, closeMenu, isOpen);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => open ? openMenu() : closeMenu()}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hidden sm:block lg:hidden cursor-target" onClick={toggleMenu}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[300px] sm:w-[400px] pt-10 flex flex-col"
        ref={menuRef}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Menu điều hướng</SheetTitle>
        </SheetHeader>
        
        {!isLoggedIn && (
          <div className="flex flex-col gap-y-3 pb-6 border-b mb-6">
            <Button
              className="cursor-target w-full h-11"
              variant="default"
              asChild
            >
              <Link href={ROUTES.LOGIN} onClick={closeMenu}>Đăng nhập</Link>
            </Button>
            <Button
              className="cursor-target w-full h-11"
              variant="outline"
              asChild
            >
              <Link href={ROUTES.REGISTER} onClick={closeMenu}>Đăng ký</Link>
            </Button>
          </div>
        )}

        {isLoggedIn && user && (
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg mb-6">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.avatar} alt={user?.fullname} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {user?.fullname?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user?.fullname}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-1">
            <h3 className="px-2 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              ĐIỀU HƯỚNG
            </h3>
            {navigationItems.map((item) => (
              <div key={item.title}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                >
                  {item.title}
                </Link>
                {item.items && item.items.length > 0 && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        onClick={closeMenu}
                        className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* User Menu Items - Show when logged in */}
            {isLoggedIn && (
              <>
                <h3 className="px-2 mt-6 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  TÀI KHOẢN
                </h3>
                <Link
                  href={user?.id ? ROUTES.PROFILE(user.id) : ROUTES.PROFILE()}
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                >
                  <User className="h-4 w-4" />
                  Trang cá nhân
                </Link>
                <Link
                  href={ROUTES.USER_RESUME}
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Hồ sơ / CV
                </Link>
                <Link
                  href={ROUTES.USER_APPLIED_JOBS}
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                >
                  <Briefcase className="h-4 w-4" />
                  Việc đã ứng tuyển
                </Link>
                <Link
                  href={ROUTES.USER_SETTINGS}
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Cài đặt
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Logout Button - Show when logged in */}
        {isLoggedIn && (
          <div className="pt-4 border-t mt-4">
            <Button
              onClick={() => {
                onLogout();
                closeMenu();
              }}
              variant="destructive"
              className="w-full cursor-target"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
