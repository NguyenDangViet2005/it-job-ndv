"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { userApi } from "@/apis/user.api";
import { authApi } from "@/apis/auth.api";
import { getRedirectPathByRole } from "@/helpers/permission.helper";
import { ROUTES } from "@/constants";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import LoadingScreen from "@/components/common/loading/loading-screen";

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
          toast.success("Đăng nhập tài khoản thành công!");
          
          const redirectPath = response.role === "user" ? ROUTES.HOME : getRedirectPathByRole(response.role);
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

  return <LoadingScreen message="Đang xử lý đồng bộ hóa tài khoản và đăng nhập..." fullScreen={true} />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Đang tải..." fullScreen={true} />}>
      <CallbackContent />
    </Suspense>
  );
}
