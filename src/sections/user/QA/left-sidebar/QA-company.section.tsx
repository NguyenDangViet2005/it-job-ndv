"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { Lightbulb, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/configs";

function BlogCompany({ companyPosts }: { companyPosts: any[] }) {
  // Lấy 2 bài mới nhất
  // Assuming 'createdAt' exists on real data, else fallback to date or now
  const latestPosts = companyPosts
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.date).getTime() -
        new Date(a.createdAt || a.date).getTime(),
    )
    .slice(0, 4);

  return (
    <Card className="border-border/50 py-3">
      <CardHeader>
        <CardTitle className="text-xs flex items-center gap-2">
          <Lightbulb className="h-3.5 w-3.5 text-primary" />
          Chia sẻ kinh nghiệm
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        {latestPosts.map((post: any) => (
          <Link
            href={ROUTES.BLOG_DETAIL(post.id)}
            key={post.id}
            rel="noopener noreferrer"
          >
            <div className="flex items-start gap-2 cursor-pointer hover:bg-accent/50 p-1 rounded-lg transition-colors">
              <div className="w-8 h-8 overflow-hidden flex-shrink-0 border border-gray-200">
                <Image
                  src={
                    post.image || post.companyLogo || "/images/placeholder.png"
                  }
                  alt={post.company || post.author || "Blog"}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium line-clamp-2 leading-tight">
                  {post.title}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {post.companyName || post.author || "IT Job"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
      <Button
        variant="ghost"
        className="w-full justify-center text-xs text-primary hover:bg-primary/10"
      >
        Xem thêm
        <ArrowRight className="h-3 w-3 ml-1" />
      </Button>
    </Card>
  );
}

export default BlogCompany;
