"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import SearchBar from "@/components/features/navigation/search-bar";
import HeroSlideshow from "@/components/sections/home/hero-slideshow";
import TextRotator from "@/components/features/text-rotater";

interface HeroSectionProps {
  height?: number;
}

export const HeroSection = ({ height = 400 }: HeroSectionProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    
    gsap.fromTo(
      contentRef.current.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <div className="relative w-full" style={{ height: `${height}px` }}>
      <HeroSlideshow />
      <div 
        ref={contentRef}
        className="absolute w-full top-14 left-1/2 translate-x-[-50%] max-w-[1200px] mx-auto px-4 z-10"
      >
        <div className="mt-24 text-center md:text-left md:ml-2 lg:ml-0">
          <TextRotator />
        </div>
        <div className="mt-8">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};