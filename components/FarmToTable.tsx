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
    <section className="py-24 sm:py-32 bg-background grain-overlay">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <FadeIn className="text-center mb-16">
          <span className="text-xs font-bold text-[#2B7A5D] uppercase tracking-wider bg-[#E8F2EC] px-3.5 py-1.5 rounded-full">Our Process</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mt-4 font-heading">
            Farm to Table in Hours, Not Days
          </h2>
          <p className="text-[var(--color-body)] max-w-2xl mx-auto mt-4 text-sm sm:text-base">
            From the moment we harvest to the moment it arrives at your door — freshness guaranteed.
          </p>
        </FadeIn>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-[30px] left-[10%] right-[10%] h-0.5 bg-border z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-[#E8F2EC] border-4 border-background shadow-[0_4px_15px_rgba(43,122,93,0.1)] text-[#2B7A5D] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <step.icon size={26} strokeWidth={1.5} />
                </div>
                <span className="text-xs font-extrabold text-[#2B7A5D] uppercase tracking-wide mb-1">{step.time}</span>
                <h3 className="font-bold text-foreground text-sm sm:text-base font-heading mb-1">{step.title}</h3>
                <p className="text-sm text-[var(--color-body)] leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <FadeIn className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8F2EC] text-[#2B7A5D] text-sm font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2B7A5D] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2B7A5D]" />
            </span>
            Today&apos;s harvest completed at 5:30 AM
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
