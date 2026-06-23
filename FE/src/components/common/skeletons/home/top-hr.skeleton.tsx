import { Skeleton } from "@/components/ui/skeleton";
import SectionTitle from "@/components/features/section-title";

export default function TopHRSkeleton() {
  return (
    <div>
      <SectionTitle title="Nhà Tuyển Dụng Hàng Đầu" />
      <div className="mt-10 overflow-hidden">
        <div className="flex gap-8 animate-pulse">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-32 rounded-lg flex-shrink-0" />
          ))}
        </div>
      </div>
    </div>
  );
}
