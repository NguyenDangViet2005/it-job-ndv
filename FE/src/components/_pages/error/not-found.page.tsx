"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LottieAnimation } from "@/components/common/lottie-animation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* Lottie Animation */}
        <div className="flex justify-center">
          <LottieAnimation
            src="/media/lonely-404.json"
            className="w-full max-w-md h-80"
          />
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground/90">
            Không tìm thấy trang
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
        </div>

        {/* Home Button */}
        <Button
          onClick={router.back}
          size="lg"
          className="cursor-pointer bg-primary-foreground hover:bg-primary/90 hover:text-primary-foreground text-primary px-8 border-primary border-1"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Trở lại
        </Button>
      </div>
    </div>
  );
}
