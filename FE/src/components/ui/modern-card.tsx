"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hoverGlow?: boolean;
}

export function ModernCard({
  children,
  className,
  glass = true,
  hoverGlow = true,
  ...props
}: ModernCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl transition-all duration-300 border border-border/40",
        glass
          ? "bg-card/75 backdrop-blur-md dark:bg-card/60 shadow-lg shadow-black/5"
          : "bg-card shadow-md",
        hoverGlow &&
          "hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
