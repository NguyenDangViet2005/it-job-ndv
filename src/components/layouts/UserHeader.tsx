"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/features/toggle-theme";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/hooks/useAuth";
import { navigationItems } from "@/constants/navigation.config";
import { NavigationLink } from "@/components/features/navigation/navigation-link";
import { UserDropdown } from "@/components/features/navigation/user-dropdown";
import { MobileMenu } from "@/components/features/navigation/mobile-menu";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ROUTES } from "@/constants";

const UserHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Use isAuthenticated directly instead of localStorage to avoid hydration mismatch
  const isLoggedIn = isAuthenticated;

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

  const handleLogout = () => {
    logout();
  };

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  const logoSrc = mounted
    ? resolvedTheme === "dark" || theme === "dark"
      ? "/logo/logo-dark-removebg.png"
      : "/logo/logo-removebg.png"
    : "/logo/logo-removebg.png"; // Default to light logo for SSR

  return (
    <header
      className={`
        group/header
        container fixed top-2 left-1/2 translate-x-[-50%] z-50 
        w-[95%] md:w-full max-w-[1200px] px-4 rounded-2xl shadow-md border border-border/40 backdrop-blur-lg
        transition-all duration-300
        ${
          scrolled
            ? "bg-white/80 dark:bg-black/60 shadow-lg backdrop-blur-md"
            : "bg-background/50"
        }
        hover:bg-white dark:hover:bg-card hover:shadow-xl
      `}
    >
      <div className="flex h-14 items-center justify-between">
        {/* Logo */}
        <div className="p-2 h-full flex items-center">
          <Link href={ROUTES.HOME} className="cursor-target">
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
                <Link href={ROUTES.LOGIN}>Đăng nhập</Link>
              </Button>
              <Button
                className="cursor-target h-9 px-4 shadow-sm hover:shadow-md transition-all"
                size="sm"
                asChild
              >
                <Link href={ROUTES.REGISTER}>Đăng ký</Link>
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
