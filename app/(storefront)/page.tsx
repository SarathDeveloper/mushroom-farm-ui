import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, Truck, Send } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { HomeHero, type HeroSlideData } from "@/components/HomeHero";
import { FarmToTable } from "@/components/FarmToTable";
import { AboutPreview } from "@/components/AboutPreview";
import { PressAndRecognition } from "@/components/PressAndRecognition";
import { SeasonalAvailability } from "@/components/SeasonalAvailability";
import { SuccessStories } from "@/components/SuccessStories";
import { LoyaltySection } from "@/components/LoyaltySection";
import { HomeContactSection } from "@/components/HomeContactSection";
import { ProductCard } from "@/components/ProductCard";
import { Certifications } from "@/components/Certifications";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SectionDivider } from "@/components/SectionDivider";
import { ShopByCategory } from "@/components/ShopByCategory";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { prisma } from "@/lib/prisma";
import { type Product } from "@/lib/data";

export default async function Home() {
  const [dbProducts, dbValueAdded, dbSlides] = await Promise.all([
    prisma.product.findMany({ take: 3, include: { category: true } }),
    prisma.product.findMany({
      where: {
        isActive: true,
        slug: {
          in: ["mushroom-masala-powder", "mushroom-soup-mix", "mushroom-pickle"],
        },
      },
      include: { category: true },
    }),
    prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);
  type FeaturedProduct = {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    compareAtPrice: number | null;
    weight: string;
    stock: number;
    images: string[];
    rating: number;
    reviewCount: number;
    tag: string | null;
    highlights: string[];
    category: { name: string };
  };
  const mapProduct = (p: FeaturedProduct): Product => ({
    ...p,
    category: p.category.name,
    image: p.images[0] || "",
    gallery: p.images,
  });
  const featuredProducts: Product[] = dbProducts.map(mapProduct);
  const valueAddedOrder = ["mushroom-masala-powder", "mushroom-soup-mix", "mushroom-pickle"];
  const valueAddedProducts: Product[] = valueAddedOrder
    .map((slug) => dbValueAdded.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => p != null)
    .map(mapProduct);

  type DbHeroSlide = {
    badge: string;
    headline: string;
    subtitle: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    image: string;
  };
  const heroSlides: HeroSlideData[] | undefined =
    dbSlides.length > 0
      ? dbSlides.map((s: DbHeroSlide) => ({
          badge: s.badge,
          headline: s.headline,
          subtitle: s.subtitle,
          primaryCtaLabel: s.primaryCtaLabel,
          primaryCtaHref: s.primaryCtaHref,
          secondaryCtaLabel: s.secondaryCtaLabel,
          secondaryCtaHref: s.secondaryCtaHref,
          image: s.image,
        }))
      : undefined;

  return (
    <div className="flex flex-col min-h-screen">

      <HomeHero slides={heroSlides} />

      <ShopByCategory />

      <SectionDivider variant="leaf" />

      {/* FEATURED PRODUCTS */}
      <section className="py-20 sm:py-28 bg-background grain-overlay">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <FadeIn className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="hidden sm:block h-px w-8 bg-border" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Farm Fresh</span>
                <span className="hidden sm:block h-px w-8 bg-border" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight font-heading">Fresh Harvest</h2>
              <p className="text-[var(--color-body)] text-sm mt-1.5">Explore our premium selection, harvested today.</p>
            </div>
            <Link href="/shop" className="group inline-flex items-center gap-2 text-primary font-semibold text-base">
              View All Products <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredProducts.map((product, i) => (
              <FadeIn key={product.id} delay={i * 0.1}>
                <ProductCard product={product} priority={i === 0} />
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-10 text-center">
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-body)] hover:text-primary transition-colors"
            >
              Not sure which to pick? <span className="text-primary font-semibold">Compare Mushrooms →</span>
            </Link>
          </FadeIn>
        </div>
      </section>

      {valueAddedProducts.length > 0 && (
        <>
          <SectionDivider variant="leaf" />

          {/* VALUE-ADDED PRODUCTS */}
          <section className="py-20 sm:py-28 bg-secondary grain-overlay">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <FadeIn className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 gap-3 sm:gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="hidden sm:block h-px w-8 bg-border" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Ready to Cook</span>
                    <span className="hidden sm:block h-px w-8 bg-border" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight font-heading">Kitchen Essentials</h2>
                  <p className="text-[var(--color-body)] text-sm mt-1.5">Powders, mixes, and preserves made from our farm harvest.</p>
                </div>
                <Link href="/shop?category=value-added" className="group inline-flex items-center gap-2 text-primary font-semibold text-base">
                  View All <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </FadeIn>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {valueAddedProducts.map((product, i) => (
                  <FadeIn key={product.id} delay={i * 0.1}>
                    <ProductCard product={product} />
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <SectionDivider variant="leaf" />

      {/* SEASONAL AVAILABILITY */}
      <SeasonalAvailability />

      <SectionDivider variant="leaf" />

      {/* Farm to Table Journey / Our Process */}
      <FarmToTable />

      {/* About Us Preview */}
      <AboutPreview />

      <SectionDivider variant="leaf" />

      {/* Press & Recognition */}
      <PressAndRecognition compact />

      <SectionDivider variant="leaf" />

      {/* SUCCESS STORIES */}
      <SuccessStories />

      {/* LOYALTY PROGRAM */}
      <LoyaltySection />



      {/* FAQ & NEWSLETTER */}
      <section className="py-20 sm:py-28 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            <FadeIn direction="right">
              <div className="flex items-center gap-3 mb-4">
                <span className="hidden sm:block h-px w-8 bg-border" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">FAQ</span>
                <span className="hidden sm:block h-px w-8 bg-border" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight font-heading mb-6 sm:mb-8">Frequently Asked Questions</h2>
              <Accordion className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-sm sm:text-base font-medium">How do you ensure freshness?</AccordionTrigger>
                  <AccordionContent className="text-[var(--color-body)] text-sm">
                    We harvest early morning and dispatch immediately using temperature-controlled packaging to ensure the mushrooms reach you as fresh as possible.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-sm sm:text-base font-medium">Do you use pesticides?</AccordionTrigger>
                  <AccordionContent className="text-[var(--color-body)] text-sm">
                    Absolutely not. Our farming methods are 100% organic and natural, utilizing clean agricultural practices without any synthetic chemicals.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-sm sm:text-base font-medium">How long is the training program?</AccordionTrigger>
                  <AccordionContent className="text-[var(--color-body)] text-sm">
                    We offer both 1-day crash courses and comprehensive 2-week programs depending on your needs. Check our Training page for details.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-sm sm:text-base font-medium">What areas do you deliver to?</AccordionTrigger>
                  <AccordionContent className="text-[var(--color-body)] text-sm">
                    We deliver across Salem, Namakkal, Erode, Coimbatore, Trichy, Madurai, Chennai, and Bangalore. Use our pincode checker on product pages to confirm delivery to your area.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-sm sm:text-base font-medium">Do you offer subscriptions?</AccordionTrigger>
                  <AccordionContent className="text-[var(--color-body)] text-sm">
                    Yes! Subscribe for weekly, bi-weekly, or monthly deliveries and save up to 15%. You can cancel anytime with no commitment.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </FadeIn>

            <FadeIn direction="left" className="bg-[var(--color-primary-dark)] rounded-2xl p-6 sm:p-10 text-white text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
                <Send size={28} />
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold mb-3 sm:mb-4 font-heading">Stay Freshly Updated</h2>
              <p className="text-white/80 mb-6 sm:mb-8 max-w-sm mx-auto text-sm sm:text-base">
                Subscribe to our newsletter for exclusive offers and farm updates.
              </p>
              <NewsletterForm />
            </FadeIn>

          </div>
        </div>
      </section>

      <SectionDivider variant="leaf" />

      {/* CONTACT SECTION */}
      <HomeContactSection />

      <SectionDivider variant="leaf" />

      {/* WHY CHOOSE US / CORE VALUES */}
      <section className="py-24 sm:py-32 bg-background grain-overlay">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="hidden sm:block h-px w-10 bg-border" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Why Choose Us</span>
              <span className="hidden sm:block h-px w-10 bg-border" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight font-heading mb-3 sm:mb-4">The Sri Amman Promise</h2>
            <p className="text-[var(--color-body)] max-w-2xl mx-auto mb-12 sm:mb-20 text-sm sm:text-base">
              We bridge the gap between traditional organic farming and modern quality standards. Our mushrooms are cultivated in the pristine climate of Kalvarayan Hills.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20">
            {[
              { icon: ShieldCheck, title: "100% Organic", desc: "Naturally grown without any harmful chemicals or synthetic fertilizers.", accent: true },
              { icon: Clock, title: "Daily Harvest", desc: "Hand-picked fresh every single morning at the peak of perfection.", accent: false },
              { icon: Truck, title: "Farm to Doorstep", desc: "Packed hygienically and delivered fresh to maintain maximum nutritional value.", accent: false }
            ].map((feature, i) => (
              <FadeIn
                key={i}
                delay={i * 0.12}
                direction="up"
                className={`flex flex-col items-center text-center p-8 sm:p-10 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 ease-out border ${
                  feature.accent
                    ? "bg-primary text-white border-primary sm:col-span-2 lg:col-span-1 lg:scale-105 lg:shadow-[0_8px_30px_rgba(26,73,56,0.2)]"
                    : "bg-card border-border lg:translate-y-6"
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  feature.accent ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                }`}>
                  <feature.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-3 font-heading ${
                  feature.accent ? "text-white" : "text-foreground"
                }`}>{feature.title}</h3>
                <p className={`leading-relaxed text-sm ${
                  feature.accent ? "text-white/85" : "text-[var(--color-body)]"
                }`}>{feature.desc}</p>
              </FadeIn>
            ))}
          </div>

          <Certifications />
        </div>
      </section>

    </div>
  );
}
