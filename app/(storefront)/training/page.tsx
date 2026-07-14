import { Award, GraduationCap, HandHeart, TrendingUp } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { TrainingCard } from "@/components/TrainingCard";
import { prisma } from "@/lib/prisma";

const highlights = [
  { icon: GraduationCap, title: "Expert Trainers", desc: "Learn from farmers and scientists with 10+ years of hands-on experience." },
  { icon: HandHeart, title: "Hands-On Learning", desc: "Practical, farm-based sessions — not just theory." },
  { icon: TrendingUp, title: "Business Guidance", desc: "Get support on sourcing, pricing, and selling your harvest." },
  { icon: Award, title: "Certification", desc: "Receive a certificate of completion recognized across Tamil Nadu." },
];

export const metadata = {
  title: "Mushroom Farming Training",
  description: "Hands-on mushroom cultivation training programs at Vellimalai Farms — from beginner crash courses to commercial-scale certification.",
};

export default async function TrainingPage() {
  const dbPrograms = await prisma.training.findMany({
    orderBy: { startDate: "asc" }
  });

  const trainingPrograms = dbPrograms.map((p) => ({
    ...p,
    fee: p.fees,
    seatsLeft: p.maxCapacity, // Using maxCapacity as seatsLeft for now
    level: p.title.toLowerCase().includes('crash') ? "Beginner" : p.title.toLowerCase().includes('commercial') ? "Intermediate" : "Advanced",
    image: p.image || "",
    startDate: p.startDate.toISOString(),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Learn"
        title="Mushroom Farming Training"
        description="Master the art and business of mushroom cultivation with our hands-on workshops."
        image="https://images.unsplash.com/photo-1574316071802-0d684efa7ea5?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <FadeIn className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {highlights.map((h) => (
              <div key={h.title} className="text-center p-6 rounded-2xl bg-secondary">
                <div className="w-14 h-14 rounded-xl bg-card text-primary flex items-center justify-center mx-auto mb-4">
                  <h.icon size={26} strokeWidth={1.75} />
                </div>
                <h3 className="font-bold text-foreground mb-1">{h.title}</h3>
                <p className="text-sm text-[var(--color-body)]">{h.desc}</p>
              </div>
            ))}
          </FadeIn>

          <FadeIn>
            <h2 className="text-3xl font-bold font-heading text-foreground mb-2 text-center">Upcoming Programs</h2>
            <p className="text-[var(--color-body)] text-center max-w-xl mx-auto mb-12">
              Choose a program that matches your goals — from a weekend hobby to a full commercial venture.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainingPrograms.map((program, i) => (
              <FadeIn key={program.id} delay={i * 0.1}>
                {/* @ts-ignore */}
                <TrainingCard program={program} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
