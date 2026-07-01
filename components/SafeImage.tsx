"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Wraps next/image with a graceful fallback so a missing or rate-limited
 * remote image (e.g. a hotlinked stock photo) never shows a broken-image icon.
 */
export function SafeImage({ className, fill, alt, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={typeof alt === "string" ? alt : undefined}
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-primary/15 via-secondary to-accent/20",
          fill ? "absolute inset-0" : "h-full w-full",
          className
        )}
      >
        <Leaf className="text-primary/30" size={36} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      fill={fill}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
