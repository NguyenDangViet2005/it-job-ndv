import { Skeleton } from "@/components/ui/skeleton";
import SectionTitle from "@/components/features/section-title";
import { ROUTES } from "@/constants";

export default function FeatureCompanySkeleton() {
  return (
    <div className="w-full mx-auto py-4 lg:py-6">
      <SectionTitle
        title="Công Ty Nổi Bật"
        subtitle="Khám phá các doanh nghiệp IT hàng đầu đang chiêu mộ nhân tài"
        showViewAll
        viewAllLink={ROUTES.COMPANIES}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-md p-5 flex flex-col justify-between h-full space-y-4"
          >
            <div className="space-y-3">
              {/* Header: Logo & Title */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 w-full">
                  <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4 rounded-md" />
                    <Skeleton className="h-3.5 w-1/3 rounded-md" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 pt-1">
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-4/5 rounded" />
              </div>
            </div>

            {/* Footer info */}
            <div className="pt-3 border-t border-border/40 flex items-center justify-between">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-3.5 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
