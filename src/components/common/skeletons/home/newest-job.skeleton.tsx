import { Skeleton } from "@/components/ui/skeleton";
import SectionTitle from "@/components/features/section-title";

export default function NewestJobSkeleton() {
  return (
    <div>
      <SectionTitle
        title="Công Việc Mới Nhất"
        subtitle="Cơ hội việc làm vừa được đăng tuyển"
        showViewAll
        viewAllLink="/jobs"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="p-5 border rounded-xl bg-card flex flex-col gap-4"
          >
            <div className="flex gap-3 items-start">
              <Skeleton className="w-14 h-14 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-1.5 pt-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
