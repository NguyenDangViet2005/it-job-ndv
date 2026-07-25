"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function NavigationTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Không lưu các trang error vào history
    if (
      pathname &&
      !pathname.includes("/access-denied") &&
      !pathname.includes("/not-found")
    ) {
      // Lấy history hiện tại
      const stored = sessionStorage.getItem("nav_history");
      let history: string[] = [];

      if (stored) {
        try {
          history = JSON.parse(stored);
        } catch (e) {
          history = [];
        }
      }

      // Chỉ thêm nếu đường dẫn khác với trang cuối cùng trong history
      if (history.length === 0 || history[history.length - 1] !== pathname) {
        history.push(pathname);

        // Giới hạn history chỉ lưu 10 trang gần nhất
        if (history.length > 10) {
          history.shift();
        }

        // Lưu vào sessionStorage
        sessionStorage.setItem("nav_history", JSON.stringify(history));
      }
    }
  }, [pathname]);

  return null;
}
