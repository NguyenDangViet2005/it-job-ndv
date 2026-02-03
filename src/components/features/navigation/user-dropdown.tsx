"use client";

import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  User,
  FileText,
  Briefcase,
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
import type { UserResponse } from "@/types/api.type";
import { ROUTES } from "@/constants";

interface UserDropdownProps {
  user: UserResponse | null;
  onLogout: () => void;
}

export const UserDropdown = ({ user, onLogout }: UserDropdownProps) => {
  const isRegularUser = user?.role?.toLowerCase() === "user";
  const isHR =
    user?.role?.toLowerCase() === "hr" ||
    user?.role?.toLowerCase() === "employer";
  const isAdmin = user?.role?.toLowerCase() === "admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="cursor-target relative h-9 w-9 p-0 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatar} alt={user?.fullname} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.fullname?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.fullname}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href={user?.id ? ROUTES.PROFILE(user.id) : "#"}
            className="cursor-target flex items-center"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Trang cá nhân</span>
          </Link>
        </DropdownMenuItem>

        {/* Regular User Menu Items */}
        {isRegularUser && (
          <>
            <DropdownMenuItem asChild>
              <Link
                href={ROUTES.USER_RESUME}
                className="cursor-target flex items-center"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>Hồ sơ / CV</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={ROUTES.USER_APPLIED_JOBS}
                className="cursor-target flex items-center"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                <span>Việc đã ứng tuyển</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={ROUTES.USER_MESSAGES}
                className="cursor-target flex items-center"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Tin nhắn</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {/* Blog - Show for ALL users */}
        <DropdownMenuItem asChild>
          <Link
            href={ROUTES.USER_MY_BLOGS}
            className="cursor-target flex items-center"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Blog của tôi</span>
          </Link>
        </DropdownMenuItem>

        {/* HR/Admin Separator */}
        {(isHR || isAdmin) && <DropdownMenuSeparator />}

        {/* HR Sub-menu */}
        {isHR && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-target flex items-center">
              <Building2 className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Quản lý HR</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="min-w-[180px]">
                <DropdownMenuItem asChild>
                  <Link href="/hr" className="cursor-target flex items-center">
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

        {/* Admin Sub-menu */}
        {isAdmin && (
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
            href={ROUTES.USER_SETTINGS}
            className="cursor-target flex items-center"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Cài đặt</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-target text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
