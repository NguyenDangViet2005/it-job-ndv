"use client";

import { useEffect, useRef } from "react";
import Typed from "typed.js";

function TextRotator() {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Laravel", "ReactJS", "Java", "Python", "NodeJS"],
      typeSpeed: 100,
      backSpeed: 60,
      backDelay: 1500,
      loop: true,
      showCursor: false, // 🔹 Ẩn con trỏ nháy
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <span className="inline-block">
      <span
        ref={el}
        className="bg-gradient-to-r from-primary via-emerald-500 to-teal-500 bg-clip-text text-transparent font-black px-1"
      ></span>
    </span>
  );
}
export default TextRotator;
