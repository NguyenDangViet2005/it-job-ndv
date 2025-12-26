import BlogListSection from "@/sections/user/blog/blog-list.section";
import { HeroSection } from "@/sections/user/common/hero.section";
import React from "react";

function BlogPage() {
  return (
    <div className="bg-background">
      <HeroSection/>
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Blog & Kiến thức IT
          </h1>
          <p className="text-muted-foreground">
            Chia sẻ kinh nghiệm, kiến thức và xu hướng công nghệ mới nhất
          </p>
        </div>

        <BlogListSection />
      </div>
    </div>
  );
}

export default BlogPage;
