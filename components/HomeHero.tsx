import Link from "next/link";
import {
  ArrowRight,
  Truck,
  Headphones,
  ShoppingBag,
  Package,
} from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { SafeImage } from "@/components/SafeImage";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "Free shipping on all your order",
  },
  {
    icon: Headphones,
    title: "Customer Support 24/7",
    desc: "Instant access to Support",
  },
  {
    icon: ShoppingBag,
    title: "100% Secure Payment",
    desc: "We ensure your money is safe",
  },
  {
    icon: Package,
    title: "Money-Back Guarantee",
    desc: "30 Days Money-Back Guarantee",
  },
];

export function HomeHero() {
  return (
    <section className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-6 lg:pt-8 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
          {/* Main banner */}
          <FadeIn direction="up" className="lg:col-span-8">
            <div className="relative rounded-2xl overflow-hidden bg-[var(--color-primary-dark)] min-h-[380px] sm:min-h-[420px] lg:min-h-[520px]">
              <div className="absolute right-0 bottom-0 top-0 w-full sm:w-[58%] lg:w-[52%] pointer-events-none">
                <SafeImage
                  src="/gallery/farm/oyster-mushroom-growing.png"
                  alt="Fresh organic oyster mushrooms growing on substrate at our farm"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover object-center"
                />
              </div>

              <div className="relative z-10 flex flex-col justify-center h-full p-8 sm:p-10 lg:p-12 max-w-full sm:max-w-[55%]">
                <span className="inline-flex w-fit items-center px-3 py-1.5 rounded-md bg-primary text-white text-xs sm:text-sm font-bold mb-4 sm:mb-5">
                  Sale up to 30% OFF — This Week Only
                </span>

                <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-bold text-white leading-[1.15] font-heading mb-3 sm:mb-4">
                  Fresh &amp; Healthy Organic Mushrooms
                </h1>

                <p className="text-white/75 text-sm sm:text-base mb-4 sm:mb-5">
                  Harvested at 5 AM, at your door by evening. Free shipping on orders above ₹500.
                </p>

                {/* Social proof */}
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="flex -space-x-2">
                    {[47, 12, 32, 20].map((img) => (
                      <div key={img} className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-white/20">
                        <img src={`https://i.pravatar.cc/56?img=${img}`} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <span className="text-white/80 text-xs sm:text-sm">
                    <strong className="text-white">1,247</strong> orders this month
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/shop"
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-white text-primary font-semibold px-6 py-3 text-sm sm:text-base hover:bg-secondary hover:scale-[1.02] transition-all duration-300"
                  >
                    Shop now
                    <ArrowRight size={18} className="text-primary" />
                  </Link>
                  <Link
                    href="/track-order"
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 text-white font-medium px-5 py-3 text-sm hover:bg-white/10 transition-all"
                  >
                    Track Order
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Side banners — split exactly 50/50, matching the main banner's total height */}
          <div className="lg:col-span-4 flex flex-col gap-4 lg:gap-5 min-h-[380px] sm:min-h-[420px] lg:min-h-[520px]">
            {/* Top half — light promo */}
            <FadeIn direction="up" delay={0.1} className="flex-1 min-h-0">
              <Link
                href="/shop"
                className="group relative flex h-full w-full rounded-2xl overflow-hidden bg-secondary"
              >
                <span className="absolute top-5 left-5 z-10 inline-flex items-center gap-1.5 text-primary font-semibold text-sm group-hover:gap-2.5 transition-all">
                  Shop Now
                  <ArrowRight size={16} />
                </span>
                <div className="absolute inset-0">
                  <SafeImage
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/20210628_Pleurotus_djamor_1.jpg/1280px-20210628_Pleurotus_djamor_1.jpg"
                    alt="Vivid pink oyster mushroom cluster"
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </Link>
            </FadeIn>

            {/* Bottom half — dark promo */}
            <FadeIn direction="up" delay={0.15} className="flex-1 min-h-0">
              <Link
                href="/shop"
                className="group relative flex h-full w-full rounded-2xl overflow-hidden bg-[#2b2f33]"
              >
                <div className="relative z-10 flex flex-col justify-center h-full p-6 sm:p-8 max-w-[55%]">
                  <span className="text-white/60 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] mb-2">
                    Best Deal
                  </span>
                  <h2 className="text-xl sm:text-2xl lg:text-[1.65rem] font-bold text-white font-heading leading-tight mb-4">
                    Premium Oyster Mushrooms
                  </h2>
                  <span className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm group-hover:gap-2.5 transition-all">
                    Shop Now
                    <ArrowRight size={16} />
                  </span>
                </div>
                <div className="absolute right-0 bottom-0 top-0 w-[50%] sm:w-[45%]">
                  <SafeImage
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/2025-10-26_D500-1200_Achim-Lammerts_Pleurotus-ostreatus.jpg/1280px-2025-10-26_D500-1200_Achim-Lammerts_Pleurotus-ostreatus.jpg"
                    alt="Premium grey oyster mushroom cluster harvest"
                    fill
                    sizes="(max-width: 1024px) 50vw, 20vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </Link>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Features bar */}
      <div className="mt-6 lg:mt-8 border-y border-border bg-muted/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 lg:py-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 0.05} direction="up">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full border-2 border-primary/30 flex items-center justify-center text-primary">
                    <feature.icon size={22} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground text-sm sm:text-base font-heading leading-snug mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
