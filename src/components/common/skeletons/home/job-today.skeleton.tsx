import { Skeleton } from "@/components/ui/skeleton";
import SectionTitle from "@/components/features/section-title";

export default function JobTodaySkeleton() {
  return (
    <div className="w-full mt-10">
      <SectionTitle
        title="Công Việc Hôm Nay"
        subtitle="Cập nhật mới nhất các vị trí tuyển dụng hot trong ngày"
      />
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-start gap-3 mb-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex flex-wrap gap-1">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-18" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
