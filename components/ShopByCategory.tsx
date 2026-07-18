"use client";

import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { SafeImage } from "@/components/SafeImage";

// Hardcoded for now — wire to admin/DB later
const HARDCODED_CATEGORIES = [
  {
    id: "oyster",
    name: "Oyster",
    slug: "oyster",
    image: "/gallery/products/oyster-mushrooms-DUuUKbNY.jpg",
  },
  {
    id: "milky",
    name: "Milky",
    slug: "milky",
    image: "/gallery/products/mixed-mushrooms-CNX65Zqk.jpg",
  },
  {
    id: "button",
    name: "Button",
    slug: "button",
    image: "/gallery/products/button-mushrooms-Dj92oXDo.jpg",
  },
  {
    id: "shiitake",
    name: "Shiitake",
    slug: "shiitake",
    image: "/gallery/products/shiitake-mushrooms-BMfvtmoS.jpg",
  },
  {
    id: "value-added",
    name: "Ready-Made",
    slug: "value-added",
    image: "/gallery/products/mixed-mushrooms-CNX65Zqk.jpg",
  },
] as const;

export function ShopByCategory() {
  return (
    <section className="py-20 sm:py-28 bg-secondary grain-overlay">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <FadeIn className="text-center mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="hidden sm:block h-px w-8 bg-border" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Shop
            </span>
            <span className="hidden sm:block h-px w-8 bg-border" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight font-heading">
            Shop by Category
          </h2>
          <p className="text-[var(--color-body)] text-sm mt-1.5 max-w-md mx-auto">
            Find the mushrooms you&apos;re looking for
          </p>
        </FadeIn>

        <div className="flex justify-center gap-6 sm:gap-10 md:gap-14 lg:gap-16 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {HARDCODED_CATEGORIES.map((category, i) => (
            <FadeIn key={category.id} delay={i * 0.08} direction="up">
              <Link
                href={`/shop?category=${category.slug}`}
                className="group flex flex-col items-center gap-3 sm:gap-4 shrink-0"
              >
                <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-full overflow-hidden bg-card border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] group-hover:border-primary/30">
                  <SafeImage
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <span className="text-sm sm:text-base font-bold text-foreground text-center font-heading group-hover:text-primary transition-colors">
                  {category.name}
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
