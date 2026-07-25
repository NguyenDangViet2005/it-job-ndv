"use client";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Typed from "typed.js";
import { useAuth } from "@/lib/hooks/useAuth";
import { ModeToggle } from "@/components/features/toggle-theme";
import { LottieAnimation } from "@/components/common/lottie-animation";
import { AppLogo } from "@/components/common/app-logo";

const WelcomePage = () => {
  const el = useRef(null);
  const { user } = useAuth();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="relative z-10 w-full min-h-screen">
      {/* Header with Logo and Theme Toggle */}
      <div className="pt-5 px-10 flex items-center justify-between">
        <Link href={ROUTES.HOME} className="cursor-target">
          <AppLogo width={160} height={80} />
        </Link>
        <ModeToggle />
      </div>
      <div className="flex flex-col lg:flex-row mt-10">
        <div className="w-full lg:w-3/5 min-h-[50vh] flex items-center justify-center p-6">
          <div className="w-full max-w-2xl flex items-center justify-center">
            <LottieAnimation
              src="/media/welcome.json"
              className="w-full h-auto max-h-[500px]"
            />
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="w-full lg:w-2/5 min-h-[50vh] flex flex-col items-center justify-center p-6 text-[0.8rem]">
          <div className="w-full max-w-xl space-y-4 lg:space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-3.5 py-1.5 text-xs font-medium text-primary dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Nền tảng tuyển dụng thế hệ mới
            </div>

            {/* Heading */}
            <div className="space-y-2 lg:space-y-3">
              <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight leading-tight">
                <span className="bg-primary bg-clip-text text-transparent">
                  Kết nối
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {" "}
                  nhân tài IT
                </span>
              </h1>

              <div className="h-[50px] lg:h-[55px] flex items-start">
                <p
                  className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-light"
                  ref={el}
                ></p>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-2.5 lg:gap-3 py-2 lg:py-3">
              <div className="flex items-start gap-2.5 text-left">
                <div className="mt-0.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 p-1.5 flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    Hàng ngàn việc làm IT
                  </h3>
                  <p className="text-[11px] text-gray-700 dark:text-gray-400">
                    Cơ hội việc làm từ các công ty công nghệ hàng đầu
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-left">
                <div className="mt-0.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 p-1.5 flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    Ứng tuyển nhanh chóng
                  </h3>
                  <p className="text-[11px] text-gray-700 dark:text-gray-400">
                    Quy trình đơn giản, phản hồi nhanh từ nhà tuyển dụng
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {user ? (
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-base font-semibold text-gray-900 dark:text-white">
                    Xin chào, {user.fullname}
                  </span>
                </div>
              ) : (
                <Link href={ROUTES.LOGIN} className="flex-1">
                  <Button
                    variant="outline"
                    className="cursor-pointer w-full text-base font-semibold px-8 h-12 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                  >
                    Đăng nhập
                  </Button>
                </Link>
              )}
              <Link href={ROUTES.HOME} className="flex-1">
                <Button className="cursor-pointer w-full text-base font-semibold px-8 h-12 bg-primary text-white shadow-lg hover:shadow-primary/40 transition-all duration-300 hover:scale-105">
                  Khám phá việc làm
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WelcomePage;
