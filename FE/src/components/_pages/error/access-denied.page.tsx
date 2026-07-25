"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LottieAnimation } from "@/components/common/lottie-animation";

export default function AccessDeniedPage() {
  const router = useRouter();

  const handleGoBack = () => {
    // Với render inline, router.back() sẽ thực sự đưa người dùng về trang trước đó trong lịch sử trình duyệt
    router.back();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* Lottie Animation */}
        <div className="flex justify-center">
          <LottieAnimation
            src="/media/access-denied.json"
            className="w-full max-w-md h-80"
          />
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground/90">
            Truy cập bị từ chối
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Bạn không có quyền truy cập vào trang này. Khu vực này chỉ dành cho
            người dùng được ủy quyền.
          </p>
        </div>

        {/* Centered Single Back Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleGoBack}
            size="lg"
            className="cursor-pointer bg-primary-foreground hover:bg-primary/90 hover:text-primary-foreground text-primary px-8 border-primary border-1"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Trở lại
          </Button>
        </div>
      </div>
    </div>
  );
}
