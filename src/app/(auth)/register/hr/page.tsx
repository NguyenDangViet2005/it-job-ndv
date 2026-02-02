import RegisterHRPage from "@/_pages/auth/register.hr.page";
import { getMetadata } from "@/utils";

export const metadata = getMetadata("IT Job | Đăng Ký HR");

export default function Page() {
  return (
    <>
      <RegisterHRPage />
    </>
  );
}
