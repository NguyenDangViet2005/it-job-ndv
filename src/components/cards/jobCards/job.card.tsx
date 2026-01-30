import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import { MapPin, Clock, Users, Calendar, Bookmark, Eye } from "lucide-react";
import type { JobResponse } from "@/types/api.type";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: JobResponse;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-border bg-card p-4 rounded-none">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Logo Section */}
          <div className="md:w-32 md:h-32 w-full h-40 bg-muted/30 p-4 flex items-center justify-center border border-border group-hover:border-primary/20 transition-colors shrink-0">
            <div className="relative w-full h-full">
              <Image
                src={job.company?.avatar || "/logo-company.jpg"}
                alt={job.company?.name || "Company"}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 128px"
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-4">
                <Link href={`/jobs/${job.id}`} className="block group/title">
                  <h2 className="text-xl font-semibold text-foreground group-hover/title:text-primary transition-colors">
                    {job.title}
                  </h2>
                </Link>
                <div className="hidden sm:block">
                  <Badge
                    variant={job.status === "open" ? "default" : "secondary"}
                    className={cn(
                      "rounded-full px-3 text-[10px] tracking-wider",
                      job.status === "open"
                        ? "bg-green-700 hover:bg-green-800"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {job.status === "open" ? "Đang tuyển" : "Đã đóng"}
                  </Badge>
                </div>
              </div>
              <p className="text-primary font-semibold text-sm tracking-wide">
                {job.company?.name}
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
                <div className="flex items-center text-muted-foreground text-xs font-medium">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary/50" />
                  {job.company?.city || job.company?.address}
                </div>
                <div className="flex items-center text-muted-foreground text-xs font-medium">
                  <Clock className="h-3.5 w-3.5 mr-1.5 text-primary/50" />
                  {job.type}
                </div>
                <div className="flex items-center text-muted-foreground text-xs font-medium">
                  <Users className="h-3.5 w-3.5 mr-1.5 text-primary/50" />
                  {job.quantity} slot
                </div>
              </div>

              {/* Description Add */}
              <p className="text-sm text-muted-foreground line-clamp-2 pt-2 transition-colors group-hover:text-foreground/80">
                {job.description}
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {job.skills?.slice(0, 3).map((skill: any) => (
                  <span
                    key={skill.id}
                    className="bg-muted text-muted-foreground px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight"
                  >
                    {skill.name}
                  </span>
                ))}
                {(job.skills?.length || 0) > 3 && (
                  <span className="text-[10px] font-bold text-muted-foreground self-center">
                    +{(job.skills?.length || 0) - 3}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-muted-foreground">
                  Hạn: {new Date(job.deadline).toLocaleDateString("vi-VN")}
                </span>
                <Link href={`/jobs/${job.id}`}>
                  <Button
                    size="sm"
                    className="bg-foreground text-background hover:bg-primary hover:text-white px-4 h-9 transition-all rounded-none font-semibold"
                  >
                    Ứng tuyển
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
