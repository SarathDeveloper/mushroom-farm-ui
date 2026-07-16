import Link from "next/link";
import { ArrowRight, Award, Droplets, HeartHandshake, Leaf, Quote, Users } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { SafeImage } from "@/components/SafeImage";
import { Certifications } from "@/components/Certifications";
import { PressAndRecognition } from "@/components/PressAndRecognition";
import { Button } from "@/components/ui/button";

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

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Our Story"
        title="Rooted in the Kalvarayan Hills"
        description="Nine years of sustainable mushroom farming, one harvest at a time."
        image="/gallery/farm/growing-shed-interior.png"
      />

      <section className="py-20 sm:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 sm:mb-24">
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
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
                A small experiment that grew into a movement
              </h2>
              <p className="text-[var(--color-body)] leading-relaxed text-sm sm:text-base">
                In 2017, our founder began cultivating oyster mushrooms in a single bamboo shed as a way to supplement his family&apos;s income. What started as a small side project quickly revealed something bigger: the Kalvarayan Hills&apos; cool, humid climate was perfect for mushroom cultivation.
              </p>
              <p className="text-[var(--color-body)] leading-relaxed text-sm sm:text-base">
                Today, Sari Amman Oyster Mushroom Farm spans several growing units, supplies restaurants and retailers across Tamil Nadu, and has trained hundreds of aspiring farmers through hands-on workshops — all while staying true to our founding promise: 100% organic, chemical-free cultivation.
              </p>
              <Button asChild size="lg" className="rounded-full px-8 mt-2">
                <Link href="/shop">Taste the Difference <ArrowRight className="ml-2" size={18} /></Link>
              </Button>
            </FadeIn>
          </div>

          {/* Founder Spotlight */}
          <div className="relative rounded-3xl bg-secondary overflow-hidden mb-16 sm:mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              <FadeIn direction="right" className="lg:col-span-2 relative min-h-[400px] lg:min-h-[520px]">
                <SafeImage
                  src="/gallery/mathesh-owner.png"
                  alt="Mathesh — Owner & Head Farmer"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-top"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 lg:hidden">
                  <span className="text-white/80 text-sm font-medium uppercase tracking-wider">Owner</span>
                  <h3 className="text-2xl font-bold text-white font-heading">Mathesh</h3>
                </div>
              </FadeIn>
              <FadeIn direction="left" className="lg:col-span-3 p-5 sm:p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Award size={20} strokeWidth={1.75} />
                  </div>
                  <span className="text-sm font-semibold text-primary uppercase tracking-wider">Meet Our Owner</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-2">
                  Mathesh
                </h2>
                <p className="text-sm text-muted-foreground font-medium mb-6">Owner &amp; Head Farmer</p>
                <p className="text-[var(--color-body)] leading-relaxed mb-4">
                  Growing up in the Kalvarayan Hills of Tamil Nadu, Mathesh witnessed firsthand how tribal farming communities struggled with limited income options. In 2017, with little more than determination and a single bamboo shed, he began experimenting with oyster mushroom cultivation — a crop uniquely suited to the region&apos;s cool, misty climate.
                </p>
                <p className="text-[var(--color-body)] leading-relaxed mb-6">
                  What started as a modest side project has since grown into Sari Amman Oyster Mushroom Farm, a thriving enterprise that supplies fresh and dried mushrooms to restaurants and retailers across Tamil Nadu. More importantly, Mathesh has trained hundreds of local farmers, empowering them to build their own mushroom-growing businesses and create sustainable livelihoods in the hills.
                </p>
                <div className="relative bg-card rounded-2xl p-6 border border-border">
                  <Quote size={32} className="text-primary/20 absolute top-4 left-4" />
                  <p className="text-foreground font-medium italic pl-8 leading-relaxed text-sm sm:text-base">
                    &ldquo;I didn&apos;t start with a business plan — I started with a belief that the hills could give our people more. The mushrooms proved me right.&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground mt-3 pl-8">— Mathesh</p>
                </div>
              </FadeIn>
            </div>
          </div>

          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-4">What We Stand For</h2>
            <p className="text-[var(--color-body)] max-w-2xl mx-auto text-sm sm:text-base">
              Our values guide every decision, from how we grow to how we grow our community.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 mb-16 sm:mb-24">
            {values.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.1} className="flex gap-5 p-6 rounded-2xl bg-secondary">
                <div className="w-14 h-14 rounded-xl bg-card text-primary flex items-center justify-center shrink-0">
                  <v.icon size={26} strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground mb-1 font-heading">{v.title}</h3>
                  <p className="text-sm text-[var(--color-body)]">{v.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mb-24">
            <Certifications />
          </FadeIn>

          <PressAndRecognition />

        </div>
      </section>
    </div>
  );
}
