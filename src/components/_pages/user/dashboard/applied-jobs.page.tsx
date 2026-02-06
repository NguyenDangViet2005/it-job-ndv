"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { applicationApi } from "@/apis/application.api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Clock, ExternalLink, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Application } from "@/types";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  reviewing: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  rejected: "bg-red-500/10 text-red-700 dark:text-red-400",
  accepted: "bg-green-500/10 text-green-700 dark:text-green-400",
};

const statusText: Record<string, string> = {
  pending: "Đang chờ",
  reviewing: "Đang xem xét",
  rejected: "Đã từ chối",
  accepted: "Đã chấp nhận",
};

export default function AppliedJobsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) {
      router.push("/login");
      return;
    }

    async function fetchApplications() {
      try {
        setLoading(true);
        const response = await applicationApi.getByUser(
          user!.id,
          1,
          50,
          token!,
        );
        setApplications(response.data || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Không thể tải danh sách ứng tuyển",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, [user, token, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center py-16">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center py-16">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-8 max-w-5xl">
      <div className="space-y-3 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0">
          <h1 className="text-xl sm:text-3xl font-bold">Việc đã ứng tuyển</h1>
          <p className="text-xs sm:text-base text-muted-foreground">
            Tổng: {applications.length} đơn ứng tuyển
          </p>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-8 sm:py-16 text-center px-3">
              <Briefcase className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-2 sm:mb-4" />
              <p className="text-xs sm:text-base text-muted-foreground mb-2 sm:mb-4">
                Bạn chưa có đơn ứng tuyển nào
              </p>
              <Button onClick={() => router.push("/jobs")} className="text-xs sm:text-base h-8 sm:h-10">Tìm việc làm</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2 sm:space-y-4">
            {applications.map((app) => (
              <Card key={app.id || `${app.jobid}-${app.userid}`}>
                <CardContent className="p-3 sm:pt-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4">
                    <div className="flex gap-2 sm:gap-4 flex-1 w-full">
                      <div className="h-10 w-10 sm:h-16 sm:w-16 rounded-lg sm:rounded-xl border border-border bg-white dark:bg-muted p-1 sm:p-2 flex items-center justify-center flex-shrink-0">
                        <Image
                          src={app.companyLogo || "/logo/default-company.png"}
                          alt={app.companyName || "Company"}
                          width={64}
                          height={64}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-lg truncate">
                          {app.jobTitle}
                        </h3>
                        <p className="text-xs sm:text-base text-muted-foreground truncate">
                          {app.companyName}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-3 mt-1 sm:mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span>
                              Ứng tuyển:{" "}
                              {new Date(app.createdat).toLocaleDateString(
                                "vi-VN",
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3 flex-shrink-0" />
                            <a
                              href={app.cvurl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Xem CV
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={`${
                        statusColors[app.status] || statusColors.pending
                      } text-xs whitespace-nowrap`}
                    >
                      {statusText[app.status] || app.status}
                    </Badge>
                  </div>

                  {/* Cover Letter */}
                  <div className="mt-2 sm:mt-4 p-2 sm:p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs font-semibold mb-0.5 sm:mb-1">Thư xin việc:</p>
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-3">
                      {app.coverletter}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-2 sm:mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 sm:h-9"
                      onClick={() => router.push(`/jobs/${app.jobid}`)}
                    >
                      Xem công việc
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
