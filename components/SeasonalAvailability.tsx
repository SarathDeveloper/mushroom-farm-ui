"use client";

import { motion } from "framer-motion";
import { Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { SafeImage } from "@/components/SafeImage";
import Link from "next/link";

const seasonalItems = [
  {
    name: "Oyster Mushroom",
    status: "peak" as const,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=400&auto=format&fit=crop",
    badge: "Peak Season",
    note: "Best quality right now",
    slug: "premium-oyster-mushroom",
  },
  {
    name: "Milky Mushroom",
    status: "peak" as const,
    image: "https://images.unsplash.com/photo-1508216127116-43b98c56cc19?q=80&w=400&auto=format&fit=crop",
    badge: "Peak Season",
    note: "Abundant harvest daily",
    slug: "fresh-milky-mushroom",
  },
  {
    name: "Shiitake",
    status: "limited" as const,
    image: "https://images.unsplash.com/photo-1516069670183-5c8e3100be05?q=80&w=400&auto=format&fit=crop",
    badge: "Limited",
    note: "Order early — small batches only",
    slug: "shiitake-exotic",
  },
  {
    name: "Button Mushroom",
    status: "available" as const,
    image: "https://images.unsplash.com/photo-1611105637889-3fa70db2b271?q=80&w=400&auto=format&fit=crop",
    badge: "Available",
    note: "Year-round supply",
    slug: "organic-button-mushroom",
  },
];

const statusStyles = {
  peak: "bg-[#E8F2EC] text-[#2B7A5D] border-[#E8F2EC]/20",
  available: "bg-primary/10 text-primary border-primary/20",
  limited: "bg-[#FFF0ED] text-[#F76B46] border-[#FFF0ED]/20",
};

export function SeasonalAvailability() {
  const currentMonth = new Date().toLocaleString("en-IN", { month: "long" });

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <FadeIn className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F2EC] text-[#2B7A5D] text-xs font-bold uppercase tracking-wider mb-4">
            <Calendar size={16} /> {currentMonth} Harvest Status
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground font-heading">
            What&apos;s Fresh Right Now
          </h2>
          <p className="text-[var(--color-body)] max-w-2xl mx-auto mt-4 text-base">
            Our seasonal availability — order what&apos;s at its peak for the best flavor and nutrition.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {seasonalItems.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link href={`/shop/${item.slug}`} className="group block">
                <div className="bg-card rounded-3xl overflow-hidden border border-border hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusStyles[item.status]}`}>
                      {item.badge}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-foreground font-heading group-hover:text-primary transition-colors text-base">{item.name}</h3>
                    <p className="text-xs text-[var(--color-body)] mt-2 flex items-center gap-1.5">
                      {item.status === "limited" ? <AlertCircle size={12} className="text-[#F76B46]" /> : <TrendingUp size={12} className="text-[#2B7A5D]" />}
                      {item.note}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
