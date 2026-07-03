"use client";

import { motion } from "framer-motion";
import { Scissors, ShieldCheck, Package, Truck, Home } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

const steps = [
  { time: "5:00 AM", title: "Harvested Fresh", icon: Scissors, desc: "Hand-picked at peak ripeness" },
  { time: "6:30 AM", title: "Quality Checked", icon: ShieldCheck, desc: "Inspected for perfection" },
  { time: "7:00 AM", title: "Packed Hygienically", icon: Package, desc: "Temperature-controlled packing" },
  { time: "8:00 AM", title: "Out for Delivery", icon: Truck, desc: "Same-day dispatch" },
  { time: "By Evening", title: "At Your Doorstep", icon: Home, desc: "Fresh to your kitchen" },
];

export function FarmToTable() {
  return (
    <section className="py-16 bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <FadeIn className="text-center mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Process</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 font-heading">
            Farm to Table in Hours, Not Days
          </h2>
          <p className="text-[var(--color-body)] max-w-2xl mx-auto mt-3">
            From the moment we harvest to the moment it arrives at your door — freshness guaranteed.
          </p>
        </FadeIn>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-border -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 border-4 border-background shadow-[0_0_0_2px] shadow-primary/20 text-primary flex items-center justify-center mb-4">
                  <step.icon size={26} strokeWidth={1.5} />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-wide mb-1">{step.time}</span>
                <h3 className="font-bold text-foreground text-sm font-heading mb-1">{step.title}</h3>
                <p className="text-xs text-[var(--color-body)]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <FadeIn className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            Today&apos;s harvest completed at 5:30 AM
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
