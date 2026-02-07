import { Skeleton } from "@/components/ui/skeleton";

export  default function HRBlogManagementSkeleton() {
    return (
         <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 sm:h-10 w-40 sm:w-56" />
            <Skeleton className="h-4 w-48 sm:w-64" />
          </div>
          <Skeleton className="h-10 w-full sm:w-36" />
        </div>

        <div className="grid gap-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Skeleton className="w-full sm:w-32 h-48 sm:h-32 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex sm:flex-col gap-2">
                  <Skeleton className="h-9 flex-1 sm:flex-none sm:w-20" />
                  <Skeleton className="h-9 flex-1 sm:flex-none sm:w-20" />
                  <Skeleton className="h-9 flex-1 sm:flex-none sm:w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
}