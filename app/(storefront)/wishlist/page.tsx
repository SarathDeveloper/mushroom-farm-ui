import { PageHero } from "@/components/PageHero";
import { prisma } from "@/lib/prisma";
import { WishlistClient } from "./WishlistClient";

export default async function WishlistPage() {
  const dbProducts = await prisma.product.findMany({ include: { category: true } });
  
  const products = dbProducts.map((p) => ({
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

      <section className="py-16 bg-background">
        <WishlistClient products={products} />
      </section>
    </div>
  );
}
