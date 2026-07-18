"use client";

import { Scissors, ShieldCheck, Package, Truck, Home } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

const steps = [
  { time: "5:00 AM", title: "We Pick Fresh", icon: Scissors, desc: "Mushrooms picked by hand early morning" },
  { time: "6:30 AM", title: "We Check Quality", icon: ShieldCheck, desc: "Only the best ones selected" },
  { time: "7:00 AM", title: "We Pack Clean", icon: Package, desc: "Packed in cool boxes to stay fresh" },
  { time: "8:00 AM", title: "We Send Out", icon: Truck, desc: "Delivery starts same day" },
  { time: "By Evening", title: "You Get It", icon: Home, desc: "Fresh mushrooms at your door" },
];

export function FarmToTable() {
  return (
    <section className="py-12 sm:py-16 bg-background grain-overlay">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <FadeIn className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-6 sm:w-8 bg-border" />
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">How We Work</span>
            <span className="h-px w-6 sm:w-8 bg-border" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-heading">
            From Farm to Your Home in One Day
          </h2>
          <p className="text-[var(--color-body)] max-w-2xl mx-auto mt-3 text-base sm:text-lg">
            We pick mushrooms in the morning and deliver to you by evening. Always fresh.
          </p>
        </FadeIn>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-[30px] left-[10%] right-[10%] h-0.5 bg-border z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 relative z-10">
            {steps.map((step, i) => (
              <FadeIn
                key={step.title}
                delay={i * 0.1}
                direction="up"
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 border-4 border-background shadow-[0_4px_15px_rgba(43,122,93,0.1)] text-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <step.icon size={26} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-extrabold text-primary uppercase tracking-wide mb-1">{step.time}</span>
                <h3 className="font-bold text-foreground text-base sm:text-lg font-heading mb-1">{step.title}</h3>
                <p className="text-base text-[var(--color-body)] leading-relaxed">{step.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-base font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            Today&apos;s picking done at 5:30 AM
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
