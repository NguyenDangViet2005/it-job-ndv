import { Skeleton } from "@/components/ui/skeleton";
import SectionTitle from "@/components/features/section-title";

export default function QuickBlogSkeleton() {
  return (
    <div className="w-full px-2 lg:mx-0">
      <SectionTitle
        title="Blog IT"
        subtitle="Kiến thức và kinh nghiệm từ cộng đồng IT"
        showViewAll
        viewAllLink="/blog"
      />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Featured Blog Skeleton */}
        <div className="md:col-span-7">
          <Skeleton className="w-full h-[220px] md:h-[350px] rounded-xl" />
          <Skeleton className="h-6 w-3/4 mt-3" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-2/3 mt-1" />
          <Skeleton className="h-3 w-1/2 mt-2" />
        </div>

        {/* Other Blogs Skeleton */}
        <div className="md:col-span-5 flex flex-col gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3 border-b pb-3">
              <Skeleton className="w-[120px] md:w-[150px] h-[80px] rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
