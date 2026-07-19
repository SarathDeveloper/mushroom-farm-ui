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
  ShoppingBag,
  Check
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

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Slide content */}
                <div className="relative z-10 flex-1 flex flex-col justify-center container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-8 sm:pt-10 pb-24 sm:pb-28">
                  <div className="max-w-xl lg:max-w-3xl mx-auto flex flex-col items-center text-center">
                    {/* Badge pill */}
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-base font-medium mb-6 sm:mb-8 border border-white/10 transition-all duration-700",
                        isActive
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      )}
                      style={{ transitionDelay: isActive ? "200ms" : "0ms" }}
                    >
                      <Check size={14} className="text-emerald-400" />
                      {slide.badge}
                    </div>

                    {/* Headline */}
                    <h1
                      className={cn(
                        "text-5xl sm:text-6xl md:text-7xl font-extrabold font-sans text-white leading-[1.1] mb-4 sm:mb-6 tracking-tight whitespace-pre-line transition-all duration-700",
                        isActive
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      )}
                      style={{
                        transitionDelay: isActive ? "350ms" : "0ms",
                      }}
                    >
                      {slide.headline}
                    </h1>

                    {/* Subtitle */}
                    <p
                      className={cn(
                        "text-white/80 text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-8 sm:mb-10 transition-all duration-700",
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
                        "flex flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 transition-all duration-700",
                        isActive
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      )}
                      style={{ transitionDelay: isActive ? "650ms" : "0ms" }}
                    >
                      {slide.primaryCtaLabel && slide.primaryCtaHref && (
                        <Link
                          href={slide.primaryCtaHref}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#265e47] text-white font-medium px-5 sm:px-7 py-3 sm:py-3.5 text-base hover:bg-[#1f4e3b] transition-colors shadow-lg shadow-black/20"
                        >
                          <ShoppingBag size={16} />
                          {slide.primaryCtaLabel}
                          <ArrowRight size={16} className="ml-1 opacity-70" />
                        </Link>
                      )}
                      {slide.secondaryCtaLabel && slide.secondaryCtaHref && (
                        <Link
                          href={slide.secondaryCtaHref}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 text-white font-medium px-5 sm:px-7 py-3 sm:py-3.5 text-base hover:bg-white/10 transition-colors backdrop-blur-sm"
                        >
                          {slide.secondaryCtaLabel}
                          <ArrowRight size={16} className="ml-1 opacity-70" />
                        </Link>
                      )}
                    </div>

                    {/* Stats Block */}
                    <div
                      className={cn(
                        "mt-10 sm:mt-12 transition-all duration-700 border-t border-white/20 pt-6 sm:pt-8 w-full max-w-2xl",
                        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                      )}
                      style={{ transitionDelay: isActive ? "800ms" : "0ms" }}
                    >
                      <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center items-center gap-y-4 gap-x-2 sm:gap-10">
                        <div className="text-center">
                          <p className="text-xl sm:text-3xl font-bold text-white mb-0.5">100%</p>
                          <p className="text-[10px] sm:text-sm text-white/70 uppercase tracking-wider">Naturally Grown</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl sm:text-3xl font-bold text-white mb-0.5">Fresh</p>
                          <p className="text-[10px] sm:text-sm text-white/70 uppercase tracking-wider">Same Day Delivery</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl sm:text-3xl font-bold text-white mb-0.5">FSSAI</p>
                          <p className="text-[10px] sm:text-sm text-white/70 uppercase tracking-wider">Certified Safe</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl sm:text-3xl font-bold text-white mb-0.5">Expert</p>
                          <p className="text-[10px] sm:text-sm text-white/70 uppercase tracking-wider">Farm Training</p>
                        </div>
                      </div>
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

      {/* Bottom chrome: dots only */}
      <div className="absolute bottom-0 inset-x-0 z-20 flex flex-col items-center gap-3 pb-6 pt-8 bg-gradient-to-t from-black/20 to-transparent pointer-events-none">
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
