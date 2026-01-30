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
import { FcGoogle } from "react-icons/fc";
import {
  RegisterFormData,
  RegisterFormSchema,
} from "@/validations/register.validation";
import { authApi } from "@/apis/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/configs";
import { toast } from "sonner";

export default function FormRegister() {
  const router = useRouter();
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
    setIsLoading(true);

    // Filter out empty string values for dateOfBirth
    const payload = {
      ...values,
      dateOfBirth: values.dateOfBirth === "" ? undefined : values.dateOfBirth,
      gender: values.gender === "" ? undefined : values.gender,
    };

    try {
      const response = await authApi.registerUser(payload);

      if (response.success) {
        toast.success("Đăng ký thành công!");
        router.push(ROUTES.LOGIN);
      } else {
        toast.error(response.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error: any) {
      toast.error(error.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    // Ở đây bạn có thể gọi API đăng ký bằng Google
  };

  return (
    <Card className="w-full max-w-md p-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary dark:text-gray-100">
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
            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="cursor-target w-full h-9 bg-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="cursor-target text-primary hover:underline"
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
