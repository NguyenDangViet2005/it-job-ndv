"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const NavigationLink = ({
  href,
  children,
  className,
}: NavigationLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "relative group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200",
        "hover:text-primary",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className
      )}
    >
      {children}
    </Link>
  );
};
