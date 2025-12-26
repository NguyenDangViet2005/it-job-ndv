"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/shadcn/button";
import { Search, Home, Code2 } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-950 p-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Code Icon */}
        <div className="flex justify-center">
          <Code2 className="w-16 h-16 text-cyan-500" strokeWidth={2} />
        </div>

        {/* 404 Number */}
        <h1 className="text-8xl font-bold text-cyan-500">404</h1>

        {/* Title */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300">
            Không tìm thấy trang
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại. Vui lòng kiểm tra
            lại đường dẫn URL.
          </p>
        </div>

        {/* Search Box */}
        <div className="flex gap-2 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Tìm kiếm công việc..."
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                router.push(`/jobs?search=${e.currentTarget.value.trim()}`);
              }
            }}
          />
          <Button
            onClick={() => {
              const input = document.querySelector("input");
              if (input?.value.trim()) {
                router.push(`/jobs?search=${input.value.trim()}`);
              }
            }}
            className="px-6 bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Home Button */}
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className="border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          <Home className="w-4 h-4 mr-2" />
          Về trang chủ
        </Button>
      </div>
    </div>
  );
}
