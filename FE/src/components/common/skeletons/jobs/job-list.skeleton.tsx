import { Skeleton } from "@/components/ui/skeleton";

export default function JobListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Results count skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
      </div>

      {/* Job cards skeleton */}
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Company logo skeleton */}
              <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />

              <div className="flex-1 space-y-3">
                {/* Title and company */}
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-20" />
                </div>

                {/* Location and deadline */}
                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-18" />
                  <Skeleton className="h-6 w-22" />
                </div>
              </div>

              {/* Bookmark button skeleton */}
              <Skeleton className="w-10 h-10 rounded flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center gap-2 mt-8">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
}
