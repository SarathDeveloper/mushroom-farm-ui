/**
 * Online ordering (cart, checkout, Razorpay, customer accounts) is off unless
 * NEXT_PUBLIC_ORDERS_ENABLED=true. While it's off the storefront is a catalogue
 * and every "buy" action becomes a product enquiry.
 *
 * NEXT_PUBLIC_* values are inlined at build time, so changing it needs a rebuild.
 */
export const ORDERS_ENABLED = process.env.NEXT_PUBLIC_ORDERS_ENABLED === "true";

export const WHATSAPP_NUMBER = "916380687811";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
