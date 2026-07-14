import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createHmac } from "crypto";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const verifySchema = z.object({
  orderId: z.string().uuid(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
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

  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    parsed.data;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { orderItems: true },
  });

  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  if (order.paymentStatus === "COMPLETED") {
    return NextResponse.json({ message: "Already verified.", orderId: order.id });
  }

  // HMAC verification
  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const generated = createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated !== razorpay_signature) {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "FAILED" },
    });
    return NextResponse.json(
      { message: "Payment verification failed." },
      { status: 400 },
    );
  }

  // Verification passed — mark paid and decrement stock
  const stockUpdates = order.orderItems.map((item) =>
    prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    }),
  );

  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "COMPLETED",
        paymentId: razorpay_payment_id,
        status: "PROCESSING",
      },
    }),
    ...stockUpdates,
  ]);

  return NextResponse.json({ message: "Payment verified.", orderId: order.id });
}
