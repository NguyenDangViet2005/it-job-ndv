"use client";

import FormRegisterHR from "@/components/forms/register.hr.form";
import { Button } from "@/components/ui/shadcn/button";
import { ROUTES } from "@/configs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterHRPage() {
  const router = useRouter();

  return (
    <div className="relative z-10 w-full min-h-screen overflow-y-auto">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <Link href={ROUTES.WELCOME}>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
      </div>

      {/* Form Container */}
      <div className="w-full px-8 py-20 md:py-24">
        <div className="text-center space-y-3 mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold">
            <span className="bg-primary bg-clip-text text-transparent">
              Đăng ký tài khoản HR
            </span>
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Tuyển dụng nhân tài IT dễ dàng hơn bao giờ hết
          </p>
        </div>

        <FormRegisterHR />
      </div>
    </div>
  );
}
