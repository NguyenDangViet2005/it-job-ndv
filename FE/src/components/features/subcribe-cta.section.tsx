"use client";

import DownloadButton from "../common/buttons/download.button";
import { LottieAnimation } from "../common/lottie-animation";

export default function SubscribeCTASection() {
  return (
    <div className="w-full relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-r from-primary/10 via-card to-background p-6 sm:p-8 md:p-10 shadow-xl shadow-primary/5 backdrop-blur-md">
      {/* Background blur accents */}
      <div className="absolute -top-12 -right-12 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Text & Buttons */}
        <div className="md:col-span-8 flex flex-col items-center md:items-start text-center md:text-left space-y-4 ">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
            Trải Nghiệm Di Động Mượt Mà
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight uppercase">
            Tải Ứng Dụng <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">IT-Job</span> Ngay
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed">
            Săn deal lương ngàn đô, ứng tuyển nhanh chóng và nhận thông báo công việc IT mới nhất mọi lúc, mọi nơi ngay trên smartphone của bạn.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <DownloadButton type="ggplay" />
            <DownloadButton type="appstore" />
          </div>
        </div>

        {/* Right: Lottie JSON Animation */}
        <div className="md:col-span-4 flex justify-center items-center">
          <LottieAnimation
            src="/media/it-deal.json"
            className="w-full h-[180px] sm:h-[220px] md:h-[250px] drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}


