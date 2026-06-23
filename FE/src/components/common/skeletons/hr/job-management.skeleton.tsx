import { Skeleton } from "@/components/ui/skeleton";

export default function HrJobManagementSkeleton(){
    return(
        <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 sm:h-10 w-48 sm:w-64" />
            <Skeleton className="h-4 w-32 sm:w-40" />
          </div>
          <Skeleton className="h-10 w-full sm:w-40" />
        </div>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-32" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
}