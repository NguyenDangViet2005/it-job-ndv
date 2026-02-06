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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Việc đã ứng tuyển</h1>
          <p className="text-muted-foreground">
            Tổng: {applications.length} đơn ứng tuyển
          </p>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Bạn chưa có đơn ứng tuyển nào
              </p>
              <Button onClick={() => router.push("/jobs")}>Tìm việc làm</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id || `${app.jobid}-${app.userid}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1">
                      <div className="h-16 w-16 rounded-xl border-2 border-border bg-white dark:bg-muted p-2 flex items-center justify-center flex-shrink-0 shadow-sm hover:shadow-md transition-shadow">
                        <Image
                          src={app.companyLogo || "/logo/default-company.png"}
                          alt={app.companyName || "Company"}
                          width={64}
                          height={64}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          {app.jobTitle}
                        </h3>
                        <p className="text-muted-foreground">
                          {app.companyName}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span>
                              Ứng tuyển:{" "}
                              {new Date(app.createdat).toLocaleDateString(
                                "vi-VN",
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4 flex-shrink-0" />
                            <a
                              href={app.cvurl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Xem CV
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={
                        statusColors[app.status] || statusColors.pending
                      }
                    >
                      {statusText[app.status] || app.status}
                    </Badge>
                  </div>

                  {/* Cover Letter */}
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-semibold mb-1">Thư xin việc:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
                      {app.coverletter}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
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
