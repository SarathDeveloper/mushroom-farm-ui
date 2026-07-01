"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SafeImage } from "@/components/SafeImage";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { useHasMounted } from "@/lib/useHasMounted";

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 49;

export default function CartPage() {
  const mounted = useHasMounted();
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Cart"
        title="Your Shopping Cart"
        image="https://images.unsplash.com/photo-1611105637889-3fa70db2b271?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {!mounted ? null : items.length === 0 ? (
            <FadeIn className="flex flex-col items-center text-center py-16">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
                <ShoppingBag size={36} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold font-heading text-foreground mb-2">Your cart is empty</h2>
              <p className="text-[var(--color-body)] mb-8 max-w-sm">
                Looks like you haven&apos;t added any fresh mushrooms yet. Let&apos;s fix that.
              </p>
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/shop">Start Shopping <ArrowRight className="ml-2" size={18} /></Link>
              </Button>
            </FadeIn>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <FadeIn key={item.productId} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card">
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden shrink-0">
                      <SafeImage src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/shop/${item.slug}`} className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.weight}</p>
                      <p className="text-primary font-bold mt-1">₹{item.price}</p>
                    </div>
                    <div className="flex items-center border border-border rounded-full bg-background">
                      <button
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="w-9 h-9 flex items-center justify-center text-[var(--color-body)] hover:text-primary"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="w-9 h-9 flex items-center justify-center text-[var(--color-body)] hover:text-primary"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </FadeIn>
                ))}
              </div>

              <FadeIn direction="left" className="lg:col-span-1">
                <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 space-y-4">
                  <h3 className="text-lg font-bold font-heading text-foreground">Order Summary</h3>
                  <div className="flex justify-between text-sm text-[var(--color-body)]">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[var(--color-body)]">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-primary bg-primary/10 rounded-lg px-3 py-2">
                      Add ₹{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(0)} more for free shipping!
                    </p>
                  )}
                  <div className="border-t border-border pt-4 flex justify-between font-bold text-foreground text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(0)}</span>
                  </div>
                  <Button asChild size="lg" className="w-full rounded-full h-12">
                    <Link href="/checkout">
                      Proceed to Checkout <ArrowRight className="ml-2" size={18} />
                    </Link>
                  </Button>
                  <Link href="/shop" className="block text-center text-sm font-semibold text-muted-foreground hover:text-primary">
                    Continue Shopping
                  </Link>
                </div>
              </FadeIn>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
