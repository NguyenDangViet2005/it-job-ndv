"use client";

import FormRegister from "@/components/forms/register.form";
import { Button } from "@/components/ui/shadcn/button";
import { ROUTES } from "@/configs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token) {
      router.push(ROUTES.HOME);
    }
  }, [token, loading, router]);

  if (loading || token) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
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

      {/* Left Side - Video */}
      <div className="w-full lg:w-1/2 min-h-[40vh] lg:min-h-screen flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-2xl aspect-video overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/media/welcome.mp4" type="video/mp4" />
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
              Video Loading...
            </div>
          </video>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 min-h-[60vh] lg:min-h-screen flex flex-col items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <p className="text-gray-700 dark:text-gray-300 text-sm lg:text-base">
              Khám phá cơ hội nghề nghiệp, kết nối và học hỏi cùng cộng đồng IT
              hàng đầu
            </p>
          </div>

          {/* Register Form */}
          <FormRegister />
        </div>
      </div>
    </div>
  );
}
