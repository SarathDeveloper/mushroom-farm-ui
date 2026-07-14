"use client";

import { useState } from "react";
import { CalendarCheck, CheckCircle2, Loader2, MailCheck, Package, Sprout } from "lucide-react";
import toast from "react-hot-toast";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const benefits = [
  {
    icon: Sprout,
    title: "Reserve Peak Harvest",
    desc: "Lock in mushrooms when they're at their freshest — before limited batches sell out.",
  },
  {
    icon: CalendarCheck,
    title: "Choose Your Date",
    desc: "Pick a preferred delivery or pickup window that fits your plans.",
  },
  {
    icon: Package,
    title: "Confirmed Availability",
    desc: "We'll confirm stock and get in touch before you need to arrange payment.",
  },
];

const initialForm = {
  name: "",
  phone: "",
  email: "",
  product: "",
  quantity: "",
  preferredDate: "",
  location: "",
  notes: "",
};

export default function PreOrderPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/pre-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message ?? "Could not submit your pre-order.");
        return;
      }
      setSubmitted(true);
      toast.success("Pre-order submitted! We'll confirm shortly.");
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Reserve Ahead"
        title="Pre-Order Mushrooms"
        description="Secure farm-fresh mushrooms for an upcoming harvest. Tell us what you need and when — we'll confirm availability."
        image="https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <FadeIn direction="right">
                <h2 className="text-2xl font-bold font-heading text-foreground mb-2">
                  Why Pre-Order?
                </h2>
                <p className="text-[var(--color-body)] mb-8">
                  Seasonal and specialty mushrooms move quickly. Pre-ordering ensures you get the
                  harvest you want without last-minute stockouts.
                </p>
                <div className="space-y-6">
                  {benefits.map((b) => (
                    <div key={b.title} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <b.icon size={22} strokeWidth={1.75} />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{b.title}</h3>
                        <p className="text-sm text-[var(--color-body)]">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            <FadeIn direction="left" className="lg:col-span-2">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center bg-card rounded-2xl p-12 border border-border">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/15 text-[var(--color-success)] flex items-center justify-center mb-6">
                    <MailCheck size={32} />
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-foreground mb-2">
                    Pre-Order Received!
                  </h3>
                  <p className="text-[var(--color-body)] max-w-sm mb-6">
                    Thank you. Our team will confirm availability and contact you within 24 hours
                    about the next steps.
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      setForm(initialForm);
                      setSubmitted(false);
                    }}
                  >
                    Submit Another Pre-Order
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-card rounded-2xl p-8 border border-border space-y-5"
                >
                  <h2 className="text-xl font-bold font-heading text-foreground">
                    Place a Pre-Order
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        required
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Your name"
                        className="h-11 bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+91 98765 43210"
                        className="h-11 bg-white"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="you@email.com"
                        className="h-11 bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="product">Product(s)</Label>
                      <Input
                        id="product"
                        required
                        value={form.product}
                        onChange={(e) => handleChange("product", e.target.value)}
                        placeholder="e.g. Shiitake, Oyster"
                        className="h-11 bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        required
                        value={form.quantity}
                        onChange={(e) => handleChange("quantity", e.target.value)}
                        placeholder="e.g. 2kg"
                        className="h-11 bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="preferredDate">Preferred Date</Label>
                      <Input
                        id="preferredDate"
                        type="date"
                        required
                        value={form.preferredDate}
                        onChange={(e) => handleChange("preferredDate", e.target.value)}
                        className="h-11 bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="location">Delivery Location</Label>
                      <Input
                        id="location"
                        required
                        value={form.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                        placeholder="City, Area"
                        className="h-11 bg-white"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="notes">Notes (optional)</Label>
                      <textarea
                        id="notes"
                        value={form.notes}
                        onChange={(e) => handleChange("notes", e.target.value)}
                        placeholder="Pickup preference, packaging notes, or anything else..."
                        rows={4}
                        className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    Pre-orders are confirmed by our team before payment.
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full sm:w-auto rounded-full h-12 px-10"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : "Submit Pre-Order"}
                  </Button>
                </form>
              )}
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
