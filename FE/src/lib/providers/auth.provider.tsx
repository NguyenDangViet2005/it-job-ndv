"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/apis/auth.api";
import { companyApi } from "@/apis/company.api";
import { AuthContext } from "@/lib/contexts/auth.context";
import { AuthGuard } from "../guards/auth.guard";
import { ROUTES } from "@/constants";
import { Company, User } from "@/types";

let isGlobalAuthInitStarted = false;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize Auth (Silent Refresh) - Chạy ngầm 1 lần duy nhất ngay khi ứng dụng mount
  // (kể cả ở trang Welcome) để đánh thức server sớm và sẵn sàng trạng thái đăng nhập trước khi chuyển trang
  useEffect(() => {
    // Module-level guard: Chống chạy lặp do React StrictMode hoặc re-mount component
    if (isGlobalAuthInitStarted) return;
    isGlobalAuthInitStarted = true;

    const initAuth = async () => {
      if (
        typeof window !== "undefined" &&
        (window.location.pathname.startsWith("/callback") ||
          window.location.pathname.startsWith("/security-blocked"))
      ) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // On init, no current token exists yet - backend will generate new one
        const response = await authApi.refreshtoken();

        if (response.success && response.data) {
          const { accesstoken, user: userData } = response.data;
          handleSetAuth(userData, accesstoken);
        }
      } catch {
        // Token không tồn tại hoặc hết hạn, tiếp tục với quyền khách
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Tự động làm mới access token định kỳ (mỗi 10 phút, trước khi token 15 phút hết hạn)
  useEffect(() => {
    if (!token) return;

    const refreshInterval = setInterval(async () => {
      try {
        const response = await authApi.refreshtoken();
        if (response.success && response.data) {
          setToken(response.data.accesstoken);
          if (response.data.user) {
            setUser(response.data.user);
          }
        }
      } catch (err) {
        console.warn("Silent token refresh failed:", err);
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [token]);

  // Internal helper to set state and fetch extra data if needed
  const handleSetAuth = async (userData: User, accesstoken: string) => {
    setUser(userData);
    setToken(accesstoken);

    // Fetch company info if user is HR/Employer
    if (userData.role === "employer") {
      try {
        const companyData = await companyApi.getMyCompany(accesstoken);
        if (companyData) {
          setCompany(companyData as Company);
        }
      } catch (error) {
        console.error("Failed to fetch company info:", error);
      }
    }
  };

  // ============================================
  // PUBLIC ACTIONS (State Updates Only)
  // ============================================

  const setAuth = (userData: User, accesstoken: string) => {
    handleSetAuth(userData, accesstoken);
  };

  const handleSetCompany = (companyData: Company) => {
    setCompany(companyData);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ...userData };
    });
  };

  const logout = () => {
    // We can call API purely for server-side cookie clearing,
    // but we don't await blocking the UI.
    authApi.logout().catch((err) => console.error("Logout api failed", err));

    // Clear Client State
    setUser(null);
    setCompany(null);
    setToken(null);
    isGlobalAuthInitStarted = false;

    router.push(ROUTES.HOME);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        setAuth,
        setCompany: handleSetCompany,
        updateUser,
        logout,
      }}
    >
      <AuthGuard>{children}</AuthGuard>
    </AuthContext.Provider>
  );
}
