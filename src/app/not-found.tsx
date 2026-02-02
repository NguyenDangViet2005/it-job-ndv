import NotFoundPage from "@/_pages/error/not-found.page";
import { getMetadata } from "@/utils";

export const metadata = getMetadata("IT Job | Không tìm thấy trang");

export default function NotFound() {
  return <NotFoundPage />;
}
