import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();

  if (!id) {
    return NextResponse.json({ message: "Order ID is required." }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      paymentStatus: true,
      totalAmount: true,
      createdAt: true,
      shippingAddress: true,
      orderItems: {
        select: {
          quantity: true,
          price: true,
          product: { select: { name: true, images: true } },
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  let city = "";
  try {
    const addr = JSON.parse(order.shippingAddress);
    city = addr.city ?? "";
  } catch { /* non-JSON address */ }

  return NextResponse.json({
    id: order.id,
    status: order.status,
    paymentStatus: order.paymentStatus,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
    city,
    items: order.orderItems.map((oi) => ({
      name: oi.product.name,
      quantity: oi.quantity,
      price: oi.price,
      image: oi.product.images[0] ?? null,
    })),
  });
}
