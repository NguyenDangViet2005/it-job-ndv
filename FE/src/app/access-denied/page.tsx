import AccessDeniedPage from "@/components/_pages/error/access-denied.page";
import { getMetadata } from "@/utils/metadata";

export const metadata = getMetadata({
  title: "Truy cập bị từ chối | IT Job",
  description: "Bạn không có quyền truy cập vào trang này.",
  noIndex: true,
});

export default function AccessDenied() {
  return <AccessDeniedPage />;
}
