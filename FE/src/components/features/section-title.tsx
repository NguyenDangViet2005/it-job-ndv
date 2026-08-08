import { MoveRight } from "lucide-react";
import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  showViewAll = false,
  viewAllLink = "#",
  align = "left",
  className = "",
}: SectionTitleProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 lg:mb-8 ${className}`}
    >
      <div className={`${align === "center" ? "text-center mx-auto" : ""} space-y-1.5`}>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold uppercase tracking-wider text-primary">
          {title}
        </h2>
        <div className="h-1 w-16 lg:w-20 bg-gradient-to-r from-primary via-emerald-500 to-transparent rounded-full" />
        {subtitle && (
          <p className="text-xs sm:text-sm font-normal text-muted-foreground pt-1">{subtitle}</p>
        )}
      </div>

      {showViewAll && (
        <a
          href={viewAllLink}
          className="group flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors shrink-0"
        >
          <span>Xem tất cả</span>
          <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      )}
    </div>
  );
}
