import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { FadeIn } from "@/components/FadeIn";
import { ShopControls } from "@/components/ShopControls";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/data";

type DbProduct = Omit<Product, "category" | "image" | "gallery"> & {
  images: string[];
  category: { name: string };
};

function mapProduct(p: DbProduct): Product {
  return {
    ...p,
    category: p.category.name,
    image: p.images[0] || "",
    gallery: p.images,
  };
}

function getOrderBy(
  sort: string | undefined
): Record<string, "asc" | "desc"> {
  switch (sort) {
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    case "newest":
      return { createdAt: "desc" };
    case "name-asc":
      return { name: "asc" };
    default:
      return { createdAt: "desc" };
  }
}

type ProductWhere = {
  isActive: boolean;
  category?: { slug: string };
  OR?: Array<{
    name?: { contains: string; mode: "insensitive" };
    description?: { contains: string; mode: "insensitive" };
  }>;
};
type ShopCategory = { id: string; name: string; slug: string };

export default async function ShopPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const activeCategorySlug = searchParams?.category as string | undefined;
  const sort = searchParams?.sort as string | undefined;
  const query = searchParams?.q as string | undefined;

  const categories: ShopCategory[] = await prisma.category.findMany();

  const where: ProductWhere = {
    isActive: true,
  };

  if (activeCategorySlug && activeCategorySlug !== "all") {
    where.category = { slug: activeCategorySlug };
  }

  if (query && query.length >= 2) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  const prismaProducts = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: getOrderBy(sort),
  });

  const products: Product[] = prismaProducts.map((product: DbProduct) =>
    mapProduct(product)
  );

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Shop"
        title="Fresh From Our Farm"
        description="Hand-picked, organically grown mushrooms delivered straight to your doorstep."
        image="https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <FadeIn className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Link
              href="/shop"
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-semibold transition-colors border",
                !activeCategorySlug || activeCategorySlug === "all"
                  ? "bg-primary text-white border-primary"
                  : "bg-secondary text-secondary-foreground border-border hover:border-primary hover:text-primary"
              )}
            >
              All
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-semibold transition-colors border",
                  activeCategorySlug === category.slug
                    ? "bg-primary text-white border-primary"
                    : "bg-secondary text-secondary-foreground border-border hover:border-primary hover:text-primary"
                )}
              >
                {category.name}
              </Link>
            ))}
          </FadeIn>

          <Suspense>
            <ShopControls />
          </Suspense>

          <FadeIn className="mb-8 text-center text-sm text-muted-foreground">
            Showing {products.length} product{products.length !== 1 && "s"}
            {query && (
              <span>
                {" "}
                for &ldquo;{query}&rdquo;
              </span>
            )}
          </FadeIn>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {products.map((product, i) => (
                <FadeIn key={product.id} delay={(i % 3) * 0.08}>
                  {/* @ts-ignore */}
                  <ProductCard product={product} priority={i < 3} />
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              {query
                ? `No products found for "${query}".`
                : "No products found in this category."}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
