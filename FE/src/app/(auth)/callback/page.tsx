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

    const code = searchParams.get("code");
    const token = searchParams.get("token");
    const refreshtoken = searchParams.get("refreshtoken");

    if (!code && !token) {
      toast.error("Đăng nhập thất bại. Không tìm thấy mã xác thực.");
      router.push("/login");
      return;
    }

    const handleCallback = async () => {
      try {
        // Flow 1: Đổi mã One-Time Code lấy tokens (Chuẩn bảo mật OAuth2)
        if (code) {
          const res = await authApi.exchangeCode(code);
          if (res?.data?.accesstoken && res?.data?.user) {
            setAuth(res.data.user, res.data.accesstoken);
            toast.success("Đăng nhập tài khoản thành công!");

            // Xóa sạch query string trên URL để không lưu vết trong lịch sử trình duyệt
            window.history.replaceState({}, document.title, window.location.pathname);

            const redirectPath =
              res.data.user.role === "user"
                ? ROUTES.HOME
                : getRedirectPathByRole(res.data.user.role);
            router.push(redirectPath);
            return;
          }
        }

        // Flow 2: Tương thích ngược với direct token (nếu có)
        if (token) {
          if (refreshtoken) {
            try {
              await authApi.setCookie(refreshtoken);
            } catch (cookieErr) {
              console.error("Failed to set refresh token cookie via endpoint:", cookieErr);
            }
          }

          const decoded: any = jwtDecode(token);
          const userId = decoded.id;
          const response = await userApi.getById(userId, token);

          if (response) {
            setAuth(response, token);
            toast.success("Đăng nhập tài khoản thành công!");

            window.history.replaceState({}, document.title, window.location.pathname);

            const redirectPath =
              response.role === "user" ? ROUTES.HOME : getRedirectPathByRole(response.role);
            router.push(redirectPath);
            return;
          }
        }

        toast.error("Đăng nhập thất bại. Không thể tải thông tin người dùng.");
        router.push("/login");
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
