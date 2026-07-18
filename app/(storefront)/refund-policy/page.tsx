import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";

export const metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "Refund, return, and order cancellation policy for Sri Amman Mushroom Farms.",
};

const sections = [
  {
    title: "1. Order Cancellation",
    body: "You may cancel an order before it has been dispatched by contacting us at hello@vellimalaifarms.in or +91 93855 26105. Once an order has been dispatched, it cannot be cancelled. For pre-orders, cancellation is allowed up to 24 hours before the scheduled harvest date.",
  },
  {
    title: "2. Return Eligibility",
    body: "Due to the perishable nature of fresh mushrooms, we accept returns only in cases of damaged, spoiled, or incorrect items received. You must contact us within 24 hours of delivery with photographic evidence of the issue to be eligible for a return. Items that have been consumed, stored improperly, or reported after 24 hours are not eligible.",
  },
  {
    title: "3. Replacement or Refund",
    body: "Upon verification of your claim, we will offer either a full replacement delivered at the earliest available slot or a complete refund — whichever you prefer. Partial refunds may be issued for partially affected orders at our discretion.",
  },
  {
    title: "4. Refund Method & Timeline",
    body: "Approved refunds are processed through the original payment method (Razorpay). The refund amount will be credited to your bank account or card within 5–7 business days after approval. For Cash on Delivery orders, refunds are processed via bank transfer — we will collect your account details at the time of approval.",
  },
  {
    title: "5. Non-Refundable Items",
    body: "Custom or bulk orders placed on special request are non-refundable once confirmed. Training program fees are non-refundable if cancellation is made less than 48 hours before the scheduled session. Shipping charges are non-refundable unless the return is due to our error.",
  },
  {
    title: "6. Pre-Orders",
    body: "Pre-order payments serve as a confirmation of your reservation. Cancellations made more than 24 hours before the scheduled harvest date are eligible for a full refund. Cancellations within 24 hours of harvest are not eligible for a refund as the produce is already allocated.",
  },
  {
    title: "7. How to Request a Refund",
    body: "To initiate a return or refund, email us at hello@vellimalaifarms.in or call +91 93855 26105 with your order number and photographs of the issue. Our team will review your request and respond within 24 hours.",
  },
  {
    title: "8. Contact Us",
    body: "For any questions regarding this Refund & Cancellation Policy, please reach out to us at hello@vellimalaifarms.in or call +91 93855 26105. Our team is available Monday–Saturday, 8:00 AM – 6:00 PM.",
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Legal"
        title="Refund & Cancellation Policy"
        description="Last updated: July 1, 2026"
        image="/gallery/farm/oyster-mushroom-growing.png"
      />
      <section className="py-10 sm:py-14 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-10">
          {sections.map((section, i) => (
            <FadeIn key={section.title} delay={Math.min(i * 0.05, 0.3)}>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground mb-3">
                {section.title}
              </h2>
              <p className="text-[var(--color-body)] text-base sm:text-lg leading-relaxed">
                {section.body}
              </p>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
