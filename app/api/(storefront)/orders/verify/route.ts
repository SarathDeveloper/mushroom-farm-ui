import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api-utils";
import { ORDERS_ENABLED } from "@/lib/features";
import { notifyOrderConfirmation, parseShippingContact } from "@/lib/notifications";

const verifySchema = z.object({
  orderId: z.string().uuid(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(request: Request) {
  if (!ORDERS_ENABLED) return errorResponse("Not found.", 404);

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return errorResponse("Unauthorized", 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request body.", 400);
  }

  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input.", 400);
  }

  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    parsed.data;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order || order.userId !== session.user.id) {
    return errorResponse("Order not found.", 404);
  }

  if (order.paymentStatus === "COMPLETED") {
    return errorResponse("Already verified.", 400, { orderId: order.id });
  }

  if (order.status === "CANCELLED") {
    return errorResponse("This order was cancelled. Please contact us about your payment.", 409);
  }

  // The signature only proves this payment belongs to razorpay_order_id, so
  // that id must be the one created for this order — otherwise a payment for a
  // cheaper order could be replayed here.
  if (!order.razorpayOrderId || razorpay_order_id !== order.razorpayOrderId) {
    return errorResponse("Payment does not match this order.", 400);
  }

  // HMAC verification
  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const generated = createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const signatureOk =
    generated.length === razorpay_signature.length &&
    timingSafeEqual(Buffer.from(generated), Buffer.from(razorpay_signature));

  if (!signatureOk) {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "FAILED" },
    });
    return errorResponse("Payment verification failed.", 400);
  }

  // Verification passed — mark paid. Stock was already reserved when the order
  // was created. The status guard makes concurrent verify calls a no-op.
  const marked = await prisma.order.updateMany({
    where: { id: orderId, paymentStatus: { not: "COMPLETED" }, status: { not: "CANCELLED" } },
    data: {
      paymentStatus: "COMPLETED",
      paymentId: razorpay_payment_id,
      status: "PROCESSING",
    },
  });

  if (marked.count === 0) {
    return errorResponse("Already verified.", 400, { orderId: order.id });
  }

  const contact = parseShippingContact(order.shippingAddress);
  if (contact.phone) {
    await notifyOrderConfirmation({
      phone: contact.phone,
      fullName: contact.fullName,
      orderId: order.id,
      totalAmount: order.totalAmount,
    });
  }

  return NextResponse.json({ message: "Payment verified.", orderId: order.id });
}
