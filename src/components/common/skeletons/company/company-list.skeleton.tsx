import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompaniesPageSkeleton(){
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Title Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-96 mb-2" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>

      {/* Filter Toggle Skeleton */}
      <div className="mb-6 flex gap-3">
        <Skeleton className="h-9 w-24" />
      </div>

      {/* Results Count Skeleton */}
      <div className="mb-4">
        <Skeleton className="h-5 w-48" />
      </div>

      {/* Companies Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative">
              <Skeleton className="h-32 w-full" />
              <div className="absolute -bottom-8 left-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
              </div>
            </div>
            <CardContent className="pt-12 pb-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};