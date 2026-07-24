import JobsPage from "@/components/_pages/user/jobs.page";
import { getMetadata } from "@/utils";

export const metadata = getMetadata("IT Job | Tìm kiếm công việc IT");

function page() {
  return (
    <>
      <JobsPage />
    </>
  );
}

export default page;
