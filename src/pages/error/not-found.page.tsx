"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/shadcn/button";
import { ArrowLeft, Home } from "lucide-react";
import Image from "next/image";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* Image */}
        <div className="flex justify-center">
          <Image
            src="/media/notfound.jpg"
            alt="404 Not Found"
            width={700}
            height={500}
            className="object-contain"
            priority
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
