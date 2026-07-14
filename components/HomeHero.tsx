"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SafeImage } from "@/components/SafeImage";
import { cn } from "@/lib/utils";

export type HeroSlideData = {
  badge: string;
  headline: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  image: string;
};

const fallbackSlides: HeroSlideData[] = [
  {
    badge: "Free Delivery above ₹500",
    headline: "Fresh Mushroom\nMarketplace",
    subtitle:
      "Farm-fresh oyster, shiitake & button mushrooms delivered to your doorstep",
    primaryCtaLabel: "Shop Fresh Now",
    primaryCtaHref: "/shop",
    secondaryCtaLabel: "Pre-Order",
    secondaryCtaHref: "/pre-order",
    image: "/gallery/products/oyster-mushrooms-DUuUKbNY.jpg",
  },
  {
    badge: "Certificate Included",
    headline: "Start Mushroom\nFarming",
    subtitle:
      "Complete training from cultivation to marketing by industry experts",
    primaryCtaLabel: "View Courses",
    primaryCtaHref: "/training",
    secondaryCtaLabel: "Book Consultation",
    secondaryCtaHref: "/contact",
    image: "/gallery/recognition/community-meeting.png",
  },
  {
    badge: "Reserve Your Harvest",
    headline: "Pre-Order Fresh\nMushrooms",
    subtitle:
      "Secure seasonal and specialty varieties before they sell out",
    primaryCtaLabel: "Pre-Order Now",
    primaryCtaHref: "/pre-order",
    secondaryCtaLabel: "Browse Shop",
    secondaryCtaHref: "/shop",
    image: "/gallery/farm/growing-shed-interior.png",
  },
];

export function HomeHero({ slides }: { slides?: HeroSlideData[] }) {
  const data = slides && slides.length > 0 ? slides : fallbackSlides;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || isHovered) return;
    const id = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => clearInterval(id);
  }, [emblaApi, isHovered]);

  return (
    <section
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel track */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {data.map((slide, i) => {
            const isActive = i === activeIndex;

            return (
              <div
                key={i}
                className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] flex-[0_0_100%] flex flex-col"
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <SafeImage
                    src={slide.image}
                    alt={slide.headline.replace(/\n/g, " ")}
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F17]/95 via-[#0F2E24]/70 to-[#0F2E24]/30 lg:to-transparent" />

                {/* Slide content */}
                <div className="relative z-10 flex-1 flex flex-col justify-center container mx-auto px-5 sm:px-8 lg:px-12 max-w-7xl pt-12 sm:pt-16 pb-16 sm:pb-24">
                  <div className="max-w-xl lg:max-w-2xl">
                    {/* Badge pill */}
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A4938] text-white text-xs font-semibold tracking-wide mb-6 transition-all duration-700",
                        isActive
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      )}
                      style={{ transitionDelay: isActive ? "200ms" : "0ms" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {slide.badge}
                    </div>

                    {/* Headline */}
                    <h1
                      className={cn(
                        "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.08] font-heading mb-4 sm:mb-5 tracking-tight whitespace-pre-line transition-all duration-700",
                        isActive
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      )}
                      style={{ transitionDelay: isActive ? "350ms" : "0ms" }}
                    >
                      {slide.headline}
                    </h1>

                    {/* Subtitle */}
                    <p
                      className={cn(
                        "text-white/80 text-base sm:text-lg lg:text-xl leading-relaxed max-w-lg mb-8 transition-all duration-700",
                        isActive
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      )}
                      style={{ transitionDelay: isActive ? "500ms" : "0ms" }}
                    >
                      {slide.subtitle}
                    </p>

                    {/* CTA buttons */}
                    <div
                      className={cn(
                        "flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 transition-all duration-700",
                        isActive
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      )}
                      style={{ transitionDelay: isActive ? "650ms" : "0ms" }}
                    >
                      {slide.primaryCtaLabel && slide.primaryCtaHref && (
                        <Link
                          href={slide.primaryCtaHref}
                          className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-[#1A4938] text-white font-semibold px-7 py-3.5 text-sm sm:text-base hover:bg-[#143D2E] transition-colors shadow-lg shadow-black/20"
                        >
                          {slide.primaryCtaLabel}
                          <ArrowRight size={16} />
                        </Link>
                      )}
                      {slide.secondaryCtaLabel && slide.secondaryCtaHref && (
                        <Link
                          href={slide.secondaryCtaHref}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 text-white font-semibold px-7 py-3.5 text-sm sm:text-base hover:bg-white/10 transition-colors backdrop-blur-sm"
                        >
                          {slide.secondaryCtaLabel}
                          <ArrowRight size={16} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition-colors cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition-colors cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Pagination dots */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {data.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "rounded-full transition-all duration-300 h-2.5 cursor-pointer",
              i === activeIndex
                ? "w-8 bg-emerald-500"
                : "w-2.5 bg-white/40 hover:bg-white/60"
            )}
          />
        ))}
      </div>
    </section>
  );
}
