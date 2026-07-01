import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { SafeImage } from "@/components/SafeImage";
import { blogPosts } from "@/lib/data";

export const metadata = {
  title: "Blog",
  description: "Farming tips, recipes, and stories from Vellimalai Mushroom Farm.",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Journal"
        title="Stories From The Farm"
        description="Farming insights, recipes, and health benefits — straight from Vellimalai."
        image="https://images.unsplash.com/photo-1497515114629-f71d768fd07c?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <FadeIn className="mb-16">
            <Link href={`/blog/${featured.slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-2xl overflow-hidden border border-border bg-card">
              <div className="relative h-64 lg:h-96">
                <SafeImage src={featured.image} alt={featured.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-8 lg:pr-12">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDate(featured.date)}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {featured.readTime}</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold font-heading text-foreground mb-3 group-hover:text-primary transition-colors">
                  {featured.title}
                </h2>
                <p className="text-[var(--color-body)] mb-6 line-clamp-3">{featured.excerpt}</p>
                <span className="inline-flex items-center gap-2 text-primary font-semibold">
                  Read Article <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((post, i) => (
              <FadeIn key={post.id} delay={i * 0.1}>
                <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full rounded-2xl overflow-hidden border border-border bg-card hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 ease-out">
                  <div className="relative h-48 overflow-hidden">
                    <SafeImage src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1.5"><Calendar size={12} /> {formatDate(post.date)}</span>
                      <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2 font-heading group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[var(--color-body)] line-clamp-2 mb-4">{post.excerpt}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      Read More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
