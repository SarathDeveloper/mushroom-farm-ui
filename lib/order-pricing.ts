import { prisma } from "@/lib/prisma";
import { FREE_SHIPPING_MIN, SHIPPING_FEE, VALID_COUPONS } from "@/lib/razorpay";

export type DeliveryRule = { charge: number; minOrderValue: number | null };

export type CouponResult =
  | { ok: true; code: string; discount: number }
  | { ok: false; message: string };

/** Delivery zone for a pincode, falling back to the catch-all zone, then the flat default. */
export async function getDeliveryRule(pincode?: string | null): Promise<DeliveryRule> {
  let zone = null;

  if (pincode) {
    zone = await prisma.deliveryZone.findFirst({
      where: { isActive: true, pincodes: { has: pincode } },
    });
  }

  if (!zone) {
    zone = await prisma.deliveryZone.findFirst({
      where: { isActive: true, pincodes: { isEmpty: true } },
      orderBy: { createdAt: "desc" },
    });
  }

  if (zone) {
    return { charge: zone.charge, minOrderValue: zone.minOrderValue };
  }

  return { charge: SHIPPING_FEE, minOrderValue: FREE_SHIPPING_MIN };
}

export function shippingFor(itemSubtotal: number, rule: DeliveryRule): number {
  if (itemSubtotal === 0) return 0;
  if (rule.minOrderValue !== null && itemSubtotal >= rule.minOrderValue) return 0;
  return rule.charge;
}

/**
 * Validates a coupon against the admin-managed Coupon table. Codes that only
 * exist in the built-in VALID_COUPONS list still work until an admin creates a
 * Coupon row with the same code, after which that row's active/expiry rules win.
 */
export async function resolveCoupon(
  rawCode: string,
  itemSubtotal: number,
): Promise<CouponResult> {
  const code = rawCode.toUpperCase().trim();
  if (!code) return { ok: false, message: "Enter a coupon code." };

  const coupon = await prisma.coupon.findUnique({ where: { code } });

  if (coupon) {
    if (!coupon.isActive) {
      return { ok: false, message: "This coupon is no longer active." };
    }
    if (coupon.expiryDate.getTime() < Date.now()) {
      return { ok: false, message: "This coupon has expired." };
    }
    const minOrder = coupon.minOrderValue ?? 0;
    if (itemSubtotal < minOrder) {
      return { ok: false, message: `You need to spend ₹${minOrder} to use this coupon.` };
    }
    let discount = coupon.isPercentage
      ? Math.round((itemSubtotal * coupon.discountValue) / 100)
      : coupon.discountValue;
    if (coupon.maxDiscount != null) discount = Math.min(discount, coupon.maxDiscount);
    return { ok: true, code, discount: Math.min(discount, itemSubtotal) };
  }

  const builtIn = VALID_COUPONS[code];
  if (!builtIn) {
    return { ok: false, message: "Oops! That doesn't look like a valid coupon code." };
  }
  if (itemSubtotal < builtIn.minOrder) {
    return { ok: false, message: `You need to spend ₹${builtIn.minOrder} to use this coupon.` };
  }
  const discount = builtIn.isPercent
    ? Math.round((itemSubtotal * builtIn.discount) / 100)
    : builtIn.discount;
  return { ok: true, code, discount: Math.min(discount, itemSubtotal) };
}
