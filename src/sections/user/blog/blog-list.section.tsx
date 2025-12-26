"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge"; 
import { Button } from "@/components/ui/shadcn/button"; 
import { Input } from "@/components/ui/shadcn/input"; 
import { Calendar, User, Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { blogApi } from "@/apis";
import type { BlogResponse } from "@/types/api.type";



function BlogListSection() {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 6;

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await blogApi.getCategories();
        setCategories(response);
      } catch (err) {
        console.error("❌ Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch blogs
  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        const response = await blogApi.getAll(
          currentPage, 
          postsPerPage, 
          selectedCategoryId ?? undefined
        );
        
        setBlogs(response.data);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.error("❌ Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, [currentPage, selectedCategoryId]);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryId]);

  // Client-side search filter
  const filteredBlogs = blogs.filter(blog => {
    if (!searchTerm) return true;
    return blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategoryId === null ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/90 transition-colors"
            onClick={() => setSelectedCategoryId(null)}
          >
            Tất cả
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategoryId === category.id ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/90 transition-colors"
              onClick={() => setSelectedCategoryId(category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Đang tải...</div>
        </div>
      )}

      {/* Blog Posts Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((post) => (
            <Card key={post.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <Link href={`/blog/${post.id}`}>
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg cursor-pointer">
                  <Image
                    src={post.image || "/cover.png"}
                    alt={post.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </Link>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <Link href={`/blog/${post.id}`}>
                  <CardTitle className="line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                    {post.title}
                  </CardTitle>
                </Link>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.date).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/blog/${post.id}`} className="w-full">
                  <Button variant="ghost" className="w-full group">
                    Đọc thêm
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && filteredBlogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            Không tìm thấy bài viết nào phù hợp
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredBlogs.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Trước
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              const showPage = 
                page === 1 || 
                page === totalPages || 
                (page >= currentPage - 1 && page <= currentPage + 1);
              
              const showEllipsis = 
                (page === currentPage - 2 && currentPage > 3) ||
                (page === currentPage + 2 && currentPage < totalPages - 2);

              if (showEllipsis) {
                return (
                  <span key={page} className="px-3 py-2 text-muted-foreground">
                    ...
                  </span>
                );
              }

              if (!showPage) return null;

              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="min-w-[40px]"
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Sau
          </Button>
        </div>
      )}

      {/* Results Info */}
      {!loading && filteredBlogs.length > 0 && (
        <div className="text-center mt-6 text-sm text-muted-foreground">
          Trang {currentPage} / {totalPages} - Tổng số {filteredBlogs.length} bài viết
        </div>
      )}
    </div>
  );
}

export default BlogListSection;
