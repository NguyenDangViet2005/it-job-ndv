"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const relatedPosts = [
  {
    id: 4,
    title: "Kinh nghiệm làm việc tại công ty outsourcing",
    excerpt: "Chia sẻ trải nghiệm thực tế về môi trường làm việc, cơ hội phát triển và những điều cần lưu ý.",
    author: "Phạm Thị D",
    date: "2024-11-20",
    category: "Nghề nghiệp",
    readTime: "7 phút đọc",
  },
  {
    id: 5,
    title: "Top 10 câu hỏi phỏng vấn JavaScript thường gặp",
    excerpt: "Tổng hợp những câu hỏi JavaScript phổ biến nhất trong các buổi phỏng vấn kèm theo câu trả lời chi tiết.",
    author: "Hoàng Văn E",
    date: "2024-11-15",
    category: "Phỏng vấn",
    readTime: "10 phút đọc",
  },
  {
    id: 6,
    title: "Làm thế nào để thương lượng lương hiệu quả",
    excerpt: "Hướng dẫn cách chuẩn bị và thương lượng mức lương phù hợp với năng lực và kinh nghiệm của bạn.",
    author: "Vũ Thị F",
    date: "2024-11-10",
    category: "Nghề nghiệp",
    readTime: "5 phút đọc",
  },
  {
    id: 7,
    title: "Kinh nghiệm làm việc remote hiệu quả",
    excerpt: "Chia sẻ tips và tricks để làm việc từ xa hiệu quả, duy trì năng suất và work-life balance tốt.",
    author: "Đỗ Văn G",
    date: "2024-11-05",
    category: "Nghề nghiệp",
    readTime: "6 phút đọc",
  },
  {
    id: 8,
    title: "Cách chuẩn bị cho buổi phỏng vấn kỹ thuật",
    excerpt: "Hướng dẫn chi tiết về cách chuẩn bị cho coding interview, system design và behavioral questions.",
    author: "Bùi Thị H",
    date: "2024-10-30",
    category: "Phỏng vấn",
    readTime: "9 phút đọc",
  },
  {
    id: 9,
    title: "Học TypeScript cho người mới bắt đầu",
    excerpt: "Lộ trình học TypeScript từ cơ bản, giúp bạn viết JavaScript an toàn và dễ maintain hơn.",
    author: "Ngô Văn I",
    date: "2024-10-25",
    category: "Học tập",
    readTime: "7 phút đọc",
  },
  {
    id: 10,
    title: "Xu hướng công nghệ IT năm 2024",
    excerpt: "Tổng hợp những công nghệ hot nhất năm 2024 mà developer nên học và theo dõi.",
    author: "Lý Thị K",
    date: "2024-10-20",
    category: "Học tập",
    readTime: "8 phút đọc",
  },
  {
    id: 11,
    title: "Cách xây dựng portfolio ấn tượng",
    excerpt: "Hướng dẫn tạo portfolio website để showcase các dự án và kỹ năng của bạn một cách chuyên nghiệp.",
    author: "Trương Văn L",
    date: "2024-10-15",
    category: "Tìm việc",
    readTime: "6 phút đọc",
  },
  {
    id: 12,
    title: "Kinh nghiệm chuyển đổi nghề sang IT",
    excerpt: "Chia sẻ hành trình chuyển nghề sang IT từ ngành khác, những khó khăn và cách vượt qua.",
    author: "Phan Thị M",
    date: "2024-10-10",
    category: "Nghề nghiệp",
    readTime: "10 phút đọc",
  }
];

interface BlogRelatedSectionProps {
  currentId: string;
}

function BlogRelatedSection({ currentId }: BlogRelatedSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  // Filter out current post
  const filteredPosts = relatedPosts.filter(post => post.id.toString() !== currentId);

  if (filteredPosts.length === 0) {
    return null;
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Bài viết liên quan</h2>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <CardTitle className="line-clamp-2 text-lg hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span className="text-xs">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span className="text-xs">{new Date(post.date).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-primary text-sm font-medium group">
                  Đọc thêm
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default BlogRelatedSection;
