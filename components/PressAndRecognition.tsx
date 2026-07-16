import { Newspaper } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { SafeImage } from "@/components/SafeImage";

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
  {
    src: "/gallery/recognition/community-meeting.png",
    title: "Community Engagement",
    desc: "Conducting outreach meetings with local farmers to share mushroom cultivation techniques and government support programmes.",
  },
  {
    src: "/gallery/recognition/officials-walking.png",
    title: "Official Farm Tour",
    desc: "Senior government officials touring the Vellimalai mushroom growing facility to evaluate sustainable farming practices.",
  },
];

export function PressAndRecognition({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? "py-24 sm:py-32 bg-background" : undefined}>
      <div className={compact ? "container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl" : undefined}>
        <FadeIn className="text-center mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Press</span>
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mt-2 mb-4">In the News</h2>
          <p className="text-[var(--color-body)] max-w-2xl mx-auto text-sm sm:text-base">
            Our farm has been featured in leading Tamil newspapers for our innovative mushroom cultivation practices.
          </p>
        </FadeIn>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${compact ? "mb-20" : "mb-24"}`}>
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

        <FadeIn className="text-center mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Trust</span>
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mt-2 mb-4">Recognition &amp; Support</h2>
          <p className="text-[var(--color-body)] max-w-2xl mx-auto text-sm sm:text-base">
            Endorsed by district administration and supported by the Tamil Nadu Horticulture Department.
          </p>
        </FadeIn>
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-8 ${compact ? "" : "mb-24"}`}>
          {recognitionPhotos.map((photo, i) => (
            <FadeIn key={photo.title} delay={i * 0.1}>
              <div className="rounded-2xl overflow-hidden bg-card border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-shadow duration-300">
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
