"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/shadcn/button";
import { Badge } from "@/components/ui/shadcn/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcn/avatar";
import {
  Eye,
  Edit,
  Trash2,
  Briefcase,
  MapPin,
  Users,
  Calendar,
  Clock,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Job interface matching backend response
export interface AdminJob {
  id: number;
  title: string;
  description?: string;
  type?: string;
  status?: string;
  quantity?: number;
  deadline?: string;
  salary?: string;
  createdAt?: string;
  company?: {
    id: number;
    name: string;
    avatar?: string;
    website?: string;
    address?: string;
  };
  skills?: {
    $values?: Array<{ id: number; name: string }>;
  } | Array<{ id: number; name: string }>;
}

interface JobRowProps {
  job: AdminJob;
  onEdit?: (job: AdminJob) => void;
  onDelete?: (job: AdminJob) => void;
}

const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "open":
    case "active":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "draft":
    case "pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "closed":
    case "inactive":
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    default:
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
  }
};

const getTypeColor = (type?: string) => {
  switch (type?.toLowerCase()) {
    case "full-time":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "part-time":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "remote":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "internship":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

// Get skills array from backend format
const getSkillsArray = (skills?: AdminJob["skills"]) => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  if (skills.$values) return skills.$values;
  return [];
};

// Table row component for jobs - renders full tr
export function AdminJobRow({ job, onEdit, onDelete }: JobRowProps) {
  const skills = getSkillsArray(job.skills);
  
  return (
    <tr className="border-b hover:bg-muted/30 transition-colors cursor-target">
      {/* Job Info with Company Avatar */}
      <td className="p-4 cursor-target">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 rounded-lg ring-2 ring-slate-200 dark:ring-slate-700">
            <AvatarImage 
              src={job.company?.avatar} 
              alt={job.company?.name}
              className="object-contain p-1 bg-white dark:bg-slate-900"
            />
            <AvatarFallback className="rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <Briefcase className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Link 
              href={`/jobs/${job.id}`}
              className="font-semibold hover:text-primary transition-colors line-clamp-1"
            >
              {job.title}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <Building2 className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate">
                {job.company?.name || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Type, Status & Salary */}
      <td className="p-4 cursor-target">
        <div className="flex flex-col gap-2">
          <Badge className={cn("text-xs w-fit", getTypeColor(job.type))}>
            {job.type || "N/A"}
          </Badge>
          <div className="flex items-center gap-2">
            <Badge className={cn("text-xs w-fit", getStatusColor(job.status))}>
              {job.status?.toUpperCase() || "ACTIVE"}
            </Badge>
            <span className="text-xs font-semibold text-green-600 dark:text-green-400 truncate max-w-[100px]">
              {job.salary || "N/A"}
            </span>
          </div>
        </div>
      </td>

      {/* Skills */}
      <td className="p-4 cursor-target">
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {skills.slice(0, 3).map((skill) => (
            <Badge key={skill.id} variant="outline" className="text-xs">
              {skill.name}
            </Badge>
          ))}
          {skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{skills.length - 3}
            </Badge>
          )}
          {skills.length === 0 && (
            <span className="text-muted-foreground text-sm">-</span>
          )}
        </div>
      </td>

      {/* Quantity */}
      <td className="p-4 cursor-target">
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{job.quantity || 1}</span>
        </div>
      </td>

      {/* Deadline */}
      <td className="p-4 cursor-target">
        {job.deadline ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(job.deadline).toLocaleDateString("vi-VN")}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </td>

      {/* Created */}
      <td className="p-4 cursor-target">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{job.createdAt ? new Date(job.createdAt).toLocaleDateString("vi-VN") : "-"}</span>
        </div>
      </td>

      {/* Actions */}
      <td className="p-4 cursor-target">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            asChild
          >
            <Link href={`/jobs/${job.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(job)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
              onClick={() => onDelete(job)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

// Get columns for jobs table
export function getJobTableColumns() {
  return [
    { key: "job", header: "Công việc", width: "25%" },
    { key: "type", header: "Loại / Lương", width: "15%" },
    { key: "skills", header: "Kỹ năng", width: "18%" },
    { key: "quantity", header: "Số lượng", width: "10%" },
    { key: "deadline", header: "Hạn nộp", width: "12%" },
    { key: "created", header: "Ngày tạo", width: "12%" },
    { key: "actions", header: "Thao tác", width: "11%" },
  ];
}

export default AdminJobRow;
