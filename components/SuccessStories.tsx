"use client";

import { motion } from "framer-motion";
import { ArrowRight, Quote, TrendingUp } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { SafeImage } from "@/components/SafeImage";
import Link from "next/link";

const stories = [
  {
    name: "Rahul Menon",
    role: "Restaurant Owner, Salem",
    image: "https://i.pravatar.cc/200?img=12",
    story: "We switched to Vellimalai Farms 2 years ago. Our mushroom dishes are now our top sellers — consistent quality and never a missed delivery.",
    metric: "20% cost savings",
    metricLabel: "vs. previous supplier",
    type: "B2B Partner",
  },
  {
    name: "Kavitha & Ravi",
    role: "Training Graduates, Namakkal",
    image: "https://i.pravatar.cc/200?img=47",
    story: "After completing the 2-week commercial training, we set up our own unit. Now we earn ₹60,000/month from oyster mushrooms alone.",
    metric: "₹60K/month",
    metricLabel: "monthly revenue",
    type: "Training Success",
  },
  {
    name: "Anita Krishnan",
    role: "Health Enthusiast, Coimbatore",
    image: "https://i.pravatar.cc/200?img=32",
    story: "The weekly subscription is a lifesaver. Fresh organic mushrooms every Monday without having to remember to order. My family's health has genuinely improved.",
    metric: "52 weeks",
    metricLabel: "continuous subscriber",
    type: "Loyal Customer",
  },
];

export function SuccessStories() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <FadeIn className="text-center mb-14">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Real Results</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 font-heading">
            Success Stories
          </h2>
          <p className="text-[var(--color-body)] max-w-2xl mx-auto mt-3">
            From restaurant owners to first-time farmers — see how Vellimalai Farms creates real impact.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, i) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 flex flex-col hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {story.type}
                </span>
                <Quote size={28} className="text-secondary" />
              </div>

              <p className="text-[var(--color-body)] text-sm leading-relaxed italic flex-1 mb-6">
                &ldquo;{story.story}&rdquo;
              </p>

              <div className="rounded-xl bg-primary/5 border border-primary/10 p-3 mb-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">{story.metric}</p>
                  <p className="text-[11px] text-muted-foreground">{story.metricLabel}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="relative w-11 h-11 rounded-full overflow-hidden">
                  <SafeImage src={story.image} alt={story.name} fill sizes="44px" className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">{story.name}</h4>
                  <p className="text-xs text-muted-foreground">{story.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <FadeIn className="text-center mt-12">
          <Link
            href="/training"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            See more stories & start your journey <ArrowRight size={18} />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
