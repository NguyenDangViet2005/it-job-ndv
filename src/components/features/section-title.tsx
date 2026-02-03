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
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 ${className}`}
    >
      <div className={`${align === "center" ? "text-center mx-auto" : ""}`}>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
          {title}
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
        )}
      </div>

      {showViewAll && (
        <a
          href={viewAllLink}
          className="group flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
        >
          Xem tất cả
          <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      )}
    </div>
  );
}
