"use client";

import { useState } from "react";
import { Clock, Loader2, Mail, MailCheck, MapPin, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { PageHero } from "@/components/PageHero";
import { SafeImage } from "@/components/SafeImage";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const contactDetails = [
  {
    icon: MapPin,
    title: "Visit the Farm",
    lines: ["Vellimalai, Kalvarayan Hills", "Tamil Nadu, India"],
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+91 98765 43210"],
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["hello@vellimalaifarms.in"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: ["Mon - Sat: 8:00 AM - 6:00 PM", "Farm visits by appointment"],
  },
];

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you within 24 hours.");
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Contact"
        title="Get in Touch"
        description="Questions about our mushrooms, pre-orders, or training? We'd love to hear from you."
        image="https://images.unsplash.com/photo-1516571748831-5d81767b788d?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-20 sm:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact info */}
            <FadeIn direction="right" className="space-y-8">
              <div>
                <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground mb-3">
                  We&apos;re here to help
                </h2>
                <p className="text-[var(--color-body)] max-w-md">
                  Reach out through any of the channels below, or send us a message using the form.
                  Our team responds within one business day.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {contactDetails.map((detail) => (
                  <div
                    key={detail.title}
                    className="flex gap-4 p-5 rounded-2xl bg-secondary border border-border"
                  >
                    <div className="w-11 h-11 rounded-xl bg-card text-primary flex items-center justify-center shrink-0">
                      <detail.icon size={20} strokeWidth={1.75} />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{detail.title}</h3>
                      {detail.lines.map((line) => (
                        <p key={line} className="text-sm text-[var(--color-body)] leading-relaxed">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative h-64 rounded-2xl overflow-hidden border border-border">
                <SafeImage
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop"
                  alt="Map of the Kalvarayan Hills region"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[var(--color-primary-dark)]/20" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-card/95 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-[var(--color-primary-dark)] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                  <MapPin size={16} className="text-primary" /> Vellimalai, Kalvarayan Hills
                </div>
              </div>
            </FadeIn>

            {/* Contact form */}
            <FadeIn direction="left">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center bg-card rounded-2xl p-12 border border-border">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/15 text-[var(--color-success)] flex items-center justify-center mb-6">
                    <MailCheck size={32} />
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-foreground mb-2">Message Sent!</h3>
                  <p className="text-[var(--color-body)] max-w-sm mb-6">
                    Thank you for reaching out. Our team will get back to you within one business day.
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      setForm(initialForm);
                      setSubmitted(false);
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-card rounded-2xl p-5 sm:p-8 border border-border shadow-[0_8px_20px_rgba(0,0,0,0.06)] space-y-4 sm:space-y-5"
                >
                  <h2 className="text-xl font-bold font-heading text-foreground">Send Us a Message</h2>
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Jane Doe"
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
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      required
                      value={form.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                      placeholder="How can we help?"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      required
                      value={form.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      placeholder="Tell us a bit more..."
                      rows={5}
                      className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full rounded-full h-12"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : "Send Message"}
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
