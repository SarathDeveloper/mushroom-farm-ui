import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, Truck, Send } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { HomeHero, type HeroSlideData } from "@/components/HomeHero";
import { FarmToTable } from "@/components/FarmToTable";
import { AboutPreview } from "@/components/AboutPreview";
import { PressAndRecognition } from "@/components/PressAndRecognition";
import { SuccessStories } from "@/components/SuccessStories";
import { HomeContactSection } from "@/components/HomeContactSection";
import { ProductCard } from "@/components/ProductCard";
import { Certifications } from "@/components/Certifications";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SectionDivider } from "@/components/SectionDivider";
import { ShopByCategory } from "@/components/ShopByCategory";
import { TrainingJourneySection } from "@/components/TrainingJourneySection";
import { TrainingOrderFlowSection } from "@/components/TrainingOrderFlowSection";
import { PreOrderSection } from "@/components/PreOrderSection";
import { DeliverySchedule } from "@/components/DeliverySchedule";
import { Button } from "@/components/ui/button";
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
    shelfLifeDays: number;
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

      <DeliverySchedule />

      <SectionDivider variant="leaf" />

      {/* FEATURED PRODUCTS */}
      <section className="py-20 sm:py-28 bg-background grain-overlay">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <FadeIn className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="h-px w-6 sm:w-8 bg-border" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Fresh From Farm</span>
                <span className="h-px w-6 sm:w-8 bg-border" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight font-heading">Today&apos;s Fresh Mushrooms</h2>
              <p className="text-[var(--color-body)] text-sm mt-1.5">Picked this morning. Ready to buy now.</p>
            </div>
            <Link href="/shop" className="group inline-flex items-center gap-2 text-primary font-semibold text-base">
              See All <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
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
              Don&apos;t know which to choose? <span className="text-primary font-semibold">Compare Them →</span>
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
                    <span className="h-px w-6 sm:w-8 bg-border" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Easy to Cook</span>
                    <span className="h-px w-6 sm:w-8 bg-border" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight font-heading">Ready-Made Products</h2>
                  <p className="text-[var(--color-body)] text-sm mt-1.5">Mushroom powder, soup mix, and pickle. Made from our fresh mushrooms.</p>
                </div>
                <Link href="/shop?category=value-added" className="group inline-flex items-center gap-2 text-primary font-semibold text-base">
                  View All <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </FadeIn>

              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
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

      <PreOrderSection />

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

      <SectionDivider variant="leaf" />

      <TrainingJourneySection />

      <TrainingOrderFlowSection />

      {/* START YOUR OWN FARM CTA */}
      <section className="py-16 sm:py-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <FadeIn>
            <div className="bg-[var(--color-primary-dark)] rounded-3xl p-8 sm:p-12 text-white text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-8 bg-white/30" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">For Aspiring Farmers</span>
                <span className="h-px w-8 bg-white/30" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading mb-3 sm:mb-4">
                Want to Grow Mushrooms & Earn ₹12K–50K/Month?
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
                We give you bags, hands-on training, customer orders, and help you get 40% government subsidy. Start your own mushroom business with full support from Mathesh.
              </p>
              <Button asChild size="lg" className="rounded-full px-8 bg-white text-[var(--color-primary-dark)] hover:bg-white/90 font-bold">
                <Link href="/training">Start Your Journey <ArrowRight size={18} className="ml-2" /></Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <SectionDivider variant="leaf" />

      {/* FAQ & NEWSLETTER */}
      <section className="py-20 sm:py-28 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            <FadeIn direction="right">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-6 sm:w-8 bg-border" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Questions</span>
                <span className="h-px w-6 sm:w-8 bg-border" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight font-heading mb-6 sm:mb-8">Common Questions</h2>
              <Accordion className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-sm sm:text-base font-medium">Are mushrooms fresh when I get them?</AccordionTrigger>
                  <AccordionContent className="text-[var(--color-body)] text-sm">
                    Yes! We pick mushrooms in the early morning and send them the same day. We pack them in cool boxes so they stay fresh until you get them.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-sm sm:text-base font-medium">How do you grow your mushrooms?</AccordionTrigger>
                  <AccordionContent className="text-[var(--color-body)] text-sm">
                    We follow natural growing practices at our farm and pack each harvest with care. Contact us if you need details about a particular variety or batch.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-sm sm:text-base font-medium">How long is the training?</AccordionTrigger>
                  <AccordionContent className="text-[var(--color-body)] text-sm">
                    We have 1-day short course and 2-week full course. Choose what works for you. See our Training page for more details.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-sm sm:text-base font-medium">Where do you deliver?</AccordionTrigger>
                  <AccordionContent className="text-[var(--color-body)] text-sm">
                    We deliver to Salem, Namakkal, Erode, Coimbatore, Trichy, Madurai, Chennai, and Bangalore. Check your pincode on the product page to see if we deliver to your area.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-sm sm:text-base font-medium">Can I get mushrooms every week?</AccordionTrigger>
                  <AccordionContent className="text-[var(--color-body)] text-sm">
                    Yes! You can order weekly, every 2 weeks, or monthly. You save up to 15% and can stop anytime you want.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </FadeIn>

            <FadeIn direction="left" className="bg-[var(--color-primary-dark)] rounded-2xl p-6 sm:p-10 text-white text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
                <Send size={28} />
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold mb-3 sm:mb-4 font-heading">Get Our Updates</h2>
              <p className="text-white/80 mb-6 sm:mb-8 max-w-sm mx-auto text-sm sm:text-base">
                Give your email and we will send you special offers and news from our farm.
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
              <span className="h-px w-6 sm:w-8 bg-border" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Why Buy From Us</span>
              <span className="h-px w-6 sm:w-8 bg-border" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight font-heading mb-3 sm:mb-4">Our Promise to You</h2>
            <p className="text-[var(--color-body)] max-w-2xl mx-auto mb-12 sm:mb-20 text-sm sm:text-base">
              We grow mushrooms the old, natural way but with good quality. Our farm is in the cool hills of Kalvarayan, which is perfect for mushrooms.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20">
            {[
              { icon: ShieldCheck, title: "Natural Growing Practices", desc: "We follow careful growing and handling practices from cultivation through packing.", accent: true },
              { icon: Clock, title: "Picked Every Day", desc: "We pick fresh mushrooms every morning so you get the best.", accent: false },
              { icon: Truck, title: "Direct to Your Home", desc: "Packed clean and delivered fresh. Straight from our farm to you.", accent: false }
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
