import type { Metadata } from "next";
import LoginPage from "@/pages/auth/login.page";

export const metadata: Metadata = {
  title: "IT Job | Đăng Nhập",
  description: "IT Job | Đăng Nhập",
  icons: {
    icon: [
      { url: "/icons/icon.svg", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
  },
};

export default function Page() {
  return <LoginPage />;
}
