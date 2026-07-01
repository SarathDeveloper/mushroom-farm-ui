"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data";
import { useWishlistStore } from "@/lib/store";
import { useHasMounted } from "@/lib/useHasMounted";

export default function WishlistPage() {
  const mounted = useHasMounted();
  const productIds = useWishlistStore((s) => s.productIds);
  const wishlistedProducts = products.filter((p) => productIds.includes(p.id));

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Wishlist"
        title="Your Saved Favorites"
        image="https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {!mounted ? null : wishlistedProducts.length === 0 ? (
            <FadeIn className="flex flex-col items-center text-center py-16">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
                <Heart size={36} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold font-heading text-foreground mb-2">Your wishlist is empty</h2>
              <p className="text-[var(--color-body)] mb-8 max-w-sm">
                Tap the heart icon on any product to save it here for later.
              </p>
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/shop">Explore Products <ArrowRight className="ml-2" size={18} /></Link>
              </Button>
            </FadeIn>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {wishlistedProducts.map((product, i) => (
                <FadeIn key={product.id} delay={i * 0.08}>
                  <ProductCard product={product} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
