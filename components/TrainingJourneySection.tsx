import {
  ClipboardList,
  Package,
  Sprout,
  ShoppingBag,
  Users,
  Landmark,
} from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

const journeySteps = [
  {
    step: 1,
    icon: ClipboardList,
    title: "Setup & Registration",
    desc: "Mathesh helps you fill forms, get FSSAI license, and plan your shed layout — no confusion.",
    who: "Mathesh",
  },
  {
    step: 2,
    icon: Package,
    title: "Bags & Spawn Supply",
    desc: "We give you ready-to-grow mushroom bags. No need to search for suppliers or raw materials.",
    who: "Mathesh",
  },
  {
    step: 3,
    icon: Sprout,
    title: "Hands-On Training",
    desc: "Work alongside us in the farm. Learn watering, humidity control, harvesting — by doing, not reading.",
    who: "Mathesh & Team",
  },
  {
    step: 4,
    icon: ShoppingBag,
    title: "Customer Orders Routed to You",
    desc: "When customers order mushrooms, Mathesh sends the work to you. You grow, we find buyers.",
    who: "Mathesh",
  },
  {
    step: 5,
    icon: Users,
    title: "Farmer Network",
    desc: "Join our WhatsApp group of 100+ farmers. Share problems, get answers, help each other grow.",
    who: "Fellow Farmers",
  },
  {
    step: 6,
    icon: Landmark,
    title: "Government Scheme Guidance",
    desc: "We help you understand available schemes and prepare documents; approval depends on the relevant department and your eligibility.",
    who: "Government Departments",
  },
];

export function TrainingJourneySection() {
  return (
    <section className="py-10 sm:py-14 bg-background grain-overlay">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <FadeIn className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-px w-6 sm:w-8 bg-border" />
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Full Support</span>
            <span className="h-px w-6 sm:w-8 bg-border" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-heading mb-3 sm:mb-4">
            How We Help You — Step by Step
          </h2>
          <p className="text-[var(--color-body)] max-w-2xl mx-auto text-base sm:text-lg">
            This is not just a training. It is a full support system — from your first form to your first sale.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {journeySteps.map((s, i) => (
            <FadeIn key={s.step} delay={i * 0.08}>
              <div className="relative flex flex-col h-full p-6 rounded-2xl bg-secondary border border-border/50 shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 ease-out">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <s.icon size={26} strokeWidth={1.75} />
                  </div>
                  <span className="text-sm font-bold text-primary uppercase tracking-wider">
                    Step {s.step}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-lg sm:text-xl mb-2 font-heading">
                  {s.title}
                </h3>
                <p className="text-base text-[var(--color-body)] mb-4 flex-1 leading-relaxed">{s.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full w-fit">
                  <Users size={12} /> {s.who}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
