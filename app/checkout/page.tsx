"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, PartyPopper, ShoppingBag } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/lib/store";
import { useHasMounted } from "@/lib/useHasMounted";

export default function CheckoutPage() {
  const mounted = useHasMounted();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clear = useCartStore((s) => s.clear);

  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setOrderId(`VM${Math.floor(100000 + Math.random() * 900000)}`);
      clear();
      setSubmitting(false);
    }, 1200);
  };

  if (!mounted) return null;

  if (orderId) {
    return (
      <div className="flex flex-col min-h-[70vh] items-center justify-center px-4 py-24 text-center">
        <FadeIn>
          <div className="w-20 h-20 rounded-full bg-[var(--color-success)]/15 text-[var(--color-success)] flex items-center justify-center mx-auto mb-6">
            <PartyPopper size={36} />
          </div>
          <h1 className="text-3xl font-bold font-heading text-foreground mb-3">Order Placed Successfully!</h1>
          <p className="text-[var(--color-body)] max-w-md mx-auto mb-2">
            Thank you for your order. A confirmation has been noted under order ID:
          </p>
          <p className="text-xl font-bold text-primary mb-8">#{orderId}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-8 max-w-sm mx-auto">
            This is a demo checkout — no real payment was processed. Connect Razorpay keys to enable live payments.
          </p>
        </FadeIn>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-[60vh] items-center justify-center text-center px-4 py-24">
        <ShoppingBag size={36} className="text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold font-heading text-foreground mb-2">Nothing to checkout</h1>
        <p className="text-[var(--color-body)] mb-6">Your cart is empty. Add some products first.</p>
        <Button asChild className="rounded-full px-8">
          <Link href="/shop">Go to Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Checkout"
        title="Almost There"
        image="https://images.unsplash.com/photo-1497515114629-f71d768fd07c?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <FadeIn direction="right" className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl font-bold font-heading text-foreground">Shipping Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" required placeholder="Jane Doe" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" required placeholder="+91 98765 43210" className="h-11" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" required placeholder="House no., street, area" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required placeholder="Salem" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" required placeholder="Tamil Nadu" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" required placeholder="636001" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email (for order updates)</Label>
                    <Input id="email" type="email" required placeholder="you@example.com" className="h-11" />
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-secondary/50 p-4 flex items-center gap-3 text-sm text-[var(--color-body)]">
                  <CheckCircle2 size={18} className="text-primary shrink-0" />
                  Cash on Delivery available. Online payment via Razorpay coming soon.
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  size="lg"
                  className="w-full rounded-full h-12"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" /> Placing Order...
                    </>
                  ) : (
                    `Place Order · ₹${total.toFixed(0)}`
                  )}
                </Button>
              </form>
            </FadeIn>

            <FadeIn direction="left" className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 space-y-4">
                <h3 className="text-lg font-bold font-heading text-foreground">Order Summary</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm text-[var(--color-body)]">
                      <span className="line-clamp-1">{item.name} × {item.quantity}</span>
                      <span className="font-medium text-foreground shrink-0 ml-2">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-[var(--color-body)]">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[var(--color-body)]">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-foreground text-lg pt-2">
                    <span>Total</span>
                    <span>₹{total.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
