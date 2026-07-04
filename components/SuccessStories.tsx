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
          <span className="text-xs font-bold text-[#2B7A5D] uppercase tracking-wider bg-[#E8F2EC] px-3.5 py-1.5 rounded-full">Real Results</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-4 font-heading">
            Success Stories
          </h2>
          <p className="text-[var(--color-body)] max-w-2xl mx-auto mt-4 text-base">
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
              className="bg-card rounded-3xl border border-border p-8 flex flex-col hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2B7A5D] bg-[#E8F2EC] px-3.5 py-1 rounded-full">
                  {story.type}
                </span>
                <Quote size={28} className="text-[#F4F0E6]" />
              </div>

              <p className="text-[var(--color-body)] text-sm leading-relaxed italic flex-1 mb-6">
                &ldquo;{story.story}&rdquo;
              </p>

              <div className="rounded-2xl bg-[#E8F2EC]/40 border border-[#E8F2EC] p-4 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8F2EC] text-[#2B7A5D] flex items-center justify-center">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <p className="font-extrabold text-foreground text-sm">{story.metric}</p>
                  <p className="text-[11px] text-[#5C6370]">{story.metricLabel}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-5 border-t border-border">
                <div className="relative w-11 h-11 rounded-full overflow-hidden">
                  <SafeImage src={story.image} alt={story.name} fill sizes="44px" className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0B0B0B] text-sm">{story.name}</h4>
                  <p className="text-xs text-muted-foreground">{story.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <FadeIn className="text-center mt-12">
          <Link
            href="/training"
            className="inline-flex items-center gap-2 text-[#2B7A5D] font-bold hover:gap-3 transition-all"
          >
            See more stories & start your journey <ArrowRight size={18} />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
