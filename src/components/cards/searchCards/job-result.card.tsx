import { SearchJob } from "@/apis/search.api";
import { Building2, Calendar } from "lucide-react";
import Link from "next/link";
import { Badge } from "../../ui/shadcn/badge";

export function JobCard({ job }: { job: SearchJob }) {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "full-time": "Toàn thời gian",
      "part-time": "Bán thời gian",
      "contract": "Hợp đồng",
      "internship": "Thực tập",
    };
    return labels[type] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="bg-card dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all p-5 border dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 h-full">
        <div className="flex gap-4 mb-3">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-background dark:bg-gray-700 border dark:border-gray-600 rounded-lg p-2 flex items-center justify-center">
              <img
                src={job.company.avatar}
                alt={job.company.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground dark:text-gray-100 mb-1 hover:text-primary dark:hover:text-primary transition-colors line-clamp-1">
              {job.title}
            </h3>
            
            <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400 text-sm">
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{job.company.name}</span>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {job.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 text-xs">
              {getTypeLabel(job.type)}
            </Badge>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground dark:text-gray-400">
              <Calendar  className="w-3 h-3" />
              <span>{formatDate(job.deadline)}</span>
            </div>
          </div>

          {job.skills && job.skills.length > 0 && (
            <div className="flex gap-1.5">
              {job.skills.slice(0, 2).map((skill) => (
                <span
                  key={typeof skill === 'string' ? skill : skill.id}
                  className="px-2 py-0.5 bg-muted dark:bg-gray-700 text-muted-foreground dark:text-gray-300 text-xs rounded"
                >
                  {typeof skill === 'string' ? skill : skill.name}
                </span>
              ))}
              {job.skills.length > 2 && (
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                  +{job.skills.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}