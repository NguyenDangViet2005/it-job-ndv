import BlogDetailSection from "@/sections/user/blog/blog-detail.section"; 
import BlogRelatedSection from "@/sections/user/blog/blog-related.section"; 
import React from "react";

interface BlogDetailPageProps {
  id: string;
}

function BlogDetailPage({ id }: BlogDetailPageProps) {
  return (
    <div className="bg-background">
      <div className="max-w-[900px] mx-auto px-4 py-20">
        <BlogDetailSection id={id} />
        <div className="mt-16">
          <BlogRelatedSection currentId={id} />
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;
