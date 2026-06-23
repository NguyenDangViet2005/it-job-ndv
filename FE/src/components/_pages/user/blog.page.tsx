"use client";

import BlogListSection from "@/components/sections/blog/blog-list.section";
import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants";
import { HeroSection } from "@/components/features/hero.section";

function BlogPage() {
  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
       <HeroSection />
      <div className="bg-card w-full border-t border-border mt-[-88px] relative z-10 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.1)]">
        {/* Top Breadcrumb / Meta Bar (Optional) */}
        <div className="bg-muted/30 border-b border-border py-2 px-4 lg:px-8">
          <div className="max-w-[1200px] mx-auto flex items-center gap-2 text-[9px] lg:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
             <Link href={ROUTES.HOME} className="hover:text-primary transition-colors">TRANG CHỦ</Link>
             <span>/</span>
             <span className="text-foreground">BLOG & KIẾN THỨC IT</span>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-3 lg:px-8 pt-6 lg:pt-12 pb-10 lg:pb-20">
          {/* Modern Sharp Header */}
          <header className="mb-8 lg:mb-16 space-y-3 lg:space-y-4">
            <div className="flex items-center gap-3 lg:gap-4">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter text-foreground leading-none">
                BLOG & KIẾN THỨC IT
              </h1>
              <div className="h-[3px] lg:h-[4px] bg-primary flex-grow hidden md:block" />
            </div>
            <p className="text-muted-foreground font-medium text-xs lg:text-sm max-w-2xl leading-relaxed italic border-l-2 lg:border-l-4 border-foreground pl-3 lg:pl-6">
              Khám phá kiến thức chuyên sâu, kinh nghiệm thực chiến và xu hướng công nghệ mới nhất từ cộng đồng chuyên gia hàng đầu.
            </p>
          </header>

          <BlogListSection />
        </div>

        <div className="bg-secondary/50 dark:bg-secondary/20 py-8 lg:py-16 border-t border-border">
           <div className="max-w-[1200px] mx-auto px-3 lg:px-4 text-center">
              <h2 className="text-foreground text-lg lg:text-2xl font-semibold tracking-tighter mb-3 lg:mb-4 uppercase">Trở thành một phần của cộng đồng IT-JOB</h2>
              <p className="text-muted-foreground mb-6 lg:mb-8 text-xs lg:text-sm max-w-xl mx-auto">Đăng ký nhận bản tin hàng tuần để không bỏ lỡ bất kỳ cơ hội nghề nghiệp hay kiến thức quan trọng nào.</p>
              <div className="flex max-w-md mx-auto gap-2">
                 <input type="email" placeholder="Email của bạn..." className="flex-grow bg-background border border-border px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base text-foreground focus:outline-none focus:border-primary transition-colors"/>
                 <button className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold px-4 lg:px-8 text-xs lg:text-sm transition-colors">ĐĂNG KÝ</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}


export default BlogPage;


