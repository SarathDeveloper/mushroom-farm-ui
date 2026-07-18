import Link from "next/link";
import { ArrowRight, Award, Dumbbell, Heart, Shield, Zap } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { SafeImage } from "@/components/SafeImage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Compare Mushrooms — Nutrition Guide",
  description: "Compare the nutrition, health benefits, and best uses of Oyster, Milky, Button, and Shiitake mushrooms side by side.",
};

const mushrooms = [
  {
    name: "Oyster",
    slug: "premium-oyster-mushroom",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=400&auto=format&fit=crop",
    calories: 33,
    protein: "3.3g",
    fiber: "2.3g",
    vitaminD: "Low",
    iron: "1.3mg",
    potassium: "420mg",
    bestFor: "Weight loss, Immunity",
    taste: "Mild, slightly sweet",
    texture: "Tender, delicate",
    cooking: "Stir-fry, Soups, Grilling",
    highlight: "Best meat substitute",
  },
  {
    name: "Milky",
    slug: "fresh-milky-mushroom",
    image: "https://images.unsplash.com/photo-1508216127116-43b98c56cc19?q=80&w=400&auto=format&fit=crop",
    calories: 35,
    protein: "3.1g",
    fiber: "1.8g",
    vitaminD: "High",
    iron: "1.7mg",
    potassium: "380mg",
    bestFor: "Bone health, Vitamin D",
    taste: "Mild, milky",
    texture: "Firm, meaty",
    cooking: "Curries, Biryani, Grilling",
    highlight: "Highest Vitamin D",
  },
  {
    name: "Button",
    slug: "organic-button-mushroom",
    image: "/gallery/products/button-mushrooms-Dj92oXDo.jpg",
    calories: 22,
    protein: "3.1g",
    fiber: "1.0g",
    vitaminD: "Medium",
    iron: "0.5mg",
    potassium: "318mg",
    bestFor: "Everyday cooking, Low calorie",
    taste: "Mild, earthy",
    texture: "Soft, versatile",
    cooking: "Soups, Pizza, Salads, Everything",
    highlight: "Lowest calories",
  },
  {
    name: "Shiitake",
    slug: "shiitake-exotic",
    image: "https://images.unsplash.com/photo-1516069670183-5c8e3100be05?q=80&w=400&auto=format&fit=crop",
    calories: 34,
    protein: "2.2g",
    fiber: "2.5g",
    vitaminD: "High",
    iron: "0.4mg",
    potassium: "304mg",
    bestFor: "Immunity, Heart health",
    taste: "Rich umami, smoky",
    texture: "Chewy, meaty",
    cooking: "Ramen, Risotto, Stir-fry",
    highlight: "Most umami flavor",
  },
];

const useCases = [
  { icon: Dumbbell, goal: "High Protein", recommended: "Oyster", reason: "3.3g protein per 100g, excellent meat alternative" },
  { icon: Shield, goal: "Immunity Boost", recommended: "Shiitake", reason: "Rich in beta-glucans and lentinan compounds" },
  { icon: Heart, goal: "Heart Health", recommended: "Oyster", reason: "Contains lovastatin, helps manage cholesterol" },
  { icon: Zap, goal: "Vitamin D", recommended: "Milky", reason: "Highest natural Vitamin D among Indian mushrooms" },
  { icon: Award, goal: "Kids & Beginners", recommended: "Button", reason: "Mildest flavor, most versatile in cooking" },
];

export default function ComparePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Nutrition Guide"
        title="Compare Our Mushrooms"
        description="Not sure which mushroom is right for you? Compare nutrition, taste, and best uses side by side."
        image="https://images.unsplash.com/photo-1445282768818-728615cc910a?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-20 sm:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Comparison Cards */}
          <FadeIn className="mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mushrooms.map((m) => (
                <div key={m.name} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-40">
                    <SafeImage src={m.image} alt={m.name} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover" />
                    <Badge className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm text-foreground font-bold">{m.name}</Badge>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground text-xs">Calories</span>
                      <span className="font-bold text-foreground text-xs">{m.calories} kcal</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Protein</span>
                      <span className="font-bold text-foreground">{m.protein}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Fiber</span>
                      <span className="font-bold text-foreground">{m.fiber}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Vitamin D</span>
                      <span className="font-bold text-foreground">{m.vitaminD}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Iron</span>
                      <span className="font-bold text-foreground">{m.iron}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Potassium</span>
                      <span className="font-bold text-foreground">{m.potassium}</span>
                    </div>
                    <div className="border-t border-border pt-3 mt-3">
                      <p className="text-xs text-muted-foreground mb-1">Best for</p>
                      <p className="text-sm font-semibold text-primary">{m.bestFor}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Taste & Texture</p>
                      <p className="text-sm text-foreground">{m.taste} · {m.texture}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Best in</p>
                      <p className="text-sm text-foreground">{m.cooking}</p>
                    </div>
                    <div className="bg-primary/5 rounded-lg px-3 py-2 text-center">
                      <p className="text-xs font-bold text-primary">{m.highlight}</p>
                    </div>
                    <Button asChild size="sm" variant="outline" className="w-full rounded-full mt-2">
                      <Link href={`/shop/${m.slug}`}>Shop {m.name} <ArrowRight size={14} className="ml-1" /></Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Recommendation by Goal */}
          <FadeIn>
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="hidden sm:block h-px w-8 bg-border" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Recommendation</span>
              <span className="hidden sm:block h-px w-8 bg-border" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-foreground text-center tracking-tight mb-8">
              Which Mushroom For Your Goal?
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {useCases.map((uc) => (
                <div key={uc.goal} className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <uc.icon size={22} strokeWidth={1.75} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-sm">{uc.goal}</h3>
                    <p className="text-sm text-[var(--color-body)]">{uc.reason}</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary font-bold shrink-0 text-xs">{uc.recommended}</Badge>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn className="text-center mt-16">
            <p className="text-xs text-muted-foreground mb-4">All values per 100g of raw mushroom. Individual results may vary.</p>
            <Button asChild className="rounded-full px-8">
              <Link href="/shop">Shop All Mushrooms</Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
