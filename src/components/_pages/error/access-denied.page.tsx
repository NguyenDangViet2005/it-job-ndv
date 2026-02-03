"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { ROUTES } from "@/constants";
import { useEffect, useState } from "react";

export default function AccessDeniedPage() {
  const router = useRouter();
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  useEffect(() => {
    // Lấy trang trước đó từ sessionStorage
    const stored = sessionStorage.getItem("nav_history");
    if (stored) {
      try {
        const history: string[] = JSON.parse(stored);
        // Lấy trang trước đó (không phải trang hiện tại)
        if (history.length >= 2) {
          setPreviousPath(history[history.length - 2]);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  const handleGoBack = () => {
    if (previousPath) {
      router.replace(previousPath);
    } else {
      handleGoHome();
    }
  };

  const handleGoHome = () => {
    // Redirect về trang chủ
    router.replace(ROUTES.HOME);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* Image */}
        <div className="flex justify-center">
          <Image
            src="/media/unauthorize.jpg"
            alt="403 Access Denied"
            width={700}
            height={500}
            className="object-contain"
            priority
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

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {previousPath && (
            <Button
              onClick={handleGoBack}
              size="lg"
              variant="outline"
              className="cursor-pointer px-8"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </Button>
          )}
          <Button
            onClick={handleGoHome}
            size="lg"
            className="cursor-pointer bg-primary-foreground hover:bg-primary/90 hover:text-primary-foreground text-primary px-8 border-primary border-1"
          >
            <Home className="w-5 h-5 mr-2" />
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
