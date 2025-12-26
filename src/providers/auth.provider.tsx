"use client";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi } from "@/apis/auth.api";
import { companyApi } from "@/apis/company.api";
import type {
  UserResponse,
  RegisterRequest,
  RegisterHRRequest,
  CompanyResponse,
} from "@/types/api.type";
import Routes from "@/routes";

// JWT Payload interface based on your token structure
interface JwtPayload {
  nameid: string;
  email: string;
  unique_name: string;
  role: string;
  nbf: number;
  exp: number;
  iat: number;
  iss: string;
  aud: string;
}

interface AuthContextType {
  user: UserResponse | null;
  company: CompanyResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; role?: string; error?: string }>;
  registerUser: (
    data: RegisterRequest
  ) => Promise<{ success: boolean; error?: string }>;
  registerHR: (
    data: RegisterHRRequest
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<UserResponse>) => void;
  loading: boolean;
  getRedirectPath: (role: string) => string;
  checkRouteAccess: (pathname: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to check if user has access to a specific route based on role
const hasRouteAccess = (role: string | undefined, pathname: string): boolean => {
  if (!role) return false;

  const normalizedRole = role.toLowerCase().trim();

  // Admin can ONLY access /admin/*
  if (normalizedRole === "admin") {
    if (pathname.startsWith("/admin")) {
      return true;
    }
    // Admin cannot access /hr or other routes
    if (pathname.startsWith("/hr")) {
      return false;
    }
    return true; // Can access public routes
  }

  // Employer/HR can ONLY access /hr/* (NOT /admin/*)
  if (normalizedRole === "employer" || normalizedRole === "hr") {
    if (pathname.startsWith("/admin")) {
      return false;
    }
    if (pathname.startsWith("/hr")) {
      return true;
    }
    return true; // Can access public routes
  }

  // User can NOT access /hr/* and /admin/*
  if (normalizedRole === "user") {
    if (pathname.startsWith("/hr") || pathname.startsWith("/admin")) {
      return false;
    }
    return true;
  }

  return false;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [jwtPayload, setJwtPayload] = useState<JwtPayload | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage for existing session (only in browser)
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("userInfo");
      const storedCompany = localStorage.getItem("company");
      const storedToken = localStorage.getItem("accessToken");

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        
        // Decode JWT token
        try {
          const decoded = jwtDecode<JwtPayload>(storedToken);
          setJwtPayload(decoded);
        } catch (error) {
          console.error("Failed to decode JWT token:", error);
        }

        // If user is HR/Employer but company is missing, fetch it
        if ((parsedUser.role === 'employer' || parsedUser.role === 'hr') && !storedCompany) {
          companyApi.getMyCompany(storedToken)
            .then((companyData) => {
              if (companyData) {
                setCompany(companyData);
                localStorage.setItem("company", JSON.stringify(companyData));
              }
            })
            .catch((err) => console.error("Failed to fetch company info:", err));
        }
      }
      if (storedCompany) {
        setCompany(JSON.parse(storedCompany));
      }
    }

    setLoading(false);
  }, []);

  // Route protection effect
  useEffect(() => {
    if (loading || !pathname) return;

    // Don't check access-denied page itself
    if (pathname === "/access-denied") return;

    // Only check protected routes
    if (pathname.startsWith("/hr") || pathname.startsWith("/admin")) {
      const role = jwtPayload?.role || user?.role;

      if (!token || !role) {
        // Not logged in, redirect to login
        router.push("/login");
        return;
      }

      if (!hasRouteAccess(role, pathname)) {
        // No access, redirect to access denied page
        router.push("/access-denied");
      }
    }
  }, [pathname, loading, jwtPayload, user, token, router]);

  // Check if current user has access to a specific route
  const checkRouteAccess = (routePath: string): boolean => {
    const role = jwtPayload?.role || user?.role;
    return hasRouteAccess(role, routePath);
  };

  // Helper function to get redirect path based on role
  const getRedirectPath = (role: string): string => {
    switch (role) {
      case "admin":
        return "/admin";
      case "hr":
      case "employer":
        return "/hr";
      case "user":
      default:
        return Routes.home;
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; role?: string; error?: string }> => {
    try {
      const response = await authApi.login({ email, password });

      if (response.success && response.data) {
        const { accessToken, refreshToken, user: userData } = response.data;

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("userInfo", JSON.stringify(userData));
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
        }

        setUser(userData);
        setToken(accessToken);

        // If user is HR/Employer, fetch company info
        if (userData.role === 'employer' || userData.role === 'hr') {
          try {
            const companyData = await companyApi.getMyCompany(accessToken);
            if (companyData) {
              setCompany(companyData);
              if (typeof window !== "undefined") {
                localStorage.setItem("company", JSON.stringify(companyData));
              }
            }
          } catch (error) {
            console.error("Failed to fetch company info after login:", error);
          }
        }

        // Decode JWT token immediately after login
        try {
          const decoded = jwtDecode<JwtPayload>(accessToken);
          setJwtPayload(decoded);
        } catch (error) {
          console.error("Failed to decode JWT token on login:", error);
        }

        return { success: true, role: userData.role };
      }

      return {
        success: false,
        error: response.message || "Đăng nhập thất bại",
      };
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.message || "Email hoặc mật khẩu không đúng",
      };
    }
  };

  const registerUser = async (
    data: RegisterRequest
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.registerUser(data);

      if (response.success && response.data) {
        const { accessToken, refreshToken, user: userData } = response.data;

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("userInfo", JSON.stringify(userData));
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
        }

        setUser(userData);
        setToken(accessToken);

        // Redirect to home for regular users
        router.push(Routes.home);

        return { success: true };
      }

      return { success: false, error: response.message || "Đăng ký thất bại" };
    } catch (error: any) {
      console.error("Register user error:", error);
      return {
        success: false,
        error: error.message || "Đăng ký thất bại. Vui lòng thử lại.",
      };
    }
  };

  const registerHR = async (
    data: RegisterHRRequest
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.registerHR(data);

      if (response.success && response.data) {
        const {
          accessToken,
          refreshToken,
          user: userData,
          company: companyData,
        } = response.data;

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("userInfo", JSON.stringify(userData));
          localStorage.setItem("company", JSON.stringify(companyData));
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
        }

        setUser(userData);
        setCompany(companyData);
        setToken(accessToken);

        // Redirect to HR dashboard
        router.push("/hr");

        return { success: true };
      }

      return { success: false, error: response.message || "Đăng ký thất bại" };
    } catch (error: any) {
      console.error("Register HR error:", error);
      return {
        success: false,
        error: error.message || "Đăng ký thất bại. Vui lòng thử lại.",
      };
    }
  };

  const logout = () => {
    // Remove from localStorage (only in browser)
    if (typeof window !== "undefined") {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("company");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    setUser(null);
    setCompany(null);
    setToken(null);
    router.push("/");
  };

  // Update user data (for avatar, cover image, etc.)
  const updateUser = (userData: Partial<UserResponse>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedUser = { ...prev, ...userData };
      // Also update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      }
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        token,
        isAuthenticated: !!user && !!token,
        login,
        registerUser,
        registerHR,
        logout,
        updateUser,
        loading,
        getRedirectPath,
        checkRouteAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
