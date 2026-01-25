import QAPage from "@/pages/user/QA.page";
import { getMetadata } from "@/utils";
export const metadata = getMetadata("IT Job | Hỏi đáp IT");

function page() {
  return (
    <>
      <QAPage />
    </>
  );
}

export default page;
