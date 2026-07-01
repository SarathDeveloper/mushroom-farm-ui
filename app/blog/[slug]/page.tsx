import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import type { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";
import { SafeImage } from "@/components/SafeImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { blogPosts, getBlogPostBySlug } from "@/lib/data";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.excerpt };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative h-[45vh] min-h-[320px]">
        <SafeImage src={post.image} alt={post.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-dark)]/90 via-[var(--color-primary-dark)]/45 to-[var(--color-primary-dark)]/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pb-10">
            <FadeIn direction="up">
              <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4">
                <ArrowLeft size={16} /> Back to Blog
              </Link>
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold font-heading text-white leading-tight">{post.title}</h1>
            </FadeIn>
          </div>
        </div>
      </div>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <FadeIn className="flex items-center gap-4 mb-10 pb-8 border-b border-border">
            <Avatar size="lg">
              <AvatarImage src={post.authorAvatar} alt={post.author} />
              <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{post.author}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(post.date)}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn className="prose prose-zinc max-w-none space-y-5">
            {post.content.map((paragraph, i) => (
              <p key={i} className="text-[var(--color-body)] leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}
          </FadeIn>

          {related.length > 0 && (
            <div className="mt-16 pt-10 border-t border-border">
              <h2 className="text-xl font-bold font-heading text-foreground mb-6">More Stories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/blog/${r.slug}`}
                    className="group flex gap-4 items-center rounded-2xl border border-border p-3 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-shadow"
                  >
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0">
                      <SafeImage src={r.image} alt={r.title} fill sizes="64px" className="object-cover" />
                    </div>
                    <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {r.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
