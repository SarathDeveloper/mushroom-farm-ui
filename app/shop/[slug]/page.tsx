import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Star, Truck, ShieldCheck, RotateCcw, Clock, Share2 } from "lucide-react";
import type { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductActions } from "@/components/ProductActions";
import { ProductCard } from "@/components/ProductCard";
import { PincodeChecker } from "@/components/PincodeChecker";
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
    other: {
      "product:price:amount": product.price.toString(),
      "product:price:currency": "INR",
    },
  };
}

const nutritionData: Record<string, { calories: number; protein: string; fiber: string; vitD: string; iron: string }> = {
  Oyster: { calories: 33, protein: "3.3g", fiber: "2.3g", vitD: "Low", iron: "1.3mg" },
  Milky: { calories: 35, protein: "3.1g", fiber: "1.8g", vitD: "High", iron: "1.7mg" },
  Button: { calories: 22, protein: "3.1g", fiber: "1.0g", vitD: "Medium", iron: "0.5mg" },
  Shiitake: { calories: 34, protein: "2.2g", fiber: "2.5g", vitD: "High", iron: "0.4mg" },
  "Value-Added": { calories: 45, protein: "2.8g", fiber: "1.5g", vitD: "Varies", iron: "0.8mg" },
};

const storageInstructions: Record<string, string> = {
  Oyster: "Store in a paper bag in the refrigerator. Best consumed within 3-4 days of delivery.",
  Milky: "Keep refrigerated in original packaging. Consume within 4-5 days for best freshness.",
  Button: "Store in a paper bag or open container in the fridge. Stays fresh for 5-7 days.",
  Shiitake: "Refrigerate in a paper bag. Fresh shiitake keeps well for 5-7 days.",
  "Value-Added": "Store in a cool, dry place away from sunlight. Check label for specific shelf life.",
};

export default async function ProductDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);
  const nutrition = nutritionData[product.category];
  const storage = storageInstructions[product.category];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-secondary py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center gap-2 text-sm text-[var(--color-body)]">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight size={14} />
          <Link href="/shop" className="hover:text-primary">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-foreground font-medium">{product.name}</span>
        </div>
      </div>

      {/* Product Detail */}
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
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= Math.round(product.rating) ? "fill-[#c4a96a] text-[#c4a96a]" : "fill-border text-border"}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount} reviews)</span>
              </div>

              {/* Freshness indicator */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-success)] animate-pulse" />
                  Harvested today at 5:30 AM
                </span>
                {product.stock <= 20 && (
                  <span className="text-xs font-semibold text-[var(--color-warning)]">
                    Only {product.stock} left!
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                {product.compareAtPrice && (
                  <span className="text-lg text-muted-foreground line-through">₹{product.compareAtPrice}</span>
                )}
                <span className="text-[var(--color-body)]">/ {product.weight}</span>
                {product.compareAtPrice && (
                  <span className="text-xs font-bold text-white bg-[var(--color-error)] px-2 py-0.5 rounded-full">
                    {Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              <p className="text-[var(--color-body)] leading-relaxed mb-6">{product.description}</p>

              <ul className="grid grid-cols-2 gap-3 mb-6">
                {product.highlights.map((h) => (
                  <li key={h} className="text-sm text-[var(--color-body)] flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" /> {h}
                  </li>
                ))}
              </ul>

              <ProductActions product={product} />

              {/* Pincode Checker */}
              <div className="mt-6">
                <PincodeChecker />
              </div>

              {/* Share */}
              <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
                <Share2 size={14} />
                <span>Share:</span>
                <a
                  href={`https://wa.me/?text=Check out ${product.name} from Vellimalai Farms!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary font-medium"
                >
                  WhatsApp
                </a>
                <span>·</span>
                <button className="hover:text-primary font-medium">Copy Link</button>
              </div>

              {/* Trust badges */}
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

      {/* Nutrition & Storage Tabs */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn>
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-bold text-foreground font-heading mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-primary" /> Nutrition Facts (per 100g)
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Calories", value: `${nutrition.calories} kcal` },
                    { label: "Protein", value: nutrition.protein },
                    { label: "Fiber", value: nutrition.fiber },
                    { label: "Vitamin D", value: nutrition.vitD },
                    { label: "Iron", value: nutrition.iron },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm text-[var(--color-body)]">{item.label}</span>
                      <span className="text-sm font-semibold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
                <Link href="/compare" className="text-xs text-primary font-semibold mt-4 inline-block hover:underline">
                  Compare all varieties →
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-bold text-foreground font-heading mb-4 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-primary" /> Storage Instructions
                </h3>
                <p className="text-sm text-[var(--color-body)] leading-relaxed mb-4">{storage}</p>
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                  <h4 className="text-xs font-bold text-primary mb-2">Pro Tips:</h4>
                  <ul className="space-y-1.5 text-xs text-[var(--color-body)]">
                    <li>• Never wash mushrooms before storing — moisture causes spoilage</li>
                    <li>• Use a paper bag, not plastic, to allow airflow</li>
                    <li>• Bring to room temperature before cooking for best texture</li>
                  </ul>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-16 bg-background">
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

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.gallery,
            brand: { "@type": "Brand", name: "Vellimalai Farms" },
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "INR",
              availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              seller: { "@type": "Organization", name: "Vellimalai Farms" },
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviewCount,
            },
          }),
        }}
      />
    </div>
  );
}
