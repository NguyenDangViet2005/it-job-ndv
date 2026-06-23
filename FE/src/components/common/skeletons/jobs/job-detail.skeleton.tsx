import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function JobDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Job Header Skeleton */}
        <Card className="rounded-none">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Company Logo */}
              <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />

              <div className="flex-1 space-y-4">
                {/* Title and Company */}
                <div className="space-y-2">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-28" />
                  <Skeleton className="h-8 w-36" />
                  <Skeleton className="h-8 w-24" />
                </div>

                {/* Info Row */}
                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-36" />
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-7 w-20" />
                  <Skeleton className="h-7 w-24" />
                  <Skeleton className="h-7 w-28" />
                  <Skeleton className="h-7 w-22" />
                  <Skeleton className="h-7 w-26" />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Skeleton className="h-11 w-40" />
                  <Skeleton className="h-11 w-11 rounded-lg" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            <Card className="rounded-none">
              <CardContent className="p-6 space-y-8">
                {/* Job Description Section */}
                <div>
                  <Skeleton className="h-7 w-48 mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>

                  <div className="mt-6 space-y-3">
                    <Skeleton className="h-5 w-40" />
                    <div className="space-y-2 ml-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Requirements Section */}
                <div>
                  <Skeleton className="h-7 w-56 mb-4" />
                  <div className="space-y-4">
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <div className="space-y-2 ml-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    </div>
                    <div>
                      <Skeleton className="h-5 w-28 mb-2" />
                      <div className="space-y-2 ml-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Benefits Section */}
                <div>
                  <Skeleton className="h-7 w-32 mb-4" />
                  <div className="space-y-4">
                    <div>
                      <Skeleton className="h-5 w-24 mb-2" />
                      <div className="space-y-2 ml-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    </div>
                    <div>
                      <Skeleton className="h-5 w-28 mb-2" />
                      <div className="space-y-2 ml-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Company Info */}
          <div className="lg:col-span-1">
            <Card className="rounded-none sticky top-8">
              <CardContent className="p-6 space-y-6">
                {/* Company Header */}
                <div className="flex items-center gap-3">
                  <Skeleton className="w-16 h-16 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>

                <Separator />

                {/* Company Details */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>

                <Separator />

                {/* View Company Button */}
                <Skeleton className="h-11 w-full" />

                {/* Company Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-16 mx-auto" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-16 mx-auto" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
