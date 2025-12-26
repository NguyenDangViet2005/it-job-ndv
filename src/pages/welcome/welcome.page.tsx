"use client";
import IntroCard from "@/pages/welcome/intro.card";
import LogoLoop from "@/components/ui/react.bits/logo.loop";
import { Button } from "@/components/ui/shadcn/button";

import Routes from "@/routes";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import Typed from "typed.js";

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  {
    node: <SiTypescript />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiTailwindcss />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
];

export const intro = [
  {
    title: "Cơ hội việc làm",
    description: "Hàng nghìn việc làm IT từ các công ty hàng đầu",
    content:
      "Frontend, Backend, Fullstack, DevOps, Mobile, AI/ML và nhiều vị trí khác",
  },
  {
    title: "Tuyển dụng dễ dàng",
    description: "Đăng tin và tìm kiếm ứng viên chất lượng",
    content: "Hệ thống lọc ứng viên thông minh và quản lý ứng tuyển hiệu quả",
  },
  {
    title: "Phù hợp hoàn hảo",
    description: "AI matching giữa ứng viên và nhà tuyển dụng",
    content: "Thuật toán thông minh giúp kết nối đúng người với đúng việc",
  },
];
const WelcomePage = () => {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        "Hệ sinh thái tuyển dụng IT toàn diện.",
        "Nơi cơ hội gặp gỡ tài năng.",
        "Đơn giản hóa quy trình, tối ưu hóa kết quả.",
      ],
      typeSpeed: 40,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="space-y-4">
          <div className="inline-block rounded-xl bg-background/80 px-3 py-1 text-sm font-medium text-primary mb-2 border border-primary/10">
            Nền tảng tuyển dụng thế hệ mới
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
              Kết nối nhân tài
            </span>
            <br />
            <span className="text-white">Kiến tạo tương lai</span>
          </h1>

          <div className="h-[60px] flex items-center justify-center">
            <span
              className="text-white md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto font-normal"
              ref={el}
            ></span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link href={Routes.home}>
            <Button className="text-sm font-semibold px-8 h-11 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 rounded-md animate-pulse">
              Tìm việc ngay
            </Button>
          </Link>
          <Link href={Routes.login}>
            <Button
              variant="outline"
              className="text-sm font-semibold px-8 h-11 border-2 hover:bg-secondary/50 transition-all duration-300 hover:-translate-y-0.5 rounded-md bg-background/80 backdrop-blur-sm"
            >
              Đăng nhập
            </Button>
          </Link>
        </div>
      </div>

      {/* Tech Stack Loop */}
      <div className="w-full max-w-2xl py-4 opacity-80 hover:opacity-100 transition-opacity duration-500 border-y border-border/40 bg-background/80 backdrop-blur-sm">
        <LogoLoop
          logos={techLogos}
          speed={40}
          direction="left"
          logoHeight={28}
          gap={48}
          pauseOnHover
          scaleOnHover
          fadeOut
          ariaLabel="Technology partners"
        />
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl px-4">
        {intro.map((item, index) => (
          <div
            className="col-span-1 transform hover:z-10 transition-all duration-300"
            key={index}
          >
            <IntroCard data={item} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default WelcomePage;
