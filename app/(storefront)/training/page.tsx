import {
  IndianRupee,
  Landmark,
  Phone,
  Users,
  Award,
  Ruler,
  Timer,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { SafeImage } from "@/components/SafeImage";
import { ContactForm } from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { TrainingJourneySection } from "@/components/TrainingJourneySection";
import { TrainingOrderFlowSection } from "@/components/TrainingOrderFlowSection";

const subsidySteps = [
  "Complete training and get your certificate",
  "Mathesh helps prepare your project report",
  "Apply at District Horticulture Office",
  "Apply for available schemes; eligibility and amounts vary by applicant and scheme",
  "Start farming with a plan that fits your approved budget",
];

const stats = [
  { icon: IndianRupee, value: "₹12K–50K", label: "Monthly Income" },
  { icon: Ruler, value: "120 sq.ft", label: "Minimum Space" },
  { icon: Timer, value: "13–17 days", label: "First Harvest" },
  { icon: TrendingUp, value: "40%", label: "Govt. Subsidy" },
  { icon: Users, value: "100+", label: "Farmers in Network" },
];

export const metadata = {
  title: "Mushroom Farming Support — From Setup to Earning",
  description:
    "We don't just teach mushroom farming. Mathesh helps you with setup, bags, customer orders, and understanding available government schemes.",
};

export default async function TrainingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── SECTION 1: HERO ─── */}
      <PageHero
        eyebrow="Your Mushroom Business"
        title="We Don't Just Teach. We Build Your Business."
        description="From setup to selling — Mathesh helps you every step. Join 100+ farmers earning from mushroom farming in Kalvarayan Hills."
      />

      {/* ─── SECTION 2: JOURNEY TIMELINE ─── */}
      <TrainingJourneySection />

      {/* ─── SECTION 3: WHO HELPS YOU ─── */}
      <section className="py-20 sm:py-28 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <FadeIn className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="hidden sm:block h-px w-8 bg-border" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Your Team</span>
              <span className="hidden sm:block h-px w-8 bg-border" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight font-heading mb-3 sm:mb-4">
              Who Helps You Succeed
            </h2>
            <p className="text-[var(--color-body)] max-w-xl mx-auto text-sm sm:text-base">
              You are not alone. These people support you at every stage.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <FadeIn delay={0}>
              <div className="bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 ease-out">
                <div className="relative h-48 overflow-hidden">
                  <SafeImage
                    src="/gallery/mathesh-owner.png"
                    alt="Mathesh — Owner & Head Farmer"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-base sm:text-lg text-foreground font-heading mb-1">Mathesh</h3>
                  <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-3">Owner & Head Farmer</p>
                  <ul className="text-sm text-[var(--color-body)] space-y-2 flex-1">
                    <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" /> Helps with setup & registration</li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" /> Gives you spawn bags & materials</li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" /> Routes customer orders to you</li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" /> Ongoing technical guidance</li>
                  </ul>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 ease-out">
                <div className="relative h-48 overflow-hidden bg-primary/5 flex items-center justify-center">
                  <Landmark size={56} strokeWidth={1} className="text-primary/30" />
                </div>
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-base sm:text-lg text-foreground font-heading mb-1">District Horticulture Office</h3>
                  <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-3">Government Support</p>
                  <ul className="text-sm text-[var(--color-body)] space-y-2 flex-1">
                    <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" /> Guidance for checking current subsidy schemes</li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" /> Help understanding project-size requirements</li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" /> Bank loan guidance & schemes</li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" /> FSSAI & registration help</li>
                  </ul>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 ease-out">
                <div className="relative h-48 overflow-hidden bg-primary/5 flex items-center justify-center">
                  <Users size={56} strokeWidth={1} className="text-primary/30" />
                </div>
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-base sm:text-lg text-foreground font-heading mb-1">Farmer Network</h3>
                  <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-3">Peer Community</p>
                  <ul className="text-sm text-[var(--color-body)] space-y-2 flex-1">
                    <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" /> WhatsApp group for instant help</li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" /> Share tips & solve problems together</li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" /> Buy materials in bulk (save money)</li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" /> Learn from experienced farmers</li>
                  </ul>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: BUYBACK / ORDER FLOW ─── */}
      <TrainingOrderFlowSection />

      {/* ─── SECTION 5: GOVERNMENT SUBSIDY ─── */}
      <section className="py-20 sm:py-28 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <FadeIn direction="right">
              <div className="space-y-5">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  <Award size={14} className="mr-1.5" /> Support with government scheme applications
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight font-heading">
                  Explore Government Subsidy Options
                </h2>
                <p className="text-[var(--color-body)] text-sm sm:text-base leading-relaxed">
                  Government schemes and subsidy amounts can change and depend on eligibility, location, project size, and approval. We help you understand the application process and prepare the required documents.
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="left">
              <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
                <h3 className="font-bold text-foreground font-heading text-base sm:text-lg mb-5">
                  How to Get Subsidy
                </h3>
                <ol className="space-y-4">
                  {subsidySteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-[var(--color-body)] leading-relaxed pt-1">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: TRUST NUMBERS ─── */}
      <section className="py-16 sm:py-20 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                    <s.icon size={24} strokeWidth={1.75} />
                  </div>
                  <p className="text-xl sm:text-2xl font-extrabold font-heading">{s.value}</p>
                  <p className="text-xs sm:text-sm text-white/70 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── SECTION 7: CONTACT / REGISTER CTA ─── */}
      <section className="py-20 sm:py-28 bg-background grain-overlay">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <FadeIn direction="right">
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="hidden sm:block h-px w-8 bg-border" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Get Started</span>
                  <span className="hidden sm:block h-px w-8 bg-border" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight font-heading">
                  Ready to Start? Talk to Mathesh.
                </h2>
                <p className="text-[var(--color-body)] text-sm sm:text-base leading-relaxed">
                  Whether you want to learn mushroom farming, need bags and materials, or want to join our farmer network — reach out. We will guide you through every step.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button asChild size="lg" className="rounded-full px-6 bg-whatsapp hover:bg-whatsapp-hover text-white">
                    <a
                      href="https://wa.me/916380687811?text=Hi%2C%20I%20am%20interested%20in%20mushroom%20farming%20training"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <WhatsAppIcon className="size-[18px] mr-2" />
                      WhatsApp Mathesh
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-full px-6">
                    <a href="tel:+919385526105">
                      <Phone size={18} className="mr-2" />
                      Call: +91 93855 26105
                    </a>
                  </Button>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left">
              <ContactForm showCompany showEmail showMessage />
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
