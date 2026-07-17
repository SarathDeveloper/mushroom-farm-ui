"use client";

import { useState } from "react";
import { Loader2, MailCheck, MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PHONE = "+91 98765 43210";
const EMAIL = "hello@vellimalaifarms.in";
const WHATSAPP_NUMBER = "919876543210";
const ADDRESS_LINE = "Vellimalai, Kalvarayan Hills, Tamil Nadu, India";
const LAT = 11.786746298281923;
const LNG = 78.71029442669108;
const MAPS_EMBED_URL = `https://www.google.com/maps?q=${LAT},${LNG}&z=14&output=embed`;
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${LAT},${LNG}`;

const inquiryTypes = [
  "Products",
  "Training",
  "Pre-Order",
  "Farm Visit",
  "Wholesale",
  "Other",
];

const contactMethods = ["WhatsApp", "Phone", "Email"] as const;
type ContactMethod = (typeof contactMethods)[number];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.85 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const initialForm = {
  name: "",
  email: "",
  mobile: "",
  subject: "",
  inquiryType: "",
  preferredContact: "WhatsApp" as ContactMethod,
  message: "",
};

export default function ContactPage() {
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
    <div className="flex flex-col min-h-screen bg-background">
      {/* ───── Centered header ───── */}
      <FadeIn className="pt-28 sm:pt-36 pb-10 sm:pb-14 text-center px-4">
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="hidden sm:block h-px w-10 bg-border" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Get in Touch
          </span>
          <span className="hidden sm:block h-px w-10 bg-border" />
        </div>
        <h1
          className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-heading"
        >
          Contact us
        </h1>
        <p className="text-[var(--color-body)] max-w-xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
          We are here to help with mushroom orders, training enquiries, farm visits, and anything else you need.
          Reach us by phone or email, or send a message and we will assist you further.
        </p>
        <p className="text-muted-foreground text-xs mt-3">
          Operated by Sri Amman Mushroom Farms
        </p>
      </FadeIn>

      {/* ───── Two-column body ───── */}
      <section className="pb-20 sm:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">

            {/* ── Left column ── */}
            <FadeIn direction="right" className="space-y-6">
              {/* Reach us directly */}
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <h2 className="text-lg font-bold font-heading text-foreground mb-1">
                  Reach us directly
                </h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Prefer a quick conversation? Choose how you&apos;d like to connect.
                </p>

                <div className="flex flex-wrap gap-3">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1ebe57] transition-colors"
                  >
                    <WhatsAppIcon className="size-4" />
                    WhatsApp
                  </a>

                  {/* Phone */}
                  <a
                    href={`tel:${PHONE.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    <Phone size={15} />
                    {PHONE}
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${EMAIL}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    <Mail size={15} />
                    {EMAIL}
                  </a>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  Typically respond within 24 hours
                </p>
              </div>

              {/* Visit us */}
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-bold font-heading text-foreground">
                    Visit us
                  </h2>
                  <a
                    href={MAPS_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    Open in Google Maps
                    <ExternalLink size={14} />
                  </a>
                </div>

                <div className="flex items-start gap-2.5 mb-5">
                  <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      Vellimalai, Kalvarayan Hills
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {ADDRESS_LINE}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-border h-56 sm:h-64">
                  <iframe
                    title="Sri Amman Mushroom Farms location"
                    src={MAPS_EMBED_URL}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>
            </FadeIn>

            {/* ── Right column — form ── */}
            <FadeIn direction="left">
              {submitted ? (
                <div className="h-full min-h-[520px] flex flex-col items-center justify-center text-center bg-card rounded-2xl p-12 border border-border">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/15 text-[var(--color-success)] flex items-center justify-center mb-6">
                    <MailCheck size={32} />
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-foreground mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-[var(--color-body)] max-w-sm mb-6 text-sm">
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
                  className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-5"
                >
                  <div>
                    <h2 className="text-lg font-bold font-heading text-foreground">
                      Send us a message
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Tell us about your query and we&apos;ll respond within 24 hours.
                    </p>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Full Name"
                    />
                  </div>

                  {/* Email + Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="Email Address"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        value={form.mobile}
                        onChange={(e) => set("mobile", e.target.value)}
                        placeholder="Mobile Number"
                      />
                    </div>
                  </div>

                  {/* Subject (optional) */}
                  <div className="space-y-1.5">
                    <Label htmlFor="subject">Company / Subject (optional)</Label>
                    <Input
                      id="subject"
                      value={form.subject}
                      onChange={(e) => set("subject", e.target.value)}
                      placeholder="Company / Subject (optional)"
                    />
                  </div>

                  {/* Inquiry type */}
                  <div className="space-y-1.5">
                    <Label htmlFor="inquiry-type">Inquiry type</Label>
                    <select
                      id="inquiry-type"
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
                        Select inquiry type...
                      </option>
                      {inquiryTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred contact method */}
                  <div className="space-y-2">
                    <Label>Preferred Contact</Label>
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
                    <Label htmlFor="message">Brief project details (optional)</Label>
                    <textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder="Brief project details (optional)"
                      rows={4}
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
    </div>
  );
}
