"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import SearchBar from "@/components/features/navigation/search-bar";
import TextRotator from "@/components/features/text-rotater";
import { LottieAnimation } from "@/components/common/lottie-animation";

export const HeroSection = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    gsap.fromTo(
      contentRef.current.children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <div className="relative w-full min-h-[580px] lg:min-h-[640px] pt-12 pb-24 overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background border-b border-border/30">
      {/* Dynamic Glow Backgrounds */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div
        ref={contentRef}
        className="w-[90%] max-w-[1350px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10"
      >
        {/* Left Column: Text Content & Search */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Hơn 10.000+ Cơ Hội Việc Làm IT Chất Lượng
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold text-foreground tracking-320px leading-[1.3]">
            Nâng Tầm Sự Nghiệp IT <br className="hidden sm:block" /> Của Bạn Với{" "}
            <TextRotator />
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
            Kết nối trực tiếp với các Công ty Công nghệ hàng đầu, săn deal lương ngàn đô và kiến tạo tương lai sự nghiệp đột phá.
          </p>

          {/* SearchBar redesign container */}
          <div className="w-full pt-2">
            <SearchBar />
          </div>

          {/* Popular Tag Pills */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground/80">Từ khóa HOT:</span>
            {["ReactJS", "NodeJS", "Java", "Python", "DevOps", "AI / ML"].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-card/80 hover:bg-primary/10 hover:text-primary border border-border/50 transition-all cursor-pointer font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Lottie Animation */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-full max-w-lg lg:max-w-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-amber-500/20 rounded-3xl blur-2xl -z-10 transform scale-95" />
            <LottieAnimation
              src="/media/welcome.json"
              className="w-full h-[320px] sm:h-[400px] lg:h-[480px] drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};