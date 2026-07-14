"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, PartyPopper, ShoppingBag, Tag, Clock, Truck } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/lib/store";
import { useHasMounted } from "@/lib/useHasMounted";
import { cn } from "@/lib/utils";

const deliverySlots = [
  { id: "morning", label: "Morning", time: "8:00 AM - 12:00 PM", icon: "🌅" },
  { id: "afternoon", label: "Afternoon", time: "12:00 PM - 4:00 PM", icon: "☀️" },
  { id: "evening", label: "Evening", time: "4:00 PM - 8:00 PM", icon: "🌇" },
];

const validCoupons: Record<string, { discount: number; isPercent: boolean; minOrder: number }> = {
  FRESH10: { discount: 10, isPercent: true, minOrder: 200 },
  WELCOME50: { discount: 50, isPercent: false, minOrder: 300 },
  MUSHROOM15: { discount: 15, isPercent: true, minOrder: 500 },
};

export default function CheckoutPage() {
  const mounted = useHasMounted();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clear = useCartStore((s) => s.clear);

  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("evening");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 49;
  const discount = appliedCoupon?.discount ?? 0;
  const total = subtotal + shipping - discount;

  const applyCoupon = () => {
    setCouponError("");
    const code = couponCode.toUpperCase().trim();
    const coupon = validCoupons[code];
    if (!coupon) {
      setCouponError("Invalid coupon code");
      return;
    }
    if (subtotal < coupon.minOrder) {
      setCouponError(`Minimum order ₹${coupon.minOrder} required`);
      return;
    }
    const discountAmt = coupon.isPercent
      ? Math.round(subtotal * coupon.discount / 100)
      : coupon.discount;
    setAppliedCoupon({ code, discount: discountAmt });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

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
          <p className="text-xl font-bold text-primary mb-4">#{orderId}</p>
          <p className="text-sm text-[var(--color-body)] mb-8 max-w-sm mx-auto">
            Delivery slot: <strong>{deliverySlots.find(s => s.id === selectedSlot)?.time}</strong> tomorrow
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/track-order">Track My Order</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8">
              <Link href="/shop">Continue Shopping</Link>
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
          {/* Progress steps */}
          <FadeIn className="mb-10">
            <div className="flex items-center justify-center gap-2 text-sm">
              {["Cart", "Details", "Payment", "Confirm"].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                    i <= 1 ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                  )}>
                    {i < 1 ? <CheckCircle2 size={14} /> : i + 1}
                  </span>
                  <span className={cn(
                    "hidden sm:inline",
                    i <= 1 ? "text-foreground font-medium" : "text-muted-foreground"
                  )}>{step}</span>
                  {i < 3 && <span className="w-8 h-px bg-border" />}
                </div>
              ))}
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <FadeIn direction="right" className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Shipping Details */}
                <div className="space-y-4">
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
                </div>

                {/* Delivery Time Slot */}
                <div className="space-y-4">
                  <h2 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
                    <Clock size={18} className="text-primary" /> Choose Delivery Time
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {deliverySlots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(slot.id)}
                        className={cn(
                          "p-4 rounded-xl border text-center transition-all",
                          selectedSlot === slot.id
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border bg-card hover:border-primary/30"
                        )}
                      >
                        <span className="text-xl mb-1 block">{slot.icon}</span>
                        <p className="text-sm font-semibold text-foreground">{slot.label}</p>
                        <p className="text-xs text-muted-foreground">{slot.time}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Delivery Instructions (optional)</Label>
                  <textarea
                    id="notes"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g., Leave at door, Call before delivery, Ring bell twice..."
                    rows={3}
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 resize-none"
                  />
                </div>

                <div className="rounded-2xl border border-border bg-secondary/50 p-4 flex items-center gap-3 text-sm text-[var(--color-body)]">
                  <Truck size={18} className="text-primary shrink-0" />
                  Cash on Delivery & UPI available. Online payment via Razorpay coming soon.
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
              <div className="sticky top-24 space-y-4">
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
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
                      <span>{shipping === 0 ? <span className="text-[var(--color-success)] font-medium">Free</span> : `₹${shipping}`}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-sm text-[var(--color-success)]">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>-₹{appliedCoupon.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-foreground text-lg pt-2 border-t border-border">
                      <span>Total</span>
                      <span>₹{total.toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <Tag size={14} className="text-primary" /> Apply Coupon
                  </h4>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-[var(--color-success)]/10 rounded-lg px-3 py-2">
                      <span className="text-sm font-semibold text-[var(--color-success)]">{appliedCoupon.code} applied!</span>
                      <button onClick={removeCoupon} className="text-xs text-[var(--color-error)] font-medium hover:underline">Remove</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <Input
                          value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                          placeholder="Enter code"
                          className="h-9 text-sm uppercase"
                        />
                        <Button onClick={applyCoupon} size="sm" variant="outline" className="h-9 px-3 text-xs shrink-0">
                          Apply
                        </Button>
                      </div>
                      {couponError && <p className="text-xs text-[var(--color-error)] mt-2">{couponError}</p>}
                      <p className="text-[11px] text-muted-foreground mt-2">Try: FRESH10, WELCOME50, MUSHROOM15</p>
                    </>
                  )}
                </div>

                {shipping === 0 && subtotal > 0 && (
                  <div className="rounded-xl bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 p-3 text-center">
                    <p className="text-xs font-semibold text-[var(--color-success)]">
                      <CheckCircle2 size={12} className="inline mr-1" /> You qualify for free shipping!
                    </p>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
