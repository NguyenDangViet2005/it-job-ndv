"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { LoginFormData, loginFormSchema } from "@/validators/login.validation";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { authApi } from "@/apis/auth.api";
import { getRedirectPathByRole } from "@/helpers/permission.helper";
import { toast } from "sonner";

export default function FormLogin() {
  const { setAuth } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    setIsLoading(true);

    try {
      const response = await authApi.login({
        email: values.email,
        password: values.password,
      });

      if (response.success && response.data) {
        const { user, accesstoken } = response.data;

        // Set auth state
        setAuth(user, accesstoken);

        toast.success("Đăng nhập thành công!");

        // Redirect based on role
        const redirectPath = getRedirectPathByRole(user.role);
        router.push(redirectPath);
      } else {
        toast.error(response.message || "Đăng nhập thất bại");
      }
    } catch (error: any) {
      toast.error(error.message || "Email hoặc mật khẩu không đúng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Ở đây bạn có thể gọi API đăng nhập Google
  };

  return (
    <Card className="w-full max-w-md p-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-center text-primary dark:text-gray-100">
          Đăng nhập
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      className="h-9"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-9"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="cursor-target w-full h-9 bg-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            {/* Divider */}
            <div className="flex items-center my-3">
              <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
              <span className="px-2 text-xs text-gray-500 dark:text-gray-400">
                hoặc
              </span>
              <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
            </div>

            {/* Google Login */}
            <Button
              type="button"
              onClick={handleGoogleLogin}
              variant="outline"
              className="cursor-target w-full h-9 flex items-center justify-center gap-2 border-gray-300 dark:border-gray-700"
            >
              <FcGoogle className="cursor-target text-lg" />
              <span className="text-sm">Đăng nhập bằng Google</span>
            </Button>

            {/* Link phụ */}
            <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-2">
              Chưa có tài khoản?{" "}
              <a
                href="/register"
                className="cursor-target text-primary hover:underline"
              >
                Đăng ký ngay
              </a>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
