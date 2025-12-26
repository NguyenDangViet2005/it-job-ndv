"use client";

import FormLogin from "@/components/forms/login.form";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "@/components/ui/shadcn/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full overflow-hidden ">
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

      <div className="relative z-10 container mx-auto h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Illustration */}
          <div className="hidden md:flex flex-col items-center justify-center space-y-6 animate-in fade-in slide-in-from-left duration-1000">
            <div className="w-full max-w-md">
              <DotLottieReact src="actionImage.lottie" loop autoplay />
            </div>

            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold leading-snug">
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Kết nối nhân tài IT
                </span>
                <br />
                <span className="text-white/80">
                  với những cơ hội tuyệt vời 🚀
                </span>
              </h1>

              <p className="text-center max-w-md mx-auto text-white/80">
                Hãy đăng nhập để tiếp tục hành trình tuyển dụng hoặc tìm kiếm
                công việc mơ ước.
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex items-center justify-center animate-in fade-in slide-in-from-right duration-1000">
            <div className="w-full max-w-md">
              <FormLogin />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
