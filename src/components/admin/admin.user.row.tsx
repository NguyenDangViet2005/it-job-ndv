"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/shadcn/button";
import { Badge } from "@/components/ui/shadcn/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcn/avatar";
import {
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  User,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Default images
const DEFAULT_AVATAR = "/ute.png";
const DEFAULT_COVER = "/cover.png";

// User interface matching backend response
export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  avatar?: string;
  coverImage?: string;
  role?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserRowProps {
  user: AdminUser;
  onEdit?: (user: AdminUser) => void;
  onDelete?: (user: AdminUser) => void;
}

const getRoleStyle = (role?: string) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return {
        bg: "bg-gradient-to-r from-red-500 to-rose-600",
        text: "text-white",
        icon: <Shield className="h-3 w-3" />,
        label: "Admin"
      };
    case "employer":
    case "hr":
      return {
        bg: "bg-gradient-to-r from-blue-500 to-indigo-600",
        text: "text-white",
        icon: <Briefcase className="h-3 w-3" />,
        label: "Nhà tuyển dụng"
      };
    case "user":
    case "candidate":
    default:
      return {
        bg: "bg-gradient-to-r from-green-500 to-emerald-600",
        text: "text-white",
        icon: <User className="h-3 w-3" />,
        label: "Ứng viên"
      };
  }
};

// Table row component for users - renders full tr with cover image preview
export function AdminUserRow({ user, onEdit, onDelete }: UserRowProps) {
  const roleStyle = getRoleStyle(user.role);
  const avatarSrc = user.avatar || DEFAULT_AVATAR;
  const coverSrc = user.coverImage || DEFAULT_COVER;
  
  return (
    <tr className="border-b hover:bg-muted/30 transition-colors group cursor-target">
      {/* User Info with Avatar and Cover Image */}
      <td className="p-4 cursor-target">
        <div className="flex items-center gap-3">
          {/* Avatar with Cover Background */}
          <div className="relative">
            {/* Cover Image Background - Always visible */}
            <div className="w-16 h-10 rounded-lg overflow-hidden shadow-sm border">
              <img
                src={coverSrc}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Avatar - Positioned on top of cover */}
            <Avatar className="h-10 w-10 ring-2 ring-background shadow-md absolute -bottom-1 -right-1">
              <AvatarImage src={avatarSrc} alt={user.fullName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm">
                {user.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1 min-w-0 ml-2">
            <Link 
              href={`/profile/${user.id}`}
              className="font-semibold hover:text-primary transition-colors line-clamp-1"
            >
              {user.fullName}
            </Link>
            <p className="text-xs text-muted-foreground">ID: #{user.id}</p>
          </div>
        </div>
      </td>

      {/* Contact Info */}
      <td className="p-4 cursor-target">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-sm truncate max-w-[180px]">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-green-500" />
              <span className="text-sm text-muted-foreground">{user.phone}</span>
            </div>
          )}
        </div>
      </td>

      {/* Role Badge */}
      <td className="p-4 cursor-target">
        <Badge className={cn("gap-1.5 font-medium", roleStyle.bg, roleStyle.text)}>
          {roleStyle.icon}
          {roleStyle.label}
        </Badge>
      </td>

      {/* Status */}
      <td className="p-4 cursor-target">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
            <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-green-500 animate-ping opacity-75" />
          </div>
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            Hoạt động
          </span>
        </div>
      </td>

      {/* Gender */}
      <td className="p-4 cursor-target">
        <span className="text-sm">
          {user.gender === "male" ? "Nam" : 
           user.gender === "female" ? "Nữ" : 
           user.gender || "—"}
        </span>
      </td>

      {/* Date of Birth */}
      <td className="p-4 cursor-target">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {user.dateOfBirth 
              ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                }) 
              : "—"}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="p-4 cursor-target">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
            asChild
          >
            <Link href={`/profile/${user.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-amber-100 hover:text-amber-600"
              onClick={() => onEdit(user)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
              onClick={() => onDelete(user)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

// Get columns for users table
export function getUserTableColumns() {
  return [
    { key: "user", header: "Người dùng", width: "22%" },
    { key: "contact", header: "Liên hệ", width: "22%" },
    { key: "role", header: "Vai trò", width: "12%" },
    { key: "status", header: "Trạng thái", width: "10%" },
    { key: "gender", header: "Giới tính", width: "8%" },
    { key: "dateOfBirth", header: "Ngày sinh", width: "14%" },
    { key: "actions", header: "Thao tác", width: "12%" },
  ];
}

export default AdminUserRow;
