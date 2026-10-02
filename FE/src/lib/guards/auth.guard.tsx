'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '@/constants'
import { hasRouteAccess } from '@/utils/auth'
import LoadingScreen from '@/components/common/loading/loading-screen'
import AccessDeniedPage from '@/components/_pages/error/access-denied.page'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading || !pathname) return

    // Don't check on welcome page or access-denied page
    if (pathname === '/' || pathname === ROUTES.WELCOME || pathname === ROUTES.ACCESS_DENIED) return

    // Check protected routes
    const isProtectedRoute =
      pathname.startsWith("/hr") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith(ROUTES.USER_DASHBOARD)

    if (isProtectedRoute) {
      // Not logged in -> Redirect to login page
      if (!isAuthenticated) {
        router.push(ROUTES.LOGIN)
        return
      }
    }
  }, [pathname, loading, isAuthenticated, router])

  // Không check và không hiện LoadingScreen ở trang Welcome để tối ưu UX lần đầu vào web
  if (pathname === '/' || pathname === ROUTES.WELCOME) {
    return <>{children}</>;
  }

  if (loading) {
    return <LoadingScreen message="Đang tải...." />
  }

  // Check route permissions
  if (pathname) {
    // 1. Kiểm tra trang Hỏi đáp (QA) - nếu chưa đăng nhập thì trả về trang unauthorize (AccessDeniedPage)
    const isQARoute = pathname === ROUTES.QA || pathname.startsWith(ROUTES.QA + '/');
    if (isQARoute && !isAuthenticated) {
      return <AccessDeniedPage />;
    }

    // 2. Check role permissions for administrative routes
    const isProtectedRoute =
      pathname.startsWith("/hr") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith(ROUTES.USER_DASHBOARD);

    if (isProtectedRoute && user?.role && !hasRouteAccess(user.role, pathname)) {
      // Render Access Denied inline at the same URL (no router redirect)
      return <AccessDeniedPage />;
    }
  }

  return <>{children}</>
}
