"use client";

import { Suspense } from "react";
import SearchResultsPage from "@/components/_pages/user/search-results.page";
import LoadingScreen from "@/components/common/loading-screen";

function SearchPageContent() {
  return <SearchResultsPage />;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingScreen fullScreen={true} message="Đang tìm kiếm..." />}>
      <SearchPageContent />
    </Suspense>
  );
}
