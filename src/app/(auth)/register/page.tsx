import RegisterPage from "@/pages/auth/register.page";
import { getMetadata } from "@/utils";

export const metadata = getMetadata("IT Job | Đăng Ký");

export default function Page() {
  return (
    <>
      <RegisterPage />
    </>
  );
}
