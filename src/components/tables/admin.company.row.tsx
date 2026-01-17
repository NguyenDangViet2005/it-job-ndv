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
  Building2,
  Globe,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Company interface matching backend response
export interface AdminCompany {
  id: number;
  name: string;
  avatar?: string;
  coverImage?: string;
  nationality?: string;
  website?: string;
  description?: string;
  foundedYear?: number;
  address?: string;
  wardId?: number;
  createdByUserId?: number;
  createdAt?: string;
  updatedAt?: string;
  jobs?: { $values?: any[] } | any[];
  follows?: { $values?: any[] } | any[];
}

interface CompanyRowProps {
  company: AdminCompany;
  onEdit?: (company: AdminCompany) => void;
  onDelete?: (company: AdminCompany) => void;
}

// Get array from backend format
const getArrayLength = (arr?: { $values?: any[] } | any[]) => {
  if (!arr) return 0;
  if (Array.isArray(arr)) return arr.length;
  if (arr.$values) return arr.$values.length;
  return 0;
};

// Table row component for companies - renders full tr
export function AdminCompanyRow({ company, onEdit, onDelete }: CompanyRowProps) {
  const jobsCount = getArrayLength(company.jobs);
  const followsCount = getArrayLength(company.follows);
  
  return (
    <tr className="border-b hover:bg-muted/30 transition-colors cursor-target">
      {/* Company Info with Avatar */}
      <td className="p-4 cursor-target">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 rounded-lg ring-2 ring-slate-200 dark:ring-slate-700">
            <AvatarImage 
              src={company.avatar} 
              alt={company.name}
              className="object-contain p-1 bg-white dark:bg-slate-900"
            />
            <AvatarFallback className="rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
              {company.name?.charAt(0) || "C"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Link 
              href={`/company/${company.id}`}
              className="font-semibold hover:text-primary transition-colors line-clamp-1"
            >
              {company.name}
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
              {company.description?.substring(0, 50) || "Chưa có mô tả"}...
            </p>
          </div>
        </div>
      </td>

      {/* Nationality */}
      <td className="p-4 cursor-target">
        {company.nationality ? (
          <Badge variant="outline" className="gap-1">
            <Globe className="h-3 w-3" />
            {company.nationality}
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </td>

      {/* Website */}
      <td className="p-4 cursor-target">
        {company.website ? (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            <span className="truncate max-w-[120px]">
              {company.website.replace(/^https?:\/\//, "")}
            </span>
          </a>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </td>

      {/* Stats */}
      <td className="p-4 cursor-target">
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-2">
            <Briefcase className="h-3 w-3 text-blue-500" />
            <span>{jobsCount} việc làm</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3 text-green-500" />
            <span>{followsCount} theo dõi</span>
          </div>
        </div>
      </td>

      {/* Founded */}
      <td className="p-4 cursor-target">
        {company.foundedYear ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{company.foundedYear}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </td>

      {/* Address */}
      <td className="p-4 cursor-target">
        {company.address ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground max-w-[150px]">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{company.address}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
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
            <Link href={`/company/${company.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(company)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
              onClick={() => onDelete(company)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

// Get columns for companies table
export function getCompanyTableColumns() {
  return [
    { key: "company", header: "Công ty", width: "25%" },
    { key: "nationality", header: "Quốc gia", width: "10%" },
    { key: "website", header: "Website", width: "15%" },
    { key: "stats", header: "Thống kê", width: "12%" },
    { key: "founded", header: "Năm thành lập", width: "10%" },
    { key: "address", header: "Địa chỉ", width: "15%" },
    { key: "actions", header: "Thao tác", width: "13%" },
  ];
}

export default AdminCompanyRow;
