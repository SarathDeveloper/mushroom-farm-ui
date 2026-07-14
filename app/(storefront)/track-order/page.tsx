"use client";

import { useState } from "react";
import { Package, Truck, CheckCircle2, Clock, MapPin, Loader2, Search } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const trackingSteps = [
  { id: "placed", label: "Order Placed", icon: CheckCircle2, time: "Today, 9:15 AM" },
  { id: "processing", label: "Processing", icon: Package, time: "Today, 10:00 AM" },
  { id: "packed", label: "Packed & Ready", icon: Package, time: "Today, 11:30 AM" },
  { id: "shipped", label: "Out for Delivery", icon: Truck, time: "Today, 1:00 PM" },
  { id: "delivered", label: "Delivered", icon: MapPin, time: "Expected by 6:00 PM" },
];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [tracked, setTracked] = useState(false);
  const [currentStep, setCurrentStep] = useState(3);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTracked(true);
      setCurrentStep(Math.floor(Math.random() * 4) + 1);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Track Order"
        title="Where's My Order?"
        description="Enter your order ID to see real-time delivery status."
        image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <FadeIn>
            <form onSubmit={handleTrack} className="flex gap-3 mb-12">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter Order ID (e.g., VM123456)"
                  className="h-12 pl-10"
                />
              </div>
              <Button type="submit" disabled={loading || !orderId.trim()} className="h-12 px-6 rounded-xl">
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Track"}
              </Button>
            </form>
          </FadeIn>

          {tracked && (
            <FadeIn>
              <div className="bg-card rounded-2xl border border-border p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-lg font-bold font-heading text-foreground">Order #{orderId || "VM284721"}</h2>
                    <p className="text-sm text-muted-foreground">Placed on {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  <div className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-bold",
                    currentStep >= 4 ? "bg-[var(--color-success)]/10 text-[var(--color-success)]" : "bg-primary/10 text-primary"
                  )}>
                    {currentStep >= 4 ? "Delivered" : "In Transit"}
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
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                            isCompleted ? "bg-[var(--color-success)] text-white" :
                            isCurrent ? "bg-primary text-white ring-4 ring-primary/20" :
                            "bg-secondary text-muted-foreground"
                          )}>
                            {isCompleted ? (
                              <CheckCircle2 size={20} />
                            ) : isCurrent ? (
                              <Clock size={18} className="animate-pulse" />
                            ) : (
                              <step.icon size={18} />
                            )}
                          </div>
                          {i < trackingSteps.length - 1 && (
                            <div className={cn(
                              "w-0.5 flex-1 mt-2",
                              isCompleted ? "bg-[var(--color-success)]" : "bg-border"
                            )} />
                          )}
                        </div>
                        <div className="pt-2 pb-4">
                          <h3 className={cn(
                            "font-semibold text-sm",
                            isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {step.label}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {isCompleted || isCurrent ? step.time : "Pending"}
                          </p>
                          {isCurrent && (
                            <p className="text-xs text-primary font-medium mt-1 flex items-center gap-1">
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

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-secondary rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">Delivery Partner</p>
                      <p className="text-sm font-semibold text-foreground">Vellimalai Express</p>
                      <p className="text-xs text-primary mt-1">+91 98765 43210</p>
                    </div>
                    <div className="bg-secondary rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">Delivering to</p>
                      <p className="text-sm font-semibold text-foreground">Salem, Tamil Nadu</p>
                      <p className="text-xs text-[var(--color-body)] mt-1">Expected by 6:00 PM today</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-muted-foreground">
                    Need help? <a href="https://wa.me/919876543210" className="text-primary font-semibold hover:underline">Chat on WhatsApp</a>
                  </p>
                </div>
              </div>
            </FadeIn>
          )}

          {!tracked && (
            <FadeIn className="text-center text-muted-foreground">
              <Package size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm">Enter your order ID above to track your delivery status.</p>
              <p className="text-xs mt-2">You can find your order ID in the confirmation email or SMS.</p>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  );
}
