import RegisterHRPage from "@/components/_pages/auth/register.hr.page";
import { getMetadata } from "@/utils/metadata";

export const metadata = getMetadata({
  title: "Đăng ký Nhà tuyển dụng (HR) | IT Job",
  description: "Đăng ký tài khoản Nhà tuyển dụng HR để tìm kiếm và tuyển dụng nhân tài IT dễ dàng.",
});

export default function Page() {
  return <RegisterHRPage />;
}
