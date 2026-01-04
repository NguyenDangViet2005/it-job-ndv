"use client";

import { Button } from "@/components/ui/shadcn/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/shadcn/navigation-menu";
import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import * as React from "react";
import { ModeToggle } from "@/components/ui/customs/toggle-them";
import { Input } from "@/components/ui/shadcn/input";
import { useAuth } from "@/providers/auth.provider";
import { navigationItems } from "@/configs/navigation.config";
import { NavigationLink } from "@/components/ui/customs/navigation-link";
import { UserDropdown } from "@/components/ui/customs/user-dropdown";
import { MobileMenu } from "@/components/ui/customs/mobile-menu";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ROUTES } from "@/configs";

const UserHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setIsLoggedIn(!!accessToken || isAuthenticated);
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    logout();
  };

  const logoSrc = mounted && (resolvedTheme === "dark" || theme === "dark")
    ? "/logo/logo-dark-removebg.png"
    : "/logo/logo-removebg.png";

  return (
    <header
      className={`
        group/header
        container fixed top-2 left-1/2 translate-x-[-50%] z-50 
        w-[95%] md:w-full max-w-[1200px] px-4 rounded-2xl shadow-md border border-border/40 backdrop-blur-lg
        transition-all duration-300
        ${scrolled ? "dark:bg-white/20 shadow-lg bg-black/20" : "bg-background/50"}
        hover:bg-white dark:hover:bg-black/95 hover:shadow-xl
      `}
    >
      <div className="flex h-14 items-center justify-between">
        {/* Logo */}
        <div className="p-2 h-full flex items-center">
          <Link
            href={ROUTES.HOME}
            className="cursor-target"
          >
            <Image
              src={logoSrc}
              width={80}
              height={50}
              alt="IT-Job Logo"
              priority
              className="object-contain"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex" viewport={false}>
          <NavigationMenuList className="flex space-x-1">
            {navigationItems.map((item) => (
              <Fragment key={item.title}>
                {!item.items || item.items.length === 0 ? (
                  <NavigationMenuItem className="cursor-target">
                    <NavigationMenuLink asChild>
                      <NavigationLink href={item.href}>
                        {item.title}
                      </NavigationLink>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem className="cursor-target">
                    <NavigationMenuTrigger className="h-9 px-4 py-2 text-sm font-medium transition-all duration-200 bg-transparent hover:text-primary data-[state=open]:text-primary">
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[300px] gap-1 p-4">
                        {item.items.map((subItem) => (
                          <NavigationMenuLink key={subItem.title} asChild>
                            <Link
                              href={subItem.href}
                              className="group block select-none space-y-1 cursor-target rounded-md p-3 leading-none no-underline outline-none transition-colors duration-200 hover:text-primary focus:text-primary"
                            >
                              <div className="text-sm font-medium">
                                {subItem.title}
                              </div>
                              {subItem.description && (
                                <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                  {subItem.description}
                                </p>
                              )}
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )}
              </Fragment>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search Bar - Tablet */}
        <div className="w-full sm:w-[30%] items-center gap-2 hidden sm:flex lg:hidden">
          <Input
            type="text"
            className="h-9 shadow-sm"
            placeholder="Tìm kiếm..."
          />
        </div>

        {/* Right side - Auth buttons and theme toggle */}
        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <UserDropdown user={user} onLogout={handleLogout} />
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Button
                className="cursor-target h-9 px-4 hover:text-primary transition-all"
                variant="ghost"
                size="sm"
                asChild
              >
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button
                className="cursor-target h-9 px-4 shadow-sm hover:shadow-md transition-all"
                size="sm"
                asChild
              >
                <Link href="/register">Đăng ký</Link>
              </Button>
            </div>
          )}

          <ModeToggle />

          {/* Mobile Menu */}
          <MobileMenu
            isLoggedIn={isLoggedIn}
            user={user}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
