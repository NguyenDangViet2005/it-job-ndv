"use client";

import FormRegisterHR from "@/components/forms/register.hr.form";
import { Button } from "@/components/ui/shadcn/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function RegisterHRPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full overflow-hidden py-8">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="bg-background/50 backdrop-blur-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>

      <div className="relative z-10 container mx-auto min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Illustration */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-6 animate-in fade-in slide-in-from-left duration-1000">
            <div className="w-full max-w-md">
              <DotLottieReact src="/actionImage.lottie" loop autoplay />
            </div>

            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold leading-snug">
                <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Tuyển dụng nhân tài IT
                </span>
                <br />
                <span className="text-white/80">
                  dễ dàng hơn bao giờ hết 🚀
                </span>
              </h1>

              <p className="text-center max-w-md mx-auto text-white/80">
                Đăng ký tài khoản nhà tuyển dụng để tiếp cận hàng ngàn ứng viên
                IT tiềm năng và xây dựng đội ngũ mơ ước.
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Đăng tin tuyển dụng miễn phí
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Tiếp cận ứng viên chất lượng
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Quản lý hồ sơ dễ dàng
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex items-center justify-center animate-in fade-in slide-in-from-right duration-1000">
            <div className="w-full max-w-2xl">
              <FormRegisterHR />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
