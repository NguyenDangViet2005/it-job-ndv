"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { featureCardItems } from "@/constants/navigation.config";

export default function QuickFeatureSection() {
  return (
    <Card className="w-full max-w-7xl mx-auto shadow-md rounded-2xl text-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {featureCardItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex flex-col gap-3 cursor-target">
                <div className="relative">
                  <Icon className="w-7 h-7 text-primary" />
                  {item.badge && (
                    <span className="absolute -top-2 left-5 bg-destructive text-destructive-foreground text-[7px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-[15px] font-semibold">{item.title}</h3>
                <p className="text-muted-foreground text-sm flex-1">
                  {item.description}
                </p>
                <Link
                  href={item.href}
                  className="text-primary font-semibold inline-flex items-center gap-1 hover:underline"
                >
                  {item.linkText} <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
