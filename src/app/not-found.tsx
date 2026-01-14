import NotFoundPage from "@/pages/error/not-found.page";

export const metadata: Metadata = {
  title: "IT Job | Không tìm thấy trang",
  description: "IT Job | Không tìm thấy trang",
  icons: {
    icon: [
      { url: "/icons/icon.svg", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
  },
};

export default function NotFound() {
  return <NotFoundPage />;
}
