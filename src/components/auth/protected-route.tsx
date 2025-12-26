"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth.provider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, token, loading, checkRouteAccess } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    // Check authentication
    if (!token || !user) {
      router.push("/login");
      return;
    }

    // Check role-based access
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/access-denied");
      return;
    }

    // Check route access
    if (pathname && !checkRouteAccess(pathname)) {
      router.push("/access-denied");
      return;
    }

    setIsChecking(false);
  }, [loading, token, user, allowedRoles, pathname, router, checkRouteAccess]);

  // Show loading while checking
  if (loading || isChecking) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang kiểm tra...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
