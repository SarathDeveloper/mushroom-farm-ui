"use client";

import { Sunrise, Moon } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

const slots = [
  {
    icon: Sunrise,
    label: "Order before 7 AM",
    detail: "We pick fresh today and deliver to your door",
  },
  {
    icon: Moon,
    label: "Order after 7 AM",
    detail: "We pick tomorrow morning, pack and send",
  },
];

export function DeliverySchedule() {
  return (
    <section className="pt-2 pb-8 sm:py-6 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {slots.map((slot) => (
              <div
                key={slot.label}
                className="flex items-start gap-3 rounded-xl bg-card border border-border p-3.5"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <slot.icon size={18} strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{slot.label}</h3>
                  <p className="text-xs text-[var(--color-body)] mt-0.5">{slot.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] text-muted-foreground mt-2.5">
            Mushrooms are picked only after your order &mdash; never sitting in storage.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
