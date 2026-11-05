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

  const isProtectedRoute = Boolean(
    pathname &&
      (pathname.startsWith('/hr') ||
        pathname.startsWith('/admin') ||
        pathname.startsWith(ROUTES.USER_DASHBOARD))
  )

  const isQARoute = Boolean(
    pathname &&
      (pathname === ROUTES.QA || pathname.startsWith(ROUTES.QA + '/'))
  )

  const requiresAuthCheck = isProtectedRoute || isQARoute

  useEffect(() => {
    if (loading || !pathname) return

    // Don't check on welcome page or access-denied page
    if (pathname === '/' || pathname === ROUTES.WELCOME || pathname === ROUTES.ACCESS_DENIED) return

    if (isProtectedRoute) {
      // Not logged in -> Redirect to login page
      if (!isAuthenticated) {
        router.push(ROUTES.LOGIN)
        return
      }
    }
  }, [pathname, loading, isAuthenticated, isProtectedRoute, router])

  // Chỉ hiện LoadingScreen toàn màn hình đối với các route bắt buộc kiểm tra quyền (Protected / QA).
  // Các trang Public (Welcome, Trang chủ, Việc làm, Công ty, Bài viết...) render ngay lập tức không bị chặn.
  if (loading && requiresAuthCheck) {
    return <LoadingScreen message="Đang tải...." />
  }

  // Check route permissions sau khi hoàn tất xác thực
  if (!loading && pathname) {
    // 1. Kiểm tra trang Hỏi đáp (QA) - nếu chưa đăng nhập thì trả về trang unauthorize (AccessDeniedPage)
    if (isQARoute && !isAuthenticated) {
      return <AccessDeniedPage />
    }

    // 2. Chặn hiển thị nội dung Protected Route trong lúc chờ router.push chuyển về trang đăng nhập
    if (isProtectedRoute && !isAuthenticated) {
      return <LoadingScreen message="Đang chuyển hướng..." />
    }

    // 3. Check role permissions for administrative routes
    if (isProtectedRoute && user?.role && !hasRouteAccess(user.role, pathname)) {
      // Render Access Denied inline at the same URL (no router redirect)
      return <AccessDeniedPage />
    }
  }

  return <>{children}</>
}
