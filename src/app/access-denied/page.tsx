import AccessDeniedPage from "@/_pages/error/access-denied.page";
import { getMetadata } from "@/utils";

export const metadata = getMetadata("IT Job | Truy cập bị từ chối");

export default function Page() {
  return <AccessDeniedPage />;
}
