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
  FileText,
  User,
  Clock,
  Calendar,
  Tag,
} from "lucide-react";

// Blog interface matching backend response
export interface AdminBlog {
  id: number;
  title: string;
  excerpt?: string;
  content?: string;
  readtime?: string;
  image?: string;
  author?: string;
  category?: string;
  date?: string;
  createdat?: string;
  updatedat?: string;
}

interface BlogRowProps {
  blog: AdminBlog;
  onEdit?: (blog: AdminBlog) => void;
  onDelete?: (blog: AdminBlog) => void;
}

// Table row component for blogs - renders full tr
export function AdminBlogRow({ blog, onEdit, onDelete }: BlogRowProps) {
  return (
    <tr className="border-b hover:bg-muted/30 transition-colors cursor-target">
      {/* Blog Info with Image */}
      <td className="p-4 cursor-target">
        <div className="flex items-center gap-3">
          {blog.image ? (
            <img
              src={blog.image}
              alt={blog.title}
              className="h-14 w-20 rounded-lg object-cover ring-1 ring-border"
            />
          ) : (
            <div className="h-14 w-20 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center ring-1 ring-border">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <Link 
              href={`/blog/${blog.id}`}
              className="font-semibold hover:text-primary transition-colors line-clamp-1"
            >
              {blog.title}
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
              {blog.excerpt || "Không có mô tả"}
            </p>
          </div>
        </div>
      </td>

      {/* Author */}
      <td className="p-4 cursor-target">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
              {blog.author?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{blog.author || "Admin"}</span>
        </div>
      </td>

      {/* Category */}
      <td className="p-4 cursor-target">
        {blog.category ? (
          <Badge variant="outline" className="gap-1">
            <Tag className="h-3 w-3" />
            {blog.category}
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </td>

      {/* Read Time */}
      <td className="p-4 cursor-target">
        {blog.readtime ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{blog.readtime}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </td>

      {/* Created At */}
      <td className="p-4 cursor-target">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{blog.createdat ? new Date(blog.createdat).toLocaleDateString("vi-VN") : "-"}</span>
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
            <Link href={`/blog/${blog.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(blog)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
              onClick={() => onDelete(blog)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

// Get columns for blogs table
export function getBlogTableColumns() {
  return [
    { key: "blog", header: "Bài viết", width: "35%" },
    { key: "author", header: "Tác giả", width: "15%" },
    { key: "category", header: "Danh mục", width: "12%" },
    { key: "readtime", header: "Thời gian đọc", width: "12%" },
    { key: "created", header: "Ngày tạo", width: "14%" },
    { key: "actions", header: "Thao tác", width: "12%" },
  ];
}

export default AdminBlogRow;
