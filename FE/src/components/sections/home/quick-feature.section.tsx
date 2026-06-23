"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { featureCardItems } from "@/constants/navigation.config";

export default function QuickFeatureSection() {
  return (
    <Card className="w-full max-w-7xl mx-auto shadow-md rounded-2xl text-sm">
      <CardContent className="p-3 lg:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-6">
          {featureCardItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex flex-col gap-2 lg:gap-3 cursor-target">
                <div className="relative">
                  <Icon className="w-5 h-5 lg:w-7 lg:h-7 text-primary" />
                  {item.badge && (
                    <span className="absolute -top-1 lg:-top-2 left-4 lg:left-5 bg-destructive text-destructive-foreground text-[6px] lg:text-[7px] font-bold px-1.5 lg:px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xs lg:text-[15px] font-semibold">{item.title}</h3>
                <p className="text-muted-foreground text-[11px] lg:text-sm flex-1 leading-tight lg:leading-normal">
                  {item.description}
                </p>
                <Link
                  href={item.href}
                  className="text-primary text-[11px] lg:text-sm font-semibold inline-flex items-center gap-1 hover:underline"
                >
                  {item.linkText} <ArrowRight size={12} className="lg:w-4 lg:h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
