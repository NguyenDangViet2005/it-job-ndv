"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/apis/auth.api";
import { companyApi } from "@/apis/company.api";
import { AuthContext } from "@/lib/contexts/auth.context";
import { AuthGuard } from "../guards/auth.guard"; 
import { ROUTES } from "@/constants";
import { Company, User } from "@/types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize Auth (Silent Refresh)
  useEffect(() => {
    const initAuth = async () => {
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/callback")) {
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
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

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
