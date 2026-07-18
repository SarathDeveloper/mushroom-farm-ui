"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Loader2, MailCheck, MapPin, Phone, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

const PHONE = "+91 93855 26105";
const ADDITIONAL_PHONES = ["+91 89031 56142", "+91 63833 61207"];
const EMAIL = "hello@vellimalaifarms.in";
const WHATSAPP_NUMBER = "916380687811";
const ADDRESS_LINE = "Sari Amman Oyster Mushroom Farm, Vellimalai, Melsathanur, Kallakurichi - 606 209, Tamil Nadu, India";
const LAT = 11.786746298281923;
const LNG = 78.71029442669108;
const MAPS_EMBED_URL = `https://www.google.com/maps?q=${LAT},${LNG}&z=14&output=embed`;
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${LAT},${LNG}`;

const contactMethods = ["WhatsApp", "Phone", "Email"] as const;
type ContactMethod = (typeof contactMethods)[number];

const initialForm = {
  name: "",
  email: "",
  mobile: "",
  inquiryType: "",
  preferredContact: "WhatsApp" as ContactMethod,
  message: "",
};

const inquiryTypes = [
  "Products",
  "Training",
  "Pre-Order",
  "Farm Visit",
  "Wholesale",
  "Other",
];

export function HomeContactSection() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field: keyof typeof initialForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

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
    <section className="py-20 sm:py-28 bg-secondary grain-overlay">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Section header */}
        <FadeIn className="text-center mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-6 sm:w-8 bg-border" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Talk to Us
            </span>
            <span className="h-px w-6 sm:w-8 bg-border" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight font-heading">
            Contact Us
          </h2>
          <p className="text-[var(--color-body)] max-w-lg mx-auto mt-3 text-sm sm:text-base leading-relaxed">
            Have questions about mushrooms, training, or visiting our farm? Write to us and we will reply.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">

          {/* Left column — reach us + address */}
          <FadeIn direction="right" className="space-y-6">
            {/* Reach us directly */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h3 className="text-lg font-bold font-heading text-foreground mb-1">
                  Call or Message Us
                </h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Want to talk now? Pick how you want to reach us.
                </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 text-sm font-semibold text-white hover:bg-whatsapp-hover transition-colors"
                >
                  <WhatsAppIcon className="size-4" />
                  WhatsApp
                </a>

                <a
                  href={`tel:${PHONE.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  <Phone size={15} />
                  {PHONE}
                </a>

                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  <Mail size={15} />
                  {EMAIL}
                </a>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-muted-foreground">
                {ADDITIONAL_PHONES.map((phone) => (
                  <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-foreground transition-colors">
                    {phone}
                  </a>
                ))}
              </div>

                <p className="text-xs text-muted-foreground mt-4">
                  We usually reply within 24 hours
                </p>
            </div>

            {/* Visit us + map */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold font-heading text-foreground">
                    Come Visit Us
                  </h3>
                  <a
                    href={MAPS_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    See on Google Maps
                    <ExternalLink size={14} />
                  </a>
              </div>

              <div className="flex items-start gap-2.5 mb-5">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    Sari Amman Oyster Mushroom Farm
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {ADDRESS_LINE.replace("Sari Amman Oyster Mushroom Farm, ", "")}
                  </p>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-border h-48 sm:h-56">
                <iframe
                  title="Sri Amman Mushroom Farms location"
                  src={MAPS_EMBED_URL}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>

              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mt-4"
              >
                See All Contact Info
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </FadeIn>

          {/* Right column — form */}
          <FadeIn direction="left">
            {submitted ? (
              <div className="min-h-[440px] flex flex-col items-center justify-center text-center bg-card rounded-2xl p-10 border border-border">
                <div className="w-14 h-14 rounded-full bg-[var(--color-success)]/15 text-[var(--color-success)] flex items-center justify-center mb-5">
                  <MailCheck size={28} />
                </div>
                <h3 className="text-xl font-bold font-heading text-foreground mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-[var(--color-body)] max-w-sm mb-5 text-sm">
                    Thank you! We will reply to you within one day.
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
                  className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4"
                >
                  <div>
                    <h3 className="text-lg font-bold font-heading text-foreground">
                      Send Us a Message
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Tell us what you need and we will reply within 24 hours.
                    </p>
                  </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="home-name">Full Name</Label>
                  <Input
                    id="home-name"
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Full Name"
                  />
                </div>

                {/* Email + Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="home-email">Email Address</Label>
                    <Input
                      id="home-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="Email Address"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="home-mobile">Mobile Number</Label>
                    <Input
                      id="home-mobile"
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => set("mobile", e.target.value)}
                      placeholder="Mobile Number"
                    />
                  </div>
                </div>

                  {/* Inquiry type */}
                  <div className="space-y-1.5">
                    <Label htmlFor="home-inquiry-type">What do you need?</Label>
                  <select
                    id="home-inquiry-type"
                    value={form.inquiryType}
                    onChange={(e) => set("inquiryType", e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 text-foreground appearance-none"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235c6370' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option value="" disabled className="text-muted-foreground">
                      Choose one...
                    </option>
                    {inquiryTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                  {/* Preferred contact */}
                  <div className="space-y-2">
                    <Label>How should we contact you?</Label>
                  <div className="flex gap-2">
                    {contactMethods.map((method) => {
                      const active = form.preferredContact === method;
                      return (
                        <button
                          key={method}
                          type="button"
                          onClick={() => set("preferredContact", method)}
                          className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
                            active
                              ? "bg-primary text-white border-primary"
                              : "bg-card text-foreground border-border hover:bg-secondary"
                          }`}
                        >
                          {method}
                        </button>
                      );
                    })}
                  </div>
                </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <Label htmlFor="home-message">Your Message (optional)</Label>
                    <textarea
                      id="home-message"
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder="Tell us more about what you need..."
                    rows={3}
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 resize-none"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full rounded-full h-12"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            )}
          </FadeIn>

        </div>
      </div>
    </section>
  );
}
