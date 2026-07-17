import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/training", label: "Training" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const productLinks = [
  { href: "/shop", label: "Fresh Mushrooms" },
  { href: "/pre-order", label: "Pre-Order" },
  { href: "/compare", label: "Compare Varieties" },
  { href: "/training", label: "Farm Training" },
];

const contactItems = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@vellimalaifarms.in",
    href: "mailto:hello@vellimalaifarms.in",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Vellimalai, Kalvarayan Hills, Tamil Nadu, India",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Monday–Saturday: 8:00 – 18:00\nSunday: Closed",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white pt-16 sm:pt-20 pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Brand */}
          <div className="space-y-5 max-w-sm">
            <Link href="/" className="inline-flex flex-col gap-3">
              <div className="relative h-20 w-20 overflow-hidden rounded-full ring-1 ring-white/20">
                <Image
                  src="/gallery/brand-logo.png"
                  alt="Sri Amman Mushroom Farms"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <span className="text-lg font-heading font-semibold tracking-[0.08em] uppercase text-white">
                Sri Amman Mushroom Farms
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/75">
              Premium, organic mushrooms grown in the pristine Kalvarayan Hills,
              Vellimalai. Farm-fresh harvests, pre-orders, and expert farming
              training.
            </p>
            <p className="text-xs text-white/45">
              Grown with care — Trusted for quality and freshness
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
            >
              Contact Us
            </Link>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-5 text-xs font-semibold tracking-[0.18em] uppercase text-white/45">
              Navigation
            </h3>
            <ul className="space-y-3.5">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/90 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="mb-5 text-xs font-semibold tracking-[0.18em] uppercase text-white/45">
              Products
            </h3>
            <ul className="space-y-3.5">
              {productLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/90 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h3 className="mb-5 text-xs font-semibold tracking-[0.18em] uppercase text-white/45">
              Get in Touch
            </h3>
            <ul className="space-y-5">
              {contactItems.map((item) => {
                const Icon = item.icon;
                const value = (
                  <span className="whitespace-pre-line text-sm leading-relaxed text-white/90">
                    {item.value}
                  </span>
                );
                return (
                  <li key={item.label} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70">
                      <Icon size={15} strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <p className="mb-0.5 text-[10px] font-semibold tracking-[0.16em] uppercase text-white/40">
                        {item.label}
                      </p>
                      {"href" in item && item.href ? (
                        <a
                          href={item.href}
                          className="transition-colors hover:text-white"
                        >
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:bg-[#25D366] hover:border-transparent hover:text-white"
                aria-label="WhatsApp"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/vellimalaifarms"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:bg-[#E4405F] hover:border-transparent hover:text-white"
                aria-label="Instagram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@vellimalaifarms"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:bg-[#FF0000] hover:border-transparent hover:text-white"
                aria-label="YouTube"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/45 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Sri Amman Mushroom Farms. All rights
            reserved. FSSAI Lic: 12421033000123
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/track-order" className="hover:text-white transition-colors">
              Track Order
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
