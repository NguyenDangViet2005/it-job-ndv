"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Bookmark,
  TrendingUp,
  Eye,
  Loader2,
  FileText,
  Award,
  ChevronRight,
  Phone,
  MapPin,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { DEFAULT_AVATARS, ROUTES } from "@/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProfileSection() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Get initials from name
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNavigation = (path: string) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thực hiện thao tác này");
      return;
    }
    router.push(path);
  };

  if (loading) {
    return (
      <Card className="overflow-hidden border-border/50">
        <div className="h-14 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <CardContent className="p-4 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-border/50 p-0">
      {/* Cover Image */}
      <div
        className="h-14 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent bg-cover bg-center"
        style={{
          backgroundImage: user?.coverimage
            ? `url(${user.coverimage})`
            : undefined,
        }}
      />

      <CardContent className="p-0">
        {/* Avatar & Info */}
        <div className="px-4 -mt-7 pb-3">
          <div
            onClick={() => handleNavigation(`/profile/${user?.id}`)}
            className="cursor-pointer inline-block"
          >
            <Avatar className="h-14 w-14 ring-4 ring-background border border-border/50 hover:ring-primary/50 transition-all">
              <AvatarImage
                src={user?.avatar || DEFAULT_AVATARS.USER}
                alt={user?.fullname || "User"}
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                {getInitials(user?.fullname)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div
            onClick={() => handleNavigation(`/profile/${user?.id}`)}
            className="cursor-pointer hover:underline"
          >
            <h3 className="font-semibold text-sm mt-2">
              {user?.fullname || "Người dùng"}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            {user?.email || "Chưa cập nhật email"}
          </p>

          <div className="mt-4 flex flex-col gap-2">
            {user?.phone && (
              <div
                className="flex items-center gap-2 text-xs text-muted-foreground"
                title="Số điện thoại"
              >
                <Phone className="h-3.5 w-3.5 text-muted-foreground/70" />
                <span>{user.phone}</span>
              </div>
            )}

            {user?.address && (
              <div
                className="flex items-center gap-2 text-xs text-muted-foreground"
                title="Địa chỉ"
              >
                <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                <span className="truncate">{user.address}</span>
              </div>
            )}

            <div
              className="flex items-center gap-2 text-xs text-muted-foreground"
              title="Vai trò"
            >
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground/70" />
              <span className="capitalize">
                {user?.role === "user" ? "Ứng viên tìm việc" : "Nhà tuyển dụng"}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Tools - Quick Actions */}
        <div className="px-2 py-2 space-y-1">
          <div
            onClick={() => handleNavigation(ROUTES.USER_RESUME)}
            className="block"
          >
            <button className="cursor-pointer w-full flex items-center justify-between hover:bg-accent/50 px-2 py-2 rounded-md transition-colors text-xs group">
              <span className="text-muted-foreground group-hover:text-foreground flex items-center gap-2 transition-colors">
                <FileText className="h-4 w-4" />
                Upload CV
              </span>
              <ChevronRight className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
            </button>
          </div>

          <div
            onClick={() => handleNavigation(ROUTES.USER_RESUME)}
            className="block"
          >
            <button className="cursor-pointer w-full flex items-center justify-between hover:bg-accent/50 px-2 py-2 rounded-md transition-colors text-xs group">
              <span className="text-muted-foreground group-hover:text-foreground flex items-center gap-2 transition-colors">
                <Award className="h-4 w-4" />
                Thêm Kỹ Năng
              </span>
              <ChevronRight className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
