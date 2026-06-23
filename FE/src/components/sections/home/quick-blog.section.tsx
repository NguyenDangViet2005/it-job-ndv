"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SectionTitle from "@/components/features/section-title";
import { blogApi } from "@/apis";
import { formatDate } from "@/utils";
import Link from "next/link";
import { ROUTES } from "@/constants";
import { QuickBlogSkeleton } from "@/components/common/skeletons";
import { Blog } from "@/types";

export default function QuickBlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        const response = await blogApi.getAll(1, 6);
        setBlogs(response.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  if (loading) {
    return <QuickBlogSkeleton />;
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="w-full px-2 lg:mx-0">
        <SectionTitle
          title="Blog IT"
          subtitle="Kiến thức và kinh nghiệm từ cộng đồng IT"
          showViewAll
          viewAllLink="/blog"
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Chưa có bài viết nào</div>
        </div>
      </div>
    );
  }

  const featured = blogs[0]; 
  const others = blogs.slice(1); 

  return (
    <div className="w-full px-2 lg:mx-0">
      <SectionTitle
        title="Blog IT"
        subtitle="Kiến thức và kinh nghiệm từ cộng đồng IT"
        showViewAll
        viewAllLink="/blog"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6">
        {featured && (
          <div className="md:col-span-7">
            <Link href={ROUTES.BLOG_DETAIL(featured.id)} className="block group">
              <div className="w-full h-[180px] md:h-[280px] lg:h-[350px] relative overflow-hidden shadow rounded-xl">
                <Image
                  src={featured.image || "/cover.png"}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition"
                  sizes="(max-width: 768px) 100vw, 58vw"
                />
              </div>
              <h3 className="mt-2 lg:mt-3 font-bold text-sm md:text-base lg:text-xl group-hover:text-primary transition">
                {featured.title}
              </h3>
              <p className="text-xs lg:text-sm text-muted-foreground mt-1 line-clamp-2 lg:line-clamp-3">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-2 mt-1 lg:mt-2 text-[10px] lg:text-xs text-muted-foreground">
                <span>{featured.author}</span>
                <span>•</span>
                <span>{featured.readtime}</span>
                <span>•</span>
                <span>
                  {formatDate(featured.createdat)}
                </span>
              </div>
              <span className="text-primary text-xs lg:text-sm mt-1 inline-block hover:underline">
                Đọc thêm
              </span>
            </Link>
          </div>
        )}

        <div className="md:col-span-5 flex flex-col gap-3 lg:gap-4 max-h-[350px] lg:max-h-[450px] overflow-auto">
          {others.map((blog) => (
            <a
              key={blog.id}
              href={ROUTES.BLOG_DETAIL(blog.id)}
              className="flex gap-2 lg:gap-3 group border-b pb-2 lg:pb-3 last:border-none"
            >
              <div className="w-[100px] md:w-[120px] lg:w-[150px] h-[65px] lg:h-[80px] relative overflow-hidden flex-shrink-0 rounded-lg">
                <Image
                  src={blog.image || "/cover.png"}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition"
                  sizes="150px"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-xs lg:text-base group-hover:text-primary transition line-clamp-2">
                  {blog.title}
                </h4>
                <p className="text-[10px] lg:text-sm text-muted-foreground mt-0.5 lg:mt-1 line-clamp-2">
                  {blog.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-0.5 lg:mt-1 text-[9px] lg:text-xs text-muted-foreground">
                  <span>{blog.readtime}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
