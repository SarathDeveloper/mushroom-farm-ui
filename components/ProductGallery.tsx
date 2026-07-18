"use client";

import { useState } from "react";
import { SafeImage } from "@/components/SafeImage";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative h-96 sm:h-[480px] rounded-2xl overflow-hidden bg-secondary/40 border border-border">
        <SafeImage
          key={images[active]}
          src={images[active]}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover animate-in fade-in duration-300"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${name}`}
              className={cn(
                "relative h-20 w-20 rounded-xl overflow-hidden border-2 transition-colors shrink-0",
                active === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <SafeImage src={img} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
