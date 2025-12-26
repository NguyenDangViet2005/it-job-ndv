"use client";

import { motion } from "motion/react";
import {
  SiReact,
  SiNodedotjs,
  SiPython,
  SiDocker,
  SiKubernetes,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiJavascript,
  SiTypescript,
  SiGo,
  SiRust,
} from "react-icons/si";

const icons = [
  { Icon: SiReact, color: "#61DAFB", x: "10%", y: "20%", size: 40 },
  { Icon: SiNodedotjs, color: "#339933", x: "85%", y: "15%", size: 45 },
  { Icon: SiPython, color: "#3776AB", x: "15%", y: "65%", size: 42 },
  { Icon: SiDocker, color: "#2496ED", x: "80%", y: "70%", size: 38 },
  { Icon: SiKubernetes, color: "#326CE5", x: "5%", y: "40%", size: 35 },
  { Icon: SiMongodb, color: "#47A248", x: "92%", y: "45%", size: 40 },
  { Icon: SiPostgresql, color: "#4169E1", x: "25%", y: "85%", size: 36 },
  { Icon: SiGit, color: "#F05032", x: "70%", y: "80%", size: 32 },
  { Icon: SiJavascript, color: "#F7DF1E", x: "30%", y: "10%", size: 30 },
  { Icon: SiTypescript, color: "#3178C6", x: "70%", y: "12%", size: 34 },
  { Icon: SiGo, color: "#00ADD8", x: "35%", y: "90%", size: 38 },
  { Icon: SiRust, color: "#000000", x: "65%", y: "92%", size: 40 },
];

export const FloatingIcons = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute opacity-100"
          style={{ left: item.x, top: item.y, color: item.color }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        >
          <item.Icon size={item.size} />
        </motion.div>
      ))}
    </div>
  );
};
