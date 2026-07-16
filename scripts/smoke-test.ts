import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function runSmokeTest() {
  console.log("Starting smoke test...");
  
  try {
    // 1. Category
    console.log("Testing Category...");
    const category = await prisma.category.create({
      data: { name: "Test Category", slug: "test-category" }
    });
    console.log("Created category:", category.id);

    // 2. Product
    console.log("Testing Product...");
    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        slug: "test-product",
        description: "Test desc",
        price: 100,
        categoryId: category.id
      }
    });
    console.log("Created product:", product.id);

    // 3. User & Order
    console.log("Testing User and Order...");
    const user = await prisma.user.create({
      data: { email: "test@example.com", name: "Test User" }
    });
    
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: 100,
        shippingAddress: "{}"
      }
    });
    console.log("Created user & order:", order.id);

    // 4. Clean up
    console.log("Cleaning up test data...");
    await prisma.order.delete({ where: { id: order.id } });
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.product.delete({ where: { id: product.id } });
    await prisma.category.delete({ where: { id: category.id } });
    
    console.log("Smoke test completed successfully!");
  } catch (error) {
    console.error("Smoke test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

runSmokeTest();
