import { Presentation } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { HeroSlidesTable } from "@/components/admin/HeroSlidesTable";

export const metadata = {
  title: "Hero Slides · Admin",
};

export default async function AdminHeroSlidesPage() {
  const slides = await prisma.heroSlide.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-foreground">
            Hero Slides
          </h1>
          <p className="text-[var(--color-body)] mt-1 text-xs sm:text-sm">
            {slides.length} {slides.length === 1 ? "slide" : "slides"} on your homepage hero.
          </p>
        </div>
      </header>

      {slides.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
            <Presentation size={30} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground mb-1">No hero slides yet</h2>
          <p className="text-[var(--color-body)] max-w-sm mb-6">
            Create slides to showcase on your homepage hero carousel.
          </p>
        </div>
      ) : (
        <HeroSlidesTable slides={slides} />
      )}
    </div>
  );
}
