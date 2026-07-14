import { Check, Sparkles, Star, Truck } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import Link from "next/link";

const WHATSAPP_NUMBER = "919876543210";
const WHATSAPP_MESSAGE =
  "Hi! I'd like to start my mushroom farming journey with Vellimalai Farms.";

const benefits = [
  "Join India's largest mushroom farming community",
  "Access expert training and certification programs",
  "Connect with buyers, suppliers, and partners",
  "Get smart IoT monitoring for your farm",
  "Unlock multiple revenue streams",
];

const trustItems = [
  {
    label: "ISO Certified Quality",
    iconBg: "bg-[#2D6A4F]",
    icon: <Check size={14} strokeWidth={2.5} className="text-white" />,
  },
  {
    label: "5000+ Happy Customers",
    iconBg: "bg-[#C0702F]",
    icon: <Star size={14} strokeWidth={2.5} className="text-white fill-white" />,
  },
  {
    label: "Pan-India Delivery",
    iconBg: "bg-[#B85C38]",
    icon: <Truck size={14} strokeWidth={2.5} className="text-white" />,
  },
  {
    label: "24/7 Support",
    iconBg: "bg-[#3A5A8C]",
    icon: (
      <span className="text-[10px] font-bold text-white leading-none">24</span>
    ),
  },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.85 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function LoyaltySection() {
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <section className="relative overflow-hidden bg-[#1B4332]">
      {/* Plus-grid atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.5 8h1v12h-1V8zm-5.5 5.5h12v1H8v-1z' fill='%23ffffff' fill-opacity='0.9'/%3E%3C/svg%3E\")",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(45,106,79,0.45)_0%,_transparent_65%)]" />

      <div className="container relative z-10 mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <FadeIn className="text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#95D5B2]/35 bg-white/5 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            <Sparkles size={14} className="text-[#E9A86B]" fill="#E9A86B" />
            Trusted by 1000+ Growers
          </span>

          <h2 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-[2.75rem]">
            Start your mushroom farming
            <br className="hidden sm:block" /> journey today
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-[17px]">
            Join thousands of successful mushroom growers who are learning,
            producing, and profiting through our comprehensive platform.
          </p>
        </FadeIn>

        <FadeIn delay={0.12} className="mt-10 flex justify-center">
          <ul className="space-y-3.5 text-left">
            {benefits.map((item) => (
              <li key={item} className="flex items-start gap-3 text-white/95">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C0702F] shadow-sm shadow-black/20">
                  <Check size={14} strokeWidth={3} className="text-white" />
                </span>
                <span className="text-[15px] leading-snug sm:text-base">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn
          delay={0.22}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#C0702F] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:bg-[#A85F28] hover:scale-[1.02] sm:w-auto"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Chat on WhatsApp
          </a>
          <Link
            href="/training"
            className="inline-flex w-full items-center justify-center rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-[#1B4332] shadow-lg shadow-black/10 transition-all duration-300 hover:bg-[#F4F0E6] hover:scale-[1.02] sm:w-auto"
          >
            Start Growing
          </Link>
        </FadeIn>
      </div>

      <FadeIn delay={0.3} direction="none" fullWidth>
        <div className="relative z-10 border-t border-white/10 bg-[#143225]/80">
          <div className="container mx-auto grid max-w-5xl grid-cols-2 gap-y-5 gap-x-4 px-4 py-5 sm:grid-cols-4 sm:px-6 lg:px-8 lg:py-6">
            {trustItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-center gap-2.5 sm:justify-start"
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${item.iconBg}`}
                >
                  {item.icon}
                </span>
                <span className="text-xs font-medium text-white sm:text-sm">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
