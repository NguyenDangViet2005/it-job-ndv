"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  stagger?: number;
  staggerChildren?: string;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 40,
  duration = 0.8,
  stagger = 0,
  staggerChildren,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = ref.current;
    if (!el) return;

    let x = 0;
    let y = 0;

    if (direction === "up") y = distance;
    if (direction === "down") y = -distance;
    if (direction === "left") x = distance;
    if (direction === "right") x = -distance;

    let targets: Element[] | Element = el;
    if (staggerChildren) {
      const childEls = el.querySelectorAll(staggerChildren);
      if (childEls.length > 0) {
        targets = Array.from(childEls);
      }
    }

    gsap.fromTo(
      targets,
      {
        opacity: 0,
        x,
        y,
        scale: direction === "none" ? 0.92 : 1,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration,
        delay,
        stagger: stagger > 0 ? stagger : undefined,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [delay, direction, distance, duration, stagger, staggerChildren]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
