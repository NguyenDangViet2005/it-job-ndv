import { Suspense } from "react";
import SecurityPage from "@/components/_pages/error/security.page";
import { getMetadata } from "@/utils/metadata";

export const metadata = getMetadata({
  title: "Cảnh Báo Bảo Mật & Giới Hạn Tần Suất | IT Job",
  description: "Yêu cầu của bạn tạm thời bị từ chối do phát hiện dấu hiệu truy cập vượt quá giới hạn.",
  noIndex: true,
});

export default function SecurityBlockedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">Đang tải...</div>}>
      <SecurityPage />
    </Suspense>
  );
}

