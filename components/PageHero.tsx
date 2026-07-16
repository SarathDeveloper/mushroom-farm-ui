import { FadeIn } from "@/components/FadeIn";

export function PageHero({
  eyebrow,
  title,
  description,
  image: _image,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
}) {
  return (
    <section className="relative pt-20 pb-10 sm:pt-28 sm:pb-14 md:pt-36 md:pb-20 overflow-hidden border-b border-border/40 grain-overlay" style={{ background: 'linear-gradient(180deg, #eaf5ed 0%, #f5faf6 50%, #ffffff 100%)' }}>
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-primary/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-primary/8 blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        <FadeIn direction="up">
          {eyebrow && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider mb-5">
              {eyebrow}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15] font-heading mb-4 sm:mb-5">
            {title}
          </h1>
          {description && (
            <p className="text-[var(--color-body)] text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
