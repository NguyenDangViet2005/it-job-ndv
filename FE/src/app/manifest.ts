import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IT Job - Nền tảng tuyển dụng công việc IT hàng đầu",
    short_name: "IT Job",
    description: "Tìm kiếm công việc IT mơ ước và kết nối với các nhà tuyển dụng hàng đầu tại Việt Nam.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0284c7",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/icon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
