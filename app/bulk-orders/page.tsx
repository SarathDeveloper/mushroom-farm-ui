"use client";

import { useState } from "react";
import { Building2, CheckCircle2, Loader2, MailCheck, Percent, Repeat, Truck } from "lucide-react";
import toast from "react-hot-toast";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const benefits = [
  { icon: Truck, title: "Reliable Supply", desc: "Consistent daily/weekly delivery schedules tailored to your business." },
  { icon: Percent, title: "Wholesale Pricing", desc: "Volume-based discounts on every order, no hidden fees." },
  { icon: Repeat, title: "Flexible Frequency", desc: "Daily, weekly, or custom delivery cycles that fit your kitchen." },
];

const initialForm = {
  businessName: "",
  contactName: "",
  phone: "",
  email: "",
  location: "",
  product: "",
  quantity: "",
  frequency: "",
  requirements: "",
};

export default function BulkOrdersPage() {
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
      const res = await fetch("/api/bulk-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message ?? "Could not submit your enquiry.");
        return;
      }
      setSubmitted(true);
      toast.success("Enquiry submitted! Our team will reach out shortly.");
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="B2B"
        title="Wholesale & Bulk Orders"
        description="Consistent, premium-quality mushroom supply for restaurants, hotels, and supermarkets."
        image="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <FadeIn direction="right">
                <h2 className="text-2xl font-bold font-heading text-foreground mb-2">Why Partner With Us?</h2>
                <p className="text-[var(--color-body)] mb-8">
                  Join 320+ restaurants, hotels, and supermarkets that trust Vellimalai Farms for their daily mushroom supply.
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

              <FadeIn direction="right" delay={0.1} className="rounded-2xl bg-[var(--color-primary-dark)] text-white p-6">
                <Building2 className="mb-3" size={24} />
                <p className="italic text-white/90 mb-3">
                  &ldquo;Consistent quality and reliable delivery. Vellimalai Farms is our trusted partner.&rdquo;
                </p>
                <p className="text-sm font-semibold">Rahul Menon, Restaurant Owner</p>
              </FadeIn>
            </div>

            <FadeIn direction="left" className="lg:col-span-2">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center bg-card rounded-2xl p-12 border border-border">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/15 text-[var(--color-success)] flex items-center justify-center mb-6">
                    <MailCheck size={32} />
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-foreground mb-2">Enquiry Received!</h3>
                  <p className="text-[var(--color-body)] max-w-sm mb-6">
                    Thank you for reaching out. Our B2B team will contact you within 24 hours to discuss pricing and delivery schedules.
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      setForm(initialForm);
                      setSubmitted(false);
                    }}
                  >
                    Submit Another Enquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 border border-border space-y-5">
                  <h2 className="text-xl font-bold font-heading text-foreground">Request a Quote</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        required
                        value={form.businessName}
                        onChange={(e) => handleChange("businessName", e.target.value)}
                        placeholder="Green Leaf Restaurant"
                        className="h-11 bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="contactName">Contact Person</Label>
                      <Input
                        id="contactName"
                        required
                        value={form.contactName}
                        onChange={(e) => handleChange("contactName", e.target.value)}
                        placeholder="Full name"
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
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="you@business.com"
                        className="h-11 bg-white"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="location">Business Location</Label>
                      <Input
                        id="location"
                        required
                        value={form.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                        placeholder="City, State"
                        className="h-11 bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="product">Product(s) Needed</Label>
                      <Input
                        id="product"
                        required
                        value={form.product}
                        onChange={(e) => handleChange("product", e.target.value)}
                        placeholder="e.g. Oyster, Milky"
                        className="h-11 bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="quantity">Estimated Quantity</Label>
                      <Input
                        id="quantity"
                        required
                        value={form.quantity}
                        onChange={(e) => handleChange("quantity", e.target.value)}
                        placeholder="e.g. 20kg / week"
                        className="h-11 bg-white"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="frequency">Delivery Frequency</Label>
                      <Input
                        id="frequency"
                        required
                        value={form.frequency}
                        onChange={(e) => handleChange("frequency", e.target.value)}
                        placeholder="e.g. Daily, Weekly"
                        className="h-11 bg-white"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="requirements">Additional Requirements (optional)</Label>
                      <textarea
                        id="requirements"
                        value={form.requirements}
                        onChange={(e) => handleChange("requirements", e.target.value)}
                        placeholder="Tell us more about your needs..."
                        rows={4}
                        className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    We typically respond within 24 hours on business days.
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full sm:w-auto rounded-full h-12 px-10"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : "Submit Enquiry"}
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
