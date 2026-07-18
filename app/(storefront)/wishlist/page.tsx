import { PageHero } from "@/components/PageHero";
import { prisma } from "@/lib/prisma";
import { WishlistClient } from "./WishlistClient";
import type { Product } from "@/lib/data";

export default async function WishlistPage() {
  const dbProducts = await prisma.product.findMany({ include: { category: true } });
  type DbProduct = Omit<Product, "category" | "image" | "gallery"> & {
    images: string[];
    category: { name: string };
  };
  const products: Product[] = dbProducts.map((p: DbProduct) => ({
    ...p,
    category: p.category.name,
    image: p.images[0] || "",
    gallery: p.images,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Wishlist"
        title="Your Saved Favorites"
        image="https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-10 sm:py-14 bg-background">
        <WishlistClient products={products} />
      </section>
    </div>
  );
}
