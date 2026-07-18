import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";

export const metadata = {
  title: "Shipping & Delivery Policy",
  description:
    "Shipping charges, delivery timelines, and delivery terms for Sri Amman Mushroom Farms.",
};

const sections = [
  {
    title: "1. Delivery Areas",
    body: "We currently deliver across select regions in Tamil Nadu. Availability of delivery to your pin code will be confirmed at checkout. We are continuously expanding our delivery network — if your area is not yet covered, please contact us and we will do our best to arrange delivery.",
  },
  {
    title: "2. Dispatch & Delivery Timeline",
    body: "Orders are dispatched within 24–48 hours of harvest to ensure maximum freshness. Local orders are typically delivered on the same day or next day. Delivery timelines for other areas may vary based on distance and logistics partner availability. All delivery dates shown at checkout are estimates, not guarantees.",
  },
  {
    title: "3. Shipping Charges",
    body: "We offer free shipping on all orders above ₹500. For orders below ₹500, a flat shipping fee of ₹49 is applicable. Shipping charges, if any, are clearly displayed at checkout before you confirm your order.",
  },
  {
    title: "4. Perishable Goods Handling",
    body: "Since fresh mushrooms are perishable, we pack all orders with care using food-safe packaging designed to maintain freshness during transit. We recommend that you inspect the delivery upon receipt and store the mushrooms in a cool, dry place or refrigerator immediately.",
  },
  {
    title: "5. Failed Delivery Attempts",
    body: "If a delivery attempt fails because no one is available to receive the order or the address provided is incorrect, our delivery partner will attempt redelivery once. If the second attempt also fails, the order may be returned to us. In such cases, perishable items cannot be reshipped and a refund will be processed as per our Refund & Cancellation Policy.",
  },
  {
    title: "6. Order Tracking",
    body: "Once your order is dispatched, you will receive a confirmation with tracking details via SMS or email. You can also track your order at any time by visiting the Track Order page on our website.",
  },
  {
    title: "7. Pre-Orders & Bulk Orders",
    body: "Pre-orders are harvested and dispatched on the scheduled date communicated at the time of booking. Bulk orders may require additional processing time — our team will confirm the delivery schedule when you place the order.",
  },
  {
    title: "8. Contact Us",
    body: "For any shipping or delivery-related queries, please contact us at hello@vellimalaifarms.in or call +91 93855 26105. Our team is available Monday–Saturday, 8:00 AM – 6:00 PM.",
  },
];

export default function ShippingPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Legal"
        title="Shipping & Delivery Policy"
        description="Last updated: July 1, 2026"
        image="/gallery/farm/oyster-mushroom-growing.png"
      />
      <section className="py-20 sm:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-10">
          {sections.map((section, i) => (
            <FadeIn key={section.title} delay={Math.min(i * 0.05, 0.3)}>
              <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground mb-3">
                {section.title}
              </h2>
              <p className="text-[var(--color-body)] text-sm sm:text-base leading-relaxed">
                {section.body}
              </p>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
