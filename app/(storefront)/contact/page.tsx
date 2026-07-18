"use client";

import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";

const PHONE = "+91 93855 26105";
const ADDITIONAL_PHONES = ["+91 89031 56142", "+91 63833 61207"];
const EMAIL = "hello@vellimalaifarms.in";
const WHATSAPP_NUMBER = "916380687811";
const ADDRESS_LINE = "Sari Amman Oyster Mushroom Farm, Vellimalai, Melsathanur, Kallakurichi - 606 209, Tamil Nadu, India";
const LAT = 11.786746298281923;
const LNG = 78.71029442669108;
const MAPS_EMBED_URL = `https://www.google.com/maps?q=${LAT},${LNG}&z=14&output=embed`;
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${LAT},${LNG}`;

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHero
        eyebrow="Talk to Us"
        title="Contact Us"
        description="Want to buy mushrooms? Want to learn farming? Want to visit our farm? Call us, WhatsApp us, or send a message. We will help you."
      />

      {/* ───── Two-column body ───── */}
      <section className="pb-20 sm:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">

            {/* ── Left column ── */}
            <FadeIn direction="right" className="space-y-6">
              {/* Reach us directly */}
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <h2 className="text-lg font-bold font-heading text-foreground mb-1">
                  Call or Message Us
                </h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Want to talk now? Pick how you want to reach us.
                </p>

                <div className="flex flex-wrap gap-3">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 text-sm font-semibold text-white hover:bg-whatsapp-hover transition-colors"
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
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors break-all"
                  >
                    <Mail size={15} className="shrink-0" />
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

              {/* Visit us */}
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-bold font-heading text-foreground">
                    Come Visit Us
                  </h2>
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
              <ContactForm showCompany showEmail showMessage />
            </FadeIn>

          </div>
        </div>
      </section>
    </div>
  );
}
