import Link from "next/link";
import { ArrowRight, Droplets, HeartHandshake, Leaf, Newspaper, Users } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { SafeImage } from "@/components/SafeImage";
import { StatsCounter } from "@/components/StatsCounter";
import { Certifications } from "@/components/Certifications";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata = {
  title: "About Us",
  description: "Learn the story behind Sari Amman Oyster Mushroom Farm and our mission for sustainable, organic farming in the Kalvarayan Hills.",
};

const values = [
  { icon: Leaf, title: "Organic First", desc: "Every decision starts with the question: is this good for the soil, the mushroom, and the customer?" },
  { icon: Droplets, title: "Sustainable Farming", desc: "We recycle agricultural waste into growing substrate and manage water responsibly." },
  { icon: Users, title: "Community Empowerment", desc: "We train and employ local farmers, keeping economic value within the Kalvarayan Hills community." },
  { icon: HeartHandshake, title: "Radical Transparency", desc: "From farm practices to pricing, we believe our customers deserve to know exactly what they're getting." },
];

const team = [
  { name: "Murugan Selvam", role: "Founder & Head Farmer", avatar: "https://i.pravatar.cc/200?img=12" },
  { name: "Dr. Kavitha Raman", role: "Agricultural Scientist", avatar: "https://i.pravatar.cc/200?img=32" },
  { name: "Lakshmi Narayanan", role: "Operations & Training Lead", avatar: "https://i.pravatar.cc/200?img=47" },
];

const mediaArticles = [
  {
    src: "/gallery/media/daily-thanthi-article.png",
    paper: "Daily Thanthi",
    date: "March 2025",
    headline: "Young farmer from Kalvarayanmalai excelling in mushroom production",
  },
  {
    src: "/gallery/media/makkal-velicham-article.png",
    paper: "Makkal Velicham",
    date: "2024",
    headline: "District Collector inspects mushroom growing centre, urges farmers to utilise government schemes",
  },
  {
    src: "/gallery/media/dinamalar-article.png",
    paper: "Dinamalar",
    date: "August 2024",
    headline: "District Collector visits mushroom growing centre near Kalvarayanmalai",
  },
];

const recognitionPhotos = [
  {
    src: "/gallery/recognition/collector-farm-visit.png",
    title: "District Collector's Inspection",
    desc: "Kallakkurichi District Collector Mr. M.S. Prasanth, IAS inspecting our mushroom cultivation facility (14.08.2024).",
  },
  {
    src: "/gallery/recognition/government-award.png",
    title: "Government Recognition",
    desc: "Receiving recognition at a Special Development Programme under the Horticulture Department's tribal welfare initiative.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Our Story"
        title="Rooted in the Kalvarayan Hills"
        description="Nine years of sustainable mushroom farming, one harvest at a time."
        image="/gallery/farm/growing-shed-interior.png"
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <FadeIn direction="right">
              <div className="relative h-[420px] rounded-2xl overflow-hidden">
                <SafeImage
                  src="/gallery/farm/oyster-mushroom-growing.png"
                  alt="Fresh oyster mushrooms growing on substrate at our farm"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </FadeIn>
            <FadeIn direction="left" className="space-y-5">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">How it started</span>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground">
                A small experiment that grew into a movement
              </h2>
              <p className="text-[var(--color-body)] leading-relaxed">
                In 2017, our founder began cultivating oyster mushrooms in a single bamboo shed as a way to supplement his family&apos;s income. What started as a small side project quickly revealed something bigger: the Kalvarayan Hills&apos; cool, humid climate was perfect for mushroom cultivation.
              </p>
              <p className="text-[var(--color-body)] leading-relaxed">
                Today, Sari Amman Oyster Mushroom Farm spans several growing units, supplies restaurants and retailers across Tamil Nadu, and has trained hundreds of aspiring farmers through hands-on workshops — all while staying true to our founding promise: 100% organic, chemical-free cultivation.
              </p>
              <Button asChild size="lg" className="rounded-full px-8 mt-2">
                <Link href="/shop">Taste the Difference <ArrowRight className="ml-2" size={18} /></Link>
              </Button>
            </FadeIn>
          </div>

          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-foreground mb-4">What We Stand For</h2>
            <p className="text-[var(--color-body)] max-w-2xl mx-auto">
              Our values guide every decision, from how we grow to how we grow our community.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-24">
            {values.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.1} className="flex gap-5 p-6 rounded-2xl bg-secondary">
                <div className="w-14 h-14 rounded-xl bg-card text-primary flex items-center justify-center shrink-0">
                  <v.icon size={26} strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-1 font-heading">{v.title}</h3>
                  <p className="text-sm text-[var(--color-body)]">{v.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mb-24">
            <Certifications />
          </FadeIn>

          {/* Media Coverage */}
          <FadeIn className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Press</span>
            <h2 className="text-3xl font-bold font-heading text-foreground mt-2 mb-4">In the News</h2>
            <p className="text-[var(--color-body)] max-w-2xl mx-auto">
              Our farm has been featured in leading Tamil newspapers for our innovative mushroom cultivation practices.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {mediaArticles.map((article, i) => (
              <FadeIn key={article.paper} delay={i * 0.1}>
                <div className="rounded-2xl overflow-hidden bg-card border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-shadow duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <SafeImage
                      src={article.src}
                      alt={`${article.paper} newspaper article`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Newspaper size={16} className="text-primary" />
                      <span className="text-sm font-semibold text-primary">{article.paper}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{article.date}</span>
                    </div>
                    <p className="text-sm text-foreground font-medium leading-snug">{article.headline}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Government Recognition */}
          <FadeIn className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Trust</span>
            <h2 className="text-3xl font-bold font-heading text-foreground mt-2 mb-4">Recognition &amp; Support</h2>
            <p className="text-[var(--color-body)] max-w-2xl mx-auto">
              Endorsed by district administration and supported by the Tamil Nadu Horticulture Department.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {recognitionPhotos.map((photo, i) => (
              <FadeIn key={photo.title} delay={i * 0.1}>
                <div className="rounded-2xl overflow-hidden bg-card border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <SafeImage
                      src={photo.src}
                      alt={photo.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-foreground font-heading mb-1">{photo.title}</h3>
                    <p className="text-sm text-[var(--color-body)]">{photo.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-foreground mb-4">Meet the Team</h2>
            <p className="text-[var(--color-body)] max-w-2xl mx-auto">
              The people behind every harvest.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.1} className="text-center">
                <Avatar className="size-28 mx-auto mb-4">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-foreground font-heading">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--color-primary-dark)] relative overflow-hidden">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <StatsCounter />
        </div>
      </section>
    </div>
  );
}
