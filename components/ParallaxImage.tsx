"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SafeImage } from "@/components/SafeImage";

export function ParallaxImage({
  src,
  alt,
  speed = 0.15,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`]);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="absolute inset-x-0 -top-[15%] h-[130%]">
        <SafeImage src={src} alt={alt} fill priority={priority} sizes="100vw" className="object-cover" />
      </motion.div>
    </div>
  );
}
