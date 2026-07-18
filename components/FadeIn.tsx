"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

const initialTransform: Record<string, string> = {
  up: "translate3d(0, 40px, 0)",
  down: "translate3d(0, -40px, 0)",
  left: "translate3d(40px, 0, 0)",
  right: "translate3d(-40px, 0, 0)",
  none: "none",
};

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className = "",
  fullWidth = false,
}: {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  fullWidth?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: "-100px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const combinedClassName = `${fullWidth ? "w-full" : ""} ${className}`.trim();

  return (
    <div
      ref={ref}
      className={combinedClassName}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : initialTransform[direction],
        transition: `opacity 0.7s cubic-bezier(0.21,0.47,0.32,0.98) ${delay}s, transform 0.7s cubic-bezier(0.21,0.47,0.32,0.98) ${delay}s`,
        willChange: visible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
