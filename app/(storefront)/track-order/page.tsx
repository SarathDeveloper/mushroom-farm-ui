"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Loader2,
  Search,
  AlertCircle,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { SafeImage } from "@/components/SafeImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { cn } from "@/lib/utils";

interface OrderData {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  city: string;
  items: { name: string; quantity: number; price: number; image: string | null }[];
}

const STATUS_TO_STEP: Record<string, number> = {
  PENDING: 0,
  PROCESSING: 1,
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELLED: -1,
};

const trackingSteps = [
  { id: "placed", label: "Order Placed", icon: CheckCircle2 },
  { id: "processing", label: "Processing", icon: Package },
  { id: "packed", label: "Packed & Ready", icon: Package },
  { id: "shipped", label: "Out for Delivery", icon: Truck },
  { id: "delivered", label: "Delivered", icon: MapPin },
];

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setOrderId(idFromUrl);
      fetchOrder(idFromUrl);
    }
  }, [searchParams]);

  const fetchOrder = async (id: string) => {
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/track?id=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Order not found.");
      } else {
        setOrder(data);
      }
    } catch {
      setError("Failed to load order details.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    fetchOrder(orderId.trim());
  };

  const currentStep = order ? (STATUS_TO_STEP[order.status] ?? 0) : 0;
  const isCancelled = order?.status === "CANCELLED";
  const placedDate = order
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Track Order"
        title="Where's My Order?"
        description="Enter your order ID to see real-time delivery status."
        image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-10 sm:py-14 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <FadeIn>
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 mb-12">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter Order ID"
                  className="h-12 pl-10"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !orderId.trim()}
                className="h-12 px-6 rounded-full w-full sm:w-auto"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Track"
                )}
              </Button>
            </form>
          </FadeIn>

          {error && (
            <FadeIn className="mb-8">
              <div className="bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-xl p-4 flex items-center gap-3 text-base text-[var(--color-error)]">
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </div>
            </FadeIn>
          )}

          {order && !isCancelled && (
            <FadeIn>
              <div className="bg-card rounded-2xl border border-border p-5 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Placed on {placedDate}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-bold w-fit",
                      currentStep >= 4
                        ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    {currentStep >= 4 ? "Delivered" : order.status}
                  </div>
                </div>

                {/* Progress Tracker */}
                <div className="relative">
                  {trackingSteps.map((step, i) => {
                    const isCompleted = i < currentStep;
                    const isCurrent = i === currentStep;

                    return (
                      <div key={step.id} className="flex gap-4 pb-8 last:pb-0">
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                              isCompleted
                                ? "bg-[var(--color-success)] text-white"
                                : isCurrent
                                  ? "bg-primary text-white ring-4 ring-primary/20"
                                  : "bg-secondary text-muted-foreground",
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle2 size={20} />
                            ) : isCurrent ? (
                              <Clock size={18} className="animate-pulse" />
                            ) : (
                              <step.icon size={18} />
                            )}
                          </div>
                          {i < trackingSteps.length - 1 && (
                            <div
                              className={cn(
                                "w-0.5 flex-1 mt-2",
                                isCompleted
                                  ? "bg-[var(--color-success)]"
                                  : "bg-border",
                              )}
                            />
                          )}
                        </div>
                        <div className="pt-2 pb-4">
                          <h3
                            className={cn(
                              "font-semibold text-sm",
                              isCompleted || isCurrent
                                ? "text-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            {step.label}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {isCompleted || isCurrent ? placedDate : "Pending"}
                          </p>
                          {isCurrent && (
                            <p className="text-sm text-primary font-medium mt-1 flex items-center gap-1">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                              </span>
                              Current status
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Items */}
                {order.items.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border space-y-3">
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                      Items
                    </p>
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-3 text-sm text-[var(--color-body)]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {item.image && (
                            <div className="relative h-10 w-10 rounded-lg overflow-hidden shrink-0 bg-secondary">
                              <SafeImage
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                          )}
                          <span className="truncate">
                            {item.name} × {item.quantity}
                          </span>
                        </div>
                        <span className="font-medium text-foreground shrink-0 text-sm">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border text-sm">
                      <span>Total</span>
                      <span>₹{order.totalAmount}</span>
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-secondary rounded-xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        Delivery Partner
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        Sri Amman Express
                      </p>
                    </div>
                    {order.city && (
                      <div className="bg-secondary rounded-xl p-4">
                        <p className="text-sm text-muted-foreground mb-1">
                          Delivering to
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {order.city}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Need help?{" "}
                    <a
                      href="https://wa.me/916380687811"
                      className="inline-flex items-center gap-1.5 text-whatsapp font-semibold hover:underline"
                    >
                      <WhatsAppIcon className="size-3.5" />
                      Chat on WhatsApp
                    </a>
                  </p>
                </div>
              </div>
            </FadeIn>
          )}

          {order && isCancelled && (
            <FadeIn>
              <div className="bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-2xl p-8 text-center">
                <AlertCircle
                  size={36}
                  className="mx-auto mb-4 text-[var(--color-error)]"
                />
                <h2 className="text-xl font-bold font-heading text-foreground mb-2">
                  Order Cancelled
                </h2>
                <p className="text-sm text-[var(--color-body)]">
                  Order #{order.id.slice(0, 8).toUpperCase()} has been cancelled.
                </p>
              </div>
            </FadeIn>
          )}

          {!order && !error && !loading && (
            <FadeIn className="text-center text-muted-foreground">
              <Package size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm">
                Enter your order ID above to track your delivery status.
              </p>
              <p className="text-sm mt-2">
                You can find your order ID in your order confirmation.
              </p>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  );
}
