import BlogPage from "@/components/_pages/user/blog.page";

import { getMetadata } from "@/utils/metadata";

export const metadata = getMetadata("IT Job | Blog về công việc IT");

function page() {
  return (
    <>
      <BlogPage />
    </>
  );
}

export default page;
