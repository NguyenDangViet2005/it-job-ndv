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
    <div className="text-3xl font-bold text-white cursor-target inline-block px-4">
      Tìm kiếm{" "}
      <span
        ref={el}
        className="bg-primary text-primary-foreground px-2 py-1 rounded cursor-target"
      ></span>
    </div>
  );
}
export default TextRotator;
