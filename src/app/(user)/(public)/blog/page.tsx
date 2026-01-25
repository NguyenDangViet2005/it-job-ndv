import BlogPage from "@/pages/user/blog.page";

import { getMetadata } from "@/utils/metadata.utils";

export const metadata = getMetadata("IT Job | Blog về công việc IT");

function page() {
  return (
    <>
      <BlogPage />
    </>
  );
}

export default page;
