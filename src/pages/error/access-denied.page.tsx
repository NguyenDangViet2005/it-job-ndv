"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/shadcn/button";
import { ShieldX, Home } from "lucide-react";
import { useAuth } from "@/providers/auth.provider";

export default function AccessDeniedPage() {
  const router = useRouter();
  const { user, getRedirectPath } = useAuth();

  const handleGoHome = () => {
    if (user?.role) {
      const redirectPath = getRedirectPath(user.role);
      router.push(redirectPath);
    } else {
      router.push("/");
    }
  };

  const getRoleDisplay = () => {
    if (!user?.role) return "Khách";
    if (user.role === "user") return "Ứng viên";
    if (user.role === "hr" || user.role === "employer")
      return "Nhà tuyển dụng";
    if (user.role === "admin") return "Quản trị viên";
    return user.role;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-950 p-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Shield Icon */}
        <div className="flex justify-center">
          <ShieldX className="w-16 h-16 text-red-500" strokeWidth={2} />
        </div>

        {/* 403 Number */}
        <h1 className="text-8xl font-bold text-red-500">403</h1>

        {/* Title */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300">
            Truy cập bị từ chối
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Bạn không có quyền truy cập vào trang này. Khu vực này chỉ dành cho
            người dùng được ủy quyền.
          </p>
        </div>

        {/* User Role Badge */}
        {user && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Vai trò hiện tại:
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {getRoleDisplay()}
            </span>
          </div>
        )}

        {/* Home Button */}
        <Button
          onClick={handleGoHome}
          variant="outline"
          className="border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          <Home className="w-4 h-4 mr-2" />
          Về trang chủ
        </Button>
      </div>
    </div>
  );
}
