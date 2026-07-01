import { SafeImage } from "@/components/SafeImage";
import { FadeIn } from "@/components/FadeIn";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
}) {
  return (
    <section className="relative h-[45vh] min-h-[320px] flex items-center bg-[var(--color-primary-dark)] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <SafeImage
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-dark)]/90 via-[var(--color-primary-dark)]/55 to-[var(--color-primary-dark)]/30" />
      </div>
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
        <FadeIn direction="up">
          {eyebrow && (
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-4">
              {eyebrow}
            </span>
          )}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight font-heading">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-white/80 text-lg max-w-2xl mx-auto">{description}</p>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
