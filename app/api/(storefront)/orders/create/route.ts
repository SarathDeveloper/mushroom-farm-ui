import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyPhoneVerificationToken } from "@/lib/otp";
import { INDIAN_MOBILE_REGEX } from "@/lib/phone";
import { getRazorpay, computeOrderTotals, VALID_COUPONS } from "@/lib/razorpay";
import { errorResponse } from "@/lib/api-utils";
import { notifyOrderConfirmation } from "@/lib/notifications";

const cartLineSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().min(1),
});

const createOrderSchema = z.object({
  items: z.array(cartLineSchema).min(1, "Cart is empty"),
  fullName: z.string().min(1),
  phone: z.string().regex(INDIAN_MOBILE_REGEX, "Enter a valid 10-digit mobile starting with 6, 7, 8, or 9."),
  phoneVerifiedToken: z.string().min(1, "Please verify your mobile number with OTP."),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().length(6),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(["cod", "online"]).default("online"),
});

export async function POST(request: Request) {
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

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input.", 400);
  }
  const { items, couponCode, paymentMethod, phoneVerifiedToken, ...addressFields } =
    parsed.data;

  if (!verifyPhoneVerificationToken(phoneVerifiedToken, addressFields.phone)) {
    return errorResponse("Please verify your mobile number with OTP before placing the order.", 400);
  }

  // Validate coupon code if provided
  if (couponCode) {
    const normalized = couponCode.toUpperCase().trim();
    if (!VALID_COUPONS[normalized]) {
      return errorResponse("Invalid coupon code", 400);
    }
  }

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, price: true, stock: true, name: true },
  });

  if (products.length !== productIds.length) {
    return errorResponse("One or more products not found.", 400);
  }

  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of items) {
    const product = productMap.get(item.productId)!;
    if (product.stock < item.quantity) {
      return errorResponse(`${product.name} only has ${product.stock} left in stock.`, 400);
    }
  }

  const itemSubtotal = items.reduce((sum, item) => {
    const product = productMap.get(item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);

  const { shipping, discount, total } = computeOrderTotals(itemSubtotal, couponCode);

  const shippingAddress = JSON.stringify({
    ...addressFields,
    email: session.user.email ?? "",
    paymentMethod,
  });

  try {
    const isCod = paymentMethod === "cod";

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount: total,
        shippingAddress,
        couponCode: couponCode?.toUpperCase().trim() ?? null,
        status: isCod ? "PROCESSING" : "PENDING",
        paymentStatus: "PENDING",
        paymentId: isCod ? "COD" : null,
        orderItems: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: productMap.get(item.productId)!.price,
          })),
        },
      },
    });

    if (isCod) {
      if (addressFields.phone) {
        await notifyOrderConfirmation({
          phone: addressFields.phone,
          fullName: addressFields.fullName,
          orderId: order.id,
          totalAmount: total,
        });
      }

      return NextResponse.json({
        orderId: order.id,
        paymentMethod: "cod",
        subtotal: itemSubtotal,
        shipping,
        discount,
        total,
      });
    }

    const razorpayOrder = await getRazorpay().orders.create({
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
      paymentMethod: "online",
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
    return errorResponse("Failed to create order. Please try again.", 500);
  }
}
