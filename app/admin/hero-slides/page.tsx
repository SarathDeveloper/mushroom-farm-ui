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
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
            Hero Slides
          </h1>
          <p className="text-[var(--color-body)] mt-1 text-sm sm:text-base">
            {slides.length} {slides.length === 1 ? "slide" : "slides"} on your homepage hero.
          </p>
        </div>
      </header>

      <HeroSlidesTable slides={slides} />
    </div>
  );
}
