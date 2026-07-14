import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { razorpay, computeOrderTotals, VALID_COUPONS } from "@/lib/razorpay";

const cartLineSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().min(1),
});

const createOrderSchema = z.object({
  items: z.array(cartLineSchema).min(1, "Cart is empty"),
  fullName: z.string().min(1),
  phone: z.string().min(7),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(5),
  email: z.string().email(),
  couponCode: z.string().optional(),
  deliverySlot: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const { items, couponCode, deliverySlot, notes, ...addressFields } = parsed.data;

  // Validate coupon code if provided
  if (couponCode) {
    const normalized = couponCode.toUpperCase().trim();
    if (!VALID_COUPONS[normalized]) {
      return NextResponse.json({ message: "Invalid coupon code" }, { status: 400 });
    }
  }

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, price: true, stock: true, name: true },
  });

  if (products.length !== productIds.length) {
    return NextResponse.json(
      { message: "One or more products not found." },
      { status: 400 },
    );
  }

  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of items) {
    const product = productMap.get(item.productId)!;
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { message: `${product.name} only has ${product.stock} left in stock.` },
        { status: 400 },
      );
    }
  }

  const itemSubtotal = items.reduce((sum, item) => {
    const product = productMap.get(item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);

  const { shipping, discount, total } = computeOrderTotals(itemSubtotal, couponCode);

  const shippingAddress = JSON.stringify({
    ...addressFields,
    deliverySlot: deliverySlot ?? "evening",
    notes: notes ?? "",
  });

  try {
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount: total,
        shippingAddress,
        couponCode: couponCode?.toUpperCase().trim() ?? null,
        orderItems: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: productMap.get(item.productId)!.price,
          })),
        },
      },
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: order.id,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: Math.round(total * 100),
      currency: "INR",
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subtotal: itemSubtotal,
      shipping,
      discount,
      total,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { message: "Failed to create order. Please try again." },
      { status: 500 },
    );
  }
}
