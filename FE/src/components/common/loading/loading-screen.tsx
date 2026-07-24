"use client";

import Image from "next/image";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingScreen({ message = "Đang tải...", fullScreen = true }: LoadingScreenProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-[9999] transition-all duration-300 ${
        fullScreen ? "fixed inset-0 w-screen h-screen" : "w-full py-12"
      }`}
    >
      <div className="relative flex flex-col items-center gap-6">
        {/* Glow behind the icon */}
        <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl animate-pulse" />
        
        {/* Spinner outer ring & center icon */}
        <div className="relative flex items-center justify-center h-28 w-28">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          
          <div className="h-16 w-16 relative transform transition-transform hover:scale-105 duration-300 animate-pulse">
            <Image
              src="/icons/icon.svg"
              alt="Loading..."
              width={64}
              height={64}
              priority
              className="object-contain"
            />
          </div>
        </div>

        {/* Loading text with modern typography and animations */}
        {message && (
          <p className="text-sm font-medium tracking-wide text-muted-foreground animate-pulse mt-2">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
