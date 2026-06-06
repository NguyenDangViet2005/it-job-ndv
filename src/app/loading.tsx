"use client";

import LoadingScreen from "@/components/common/loading-screen";

export default function Loading() {
  return <LoadingScreen fullScreen={true} message="Đang tải dữ liệu..." />;
}
