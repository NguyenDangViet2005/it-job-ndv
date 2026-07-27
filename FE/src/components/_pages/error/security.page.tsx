"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LottieAnimation } from "@/components/common/lottie-animation";

export default function SecurityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryMessage = searchParams.get("message");

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* Lottie Animation */}
        <div className="flex justify-center">
          <LottieAnimation
            src="/media/security.json"
            className="w-full max-w-md h-80"
          />
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground/90">
            Hạn chế truy cập bảo mật
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {queryMessage ||
              "Bạn đã thực hiện quá nhiều yêu cầu xác thực. Vui lòng thử lại sau 15 phút để bảo đảm an toàn."}
          </p>
        </div>

        {/* Centered Home Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleGoHome}
            size="lg"
            className="cursor-pointer bg-primary-foreground hover:bg-primary/90 hover:text-primary-foreground text-primary px-8 border-primary border-1"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
