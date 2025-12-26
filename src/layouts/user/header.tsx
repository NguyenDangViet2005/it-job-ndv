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
import { useState, useEffect } from "react";

import {
  Menu,
  User,
  FileText,
  Briefcase,
  Bookmark,
  MessageSquare,
  Settings,
  LogOut,
  Shield,
  Building2,
  LayoutDashboard,
  BarChart3,
  Users as UsersIcon,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { ModeToggle } from "../../components/ui/customs/toggle-them";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/shadcn/sheet";
import { Input } from "@/components/ui/shadcn/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/shadcn/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";

import Routes from "@/routes";
import { useAuth } from "@/providers/auth.provider";

const UserHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check login status from localStorage
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

  const navigationItems = [
    {
      title: "Trang chủ",
      href: "/home",
    },
    {
      title: "Công việc",
      href: "/jobs",
    },
    {
      title: "Cộng đồng",
      href: "#",
      items: [
        {
          title: "Hỏi đáp",
          href: "/QA",
        },
        {
          title: "Chia sẽ kinh nghiệm",
          href: "/blog",
        },
      ],
    },
    {
      title: "Công ty",
      href: "/companies",
    },
  ];

  return (
    <>
      <header
        className={`
    container fixed top-2 left-1/2 translate-x-[-50%] z-50 
    w-[95%] md:w-full max-w-[1200px] px-4 rounded-2xl shadow-md border border-border/40 backdrop-blur-lg
    transition-all duration-300
    ${scrolled ? "dark:bg-white/20 shadow-lg bg-black/20" : "bg-background/50"}
  `}
      >
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link
              href={Routes.home}
              className="cursor-target flex items-center gap-2"
            >
              <h1 className="text-lg font-bold tracking-tight">
                <span className="text-foreground">IT</span>
                <span className="text-primary">-Job</span>
              </h1>
            </Link>
          </div>
          {/* pc*/}
          <NavigationMenu className="hidden lg:flex" viewport={false}>
            <NavigationMenuList className="flex space-x-1 ">
              {navigationItems.map((item) => (
                <React.Fragment key={item.title}>
                  {!item.items || item.items.length === 0 ? (
                    <NavigationMenuItem className="cursor-target">
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                        >
                          {item.title}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem className="cursor-target">
                      <NavigationMenuTrigger className="h-9 px-4 py-2 text-sm font-medium transition-colors bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent/50">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid w-[300px] gap-1 p-4">
                          {item.items.map((subItem) => (
                            <NavigationMenuLink key={subItem.title} asChild>
                              <Link
                                href={subItem.href}
                                className="block select-none space-y-1 cursor-target rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium">
                                  {subItem.title}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  )}
                </React.Fragment>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <div className="w-full sm:w-[30%] items-center gap-2 hidden sm:flex lg:hidden">
            <Input
              type="text"
              className="h-9 shadow-sm"
              placeholder="Tìm kiếm..."
            />
          </div>

          {/* Right side - Auth buttons and theme toggle */}
          <div className="flex items-center space-x-3">
            {/* Desktop Auth Buttons or User Menu */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="cursor-target relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.avatar} alt={user?.fullName} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.fullName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.fullName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={user?.id ? Routes.profile(user.id) : "#"}
                      className="cursor-target flex items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Trang cá nhân</span>
                    </Link>
                  </DropdownMenuItem>

                  {/* Only show these items for regular users (not HR/Employer/Admin) */}
                  {user?.role?.toLowerCase() === "user" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href={Routes.dashboardResume}
                          className="cursor-target flex items-center"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Hồ sơ / CV</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={Routes.dashboardAppliedJobs}
                          className="cursor-target flex items-center"
                        >
                          <Briefcase className="mr-2 h-4 w-4" />
                          <span>Việc đã ứng tuyển</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={Routes.dashboardMessages}
                          className="cursor-target flex items-center"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>Tin nhắn</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* Blog của tôi - Show for ALL users */}
                  <DropdownMenuItem asChild>
                    <Link
                      href={Routes.dashboardMyBlogs}
                      className="cursor-target flex items-center"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Blog của tôi</span>
                    </Link>
                  </DropdownMenuItem>

                  {/* HR/Admin Management Sections */}
                  {(user?.role?.toLowerCase() === "hr" ||
                    user?.role?.toLowerCase() === "employer" ||
                    user?.role?.toLowerCase() === "admin") && (
                    <DropdownMenuSeparator />
                  )}

                  {/* HR Sub-menu - Show for HR/employer role */}
                  {(user?.role?.toLowerCase() === "hr" ||
                    user?.role?.toLowerCase() === "employer") && (
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="cursor-target flex items-center">
                        <Building2 className="mr-2 h-4 w-4 text-emerald-500" />
                        <span>Quản lý HR</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="min-w-[180px]">
                          <DropdownMenuItem asChild>
                            <Link
                              href="/hr"
                              className="cursor-target flex items-center"
                            >
                              <LayoutDashboard className="mr-2 h-4 w-4" />
                              <span>Bảng Điều Khiển</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/hr/jobs"
                              className="cursor-target flex items-center"
                            >
                              <Briefcase className="mr-2 h-4 w-4" />
                              <span>Quản Lý Công Việc</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/hr/candidates"
                              className="cursor-target flex items-center"
                            >
                              <UsersIcon className="mr-2 h-4 w-4" />
                              <span>Quản Lý Ứng Viên</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/hr/infor"
                              className="cursor-target flex items-center"
                            >
                              <Building2 className="mr-2 h-4 w-4" />
                              <span>Thông Tin Công Ty</span>
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  )}

                  {/* Admin Sub-menu - Show for ADMIN role */}
                  {user?.role?.toLowerCase() === "admin" && (
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="cursor-target flex items-center">
                        <Shield className="mr-2 h-4 w-4 text-red-500" />
                        <span>Quản lý Admin</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="min-w-[180px]">
                          <DropdownMenuItem asChild>
                            <Link
                              href="/admin"
                              className="cursor-target flex items-center"
                            >
                              <LayoutDashboard className="mr-2 h-4 w-4" />
                              <span>Dashboard</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/admin/jobs"
                              className="cursor-target flex items-center"
                            >
                              <Briefcase className="mr-2 h-4 w-4" />
                              <span>Quản Lý Jobs</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/admin/users"
                              className="cursor-target flex items-center"
                            >
                              <UsersIcon className="mr-2 h-4 w-4" />
                              <span>Người Dùng</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/admin/company"
                              className="cursor-target flex items-center"
                            >
                              <Building2 className="mr-2 h-4 w-4" />
                              <span>Công Ty</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/admin/analytics"
                              className="cursor-target flex items-center"
                            >
                              <BarChart3 className="mr-2 h-4 w-4" />
                              <span>Thống Kê</span>
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={Routes.dashboardSettings}
                      className="cursor-target flex items-center"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Cài đặt</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-target text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button
                  className="cursor-target h-9 px-4"
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button
                  className="cursor-target h-9 px-4 shadow-sm"
                  size="sm"
                  asChild
                >
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </div>
            )}

            <ModeToggle />

            {/* mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden cursor-target"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] pt-10 flex flex-col"
              >
                {/* Search Bar */}
                <div className="flex w-full items-center gap-2 mb-6">
                  <Input
                    type="text"
                    className="h-10"
                    placeholder="Nhập từ khóa"
                  />
                  <Button type="submit" size="sm" className="px-4">
                    Tìm kiếm
                  </Button>
                </div>

                {/* Auth Buttons - Only show when not logged in */}
                {!isLoggedIn && (
                  <div className="flex flex-col gap-3 pb-6 border-b mb-6">
                    <Button
                      className="cursor-target w-full h-11"
                      variant="default"
                      asChild
                    >
                      <Link href="/login">Đăng nhập</Link>
                    </Button>
                    <Button
                      className="cursor-target w-full h-11"
                      variant="outline"
                      asChild
                    >
                      <Link href="/register">Đăng ký</Link>
                    </Button>
                  </div>
                )}

                {/* User Info - Show when logged in */}
                {isLoggedIn && user && (
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg mb-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user?.avatar} alt={user?.fullName} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {user?.fullName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {user?.fullName}
                      </p>
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
                      TRANG CHỦ
                    </h3>
                    {navigationItems.map((item) => (
                      <div key={item.title}>
                        <Link
                          href={item.href}
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
                          CỘNG ĐỒNG
                        </h3>
                        <Link
                          href={user?.id ? Routes.profile(user.id) : "#"}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                        >
                          <User className="h-4 w-4" />
                          Trang cá nhân
                        </Link>
                        <Link
                          href={Routes.dashboardResume}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                        >
                          <FileText className="h-4 w-4" />
                          Hồ sơ / CV
                        </Link>
                        <Link
                          href={Routes.dashboardAppliedJobs}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                        >
                          <Briefcase className="h-4 w-4" />
                          Việc đã ứng tuyển
                        </Link>

                        <h3 className="px-2 mt-6 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          CÔNG TY
                        </h3>
                        <Link
                          href={Routes.dashboardSettings}
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
                      onClick={handleLogout}
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
          </div>
        </div>
      </header>
    </>
  );
};

export default UserHeader;
