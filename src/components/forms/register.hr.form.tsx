"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";

import {
  RegisterHRFormData,
  RegisterHRFormSchema,
} from "@/validations/register.validation";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/apis/auth.api";
import { locationApi } from "@/apis/location.api";
import type { ProvinceResponse, WardResponse } from "@/types/api.type";
import { Textarea } from "../ui/shadcn/textarea";
import { toast } from "sonner";

export default function FormRegisterHR() {
  const { setAuth, setCompany } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState<ProvinceResponse[]>([]);
  const [wards, setWards] = useState<WardResponse[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingWards, setLoadingWards] = useState(false);

  const form = useForm<RegisterHRFormData>({
    resolver: zodResolver(RegisterHRFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      gender: "",
      dateOfBirth: "",
      companyName: "",
      companyWebsite: "",
      companyHotline: "",
      companyEmail: "",
      companyDescription: "",
      companyFoundedYear: undefined,
      companyAddress: "",
      companyNationality: "",
      provinceId: 0,
      wardId: 0,
    },
  });

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const response = await locationApi.getProvinces();
        if (response.success && response.data) {
          setProvinces(response.data);
        }
      } catch (error) {
        console.error("Error loading provinces:", error);
      } finally {
        setLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, []);

  // Load wards when province changes
  const handleProvinceChange = async (provinceId: string) => {
    const id = parseInt(provinceId);
    form.setValue("provinceId", id);
    form.setValue("wardId", 0); // Reset ward
    setWards([]);

    if (id > 0) {
      try {
        setLoadingWards(true);
        const response = await locationApi.getWards(id);
        if (response.success && response.data) {
          setWards(response.data);
        }
      } catch (error) {
        console.error("Error loading wards:", error);
      } finally {
        setLoadingWards(false);
      }
    }
  };

  const onSubmit = async (values: RegisterHRFormData) => {
    setIsLoading(true);

    try {
      const response = await authApi.registerHR({
        ...values,
        companyWebsite: values.companyWebsite || undefined,
      });

      if (response.success && response.data) {
        const { user, accessToken, company } = response.data;

        setAuth(user, accessToken);
        if (company) setCompany(company);

        toast.success("Đăng ký nhà tuyển dụng thành công!");
        router.push("/hr");
      } else {
        toast.error(response.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error: any) {
      toast.error(error.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
        Đăng ký Nhà tuyển dụng
      </h1>
      <div className="w-full mt-5 ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
                Thông tin cá nhân
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nguyễn Văn A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input placeholder="hr@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại *</FormLabel>
                      <FormControl>
                        <Input placeholder="0987654321" {...field} />
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
                      <FormLabel>Mật khẩu *</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Company Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
                Thông tin công ty
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Company Name */}
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên công ty *</FormLabel>
                      <FormControl>
                        <Input placeholder="Công ty ABC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Company Website */}
                <FormField
                  control={form.control}
                  name="companyWebsite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Company Hotline */}
                <FormField
                  control={form.control}
                  name="companyHotline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hotline</FormLabel>
                      <FormControl>
                        <Input placeholder="1900 xxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Company Email */}
                <FormField
                  control={form.control}
                  name="companyEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email công ty</FormLabel>
                      <FormControl>
                        <Input placeholder="contact@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Company Nationality */}
                <FormField
                  control={form.control}
                  name="companyNationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quốc gia</FormLabel>
                      <FormControl>
                        <Input placeholder="Việt Nam" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Founded Year */}
                <FormField
                  control={form.control}
                  name="companyFoundedYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Năm thành lập</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="2020"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Company Description */}
              <FormField
                control={form.control}
                name="companyDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả công ty</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Giới thiệu về công ty của bạn..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
                Địa chỉ
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Province */}
                <FormField
                  control={form.control}
                  name="provinceId"
                  render={() => (
                    <FormItem>
                      <FormLabel>Tỉnh/Thành phố *</FormLabel>
                      <Select
                        onValueChange={handleProvinceChange}
                        disabled={loadingProvinces}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                loadingProvinces
                                  ? "Đang tải..."
                                  : "Chọn tỉnh/thành phố"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {provinces.map((province) => (
                            <SelectItem
                              key={province.id}
                              value={province.id.toString()}
                            >
                              {province.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Ward */}
                <FormField
                  control={form.control}
                  name="wardId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quận/Huyện *</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        disabled={loadingWards || wards.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                loadingWards
                                  ? "Đang tải..."
                                  : wards.length === 0
                                    ? "Vui lòng chọn tỉnh/thành phố"
                                    : "Chọn quận/huyện"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {wards.map((ward) => (
                            <SelectItem
                              key={ward.id}
                              value={ward.id.toString()}
                            >
                              {ward.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Detailed Address */}
              <FormField
                control={form.control}
                name="companyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ chi tiết</FormLabel>
                    <FormControl>
                      <Input placeholder="Số nhà, tên đường..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold disabled:opacity-50"
            >
              {isLoading ? "Đang đăng ký..." : "Đăng ký tài khoản HR"}
            </Button>

            {/* Link to user register */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
              Bạn là ứng viên?{" "}
              <a
                href="/register"
                className="text-green-600 dark:text-green-400 hover:underline"
              >
                Đăng ký tài khoản ứng viên
              </a>
            </p>

            {/* Link to login */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Đã có tài khoản?{" "}
              <a
                href="/login"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Đăng nhập ngay
              </a>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
