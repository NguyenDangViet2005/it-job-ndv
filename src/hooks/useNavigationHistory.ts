"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function useNavigationHistory() {
  const pathname = usePathname();
  const historyRef = useRef<string[]>([]);

  useEffect(() => {
    // Không lưu các trang error vào history
    if (pathname && !pathname.includes("/access-denied") && !pathname.includes("/not-found")) {
      // Thêm pathname vào history
      historyRef.current.push(pathname);
      
      // Giới hạn history chỉ lưu 10 trang gần nhất
      if (historyRef.current.length > 10) {
        historyRef.current.shift();
      }
      
      // Lưu vào sessionStorage để persist khi refresh
      sessionStorage.setItem("nav_history", JSON.stringify(historyRef.current));
    }
  }, [pathname]);

  const getPreviousPath = (): string | null => {
    // Lấy từ sessionStorage nếu có
    const stored = sessionStorage.getItem("nav_history");
    if (stored) {
      try {
        historyRef.current = JSON.parse(stored);
      } catch (e) {
        // Ignore parse errors
      }
    }

    // Lấy trang trước đó (bỏ qua trang hiện tại)
    if (historyRef.current.length >= 2) {
      return historyRef.current[historyRef.current.length - 2];
    }
    
    return null;
  };

  const clearHistory = () => {
    historyRef.current = [];
    sessionStorage.removeItem("nav_history");
  };

  return { getPreviousPath, clearHistory };
}
