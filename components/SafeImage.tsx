"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { CldImage } from "next-cloudinary";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { isCloudinarySrc, toCloudinaryPublicId } from "@/lib/cloudinary-utils";

/**
 * Wraps next/image (or CldImage for Cloudinary assets) with a graceful
 * fallback so a missing or rate-limited remote image never shows a broken icon.
 */
export function SafeImage({ className, fill, alt, src, width, height, sizes, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);
  const srcString = typeof src === "string" ? src : undefined;
  const useCloudinary = Boolean(srcString && isCloudinarySrc(srcString));

  if (failed || !srcString) {
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

  if (useCloudinary) {
    const publicId = toCloudinaryPublicId(srcString);
    const w = typeof width === "number" ? width : 800;
    const h = typeof height === "number" ? height : 800;

    if (fill) {
      return (
        <CldImage
          src={publicId}
          alt={alt}
          fill
          sizes={sizes}
          crop={{ type: "fill", source: true }}
          className={className}
          onError={() => setFailed(true)}
        />
      );
    }

    return (
      <CldImage
        src={publicId}
        alt={alt}
        width={w}
        height={h}
        sizes={sizes}
        crop={{ type: "auto", source: true }}
        className={className}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
