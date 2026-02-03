import { ReactNode } from "react";
import LeftSidebar from "@/components/features/qa/left-sidebar/left-sidebar.section";
import RightSidebar from "@/components/features/qa/right-sidebar/right-sidebar.section";
import type { BlogResponse, Company } from "@/types/api.type";

interface QAPageLayoutProps {
  children: ReactNode;
  blogs: BlogResponse[];
  suggestedCompanies: Company[];
  followedCompanyIds: number[];
  connections: any[];
}

export default function QAPageLayout({
  children,
  blogs,
  suggestedCompanies,
  followedCompanyIds,
  connections,
}: QAPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background mt-20">
      <div className="max-w-[1400px] mx-auto flex justify-center lg:justify-between px-4 gap-4">
        {/* LEFT SIDEBAR - Profile + Connections (Fixed) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="fixed top-20 w-64 h-[calc(100vh-5rem)] overflow-hidden flex flex-col">
            <LeftSidebar connections={connections} />
          </div>
        </aside>

        {/* MAIN CONTENT - Scrollable */}
        <main className="flex-1 min-w-0 max-w-2xl lg:max-w-none">
          <div className="max-w-2xl mx-auto">{children}</div>
        </main>

        {/* RIGHT SIDEBAR - Company Posts + Followed Companies (Fixed) */}
        <aside className="hidden md:block w-[340px] flex-shrink-0">
          <div
            className="fixed top-20 w-[340px] h-[calc(100vh-5rem)] overflow-hidden"
            style={{
              right: "max(1rem, calc((100vw - 1400px)/2 + 1rem))",
            }}
          >
            <RightSidebar
              followList={suggestedCompanies}
              companyPosts={blogs}
              followedCompanyIds={followedCompanyIds}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
