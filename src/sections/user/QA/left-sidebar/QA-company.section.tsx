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

function BlogCompany({ companyPosts }: { companyPosts: any[] }) {
  // Lấy 2 bài mới nhất
  const latestPosts = companyPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

  return (
    <Card className="border-border/50">
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-xs flex items-center gap-2">
          <Lightbulb className="h-3.5 w-3.5 text-primary" />
          Chia sẻ kinh nghiệm
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2">
        {latestPosts.map((post: any) => (
          <div
            key={post.id}
            className="flex items-start gap-2 cursor-pointer hover:bg-accent/50 p-1.5 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-muted">
              <img
                src={post.companyLogo}
                alt={post.company}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium line-clamp-2 leading-tight">
                {post.title}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {post.company}
              </p>
            </div>
          </div>
        ))}

        <Button
          variant="ghost"
          className="w-full justify-center text-xs h-7 text-primary hover:bg-primary/10 mt-1"
        >
          Xem thêm
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}

export default BlogCompany;
