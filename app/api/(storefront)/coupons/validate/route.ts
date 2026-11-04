import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { resolveCoupon } from "@/lib/order-pricing";
import { errorResponse } from "@/lib/api-utils";
import { withRateLimit, apiLimits } from "@/lib/rate-limit";

const schema = z.object({
  code: z.string().min(1).max(40),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.coerce.number().int().min(1),
      }),
    )
    .min(1, "Cart is empty"),
});

export async function POST(request: Request) {
  return withRateLimit(
    request,
    async () => {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return errorResponse("Invalid request body.", 400);
      }

      const parsed = schema.safeParse(body);
      if (!parsed.success) {
        return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input.", 400);
      }

      const { code, items } = parsed.data;
      const products = await prisma.product.findMany({
        where: { id: { in: items.map((i) => i.productId) }, isActive: true },
        select: { id: true, price: true },
      });
      const priceById = new Map(products.map((p) => [p.id, p.price]));
      const subtotal = items.reduce(
        (sum, i) => sum + (priceById.get(i.productId) ?? 0) * i.quantity,
        0,
      );

      const result = await resolveCoupon(code, subtotal);
      if (!result.ok) {
        return errorResponse(result.message, 400);
      }
      return NextResponse.json({ code: result.code, discount: result.discount });
    },
    { limit: apiLimits.auth, identifier: "coupon" },
  );
}
