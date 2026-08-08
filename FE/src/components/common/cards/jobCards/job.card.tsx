import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Job } from "@/types";
import { ROUTES } from "@/constants";
import { ModernCard } from "@/components/ui/modern-card";

export default function JobCard(job: Job) {
  return (
    <ModernCard className="p-5 group">
      <div className="flex flex-col md:flex-row gap-5">
        {/* Logo Section */}
        <Link
          href={ROUTES.JOB_DETAIL(job.id, job.title)}
          className="md:w-28 md:h-28 w-full h-36 bg-secondary/30 rounded-xl p-3 flex items-center justify-center border border-border/40 group-hover:border-primary/30 transition-colors shrink-0 overflow-hidden"
        >
          <div className="relative w-full h-full">
            <Image
              src={job.company?.avatar || "/logo/default-company.png"}
              alt={job.company?.name || "Company"}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 112px"
            />
          </div>
        </Link>

        {/* Info Section */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <Link href={ROUTES.JOB_DETAIL(job.id, job.title)}>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                </Link>
                <p className="text-primary/90 font-semibold text-xs tracking-wide">
                  {job.company?.name}
                </p>
              </div>

              <Badge
                variant={job.status === "open" ? "default" : "secondary"}
                className={cn(
                  "rounded-full px-3 py-0.5 text-[11px] font-medium shrink-0",
                  job.status === "open"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {job.status === "open" ? "Đang tuyển" : "Đã đóng"}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-primary/70" />
                <span>{job.company?.city || job.company?.address || "Toàn quốc"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-primary/70" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-primary/70" />
                <span>{job.quantity} chỉ tiêu</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground/90 line-clamp-2 pt-1 leading-relaxed">
              {job.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-border/40">
            <div className="flex flex-wrap gap-1.5">
              {job.skills?.slice(0, 3).map((skill: any) => (
                <span
                  key={skill.id}
                  className="bg-primary/5 text-primary/80 border border-primary/10 px-2 py-0.5 rounded-md text-[10px] font-semibold"
                >
                  {skill.name}
                </span>
              ))}
              {(job.skills?.length || 0) > 3 && (
                <span className="text-[10px] font-semibold text-muted-foreground self-center">
                  +{(job.skills?.length || 0) - 3}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[11px] text-muted-foreground hidden sm:inline">
                Hạn: {new Date(job.deadline).toLocaleDateString("vi-VN")}
              </span>
              <Link href={ROUTES.JOB_DETAIL(job.id, job.title)}>
                <Button
                  size="sm"
                  className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs px-3.5 h-8 gap-1 shadow-md shadow-primary/10 transition-all"
                >
                  <span>Ứng tuyển</span>
                  <ArrowUpRight size={14} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ModernCard>
  );
}

