import AccessDeniedPage from "@/pages/error/access-denied.page";

export const metadata: Metadata = {
  title: "IT Job | Truy cập bị từ chối",
  description: "IT Job | Truy cập bị từ chối",
  icons: {
    icon: [
      { url: "/icons/icon.svg", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
  },
};

export default function Page() {
  return <AccessDeniedPage />;
}
