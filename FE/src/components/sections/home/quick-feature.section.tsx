"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { featureCardItems } from "@/constants/navigation.config";
import { ModernCard } from "@/components/ui/modern-card";

export default function QuickFeatureSection() {
  return (
    <ModernCard className="w-full max-w-7xl mx-auto p-4 lg:p-6 -mt-25" glass hoverGlow={false}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        {featureCardItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex flex-col gap-2.5 p-3.5 rounded-xl hover:bg-secondary/40 transition-colors group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 w-fit">
                  <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                {item.badge && (
                  <span className="bg-destructive text-destructive-foreground text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <h3 className="text-xs lg:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-[11px] lg:text-xs leading-relaxed flex-1">
                {item.description}
              </p>
              <Link
                href={item.href}
                className="text-primary text-[11px] lg:text-xs font-semibold inline-flex items-center gap-1 group-hover:underline pt-1"
              >
                <span>{item.linkText}</span>
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          );
        })}
      </div>
    </ModernCard>
  );
}

