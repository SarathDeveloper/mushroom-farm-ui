import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, Truck, CheckCircle2, Quote, Send, PlayCircle, Star } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { HomeHero } from "@/components/HomeHero";
import { FarmToTable } from "@/components/FarmToTable";
import { TrustBar } from "@/components/TrustBar";
import { SeasonalAvailability } from "@/components/SeasonalAvailability";
import { SuccessStories } from "@/components/SuccessStories";
import { LoyaltySection } from "@/components/LoyaltySection";
import { ParallaxImage } from "@/components/ParallaxImage";
import { SafeImage } from "@/components/SafeImage";
import { ProductCard } from "@/components/ProductCard";
import { StatsCounter } from "@/components/StatsCounter";
import { Certifications } from "@/components/Certifications";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { products, testimonials } from "@/lib/data";

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">

      <HomeHero />

      {/* Trust Bar */}
      <TrustBar />

      {/* Farm to Table Journey */}
      <FarmToTable />

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">The Vellimalai Promise</h2>
            <p className="text-[var(--color-body)] max-w-2xl mx-auto mb-16 text-lg">
              We bridge the gap between traditional organic farming and modern quality standards. Our mushrooms are cultivated in the pristine climate of Kalvarayan Hills.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
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

      {/* FEATURED PRODUCTS */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <FadeIn className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-heading">Fresh Harvest</h2>
              <p className="text-[var(--color-body)] text-lg">Explore our premium selection, harvested today.</p>
            </div>
            <Link href="/shop" className="group inline-flex items-center gap-2 text-primary font-semibold text-lg">
              View All Products <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* ABOUT FARM (PARALLAX) */}
      <section className="py-20 bg-[var(--color-primary-dark)] relative overflow-hidden">
        <ParallaxImage
          src="/gallery/farm/growing-shed-interior.png"
          alt="Inside our mushroom growing shed"
          className="opacity-20"
        />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <FadeIn direction="right">
              <div className="relative h-[500px] rounded-[3rem] overflow-hidden border-4 border-white/10">
                <SafeImage src="/gallery/farm/oyster-mushroom-growing.png" fill sizes="(max-width: 1024px) 100vw, 50vw" alt="Fresh oyster mushrooms growing at our farm" className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group cursor-pointer hover:bg-black/10 transition-colors">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <PlayCircle size={40} className="ml-2" />
                  </div>
                </div>
              </div>
            </FadeIn>
            <FadeIn direction="left" className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold text-white font-heading">Rooted in Nature. <br/><span className="text-secondary">Cultivated with Love.</span></h2>
              <p className="text-white/80 text-lg leading-relaxed">
                Vellimalai Mushroom Farm was born out of a passion for sustainable agriculture and healthy living. Located in the serene Kalvarayan Hills, our farm utilizes pristine air and spring water to grow mushrooms that are rich in flavor and nutrients.
              </p>
              <ul className="space-y-4 pt-4">
                {["Zero Pesticides Used", "Empowering Local Farmers", "Sustainable Water Management"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/90 font-medium">
                    <CheckCircle2 className="text-secondary" size={24} /> {item}
                  </li>
                ))}
              </ul>
              <div className="pt-6">
                <Button asChild size="lg" className="rounded-full bg-white text-[var(--color-primary-dark)] hover:bg-secondary hover:scale-[1.02] px-8">
                  <Link href="/about">Discover Our Story</Link>
                </Button>
              </div>
            </FadeIn>
          </div>

          <StatsCounter />
        </div>
      </section>

      {/* TRAINING & BULK ORDERS (SPLIT) */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Training */}
            <FadeIn delay={0.1}>
              <div className="relative rounded-2xl overflow-hidden bg-secondary/40 h-[400px] flex flex-col justify-end p-10 group">
                <div className="absolute inset-0">
                  <SafeImage src="https://images.unsplash.com/photo-1574316071802-0d684efa7ea5?q=80&w=1000&auto=format&fit=crop" fill sizes="(max-width: 1024px) 100vw, 50vw" alt="Training" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-dark)]/95 via-[var(--color-primary-dark)]/45 to-transparent"></div>
                </div>
                <div className="relative z-10 text-white space-y-3">
                  <div className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider mb-2">Learn</div>
                  <h3 className="text-3xl font-bold font-heading">Mushroom Farming Training</h3>
                  <p className="text-white/80 max-w-sm">Join our hands-on workshops and master the art of commercial mushroom cultivation.</p>
                  <Link href="/training" className="inline-flex items-center gap-2 text-white font-bold hover:gap-3 transition-all pt-4">
                    View Programs <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* Bulk */}
            <FadeIn delay={0.2}>
              <div className="relative rounded-2xl overflow-hidden bg-secondary/40 h-[400px] flex flex-col justify-end p-10 group">
                <div className="absolute inset-0">
                  <SafeImage src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000&auto=format&fit=crop" fill sizes="(max-width: 1024px) 100vw, 50vw" alt="Bulk Orders" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-dark)]/95 via-[var(--color-primary-dark)]/45 to-transparent"></div>
                </div>
                <div className="relative z-10 text-white space-y-3">
                  <div className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider mb-2">B2B</div>
                  <h3 className="text-3xl font-bold font-heading">Wholesale & Bulk Orders</h3>
                  <p className="text-white/80 max-w-sm">Consistent supply of premium mushrooms for restaurants, hotels, and supermarkets.</p>
                  <Link href="/bulk-orders" className="inline-flex items-center gap-2 text-white font-bold hover:gap-3 transition-all pt-4">
                    Request a Quote <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <SuccessStories />

      {/* TESTIMONIALS */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <FadeIn>
             <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 font-heading">What Our Customers Say</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 0.1} direction="up" className="bg-card p-8 rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] relative text-left">
                <Quote className="absolute top-6 right-6 text-secondary" size={48} />
                <div className="flex gap-1 text-[#c4a96a] mb-6">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} size={16} className={star <= t.rating ? "fill-[#c4a96a]" : "fill-border text-border"} />
                  ))}
                </div>
                <p className="text-[var(--color-body)] italic mb-6 leading-relaxed">&ldquo;{t.review}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <Avatar size="lg">
                    <AvatarImage src={t.avatar} alt={t.name} />
                    <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-foreground">{t.name}</h4>
                    <span className="text-sm text-muted-foreground">{t.role}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* LOYALTY PROGRAM */}
      <LoyaltySection />

      {/* RECIPES CTA */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <FadeIn>
            <div className="relative rounded-2xl overflow-hidden bg-secondary p-10 md:p-14 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">Recipe Hub</span>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2 font-heading">
                  Don&apos;t Know What to Cook?
                </h2>
                <p className="text-[var(--color-body)] mt-2 max-w-lg">
                  Explore our curated collection of mushroom recipes — from 15-minute weeknight meals to restaurant-worthy dishes. Each recipe links directly to the mushrooms you need.
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                  <Button asChild className="rounded-full px-6">
                    <Link href="/recipes">Browse Recipes</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full px-6">
                    <Link href="/compare">Nutrition Guide</Link>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full md:w-auto md:shrink-0">
                {[
                  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=200&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=200&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=200&auto=format&fit=crop",
                ].map((src, i) => (
                  <div key={i} className="relative h-24 md:h-32 w-full md:w-28 rounded-xl overflow-hidden">
                    <SafeImage src={src} alt="Recipe" fill sizes="100px" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ & NEWSLETTER */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <FadeIn direction="right">
              <h2 className="text-3xl font-bold text-foreground mb-8 font-heading">Frequently Asked Questions</h2>
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

            <FadeIn direction="left" className="bg-[var(--color-primary-dark)] rounded-2xl p-10 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-4 font-heading">Stay Freshly Updated</h2>
              <p className="text-white/80 mb-8 max-w-sm mx-auto">
                Subscribe to our newsletter for exclusive offers, recipes, and farm updates.
              </p>
              <NewsletterForm />
            </FadeIn>

          </div>
        </div>
      </section>

    </div>
  );
}
