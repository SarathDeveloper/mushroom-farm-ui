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
    <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 overflow-hidden border-b border-border/40" style={{ background: 'linear-gradient(180deg, #eaf5ed 0%, #f5faf6 50%, #ffffff 100%)' }}>
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15] font-heading mb-5">
            {title}
          </h1>
          {description && (
            <p className="text-[var(--color-body)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
