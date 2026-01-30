"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/apis/auth.api";
import { companyApi } from "@/apis/company.api";
import { AuthContext } from "@/contexts/auth.context";
import { AuthGuard } from "@/routes/auth.guard";
import { ROUTES } from "@/configs";
import type { UserResponse, CompanyResponse } from "@/types/api.type";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize Auth (Silent Refresh)
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        // On init, no current token exists yet - backend will generate new one
        const response = await authApi.refreshToken();

        if (response.success && response.data) {
          const { accessToken, user: userData } = response.data;
          handleSetAuth(userData, accessToken);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Internal helper to set state and fetch extra data if needed
  const handleSetAuth = async (userData: UserResponse, accessToken: string) => {
    setUser(userData);
    setToken(accessToken);

    // Fetch company info if user is HR/Employer
    if (userData.role === "employer") {
      try {
        const companyData = await companyApi.getMyCompany(accessToken);
        if (companyData) {
          setCompany(companyData as CompanyResponse);
        }
      } catch (error) {
        console.error("Failed to fetch company info:", error);
      }
    }
  };

  // ============================================
  // PUBLIC ACTIONS (State Updates Only)
  // ============================================

  const setAuth = (userData: UserResponse, accessToken: string) => {
    handleSetAuth(userData, accessToken);
  };

  const handleSetCompany = (companyData: CompanyResponse) => {
    setCompany(companyData);
  };

  const updateUser = (userData: Partial<UserResponse>) => {
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
