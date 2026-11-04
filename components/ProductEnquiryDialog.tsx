"use client";

import { useState } from "react";
import { Loader2, MailCheck, MessageSquareText } from "lucide-react";
import toast from "react-hot-toast";
import { submitInquiry } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { whatsappLink } from "@/lib/features";
import { cn } from "@/lib/utils";

const CONTACT_METHODS = ["WhatsApp", "Phone"] as const;

type EnquiryProduct = { name: string; weight: string };

const emptyForm = {
  name: "",
  phone: "",
  location: "",
  preferredContact: "WhatsApp" as (typeof CONTACT_METHODS)[number],
  message: "",
  website: "", // honeypot: real visitors never see or fill this
};

/** "Enquire" button that opens a short product enquiry form. */
export function EnquireButton({
  product,
  quantity = 1,
  className,
  size = "lg",
  children,
}: {
  product: EnquiryProduct;
  quantity?: number;
  className?: string;
  size?: "sm" | "default" | "lg";
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" size={size} onClick={() => setOpen(true)} className={className}>
        {children ?? (
          <>
            <MessageSquareText size={18} className="mr-2" />
            Enquire Now
          </>
        )}
      </Button>
      {open && (
        <ProductEnquiryDialog
          product={product}
          quantity={quantity}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </>
  );
}

function ProductEnquiryDialog({
  product,
  quantity,
  open,
  onOpenChange,
}: {
  product: EnquiryProduct;
  quantity: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState(emptyForm);
  const [qty, setQty] = useState(String(quantity));
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field: keyof typeof emptyForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const summary = `Product: ${product.name} (${product.weight})\nQuantity: ${qty || 1} pack(s)`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("phone", form.phone);
    formData.append("location", form.location);
    formData.append("inquiryType", "Products");
    formData.append("preferredContact", form.preferredContact);
    formData.append("website", form.website);
    formData.append(
      "message",
      form.message.trim() ? `${summary}\n\n${form.message.trim()}` : summary,
    );

    const result = await submitInquiry(null, formData);
    setLoading(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      toast.error(result.message || "Couldn't send your enquiry. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-14 h-14 rounded-full bg-[var(--color-success)]/15 text-[var(--color-success)] flex items-center justify-center mb-4">
              <MailCheck size={28} />
            </div>
            <DialogTitle>Enquiry sent!</DialogTitle>
            <DialogDescription className="mt-2">
              Thanks, {form.name.split(" ")[0] || "there"}. We&apos;ll contact you on{" "}
              {form.preferredContact} within 24 hours to confirm availability, price and delivery.
            </DialogDescription>
            <Button className="mt-6 rounded-full px-6" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <DialogTitle>Enquire about {product.name}</DialogTitle>
              <DialogDescription className="mt-1">
                Share your details and we&apos;ll confirm availability, price and delivery.
              </DialogDescription>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="enq-name">Full Name</Label>
                <Input
                  id="enq-name"
                  required
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-1.5 w-24">
                <Label htmlFor="enq-qty">Packs</Label>
                <Input
                  id="enq-qty"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={999}
                  required
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="enq-phone">Mobile / WhatsApp Number</Label>
              <Input
                id="enq-phone"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                maxLength={16}
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="10-digit mobile number"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="enq-location">Town / City (optional)</Label>
              <Input
                id="enq-location"
                maxLength={80}
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="e.g. Salem"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="enq-message">Anything else? (optional)</Label>
              <textarea
                id="enq-message"
                rows={2}
                maxLength={1000}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder="Delivery date, bulk needs, questions…"
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-base outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 resize-none"
              />
            </div>

            <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
              <label htmlFor="enq-website">Website</label>
              <input
                id="enq-website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Contact me on</Label>
              <div className="flex gap-2">
                {CONTACT_METHODS.map((method) => (
                  <button
                    key={method}
                    type="button"
                    aria-pressed={form.preferredContact === method}
                    onClick={() => set("preferredContact", method)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-base font-medium border transition-colors",
                      form.preferredContact === method
                        ? "bg-primary text-white border-primary"
                        : "bg-card text-foreground border-border hover:bg-secondary",
                    )}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={loading} size="lg" className="w-full rounded-full h-11">
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Send Enquiry"}
            </Button>

            <a
              href={whatsappLink(`Hi! I'd like to enquire about ${product.name} (${product.weight}), ${qty || 1} pack(s).`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <WhatsAppIcon className="w-4 h-4" /> Or chat with us on WhatsApp
            </a>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
