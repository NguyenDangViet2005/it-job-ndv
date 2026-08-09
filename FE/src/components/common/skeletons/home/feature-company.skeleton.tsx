import { Skeleton } from "@/components/ui/skeleton";
import SectionTitle from "@/components/features/section-title";

export default function FeatureCompanySkeleton() {
  return (
    <div className="w-full mx-auto py-10 md:block hidden">
      <SectionTitle title="Công Ty Nổi Bật" />
      <div className="relative w-full max-w-[900px] mx-auto mt-8">
        {/* Main skeleton card */}
        <div className="w-full h-[450px] mb-12">
          <Skeleton className="w-full h-[350px] rounded-t-lg" />
          <div className="relative -mt-16 mx-auto w-[820px]">
            <div className="bg-card rounded-2xl shadow-xl border p-4">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="w-10 h-10 rounded" />
              </div>
              <div className="space-y-2 mb-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation skeleton */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex gap-2">
            <Skeleton className="w-2 h-2 rounded-full" />
            <Skeleton className="w-2 h-2 rounded-full" />
            <Skeleton className="w-2 h-2 rounded-full" />
          </div>
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
