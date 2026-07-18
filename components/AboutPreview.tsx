import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { SafeImage } from "@/components/SafeImage";
import { Button } from "@/components/ui/button";

export function AboutPreview() {
  return (
    <section className="bg-secondary overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] sm:min-h-[600px] lg:min-h-[720px]">
        <FadeIn direction="right" className="relative min-h-[320px] sm:min-h-[480px] lg:min-h-full overflow-hidden group/image">
          {/* Subtle warm organic ambient layer behind the image */}
          <div className="absolute inset-0 bg-[#1A4938]/5" />
          
          <SafeImage
            src="/gallery/mathesh-owner.png"
            alt="Mathesh — Owner & Head Farmer at Sri Amman Mushroom Farms"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-top brightness-[0.97] contrast-[1.05] saturate-[1.03] transition-transform duration-700 group-hover/image:scale-[1.02]"
            priority
          />
          
          {/* Elegant warm rustic gradient vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#102B20]/80 via-transparent to-[#102B20]/20 pointer-events-none" />
          
          {/* Beautiful inset double framing border */}
          <div className="absolute inset-4 sm:inset-6 lg:inset-8 border border-white/20 pointer-events-none rounded-2xl transition-all duration-500 group-hover/image:inset-3 sm:group-hover/image:inset-5 lg:group-hover/image:inset-7 group-hover/image:border-white/35" />
          <div className="absolute inset-5 sm:inset-7 lg:inset-9 border border-dashed border-white/10 pointer-events-none rounded-xl" />

          {/* Top floating authenticity badge */}
          <div className="absolute top-6 left-6 sm:top-8 sm:left-8 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-primary/20 shadow-md flex items-center gap-2 pointer-events-none">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-primary">
              Owner &amp; Head Farmer
            </span>
          </div>

          {/* Bottom floating location stamp */}
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 bg-[#1A4938]/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 shadow-lg flex flex-col pointer-events-none">
            <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-white/60">ESTABLISHED</span>
            <span className="text-xs font-extrabold text-white mt-0.5">2017 • Kalvarayan Hills</span>
          </div>
        </FadeIn>

        <FadeIn
          direction="left"
          className="flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-24 py-20 lg:py-28"
        >
          <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-foreground leading-tight tracking-tight">
            Meet Mathesh
          </h2>
          <div className="w-14 h-0.5 bg-primary mt-5 mb-8" aria-hidden="true" />

          <div className="space-y-5 text-[var(--color-body)] text-sm sm:text-base leading-relaxed max-w-xl">
            <p>
              I started growing mushrooms in 2017 from Kalvarayan Hills with a single shed.
              Over the years, my work earned recognition from the District Collector and the
              Horticulture Department. Today, I run 30 mushroom units with individual partners
              across Kalvarayan Hills. We supply fresh mushrooms daily and I help local farmers
              build their own livelihood.
            </p>
            <p>
              My goal is simple &mdash; grow the freshest mushrooms and help more farmers earn
              a steady income.
            </p>
          </div>

          <div className="pt-10">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full h-12 px-7 border-primary text-primary bg-transparent hover:bg-primary hover:text-white text-sm sm:text-base font-semibold"
            >
              <Link href="/about">
                Read Our Story
                <ArrowRight className="ml-1.5 size-4 transition-transform group-hover/button:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
