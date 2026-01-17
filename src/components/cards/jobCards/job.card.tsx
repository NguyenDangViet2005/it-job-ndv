import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  Bookmark,
  Eye,
} from "lucide-react";
import type { JobResponse } from "@/types/api.type";

interface JobCardProps {
  job: JobResponse;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 ">
      <CardContent className="py-6 px-4">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Company Logo */}
          <div className="flex-shrink-0 w-full lg:w-48 h-48 bg-white rounded-lg shadow-md p-4 flex items-center justify-center border">
            <div className="relative w-full h-full">
              <Image
                src={job.company?.avatar || "/logo-company.jpg"}
                alt={job.company?.name || "Company"}
                fill
                className="cursor-target object-contain"
                sizes="192px"
              />
            </div>
          </div>

          {/* Job Information */}
          <div className="flex-1 space-y-3 min-h-[192px] flex flex-col justify-between">
            <div>
              <Link href={`/jobs/${job.id}`} className="cursor-target group">
                <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                  {job.title}
                </h2>
              </Link>
              <p className="text-muted-foreground">{job.company?.name}</p>
            </div>

            {/* Job Meta */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="cursor-target text-xs">
                <MapPin className="cursor-target h-3 w-3 mr-1" />
                {job.company?.city || job.company?.address}
              </Badge>
              <Badge variant="secondary" className="cursor-target text-xs">
                <Clock className="cursor-target h-3 w-3 mr-1" />
                {job.type}
              </Badge>
              <Badge variant="secondary" className="cursor-target text-xs">
                <Users className="cursor-target h-3 w-3 mr-1" />
                {job.quantity} vị trí
              </Badge>
              <Badge
                variant={job.status === "open" ? "default" : "secondary"}
                className="cursor-target text-xs"
              >
                {job.status === "open" ? "Đang tuyển" : "Đã đóng"}
              </Badge>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              {job.skills?.map((skill: any) => (
                <Badge
                  key={skill.id}
                  variant="outline"
                  className="cursor-target text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {skill.name}
                </Badge>
              ))}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {job.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="cursor-target h-3 w-3" />
                  <span>
                    Hạn: {new Date(job.deadline).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 lg:w-40 self-start">
            <Link href={`/jobs/${job.id}`} className="w-full">
              <Button className="cursor-target w-full" size="sm">
                <Eye className="cursor-target h-4 w-4 mr-2" />
                Xem chi tiết
              </Button>
            </Link>
            <Button
              variant="outline"
              className="cursor-target w-full"
              size="sm"
            >
              <Bookmark className="cursor-target h-4 w-4 mr-2" />
              Lưu việc
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
