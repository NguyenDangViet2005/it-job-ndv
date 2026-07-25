"use client";

import { AppLogoSvg } from "./app-logo-svg";

interface AppLogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  useSvg?: boolean;
}

export function AppLogo({
  width = 160,
  height = 48,
  className = "",
  useSvg = true,
}: AppLogoProps) {
  if (useSvg) {
    return <AppLogoSvg width={width} height={height} className={className} />;
  }

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Light mode logo */}
      <img
        src="/logo/logo-removebg.webp"
        alt="IT-Job Logo"
        style={{ width: typeof width === "number" ? `${width}px` : width, height: typeof height === "number" ? `${height}px` : height }}
        className="block dark:hidden object-contain"
      />

      {/* Dark mode logo */}
      <img
        src="/logo/logo-dark-removebg.webp"
        alt="IT-Job Logo"
        style={{ width: typeof width === "number" ? `${width}px` : width, height: typeof height === "number" ? `${height}px` : height }}
        className="hidden dark:block object-contain"
      />
    </div>
  );
}

export { AppLogoSvg };

