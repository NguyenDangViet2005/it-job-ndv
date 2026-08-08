"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernSectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  linkText?: string;
  linkHref?: string;
  className?: string;
}

export function ModernSectionHeader({
  title,
  subtitle,
  badge,
  linkText,
  linkHref,
  className,
}: ModernSectionHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between mb-6 lg:mb-8 gap-4", className)}>
      <div className="space-y-1.5">
        {badge && (
          <span className="inline-block px-3 py-1 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-primary/10 text-primary border border-primary/20">
            {badge}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {linkText && linkHref && (
        <Link
          href={linkHref}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group shrink-0"
        >
          <span>{linkText}</span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
