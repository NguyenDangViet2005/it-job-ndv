'use client'

import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { useState, useEffect, Fragment } from 'react'
import Link from 'next/link'
import { ModeToggle } from '@/components/features/toggle-theme'
import { useAuth } from '@/lib/hooks/useAuth'
import { AppLogo } from '@/components/common/app-logo'
import { navigationItems } from '@/constants/navigation.config'
import { NavigationLink } from '@/components/features/navigation/navigation-link'
import { UserDropdown } from '@/components/features/navigation/user-dropdown'
import { MobileMenu } from '@/components/features/navigation/mobile-menu'
import { useTheme } from 'next-themes'
import { ROUTES } from '@/constants'

const UserHeader = () => {
  const [scrolled, setScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Use isAuthenticated only after mount to prevent hydration mismatch
  const isLoggedIn = mounted ? isAuthenticated : false

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
  }

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300
        ${scrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm border-border/60"
          : "bg-background/60 backdrop-blur-sm border-border/30"
        }
      `}
    >
      <div className="w-[92%] max-w-[1400px] mx-auto px-2 lg:px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="pt-2 h-full flex items-center">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 cursor-target transition-transform hover:scale-105"
          >
            <AppLogo width={160} height={80} />
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
                              href={subItem.href || ''}
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
  )
}

export default UserHeader
