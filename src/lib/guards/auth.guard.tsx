"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth"; 
import { ROUTES } from "@/constants"; 
import { hasRouteAccess } from "@/utils/auth";
import LoadingScreen from "@/components/common/loading-screen";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || !pathname) return;

    // Don't check access-denied page itself
    if (pathname === ROUTES.ACCESS_DENIED) return;

    // Check protected routes
    const isProtectedRoute =
      pathname.startsWith(ROUTES.HR) ||
      pathname.startsWith(ROUTES.ADMIN) ||
      pathname.startsWith(ROUTES.USER_DASHBOARD);

    if (isProtectedRoute) {
      // Not logged in
      if (!isAuthenticated) {
        router.push(ROUTES.LOGIN);
        return;
      }

      // No access to this route
      if (user?.role && !hasRouteAccess(user.role, pathname)) {
        router.push(ROUTES.ACCESS_DENIED);
      }
    }
  }, [pathname, loading, user, isAuthenticated, router]);

  if (loading) {
    return <LoadingScreen message="Đang khởi tạo hệ thống..." />;
  }

  return <>{children}</>;
}
