"use client";

import { useEffect, useRef, useState } from "react";

interface LottieAnimationProps {
  src: string;
  className?: string;
}

export function LottieAnimation({
  src,
  className = "w-full h-64",
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load Lottie animation");
        return res.json();
      })
      .then((data) => {
        if (isMounted) setAnimationData(data);
      })
      .catch((err) => {
        console.error("Lottie load error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [src]);

  useEffect(() => {
    if (!animationData || !containerRef.current) return;

    let anim: any;
    // Dynamically load lottie-web if installed or available
    import("lottie-web")
      .then((lottie) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
          anim = lottie.default.loadAnimation({
            container: containerRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData,
          });
        }
      })
      .catch((err) => {
        console.error("Lottie player load error:", err);
      });

    return () => {
      if (anim && typeof anim.destroy === "function") {
        anim.destroy();
      }
    };
  }, [animationData]);

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center ${className}`}
    />
  );
}
