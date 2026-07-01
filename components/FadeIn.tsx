"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function FadeIn({ children, delay = 0, direction = "up", className = "", fullWidth = false }: { children: ReactNode, delay?: number, direction?: "up" | "down" | "left" | "right" | "none", className?: string, fullWidth?: boolean }) {
  
  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: { duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] as const } 
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={direction === "none" ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.7, delay } } } : variants}
      className={`${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}
