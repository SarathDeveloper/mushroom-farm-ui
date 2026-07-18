import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Star, Truck, ShieldCheck, RotateCcw, Clock, Share2, Timer } from "lucide-react";
import type { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductActions } from "@/components/ProductActions";
import { ProductCard } from "@/components/ProductCard";
import { PincodeChecker } from "@/components/PincodeChecker";
import { ProductShare } from "@/components/ProductShare";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/lib/data";

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { slug: true } });
  return products.map((p: { slug: string }) => ({ slug: p.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await prisma.product.findUnique({ where: { slug } });
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

const recipesByCategory: Record<string, { title: string; time: string; description: string }[]> = {
  Oyster: [
    { title: "Pepper Garlic Oyster Mushrooms", time: "20 min", description: "Toss with garlic, black pepper, curry leaves, and a little oil for a quick side dish." },
    { title: "Oyster Mushroom Stir-Fry", time: "15 min", description: "Cook with onions, capsicum, and soy or spices until lightly crisp at the edges." },
  ],
  Milky: [
    { title: "Milky Mushroom Biryani", time: "40 min", description: "Slice the firm mushrooms into a fragrant rice biryani with whole spices and herbs." },
    { title: "Mushroom Pepper Curry", time: "30 min", description: "Simmer with onion, tomato, and freshly ground pepper for a hearty curry." },
  ],
  Button: [
    { title: "Everyday Mushroom Masala", time: "25 min", description: "Sauté with onion, tomato, turmeric, and garam masala for an easy weeknight dish." },
    { title: "Creamy Mushroom Toast", time: "15 min", description: "Cook sliced mushrooms with garlic and herbs, then serve over toasted bread." },
  ],
  Shiitake: [
    { title: "Shiitake Noodle Bowl", time: "25 min", description: "Add sautéed shiitake to noodles with greens, ginger, and a light soy dressing." },
    { title: "Crispy Shiitake Roast", time: "25 min", description: "Roast with oil and seasoning until the edges are crisp and deeply savoury." },
  ],
  "Value-Added": [
    { title: "Quick Mushroom Soup", time: "15 min", description: "Prepare a warming soup using the mix according to the pack instructions." },
    { title: "Mushroom Masala Marinade", time: "10 min", description: "Use mushroom masala powder with yogurt or oil as a flavourful marinade." },
  ],
};

type DbProduct = Omit<Product, "category" | "image" | "gallery"> & {
  images: string[];
  category: { name: string };
  categoryId: string;
  harvestDate: Date | null;
  bestBefore: Date | null;
};

function mapProduct(p: DbProduct): Product {
  return {
    ...p,
    category: p.category.name,
    image: p.images[0] || "",
    gallery: p.images,
  };
}

export default async function ProductDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  
  const p = await prisma.product.findUnique({ 
    where: { slug },
    include: {
      category: true,
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { user: { select: { name: true } } },
      },
    },
  });
  
  if (!p) notFound();
  
  const product = mapProduct(p);

  const rawRelated = await prisma.product.findMany({
    where: { 
      categoryId: p.categoryId,
      id: { not: p.id }
    },
    include: { category: true },
    take: 3,
  });
  
  const related: Product[] = rawRelated.map((p: DbProduct) => mapProduct(p));
  const nutrition = nutritionData[product.category] || nutritionData["Value-Added"];
  const storage = storageInstructions[product.category] || storageInstructions["Value-Added"];
  const recipes = recipesByCategory[product.category] || recipesByCategory["Value-Added"];
  const reviews = p.reviews;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-secondary py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center gap-2 text-base text-muted-foreground min-w-0">
          <Link href="/" className="hover:text-primary shrink-0">Home</Link>
          <ChevronRight size={14} className="shrink-0" />
          <Link href="/shop" className="hover:text-primary shrink-0">Shop</Link>
          <ChevronRight size={14} className="shrink-0" />
          <span className="text-foreground font-medium truncate min-w-0">{product.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <FadeIn direction="right">
              <ProductGallery images={product.gallery} name={product.name} />
            </FadeIn>

            <FadeIn direction="left" className="flex flex-col">
              {product.tag && (
                <span className="inline-block w-fit px-3 py-1 rounded-full bg-accent text-white text-sm font-bold uppercase tracking-wide mb-4">
                  {product.tag}
                </span>
              )}
              <span className="text-base font-semibold text-primary uppercase tracking-wider mb-2">
                {product.category} Mushroom
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-foreground mb-3">
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
                <span className="text-base text-muted-foreground">{product.rating} ({product.reviewCount} reviews)</span>
              </div>

              {/* Stock badge */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={
                    product.stock <= 0
                      ? "inline-flex px-2.5 py-1 rounded-full bg-[hsl(var(--destructive))] text-white text-sm font-semibold"
                      : product.stock <= 20
                        ? "inline-flex px-2.5 py-1 rounded-full bg-[hsl(var(--warning))] text-white text-sm font-semibold"
                        : "inline-flex px-2.5 py-1 rounded-full bg-[hsl(var(--primary-600))] text-white text-sm font-semibold"
                  }
                >
                  {product.stock <= 0
                    ? "Out of Stock"
                    : product.stock <= 20
                      ? "Low Stock"
                      : "In Stock"}
                </span>
                {product.stock > 0 && product.stock <= 20 && (
                  <span className="text-sm font-semibold text-[hsl(var(--warning))]">
                    Only {product.stock} left!
                  </span>
                )}
              </div>

              {product.shelfLifeDays != null && product.shelfLifeDays > 0 && (
                <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 w-fit">
                  <Timer size={16} className="text-amber-600 shrink-0" />
                  <span className="text-sm font-semibold text-amber-700">
                    Best consumed within {product.shelfLifeDays} day{product.shelfLifeDays > 1 ? "s" : ""} of delivery
                  </span>
                </div>
              )}

              <div className="flex items-baseline gap-2 mb-6 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.compareAtPrice && (
                  <span className="text-base sm:text-lg text-muted-foreground line-through">
                    ₹{product.compareAtPrice.toLocaleString("en-IN")}
                  </span>
                )}
                <span className="text-muted-foreground">per {product.weight}</span>
                {product.compareAtPrice && (
                  <span className="text-sm font-bold text-white bg-[var(--color-error)] px-2 py-0.5 rounded-full">
                    {Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base text-foreground leading-relaxed mb-6">{product.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {product.highlights.map((h: string) => (
                  <span
                    key={h}
                    className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary border border-primary/10"
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* @ts-ignore */}
              <ProductActions product={product} />

              {/* Pincode Checker */}
              <div className="mt-6">
                <PincodeChecker />
              </div>

              {/* Share */}
              <div className="mt-4 flex items-center gap-3 text-base text-muted-foreground">
                <Share2 size={14} />
                <span>Share:</span>
                <a
                  href={`https://wa.me/?text=Check out ${product.name} from Sri Amman Mushroom Farms!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-whatsapp hover:text-whatsapp-hover font-medium"
                >
                  <WhatsAppIcon className="size-3.5" />
                  WhatsApp
                </a>
                <span>·</span>
                <ProductShare productName={product.name} />
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck size={22} className="text-primary" />
                  <span className="text-sm text-muted-foreground">Free delivery over ₹500</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <ShieldCheck size={22} className="text-primary" />
                  <span className="text-sm text-muted-foreground">FSSAI registered business</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw size={22} className="text-primary" />
                  <span className="text-sm text-muted-foreground">Easy replacement</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Product information */}
      <section className="py-10 sm:py-14 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn>
              <div className="bg-card rounded-2xl border border-border p-6 h-full">
                <h3 className="text-lg sm:text-xl font-bold text-foreground font-heading mb-4">
                  Freshness Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                    <span className="text-muted-foreground">Harvested</span>
                    <span className="font-semibold text-right">
                      {p.harvestDate
                        ? new Date(p.harvestDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : "Fresh farm harvest"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                    <span className="text-muted-foreground">Best before</span>
                    <span className="font-semibold text-right">
                      {p.bestBefore
                        ? new Date(p.bestBefore).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : "See pack label"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Pack size</span>
                    <span className="font-semibold">{product.weight}</span>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-lg sm:text-xl font-bold text-foreground font-heading mb-4 flex items-center gap-2">
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
                      <span className="text-sm text-foreground">{item.label}</span>
                      <span className="text-sm font-semibold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
                <Link href="/compare" className="text-sm text-primary font-semibold mt-4 inline-block hover:underline">
                  Compare all varieties →
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-lg sm:text-xl font-bold text-foreground font-heading mb-4 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-primary" /> Storage Instructions
                </h3>
                <p className="text-sm text-foreground leading-relaxed mb-4">{storage}</p>
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                  <h4 className="text-sm font-bold text-primary mb-2">Pro Tips:</h4>
                  <ul className="space-y-1.5 text-sm text-foreground">
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

      {/* Customer reviews */}
      <section className="py-10 sm:py-14 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-px w-6 sm:w-8 bg-border" />
                  <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Customer feedback</span>
                  <span className="h-px w-6 sm:w-8 bg-border" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading tracking-tight">Reviews for {product.name}</h2>
              </div>
              <div className="flex items-center gap-2 text-base text-muted-foreground">
                <Star size={16} className="fill-[#c4a96a] text-[#c4a96a]" />
                <span className="font-semibold text-foreground">{product.rating.toFixed(1)}</span>
                <span>from {product.reviewCount} reviews</span>
              </div>
            </div>
          </FadeIn>
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reviews.map((review) => (
                <FadeIn key={review.id}>
                  <article className="h-full rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center gap-1 mb-3" aria-label={`${review.rating} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={star <= review.rating ? "fill-[#c4a96a] text-[#c4a96a]" : "fill-border text-border"}
                        />
                      ))}
                    </div>
                    <p className="text-base leading-relaxed text-[var(--color-body)]">
                      {review.comment || "A customer left a rating for this product."}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-muted-foreground">
                      {review.user.name || "Verified customer"}
                    </p>
                  </article>
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-secondary/50 p-8 text-center text-base text-muted-foreground">
              Customer reviews for this product will appear here after they are approved.
            </div>
          )}
        </div>
      </section>

      {/* Recipe ideas */}
      <section className="py-10 sm:py-14 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <FadeIn>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px w-6 sm:w-8 bg-border" />
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Cook something good</span>
              <span className="h-px w-6 sm:w-8 bg-border" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading tracking-tight mb-8">
              Recipe ideas for {product.name}
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipes.map((recipe) => (
              <FadeIn key={recipe.title}>
                <article className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-foreground font-heading">{recipe.title}</h3>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary">
                      {recipe.time}
                    </span>
                  </div>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">{recipe.description}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-10 sm:py-14 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <FadeIn>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="h-px w-6 sm:w-8 bg-border" />
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">More Options</span>
                <span className="h-px w-6 sm:w-8 bg-border" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-10 font-heading tracking-tight text-center">You Might Also Like</h2>
            </FadeIn>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {related.map((p, i) => (
                <FadeIn key={p.id} delay={i * 0.08}>
                  {/* @ts-ignore */}
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
