import "dotenv/config";
import { prisma } from "../lib/prisma";

const IMAGE_UPDATES: Record<string, string[]> = {
  "premium-oyster-mushroom": [
    "mushroom-farm/products/premium-oyster-mushroom-0",
    "mushroom-farm/products/premium-oyster-mushroom-1",
  ],
  "fresh-milky-mushroom": [
    "mushroom-farm/products/mixed-mushrooms-CNX65Zqk",
  ],
  "organic-button-mushroom": [
    "mushroom-farm/products/organic-button-mushroom",
    "mushroom-farm/products/button-mushrooms-Dj92oXDo",
  ],
  "shiitake-exotic": [
    "mushroom-farm/products/shiitake-exotic-1",
  ],
  "grey-oyster-mushroom": [
    "mushroom-farm/products/grey-oyster-mushroom-0",
    "mushroom-farm/products/grey-oyster-mushroom-1",
  ],
  "mushroom-pickle": ["mushroom-farm/products/mushroom-pickle"],
  "dried-shiitake": [
    "mushroom-farm/products/dried-shiitake",
    "mushroom-farm/products/shiitake-mushrooms-BMfvtmoS",
  ],
  "mixed-mushroom-combo": [
    "mushroom-farm/products/mixed-mushrooms-CNX65Zqk",
    "mushroom-farm/products/oyster-mushrooms-DUuUKbNY",
    "mushroom-farm/products/button-mushrooms-Dj92oXDo",
  ],
  "pink-oyster-mushroom": [
    "mushroom-farm/products/oyster-mushrooms-DUuUKbNY",
    "mushroom-farm/products/pink-oyster-mushroom-1",
  ],
  "king-oyster-mushroom": [
    "mushroom-farm/products/oyster-mushrooms-DUuUKbNY",
    "mushroom-farm/products/king-oyster-mushroom-1",
  ],
  "brown-button-mushroom": [
    "mushroom-farm/products/button-mushrooms-Dj92oXDo",
    "mushroom-farm/products/brown-button-mushroom-1",
  ],
  "jumbo-button-mushroom": [
    "mushroom-farm/products/button-mushrooms-Dj92oXDo",
  ],
  "milky-mushroom-family-pack": [
    "mushroom-farm/products/mixed-mushrooms-CNX65Zqk",
  ],
  "fresh-shiitake-caps": [
    "mushroom-farm/products/shiitake-mushrooms-BMfvtmoS",
  ],
  "mushroom-masala-powder": ["mushroom-farm/products/mushroom-masala-powder"],
  "mushroom-soup-mix": ["mushroom-farm/products/creamy-mushroom-soup"],
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
