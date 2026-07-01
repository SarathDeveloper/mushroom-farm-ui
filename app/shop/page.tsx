"use client";

import { useMemo, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { FadeIn } from "@/components/FadeIn";
import { categories, products } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Shop"
        title="Fresh From Our Farm"
        description="Hand-picked, organically grown mushrooms delivered straight to your doorstep."
        image="https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <FadeIn className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-semibold transition-colors border",
                  activeCategory === category
                    ? "bg-primary text-white border-primary"
                    : "bg-secondary text-secondary-foreground border-border hover:border-primary hover:text-primary"
                )}
              >
                {category}
              </button>
            ))}
          </FadeIn>

          <FadeIn className="mb-8 text-center text-sm text-muted-foreground">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 && "s"}
          </FadeIn>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product, i) => (
                <FadeIn key={product.id} delay={(i % 4) * 0.08}>
                  <ProductCard product={product} priority={i < 4} />
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">No products found in this category.</div>
          )}
        </div>
      </section>
    </div>
  );
}
