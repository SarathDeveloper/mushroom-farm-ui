import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { SafeImage } from "@/components/SafeImage";
import { Button } from "@/components/ui/button";

export function AboutPreview() {
  return (
    <section className="bg-[#f7f6f2] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] lg:min-h-[720px]">
        <FadeIn direction="right" className="relative min-h-[480px] lg:min-h-full">
          <SafeImage
            src="/gallery/mathesh-owner.png"
            alt="Mathesh — Owner & Head Farmer at Sari Amman Oyster Mushroom Farm"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-top"
            priority
          />
        </FadeIn>

        <FadeIn
          direction="left"
          className="flex flex-col justify-center px-8 sm:px-12 md:px-16 xl:px-24 py-20 lg:py-28"
        >
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-primary leading-tight">
            Meet Mathesh
          </h2>
          <div className="w-14 h-0.5 bg-[#3d7a5f] mt-5 mb-8" aria-hidden="true" />

          <div className="space-y-5 text-[var(--color-body)] text-sm sm:text-base leading-relaxed max-w-xl">
            <p>
              Known as a pioneering mushroom farmer of the Kalvarayan Hills, Mathesh has
              dedicated his life to promoting sustainable farming and empowering local communities
              through agricultural education.
            </p>
            <p>
              His mission extends beyond mushroom farming — he&apos;s creating opportunities for
              farmers&apos; financial independence while providing the community with the freshest,
              most nutritious produce.
            </p>
          </div>

          <div className="pt-10">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full h-12 px-7 border-primary text-primary bg-transparent hover:bg-primary hover:text-white hover:scale-[1.02] text-sm sm:text-base font-semibold"
            >
              <Link href="/about">
                Learn More About Our Story
                <ArrowRight className="ml-1.5 size-4 transition-transform group-hover/button:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
