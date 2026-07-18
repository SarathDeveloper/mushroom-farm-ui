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
  description: "Know about Sri Amman Mushroom Farms. We grow natural mushrooms in Kalvarayan Hills and teach farmers how to grow.",
};

const values = [
  { icon: Leaf, title: "Natural First", desc: "We always ask: Is this good for the soil? Good for mushrooms? Good for our customers?" },
  { icon: Droplets, title: "Good for Earth", desc: "We use farm waste to grow mushrooms. We don't waste water. We care for our land." },
  { icon: Users, title: "Help Local People", desc: "We teach local farmers and give them jobs. Money stays in our Kalvarayan Hills area." },
  { icon: HeartHandshake, title: "We Are Honest", desc: "We tell you everything - how we farm, what we charge. No secrets." },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Our Story"
        title="From Kalvarayan Hills"
        description="We have been growing mushrooms for 9 years. Natural farming, fresh mushrooms."
        image="/gallery/farm/growing-shed-interior.png"
      />

      <section className="py-20 sm:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 sm:mb-24">
            <FadeIn direction="right">
              <div className="relative h-[280px] sm:h-[360px] lg:h-[420px] rounded-2xl overflow-hidden">
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
              <div className="flex items-center gap-3 mb-3">
                <span className="h-px w-8 bg-border" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">How We Started</span>
                <span className="h-px w-8 bg-border" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-foreground tracking-tight">
                Started small, grew big
              </h2>
              <p className="text-[var(--color-body)] leading-relaxed text-sm sm:text-base">
                In 2017, Mathesh started growing oyster mushrooms in one bamboo shed to earn extra money for his family. He found that the cool weather of Kalvarayan Hills was perfect for growing mushrooms.
              </p>
              <p className="text-[var(--color-body)] leading-relaxed text-sm sm:text-base">
                Today, Sri Amman Mushroom Farms has many growing sheds. We sell to restaurants and shops across Tamil Nadu. We have taught hundreds of farmers how to grow mushrooms. And we still keep our promise: No chemicals, only natural farming.
              </p>
              <Button asChild size="lg" className="rounded-full px-8 mt-2">
                <Link href="/shop">Try Our Mushrooms <ArrowRight className="ml-2" size={18} /></Link>
              </Button>
            </FadeIn>
          </div>

          {/* Founder Spotlight */}
          <div className="relative rounded-3xl bg-secondary overflow-hidden mb-16 sm:mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              <FadeIn direction="right" className="lg:col-span-2 relative min-h-[300px] sm:min-h-[400px] lg:min-h-[520px] overflow-hidden group/image">
                {/* Subtle warm organic ambient layer behind the image */}
                <div className="absolute inset-0 bg-[#1A4938]/5" />

                <SafeImage
                  src="/gallery/mathesh-owner.png"
                  alt="Mathesh — Owner & Head Farmer"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-top brightness-[0.97] contrast-[1.05] saturate-[1.03] transition-transform duration-700 group-hover/image:scale-[1.02]"
                />

                {/* Elegant warm rustic gradient vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#102B20]/80 via-transparent to-[#102B20]/20 pointer-events-none" />

                {/* Beautiful inset double framing border */}
                <div className="absolute inset-4 sm:inset-6 border border-white/20 pointer-events-none rounded-2xl transition-all duration-500 group-hover/image:inset-3 sm:group-hover/image:inset-5 group-hover/image:border-white/35" />
                <div className="absolute inset-5 sm:inset-7 border border-dashed border-white/10 pointer-events-none rounded-xl" />

                {/* Desktop floating stamp label */}
                <div className="hidden lg:flex absolute top-6 left-6 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-primary/20 shadow-md items-center gap-2 pointer-events-none">
                  <span className="flex h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-primary">
                    Head Farmer
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 lg:hidden">
                  <span className="text-white/80 text-sm font-medium uppercase tracking-wider">Owner</span>
                  <h3 className="text-2xl font-bold text-white font-heading">Mathesh</h3>
                </div>
              </FadeIn>
              <FadeIn direction="left" className="lg:col-span-3 p-5 sm:p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Award size={20} strokeWidth={1.75} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Meet Our Owner</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-foreground tracking-tight mb-2">
                  Mathesh
                </h2>
                <p className="text-sm text-muted-foreground font-medium mb-6">Owner &amp; Main Farmer</p>
                <p className="text-[var(--color-body)] leading-relaxed mb-4">
                  Mathesh grew up in Kalvarayan Hills of Tamil Nadu. He saw that farmers in his area had very few ways to earn money. In 2017, with just one bamboo shed, he started growing oyster mushrooms. The cool, misty weather of the hills was perfect for mushroom farming.
                </p>
                <p className="text-[var(--color-body)] leading-relaxed mb-6">
                  What started as a small project is now Sri Amman Mushroom Farms. We sell fresh and dry mushrooms to restaurants and shops across Tamil Nadu. More than that, Mathesh has taught hundreds of local farmers how to grow mushrooms and start their own business.
                </p>
                <div className="relative bg-card rounded-2xl p-6 border border-border">
                  <Quote size={32} className="text-primary/20 absolute top-4 left-4" />
                  <p className="text-foreground font-medium italic pl-8 leading-relaxed text-sm sm:text-base">
                    &ldquo;I did not start with a plan. I just believed our hills could help our people earn more. The mushrooms showed I was right.&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground mt-3 pl-8">— Mathesh</p>
                </div>
              </FadeIn>
            </div>
          </div>

          <FadeIn className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="h-px w-6 sm:w-8 bg-border" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Values</span>
              <span className="h-px w-6 sm:w-8 bg-border" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-foreground tracking-tight mb-4">What We Believe In</h2>
            <p className="text-[var(--color-body)] max-w-2xl mx-auto text-sm sm:text-base">
              These are the things we care about most. They guide everything we do.
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
