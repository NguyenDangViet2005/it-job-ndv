import CompanyFollow from "@/components/sections/qa/right-sidebar/company-follow.section";
import BlogCompany from "@/components/sections/qa/left-sidebar/QA-company.section";

export default function RightSidebar({
  followList,
  companyPosts,
  followedCompanyIds = [],
}: {
  followList: any[];
  companyPosts: any[];
  followedCompanyIds?: number[];
}) {
  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Chia sẻ kinh nghiệm từ công ty */}
      <div className="flex-shrink-0">
        <BlogCompany companyPosts={companyPosts} />
      </div>

      {/* Công ty có thể quan tâm */}
      <div className="flex-shrink-0">
        <CompanyFollow
          followList={followList}
          followedCompanyIds={followedCompanyIds}
        />
      </div>
    </div>
  );
}
