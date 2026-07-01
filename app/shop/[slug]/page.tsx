import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Star, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import type { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductActions } from "@/components/ProductActions";
import { ProductCard } from "@/components/ProductCard";
import { getProductBySlug, getRelatedProducts, products } from "@/lib/data";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-secondary py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center gap-2 text-sm text-[var(--color-body)]">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight size={14} />
          <Link href="/shop" className="hover:text-primary">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-foreground font-medium">{product.name}</span>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <FadeIn direction="right">
              <ProductGallery images={product.gallery} name={product.name} />
            </FadeIn>

            <FadeIn direction="left" className="flex flex-col">
              {product.tag && (
                <span className="inline-block w-fit px-3 py-1 rounded-full bg-accent text-white text-xs font-bold uppercase tracking-wide mb-4">
                  {product.tag}
                </span>
              )}
              <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                {product.category} Mushroom
              </span>
              <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "fill-border text-border"}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount} reviews)</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                {product.compareAtPrice && (
                  <span className="text-lg text-muted-foreground line-through">₹{product.compareAtPrice}</span>
                )}
                <span className="text-[var(--color-body)]">/ {product.weight}</span>
              </div>

              <p className="text-[var(--color-body)] leading-relaxed mb-6">{product.description}</p>

              <ul className="grid grid-cols-2 gap-3 mb-8">
                {product.highlights.map((h) => (
                  <li key={h} className="text-sm text-[var(--color-body)] flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" /> {h}
                  </li>
                ))}
              </ul>

              <ProductActions product={product} />

              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck size={22} className="text-primary" />
                  <span className="text-xs text-muted-foreground">Free delivery over ₹500</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <ShieldCheck size={22} className="text-primary" />
                  <span className="text-xs text-muted-foreground">100% organic certified</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw size={22} className="text-primary" />
                  <span className="text-xs text-muted-foreground">Easy replacement</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <FadeIn>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10 font-heading">You Might Also Like</h2>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((p, i) => (
                <FadeIn key={p.id} delay={i * 0.08}>
                  <ProductCard product={p} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
