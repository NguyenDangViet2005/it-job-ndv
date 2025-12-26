"use client";

import { Suspense } from "react";
import SearchResultsPage from "@/pages/user/search-results.page";

function SearchPageContent() {
  return <SearchResultsPage />;
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
