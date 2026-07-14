import Razorpay from "razorpay";

const globalForRazorpay = globalThis as unknown as {
  razorpay: Razorpay | undefined;
};

export const razorpay =
  globalForRazorpay.razorpay ??
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

if (process.env.NODE_ENV !== "production") globalForRazorpay.razorpay = razorpay;

export const FREE_SHIPPING_MIN = 500;
export const SHIPPING_FEE = 49;

export const VALID_COUPONS: Record<
  string,
  { discount: number; isPercent: boolean; minOrder: number }
> = {
  FRESH10: { discount: 10, isPercent: true, minOrder: 200 },
  WELCOME50: { discount: 50, isPercent: false, minOrder: 300 },
  MUSHROOM15: { discount: 15, isPercent: true, minOrder: 500 },
};

export function computeOrderTotals(
  itemSubtotal: number,
  couponCode?: string | null,
) {
  const shipping =
    itemSubtotal >= FREE_SHIPPING_MIN || itemSubtotal === 0 ? 0 : SHIPPING_FEE;

  let discount = 0;
  if (couponCode) {
    const coupon = VALID_COUPONS[couponCode.toUpperCase().trim()];
    if (coupon && itemSubtotal >= coupon.minOrder) {
      discount = coupon.isPercent
        ? Math.round(itemSubtotal * coupon.discount / 100)
        : coupon.discount;
    }
  }

  const total = itemSubtotal + shipping - discount;
  return { shipping, discount, total };
}
