"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

export function FadeIn({ children, delay = 0, direction = "up", className = "", fullWidth = false }: { children: ReactNode, delay?: number, direction?: "up" | "down" | "left" | "right" | "none", className?: string, fullWidth?: boolean }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

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

  const combinedClassName = `${fullWidth ? "w-full" : ""} ${className}`.trim();

  // Render a plain div on the server / first paint so framer-motion
  // styles (opacity: 0, transforms) don't cause hydration mismatches.
  if (!ready) {
    return <div className={combinedClassName}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={direction === "none" ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.7, delay } } } : variants}
      className={combinedClassName}
    >
      {children}
    </motion.div>
  );
}
