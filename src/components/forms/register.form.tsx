"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/shadcn/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { FcGoogle } from "react-icons/fc";
import { authApi } from "@/apis/auth.api";
import {
  RegisterFormData,
  RegisterFormSchema,
} from "@/validations/register.validation";
import { useAuth } from "@/providers/auth.provider";
import Routes from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";

export default function FormRegister() {
  const { registerUser } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      gender: "",
      dateOfBirth: "",
    },
  });

  const onSubmit = async (values: RegisterFormData) => {
    setError("");
    setIsLoading(true);

    const result = await registerUser(values);

    if (result.success) {
      router.push(Routes.login);
    } else {
      setError(result.error || "Đăng ký thất bại. Vui lòng thử lại.");
    }

    setIsLoading(false);
  };

  const handleGoogleRegister = () => {
    console.log("Google register clicked");
    // Ở đây bạn có thể gọi API đăng ký bằng Google
  };

  return (
    <Card className="w-full max-w-md p-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Đăng ký Ứng viên
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Họ và tên</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập họ và tên"
                      className="h-9"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email & Phone - Grid 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        className="h-9"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Số điện thoại</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập số điện thoại"
                        className="h-9"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="cursor-target w-full h-9 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>

            {/* Divider */}
            <div className="flex items-center my-3">
              <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
              <span className="px-2 text-xs text-gray-500 dark:text-gray-400">
                hoặc
              </span>
              <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
            </div>

            {/* Google Register */}
            <Button
              type="button"
              onClick={handleGoogleRegister}
              variant="outline"
              className="cursor-target w-full h-9 flex items-center justify-center gap-2 border-gray-300 dark:border-gray-700"
            >
              <FcGoogle className="cursor-target text-lg" />
              <span className="text-sm">Đăng ký bằng Google</span>
            </Button>

            {/* Link to HR register */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
              Bạn là nhà tuyển dụng?{" "}
              <a
                href="/register/hr"
                className="cursor-target text-green-600 dark:text-green-400 hover:underline"
              >
                Đăng ký tài khoản HR
              </a>
            </p>

            {/* Link phụ */}
            <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-2">
              Đã có tài khoản?{" "}
              <a
                href="/login"
                className="cursor-target text-blue-600 dark:text-blue-400 hover:underline"
              >
                Đăng nhập ngay
              </a>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
