import RegisterPage from "@/pages/auth/register.page";

export const metadata: Metadata = {
  title: "IT Job | Đăng Ký",
  description: "IT Job | Đăng Ký",
  icons: {
    icon: [
      { url: "/icons/icon.svg", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
  },
};

export default function Page() {
  return (
    <>
      <RegisterPage />
    </>
  );
}
