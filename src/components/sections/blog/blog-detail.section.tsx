"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { blogApi } from "@/apis";
import type { BlogResponse } from "@/types/api.type";
import { formatDate } from "@/utils/format";
import Image from "next/image";
import { ROUTES } from "@/constants";

interface BlogDetailSectionProps {
  id: string;
}

function BlogDetailSection({ id }: BlogDetailSectionProps) {
  const [post, setPost] = useState<BlogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogDetail() {
      try {
        setLoading(true);
        setError(null);
        const response = await blogApi.getById(Number(id));
        setPost(response);
      } catch (err) {
        console.error("❌ Error fetching blog detail:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchBlogDetail();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-muted-foreground text-lg">
            Đang tải bài viết...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">
          {error || "Không tìm thấy bài viết"}
        </h2>
        <Link href={ROUTES.BLOGS}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h2>
        <Link href={ROUTES.BLOGS}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <article>
      {/* Back Button */}
      <Link href={ROUTES.BLOGS}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <Badge className="mb-4">{post.category}</Badge>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.createdat, "long")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{post.readtime}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Chia sẻ
          </Button>
          <Button variant="outline" size="sm">
            <Bookmark className="mr-2 h-4 w-4" />
            Lưu bài viết
          </Button>
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Featured Image */}
      {post.image && (
        <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-base prose-p:leading-7 prose-p:mb-4 prose-ul:my-4 prose-li:my-2 prose-strong:font-semibold prose-strong:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          components={
            {
              h2: ({ ...props }) => (
                <h2
                  className="text-2xl font-bold mt-8 mb-4 text-foreground"
                  {...props}
                />
              ),
              h3: ({ ...props }) => (
                <h3
                  className="text-xl font-bold mt-6 mb-3 text-foreground"
                  {...props}
                />
              ),
              p: ({ ...props }) => (
                <p
                  className="text-base leading-7 mb-4 text-foreground/90"
                  {...props}
                />
              ),
              ul: ({ ...props }) => (
                <ul
                  className="list-disc list-inside my-4 space-y-2"
                  {...props}
                />
              ),
              ol: ({ ...props }) => (
                <ol
                  className="list-decimal list-inside my-4 space-y-2"
                  {...props}
                />
              ),
              li: ({ ...props }) => (
                <li
                  className="text-base leading-7 text-foreground/90"
                  {...props}
                />
              ),
              code: ({ className, children, ...props }: any) => {
                return (
                  <code
                    className={
                      className ||
                      "bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary"
                    }
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              pre: ({ ...props }) => (
                <pre
                  className="bg-muted border border-border rounded-lg p-4 overflow-x-auto my-4"
                  {...props}
                />
              ),
              blockquote: ({ ...props }) => (
                <blockquote
                  className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4"
                  {...props}
                />
              ),
              strong: ({ ...props }) => (
                <strong className="font-semibold text-foreground" {...props} />
              ),
              a: ({ ...props }) => (
                <a
                  className="text-primary hover:underline font-medium"
                  {...props}
                />
              ),
            } as any
          }
        >
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      <Separator className="my-8" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Image
              src={post.avatar || "/default-avatar.png"}
              alt={post.author || "Author"}
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div>
            <p className="font-semibold">{post.author}</p>
            <p className="text-sm text-muted-foreground">Tác giả</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Chia sẻ
          </Button>
        </div>
      </div>
    </article>
  );
}

export default BlogDetailSection;
