import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, Truck, Quote, Send, Star } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { HomeHero, type HeroSlideData } from "@/components/HomeHero";
import { FarmToTable } from "@/components/FarmToTable";
import { AboutPreview } from "@/components/AboutPreview";
import { PressAndRecognition } from "@/components/PressAndRecognition";
import { SeasonalAvailability } from "@/components/SeasonalAvailability";
import { SuccessStories } from "@/components/SuccessStories";
import { LoyaltySection } from "@/components/LoyaltySection";
import { ProductCard } from "@/components/ProductCard";
import { Certifications } from "@/components/Certifications";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { prisma } from "@/lib/prisma";
import { testimonials } from "@/lib/data";

export default async function Home() {
  const [dbProducts, dbSlides] = await Promise.all([
    prisma.product.findMany({ take: 3, include: { category: true } }),
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
  const featuredProducts = dbProducts.map((p: FeaturedProduct) => ({
    ...p,
    category: p.category.name,
    image: p.images[0] || "",
    gallery: p.images,
  }));

  const heroSlides: HeroSlideData[] | undefined =
    dbSlides.length > 0
      ? dbSlides.map((s) => ({
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

      {/* FEATURED PRODUCTS */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <FadeIn className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 gap-3 sm:gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1 sm:mb-2 font-heading">Fresh Harvest</h2>
              <p className="text-[var(--color-body)] text-base sm:text-lg">Explore our premium selection, harvested today.</p>
            </div>
            <Link href="/shop" className="group inline-flex items-center gap-2 text-primary font-semibold text-lg">
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

      {/* SEASONAL AVAILABILITY */}
      <SeasonalAvailability />

      {/* Farm to Table Journey / Our Process */}
      <FarmToTable />

      {/* About Us Preview */}
      <AboutPreview />

      {/* Press & Recognition */}
      <PressAndRecognition compact />

      {/* SUCCESS STORIES */}
      <SuccessStories />

      {/* TESTIMONIALS */}
      <section className="py-14 sm:py-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <FadeIn>
             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 font-heading">What Our Customers Say</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 0.1} direction="up" className="bg-card p-5 sm:p-8 rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] relative text-left">
                <Quote className="absolute top-4 sm:top-6 right-4 sm:right-6 text-secondary" size={36} />
                <div className="flex gap-1 text-[#c4a96a] mb-4 sm:mb-6">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} size={16} className={star <= t.rating ? "fill-[#c4a96a]" : "fill-border text-border"} />
                  ))}
                </div>
                <p className="text-[var(--color-body)] italic mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">&ldquo;{t.review}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <Avatar size="lg">
                    <AvatarImage src={t.avatar} alt={t.name} />
                    <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-foreground text-sm sm:text-base">{t.name}</h4>
                    <span className="text-xs sm:text-sm text-muted-foreground">{t.role}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* LOYALTY PROGRAM */}
      <LoyaltySection />



      {/* FAQ & NEWSLETTER */}
      <section className="py-14 sm:py-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            <FadeIn direction="right">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8 font-heading">Frequently Asked Questions</h2>
              <Accordion className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-medium">How do you ensure freshness?</AccordionTrigger>
                  <AccordionContent className="text-[var(--color-body)] text-base">
                    We harvest early morning and dispatch immediately using temperature-controlled packaging to ensure the mushrooms reach you as fresh as possible.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-medium">Do you use pesticides?</AccordionTrigger>
                  <AccordionContent className="text-[var(--color-body)] text-base">
                    Absolutely not. Our farming methods are 100% organic and natural, utilizing clean agricultural practices without any synthetic chemicals.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-medium">How long is the training program?</AccordionTrigger>
                  <AccordionContent className="text-[var(--color-body)] text-base">
                    We offer both 1-day crash courses and comprehensive 2-week programs depending on your needs. Check our Training page for details.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-medium">What areas do you deliver to?</AccordionTrigger>
                  <AccordionContent className="text-[var(--color-body)] text-base">
                    We deliver across Salem, Namakkal, Erode, Coimbatore, Trichy, Madurai, Chennai, and Bangalore. Use our pincode checker on product pages to confirm delivery to your area.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg font-medium">Do you offer subscriptions?</AccordionTrigger>
                  <AccordionContent className="text-[var(--color-body)] text-base">
                    Yes! Subscribe for weekly, bi-weekly, or monthly deliveries and save up to 15%. You can cancel anytime with no commitment.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </FadeIn>

            <FadeIn direction="left" className="bg-[var(--color-primary-dark)] rounded-2xl p-6 sm:p-10 text-white text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
                <Send size={28} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 font-heading">Stay Freshly Updated</h2>
              <p className="text-white/80 mb-6 sm:mb-8 max-w-sm mx-auto text-sm sm:text-base">
                Subscribe to our newsletter for exclusive offers and farm updates.
              </p>
              <NewsletterForm />
            </FadeIn>

          </div>
        </div>
      </section>

      {/* WHY CHOOSE US / CORE VALUES */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 font-heading">The Vellimalai Promise</h2>
            <p className="text-[var(--color-body)] max-w-2xl mx-auto mb-10 sm:mb-16 text-base sm:text-lg">
              We bridge the gap between traditional organic farming and modern quality standards. Our mushrooms are cultivated in the pristine climate of Kalvarayan Hills.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-10 sm:mb-16">
            {[
              { icon: ShieldCheck, title: "100% Organic", desc: "Naturally grown without any harmful chemicals or synthetic fertilizers." },
              { icon: Clock, title: "Daily Harvest", desc: "Hand-picked fresh every single morning at the peak of perfection." },
              { icon: Truck, title: "Farm to Doorstep", desc: "Packed hygienically and delivered fresh to maintain maximum nutritional value." }
            ].map((feature, i) => (
              <FadeIn key={i} delay={i * 0.1} direction="up" className="flex flex-col items-center text-center p-8 bg-card rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 ease-out border border-border">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <feature.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 font-heading">{feature.title}</h3>
                <p className="text-[var(--color-body)] leading-relaxed">{feature.desc}</p>
              </FadeIn>
            ))}
          </div>

          <Certifications />
        </div>
      </section>

    </div>
  );
}
