require('dotenv').config();
import { prisma } from '../lib/prisma';

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  console.log('Seeding realistic analytics data...');

  // Ensure a user exists
  let user = await prisma.user.findFirst({ where: { email: 'admin@mushroomfarms.com' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@mushroomfarms.com',
        role: 'ADMIN',
        isActive: true,
      },
    });
  }

  // Ensure products exist
  let products = await prisma.product.findMany();
  if (products.length === 0) {
    console.error('No products found. Run `npx prisma db seed` first to seed products.');
    process.exit(1);
  }

  // Clear existing dummy orders if needed, or just append
  // await prisma.order.deleteMany({ where: { userId: user.id } });

  const numOrders = 120; // 120 orders over 30 days = ~4 orders/day
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const now = new Date();

  console.log(`Generating ${numOrders} orders over the last 30 days...`);

  for (let i = 0; i < numOrders; i++) {
    const createdAt = randomDate(thirtyDaysAgo, now);
    
    // Pick 1 to 3 random products
    const numItems = Math.floor(Math.random() * 3) + 1;
    const orderItemsData = [];
    let totalAmount = 0;

    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1; // 1 to 3 qty
      const price = product.price;

      orderItemsData.push({
        productId: product.id,
        quantity,
        price,
        createdAt,
      });

      totalAmount += price * quantity;
    }

    // Add shipping cost occasionally
    if (totalAmount < 500) {
      totalAmount += 50;
    }

    // Random status
    const statuses = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED', 'PENDING', 'FAILED', 'REFUNDED'];
    const paymentStatus = statuses[Math.floor(Math.random() * statuses.length)] as any;

    const orderStatuses = ['DELIVERED', 'DELIVERED', 'SHIPPED', 'PROCESSING', 'PENDING'];
    const orderStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)] as any;

    await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount,
        status: orderStatus,
        paymentStatus,
        shippingAddress: JSON.stringify({
          name: "Test Customer",
          street: "123 Mushroom St",
          city: "Chennai",
          state: "Tamil Nadu",
          pincode: "600001"
        }),
        createdAt,
        updatedAt: createdAt,
        orderItems: {
          create: orderItemsData,
        },
      },
    });
  }

  console.log('Successfully seeded analytics data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
