"use client";

import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { submitInquiry } from "@/app/actions/contact";

export const INQUIRY_TYPES = [
  "Products",
  "Training",
  "Farm Visit",
  "Wholesale",
  "Other",
];

export const CONTACT_METHODS = ["WhatsApp", "Phone", "Email"] as const;
type ContactMethod = (typeof CONTACT_METHODS)[number];

interface ContactFormProps {
  defaultInquiryType?: string;
  showCompany?: boolean;
  showLocation?: boolean;
  showEmail?: boolean;
  showMessage?: boolean;
  compact?: boolean;
  successTitle?: string;
  successMessage?: string;
}

export function ContactForm({
  defaultInquiryType = "",
  showCompany = false,
  showLocation = false,
  showEmail = false,
  showMessage = false,
  compact = false,
  successTitle = "Message Sent!",
  successMessage = "Thank you for reaching out. We will reply to you within 24 hours.",
}: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    company: "",
    inquiryType: defaultInquiryType,
    preferredContact: "WhatsApp" as ContactMethod,
    message: "",
  });

  const set = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await submitInquiry(null, formData);

    setLoading(false);

    if (result.success) {
      setSubmitted(true);
      toast.success("Request sent successfully!");
    } else {
      toast.error(result.message || "Failed to submit request.");
    }
  };

  if (submitted) {
    return (
      <div className={`flex flex-col items-center justify-center text-center bg-card rounded-2xl border border-border ${compact ? "p-8" : "p-8 sm:p-12 min-h-[520px]"}`}>
        <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/15 text-[var(--color-success)] flex items-center justify-center mb-6">
          <MailCheck size={32} />
        </div>
        <h3 className="text-2xl font-bold font-heading text-foreground mb-2">
          {successTitle}
        </h3>
        <p className="text-[var(--color-body)] max-w-sm mb-6 text-sm leading-relaxed">
          {successMessage}
        </p>
        <Button
          variant="outline"
          className="rounded-full px-6"
          onClick={() => {
            setForm({
              name: "",
              email: "",
              phone: "",
              location: "",
              company: "",
              inquiryType: defaultInquiryType,
              preferredContact: "WhatsApp",
              message: "",
            });
            setSubmitted(false);
          }}
        >
          Send Another Request
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-card rounded-2xl border border-border space-y-5 ${compact ? "p-6 sm:p-8" : "p-6 sm:p-8"}`}
    >
      {!compact && (
        <div>
          <h2 className="text-lg font-bold font-heading text-foreground">
            Send Us a Message
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tell us what you need and we will reply within 24 hours.
          </p>
        </div>
      )}

      {compact && (
        <div className="mb-2">
          <h3 className="font-bold text-lg text-foreground font-heading mb-1">
            Register Your Interest
          </h3>
          <p className="text-sm text-[var(--color-body)]">
            Fill your details. Mathesh will contact you within 24 hours.
          </p>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="contact-name">Full Name</Label>
        <Input
          id="contact-name"
          required
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Your Full Name"
        />
      </div>

      <div className={`grid ${!compact && showEmail ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"} gap-4`}>
        {showEmail && (
          <div className="space-y-1.5">
            <Label htmlFor="contact-email">Email Address</Label>
            <Input
              id="contact-email"
              type="email"
              required={!compact}
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@example.com"
            />
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="contact-phone">Mobile / WhatsApp Number</Label>
          <Input
            id="contact-phone"
            type="tel"
            required
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+91 93855 26105"
          />
        </div>
      </div>

      {showLocation && (
        <div className="space-y-1.5">
          <Label htmlFor="contact-location">Your Village / Town</Label>
          <Input
            id="contact-location"
            required={compact}
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="e.g. Vellimalai, Kallakurichi"
          />
        </div>
      )}

      {showCompany && (
        <div className="space-y-1.5">
          <Label htmlFor="contact-company">Company Name (if any)</Label>
          <Input
            id="contact-company"
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
            placeholder="Company Name"
          />
        </div>
      )}

      {!defaultInquiryType && (
        <div className="space-y-1.5">
          <Label htmlFor="contact-inquiry-type">What do you need?</Label>
          <select
            id="contact-inquiry-type"
            required
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
            {INQUIRY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      )}

      {!compact && (
        <div className="space-y-2">
          <Label>How should we contact you?</Label>
          <div className="flex gap-2">
            {CONTACT_METHODS.map((method) => {
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
      )}

      {showMessage && (
        <div className="space-y-1.5">
          <Label htmlFor="contact-message">Your Message (optional)</Label>
          <textarea
            id="contact-message"
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Tell us more about what you need..."
            rows={4}
            className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 resize-none"
          />
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        size={compact ? "default" : "lg"}
        className={`w-full rounded-full ${compact ? "h-11 mt-2" : "h-12 mt-4"}`}
      >
        {loading ? (
          <Loader2 size={compact ? 16 : 18} className="animate-spin" />
        ) : compact ? (
          "Start My Journey"
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
