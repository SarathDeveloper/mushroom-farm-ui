import { prisma } from '../lib/prisma';
import { products, categories, trainingPrograms } from '../lib/data';

async function main() {
  console.log('Seeding database from lib/data.ts...');

  // 1. Seed Categories
  console.log('Seeding categories...');
  const createdCategories = [];
  for (const catName of categories) {
    if (catName === 'All') continue;
    
    // We create a slug from the name
    const slug = catName.toLowerCase().replace(/\\s+/g, '-');
    
    const category = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: {
        name: catName,
        slug,
        description: `Fresh ${catName} mushrooms`,
      },
    });
    createdCategories.push(category);
  }

  // 2. Seed Products
  console.log('Seeding products...');
  for (const product of products) {
    // Find category ID
    const cat = createdCategories.find(c => c.name === product.category);
    if (!cat) continue;

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        weight: product.weight,
        stock: product.stock,
        images: product.gallery && product.gallery.length > 0 ? product.gallery : [product.image],
        isFeatured: product.tag === 'Bestseller' || product.tag === "Chef's Choice",
        tag: product.tag,
        rating: product.rating,
        reviewCount: product.reviewCount,
        highlights: product.highlights,
        categoryId: cat.id,
      },
    });
  }

  // 3. Seed Training Programs
  console.log('Seeding training programs...');
  for (const training of trainingPrograms) {
    await prisma.training.upsert({
      where: { slug: training.slug },
      update: {},
      create: {
        title: training.title,
        slug: training.slug,
        description: training.description,
        modules: training.modules,
        fees: training.fee,
        duration: training.duration,
        trainer: training.trainer,
        startDate: new Date(training.startDate),
        status: "UPCOMING",
        image: training.image,
        maxCapacity: training.seatsLeft + 10, // dummy capacity
      }
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
