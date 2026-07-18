import { Newspaper } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { SafeImage } from "@/components/SafeImage";

const mediaArticles = [
  {
    src: "/gallery/media/daily-thanthi-article.png",
    paper: "Daily Thanthi",
    date: "March 2025",
    headline: "Young farmer from Kalvarayanmalai doing great in mushroom farming",
  },
  {
    src: "/gallery/media/makkal-velicham-article.png",
    paper: "Makkal Velicham",
    date: "2024",
    headline: "District Collector sees our mushroom farm, tells farmers to use government help",
  },
  {
    src: "/gallery/media/dinamalar-article.png",
    paper: "Dinamalar",
    date: "August 2024",
    headline: "District Collector visits mushroom farm near Kalvarayanmalai",
  },
];

const recognitionPhotos = [
  {
    src: "/gallery/recognition/collector-farm-visit.png",
    title: "Collector Visited Our Farm",
    desc: "Kallakkurichi District Collector Mr. M.S. Prasanth, IAS came to see our mushroom farm (14.08.2024).",
  },
  {
    src: "/gallery/recognition/government-award.png",
    title: "Government Award",
    desc: "We got an award from the Horticulture Department for helping tribal farmers.",
  },
  {
    src: "/gallery/recognition/community-meeting.png",
    title: "Teaching Local Farmers",
    desc: "We meet local farmers and teach them how to grow mushrooms and get government help.",
  },
  {
    src: "/gallery/recognition/officials-walking.png",
    title: "Officials Visited Us",
    desc: "Government officers came to see our farm and learn about our natural farming ways.",
  },
];

export function PressAndRecognition({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? "py-24 sm:py-32 bg-background grain-overlay" : undefined}>
      <div className={compact ? "container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl" : undefined}>
        <FadeIn className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-6 sm:w-8 bg-border" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">News</span>
            <span className="h-px w-6 sm:w-8 bg-border" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight font-heading mb-3">We Are in the News</h2>
          <p className="text-[var(--color-body)] max-w-2xl mx-auto text-sm sm:text-base">
            Tamil newspapers wrote about our farm and our mushroom growing work.
          </p>
        </FadeIn>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${compact ? "mb-20" : "mb-24"}`}>
          {mediaArticles.map((article, i) => (
            <FadeIn key={article.paper} delay={i * 0.1}>
              <div className="rounded-2xl overflow-hidden bg-card border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
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

        <FadeIn className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-6 sm:w-8 bg-border" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Trust</span>
            <span className="h-px w-6 sm:w-8 bg-border" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight font-heading mb-3">Recognition &amp; Support</h2>
          <p className="text-[var(--color-body)] max-w-2xl mx-auto text-sm sm:text-base">
            The District office and Tamil Nadu Horticulture Department support our farm.
          </p>
        </FadeIn>
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-8 ${compact ? "" : "mb-24"}`}>
          {recognitionPhotos.map((photo, i) => (
            <FadeIn key={photo.title} delay={i * 0.1}>
              <div className="rounded-2xl overflow-hidden bg-card border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <SafeImage
                    src={photo.src}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-base text-foreground font-heading mb-1">{photo.title}</h3>
                  <p className="text-sm text-[var(--color-body)]">{photo.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
