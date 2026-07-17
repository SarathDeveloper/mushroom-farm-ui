import "dotenv/config";
import { prisma } from "../lib/prisma";

const IMAGE_UPDATES: Record<string, string[]> = {
  "organic-button-mushroom": [
    "/gallery/products/organic-button-mushroom.jpg",
    "/gallery/products/button-mushrooms-Dj92oXDo.jpg",
  ],
  "mushroom-masala-powder": ["/gallery/products/mushroom-masala-powder.jpg"],
  "mushroom-soup-mix": ["/gallery/products/creamy-mushroom-soup.jpg"],
  "mushroom-pickle": ["/gallery/products/mushroom-pickle.jpg"],
  "dried-shiitake": [
    "/gallery/products/dried-shiitake.jpg",
    "/gallery/products/shiitake-mushrooms-BMfvtmoS.jpg",
  ],
  "mixed-mushroom-combo": [
    "/gallery/products/mixed-mushrooms-CNX65Zqk.jpg",
    "/gallery/products/oyster-mushrooms-DUuUKbNY.jpg",
    "/gallery/products/button-mushrooms-Dj92oXDo.jpg",
  ],
  "king-oyster-mushroom": [
    "/gallery/products/oyster-mushrooms-DUuUKbNY.jpg",
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1000&auto=format&fit=crop",
  ],
  "milky-mushroom-family-pack": [
    "/gallery/products/mixed-mushrooms-CNX65Zqk.jpg",
    "https://images.unsplash.com/photo-1508216127116-43b98c56cc19?q=80&w=1000&auto=format&fit=crop",
  ],
  "fresh-milky-mushroom": [
    "/gallery/products/mixed-mushrooms-CNX65Zqk.jpg",
    "https://images.unsplash.com/photo-1508216127116-43b98c56cc19?q=80&w=1000&auto=format&fit=crop",
  ],
};

async function main() {
  for (const [slug, images] of Object.entries(IMAGE_UPDATES)) {
    const result = await prisma.product.updateMany({
      where: { slug },
      data: { images },
    });
    console.log(`${slug}: updated ${result.count}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
