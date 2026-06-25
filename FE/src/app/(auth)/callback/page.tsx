"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { userApi } from "@/apis/user.api";
import { authApi } from "@/apis/auth.api";
import { getRedirectPathByRole } from "@/helpers/permission.helper";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuth();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const token = searchParams.get("token");
    const refreshtoken = searchParams.get("refreshtoken");

    if (!token) {
      toast.error("Đăng nhập thất bại. Không tìm thấy token.");
      router.push("/login");
      return;
    }

    const handleCallback = async () => {
      try {
        // Set refresh token cookie from frontend if provided
        if (refreshtoken) {
          try {
            await authApi.setCookie(refreshtoken);
          } catch (cookieErr) {
            console.error("Failed to set refresh token cookie via endpoint:", cookieErr);
          }
        }

        // Decode token to get user id
        const decoded: any = jwtDecode(token);
        const userId = decoded.id;

        // Fetch user data
        const response = await userApi.getById(userId, token);
        
        if (response) {
          // Set auth state
          setAuth(response, token);
          toast.success("Đăng nhập bằng Facebook thành công!");
          
          const redirectPath = getRedirectPathByRole(response.role);
          router.push(redirectPath);
        } else {
          toast.error("Đăng nhập thất bại. Không thể tải thông tin người dùng.");
          router.push("/login");
        }
      } catch (error: any) {
        console.error("Auth callback error:", error);
        toast.error("Đăng nhập thất bại. Lỗi xác thực tài khoản.");
        router.push("/login");
      }
    };

    handleCallback();
  }, [searchParams, router, setAuth]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-gray-500 dark:text-gray-400 animate-pulse">
        Đang đồng bộ hóa tài khoản Facebook...
      </p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-gray-500 dark:text-gray-400">Đang tải...</p>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
