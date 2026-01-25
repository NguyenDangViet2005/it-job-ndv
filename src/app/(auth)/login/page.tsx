import { getMetadata } from "@/utils";
import LoginPage from "@/pages/auth/login.page";

export const metadata = getMetadata("IT Job | Đăng Nhập");

export default function Page() {
  return <LoginPage />;
}
