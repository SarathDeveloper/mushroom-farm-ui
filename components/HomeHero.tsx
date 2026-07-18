"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Leaf,
  Clock,
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
  video?: string;
};

const fallbackSlides: HeroSlideData[] = [
  {
    badge: "Free Delivery for ₹500+ Orders",
    headline: "Fresh Mushrooms\nFrom Our Farm",
    subtitle:
      "We grow oyster, shiitake & button mushrooms. Pick today, deliver today. Direct from Kalvarayan Hills to your home.",
    primaryCtaLabel: "Buy Now",
    primaryCtaHref: "/shop",
    secondaryCtaLabel: "Book Early",
    secondaryCtaHref: "/pre-order",
    image: "/gallery/products/oyster-mushrooms-DUuUKbNY.jpg",
  },
  {
    badge: "Certificate Given",
    headline: "Learn Mushroom\nFarming",
    subtitle:
      "We teach you how to grow mushrooms and earn money. Easy training with hands-on practice.",
    primaryCtaLabel: "See Courses",
    primaryCtaHref: "/training",
    secondaryCtaLabel: "Talk to Us",
    secondaryCtaHref: "/contact",
    image: "/gallery/recognition/community-meeting.png",
  },
  {
    badge: "Book Before It's Gone",
    headline: "Pre-Order\nMushrooms",
    subtitle:
      "Some mushrooms are available only in certain seasons. Book early so you don't miss out.",
    primaryCtaLabel: "Book Now",
    primaryCtaHref: "/pre-order",
    secondaryCtaLabel: "See All",
    secondaryCtaHref: "/shop",
    image: "/gallery/farm/growing-shed-interior.png",
  },
];

const trustBadges = [
  { icon: ShieldCheck, label: "FSSAI Registered" },
  { icon: Leaf, label: "Natural Growing" },
  { icon: Clock, label: "Fresh Harvests" },
];

function VideoBackground({ src, isActive }: { src: string; isActive: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (isActive) {
      ref.current.play().catch(() => {});
    } else {
      ref.current.pause();
    }
  }, [isActive]);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      className={cn(
        "absolute inset-0 w-full h-full object-cover transition-transform duration-[8000ms] ease-out",
        isActive ? "scale-105" : "scale-100",
      )}
    />
  );
}

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
            const hasVideo = !!slide.video;

            return (
              <div
                key={i}
                className="relative h-screen flex-[0_0_100%] flex flex-col"
              >
                {/* Background: video or image with Ken Burns */}
                <div className="absolute inset-0 overflow-hidden">
                  {hasVideo ? (
                    <VideoBackground src={slide.video!} isActive={isActive} />
                  ) : (
                    <SafeImage
                      src={slide.image}
                      alt={slide.headline.replace(/\n/g, " ")}
                      fill
                      priority={i === 0}
                      sizes="100vw"
                      className={cn(
                        "object-cover object-center transition-transform duration-[8000ms] ease-out",
                        isActive ? "scale-105" : "scale-100",
                      )}
                    />
                  )}
                </div>

                {/* Gradient overlay — lighter for photo-forward look */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F17]/80 via-[#0F2E24]/55 to-[#0F2E24]/20 lg:to-transparent" />

                {/* Slide content */}
                <div className="relative z-10 flex-1 flex flex-col justify-center container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-8 sm:pt-10 pb-24 sm:pb-28">
                  <div className="max-w-xl lg:max-w-2xl">
                    {/* Badge pill */}
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold tracking-wide mb-4 sm:mb-6 border border-white/20 transition-all duration-700",
                        isActive
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      )}
                      style={{ transitionDelay: isActive ? "200ms" : "0ms" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {slide.badge}
                    </div>

                    {/* Headline — using display serif font */}
                    <h1
                      className={cn(
                        "text-2xl sm:text-3xl font-extrabold text-white leading-[1.08] mb-3 sm:mb-5 tracking-tight whitespace-pre-line transition-all duration-700",
                        isActive
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      )}
                      style={{
                        fontFamily: "var(--font-display)",
                        transitionDelay: isActive ? "350ms" : "0ms",
                      }}
                    >
                      {slide.headline}
                    </h1>

                    {/* Subtitle */}
                    <p
                      className={cn(
                        "text-white/85 text-sm md:text-base leading-relaxed max-w-lg mb-6 sm:mb-8 transition-all duration-700",
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
                        "flex flex-row flex-wrap items-center gap-3 sm:gap-4 transition-all duration-700",
                        isActive
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      )}
                      style={{ transitionDelay: isActive ? "650ms" : "0ms" }}
                    >
                      {slide.primaryCtaLabel && slide.primaryCtaHref && (
                        <Link
                          href={slide.primaryCtaHref}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-white font-semibold px-5 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-black/20"
                        >
                          {slide.primaryCtaLabel}
                          <ArrowRight size={16} />
                        </Link>
                      )}
                      {slide.secondaryCtaLabel && slide.secondaryCtaHref && (
                        <Link
                          href={slide.secondaryCtaHref}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 text-white font-semibold px-5 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm hover:bg-white/10 transition-colors backdrop-blur-sm"
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

      {/* Prev / Next arrows — desktop/tablet only; mobile uses swipe + dots */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="hidden sm:flex absolute left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 items-center justify-center text-white hover:bg-black/50 transition-colors cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        className="hidden sm:flex absolute right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 items-center justify-center text-white hover:bg-black/50 transition-colors cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Bottom chrome: trust badges + dots in one clear band */}
      <div className="absolute bottom-0 inset-x-0 z-20 flex flex-col items-center gap-3 pb-4 sm:pb-6 pt-8 bg-gradient-to-t from-black/40 to-transparent pointer-events-none">
        <div className="hidden sm:flex items-center gap-6 pointer-events-auto">
          {trustBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-1.5 text-white/70 text-xs font-medium"
            >
              <badge.icon size={14} strokeWidth={1.5} className="text-emerald-400" />
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 pointer-events-auto">
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
      </div>
    </section>
  );
}
