import {
  ArrowRight,
  ClipboardList,
  IndianRupee,
  ShoppingBag,
  Sprout,
  Users,
} from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

const orderFlow = [
  { label: "Customer Orders", icon: ShoppingBag },
  { label: "Mathesh Receives", icon: ClipboardList },
  { label: "Assigns to You", icon: Users },
  { label: "You Harvest", icon: Sprout },
  { label: "You Get Paid", icon: IndianRupee },
];

export function TrainingOrderFlowSection() {
  return (
    <section className="py-20 sm:py-28 bg-background grain-overlay">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <FadeIn className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="hidden sm:block h-px w-8 bg-border" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Guaranteed Orders</span>
            <span className="hidden sm:block h-px w-8 bg-border" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight font-heading mb-3 sm:mb-4">
            How You Get Orders
          </h2>
          <p className="text-[var(--color-body)] max-w-xl mx-auto text-sm sm:text-base">
            You don&apos;t search for customers. Mathesh routes orders directly to you.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="bg-secondary rounded-2xl border border-border p-6 sm:p-10">
            {/* Desktop: horizontal flow */}
            <div className="hidden md:flex items-center justify-between gap-2">
              {orderFlow.map((item, i) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <item.icon size={26} strokeWidth={1.75} />
                    </div>
                    <span className="text-xs font-semibold text-foreground max-w-[100px]">
                      {item.label}
                    </span>
                  </div>
                  {i < orderFlow.length - 1 && (
                    <ArrowRight size={20} className="text-primary/60 shrink-0 mx-1" />
                  )}
                </div>
              ))}
            </div>

            {/* Mobile: vertical flow */}
            <div className="flex md:hidden flex-col gap-4">
              {orderFlow.map((item, i) => (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <item.icon size={20} strokeWidth={1.75} />
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {item.label}
                    </span>
                  </div>
                  {i < orderFlow.length - 1 && (
                    <div className="w-px h-5 bg-primary/30" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border/60 text-center">
              <p className="text-sm text-[var(--color-body)] font-medium leading-relaxed">
                <span className="text-primary font-bold">No risk.</span> You grow mushrooms — we make sure someone buys them.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
