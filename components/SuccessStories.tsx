"use client";

import { ArrowRight, Quote, TrendingUp } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import Link from "next/link";

const stories = [
  {
    name: "Rahul Menon",
    role: "Restaurant Owner, Salem",
    story: "We buy mushrooms from Sri Amman for 2 years now. Quality is always good. Delivery never late. Our customers love the mushroom dishes.",
    metric: "20% less cost",
    metricLabel: "than before",
    type: "Restaurant",
  },
  {
    name: "Kavitha & Ravi",
    role: "Farmers, Namakkal",
    story: "We did the 2-week training here. Now we have our own mushroom farm at home. We earn ₹60,000 every month from selling oyster mushrooms.",
    metric: "₹60,000/month",
    metricLabel: "earning now",
    type: "Our Students",
  },
  {
    name: "Anita Krishnan",
    role: "Customer, Coimbatore",
    story: "I get fresh mushrooms every week at my home. No need to go to market. Clean, fresh, and good for health. My whole family eats mushrooms now.",
    metric: "1 year",
    metricLabel: "regular customer",
    type: "Happy Customer",
  },
];

export function SuccessStories() {
  return (
    <section className="py-12 sm:py-16 bg-background grain-overlay">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <FadeIn className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-6 sm:w-8 bg-border" />
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Happy Customers</span>
            <span className="h-px w-6 sm:w-8 bg-border" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-heading">
            What People Say
          </h2>
          <p className="text-[var(--color-body)] max-w-2xl mx-auto mt-3 text-base sm:text-lg">
            Restaurants, families, and new farmers — see what they say about us.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, i) => (
            <FadeIn
              key={story.name}
              delay={i * 0.1}
              direction="up"
              className="bg-card rounded-2xl border border-border p-6 sm:p-8 flex flex-col hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-bold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1 rounded-full">
                  {story.type}
                </span>
                <Quote size={28} className="text-[#F4F0E6]" />
              </div>

              <p className="text-[var(--color-body)] text-base leading-relaxed italic flex-1 mb-6">
                &ldquo;{story.story}&rdquo;
              </p>

              <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <p className="font-extrabold text-foreground text-base">{story.metric}</p>
                  <p className="text-sm text-muted-foreground">{story.metricLabel}</p>
                </div>
              </div>

              <div className="pt-5 border-t border-border">
                <h4 className="font-bold text-foreground text-base">{story.name}</h4>
                <p className="text-sm text-muted-foreground">{story.role}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="text-center mt-12">
          <Link
            href="/training"
            className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
          >
            Want to learn mushroom farming? See our courses <ArrowRight size={18} />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
