"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Search, Clock, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { blogApi } from "@/apis";
import type { BlogResponse } from "@/types/api.type";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { formatDate } from "@/utils/date.utils";
import { useDebounce } from "@/hooks/useDebounce";
import { ROUTES } from "@/configs";

function BlogListSection() {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 12;

  // Debounce search term với delay 1 giây
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await blogApi.getCategories();
        setCategories(response);
      } catch (err) {
        console.error("❌ Error:", err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        const response = await blogApi.getAll(
          currentPage,
          postsPerPage,
          selectedCategoryId ?? undefined,
        );
        setBlogs(response.data || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, [currentPage, selectedCategoryId]);

  if (loading) return <BlogSkeleton />;

  const featuredBlogs = blogs.slice(0, 3);
  const latestBlogs = blogs.slice(3, 8);
  const categoryBlocks = blogs.slice(8);

  return (
    <div className="space-y-12">
      {/* Featured Grid Section (TopDev Style) */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {featuredBlogs[0] && (
          <div className="md:col-span-2 relative aspect-[16/10] group overflow-hidden">
            <Link href={ROUTES.BLOG_DETAIL(featuredBlogs[0].id)}>
              <Image
                src={featuredBlogs[0].image || "/cover.png"}
                alt={featuredBlogs[0].title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-6 text-white space-y-2">
                <Badge className="bg-red-600 hover:bg-red-700 rounded-none border-none text-xs uppercase font-bold">
                  Nổi bật
                </Badge>
                <h2 className="text-xl md:text-2xl font-semibold leading-tight line-clamp-2 uppercase tracking-tighter">
                  {featuredBlogs[0].title}
                </h2>
                <div className="text-xs text-gray-300 font-medium">
                  {formatDate(featuredBlogs[0].createdAt, "long")}
                </div>
              </div>
            </Link>
          </div>
        )}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredBlogs.slice(1, 3).map((blog) => (
            <div
              key={blog.id}
              className="relative aspect-square md:aspect-auto h-full group overflow-hidden"
            >
              <Link href={ROUTES.BLOG_DETAIL(blog.id)}>
                <Image
                  src={blog.image || "/cover.png"}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 p-4 text-white">
                  <h3 className="text-sm font-semibold leading-tight uppercase tracking-wider">
                    {blog.title}
                  </h3>
                  <div className="text-[10px] text-gray-400 mt-2 font-medium">
                    {formatDate(blog.createdAt, "long")}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Search & Category Filter */}
      <div className="border-y border-border py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-6">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${selectedCategoryId === null ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            MỚI NHẤT
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${selectedCategoryId === cat.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm..."
            className="pl-9 h-9 rounded-none border-input bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Latest Stories (Horizontal Grid) */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">
            Mới nhất
          </h2>
          <div className="h-[2px] bg-primary flex-grow" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {latestBlogs.map((blog) => (
            <div key={blog.id} className="group space-y-3">
              <Link href={ROUTES.BLOG_DETAIL(blog.id)}>
                <div className="relative aspect-video bg-muted/30 overflow-hidden border border-border">
                  <Image
                    src={blog.image || "/cover.png"}
                    alt={blog.title}
                    fill
                    className="object-contain p-2 group-hover:scale-110 transition-transform"
                  />
                </div>
                <h3 className="text-xs font-bold leading-snug line-clamp-3 text-foreground group-hover:text-primary transition-colors uppercase mt-3">
                  {blog.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Category Sections (Bottom Layout) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {["LẬP TRÌNH", "TUYỂN DỤNG", "PHỎNG VẤN"].map((title, idx) => {
          const sectionBlogs = blogs.slice(idx * 4, (idx + 1) * 4);
          if (sectionBlogs.length === 0) return null;

          return (
            <div key={title} className="space-y-6">
              <div className="flex items-center gap-2 border-b-4 border-foreground pb-2">
                <h2 className="text-xl font-black uppercase tracking-tighter text-foreground">
                  {title}
                </h2>
              </div>

              <div className="relative aspect-video group overflow-hidden">
                <Link href={`/blog/${sectionBlogs[0].id}`}>
                  <Image
                    src={sectionBlogs[0].image || "/cover.png"}
                    alt=""
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute bottom-0 p-4">
                    <h3 className="text-white font-semibold uppercase leading-tight text-sm drop-shadow-md">
                      {sectionBlogs[0].title}
                    </h3>
                  </div>
                </Link>
              </div>

              <div className="space-y-4">
                {sectionBlogs.slice(1).map((b) => (
                  <Link
                    key={b.id}
                    href={`/blog/${b.id}`}
                    className="flex gap-4 group"
                  >
                    <div className="w-20 h-14 relative shrink-0 bg-muted">
                      <Image
                        src={b.image || "/cover.png"}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-bold uppercase leading-tight group-hover:text-primary transition-colors line-clamp-2 text-foreground">
                        {b.title}
                      </h4>
                      <p className="text-[9px] text-muted-foreground font-medium">
                        {formatDate(b.createdAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Simple Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            className="rounded-none h-8 px-3"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> TRƯỚC
          </Button>
          <div className="text-xs font-bold px-4">
            TRANG {currentPage} / {totalPages}
          </div>
          <Button
            variant="outline"
            className="rounded-none h-8 px-3"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            SAU <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}

const BlogSkeleton = () => (
  <div className="space-y-12">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Skeleton className="md:col-span-2 aspect-[16/10] rounded-none" />
      <div className="md:col-span-2 grid grid-cols-2 gap-4">
        <Skeleton className="aspect-square rounded-none" />
        <Skeleton className="aspect-square rounded-none" />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="aspect-video rounded-none" />
      ))}
    </div>
  </div>
);

export default BlogListSection;
