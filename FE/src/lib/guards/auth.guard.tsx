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

    // Don't check access-denied page itself if accessed directly
    if (pathname === ROUTES.ACCESS_DENIED) return

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

  if (loading) {
    return <LoadingScreen message="Đang tải...." />
  }

  // Check route permissions when authenticated
  if (pathname) {
    const isProtectedRoute =
      pathname.startsWith("/hr") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith(ROUTES.USER_DASHBOARD)

    if (isProtectedRoute && user?.role && !hasRouteAccess(user.role, pathname)) {
      // Render Access Denied inline at the same URL (no router redirect)
      return <AccessDeniedPage />
    }
  }

  return <>{children}</>
}
