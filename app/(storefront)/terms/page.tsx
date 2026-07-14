import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";

export const metadata = {
  title: "Terms of Service",
  description: "The terms and conditions governing your use of the Vellimalai Mushroom Farm website and services.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using the Vellimalai Mushroom Farm website, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our website.",
  },
  {
    title: "2. Orders & Payments",
    body: "All orders placed through our website are subject to product availability. We reserve the right to refuse or cancel any order for reasons including but not limited to product availability, errors in pricing, or suspected fraudulent activity. Prices are listed in Indian Rupees (₹) and are subject to change without notice.",
  },
  {
    title: "3. Delivery",
    body: "We aim to deliver fresh products as quickly as possible, typically within 24-48 hours of harvest for local orders. Delivery timelines may vary based on location and are estimates, not guarantees. Free shipping is applicable on orders above ₹500.",
  },
  {
    title: "4. Returns & Refunds",
    body: "Due to the perishable nature of our products, we accept returns only in cases of damaged, spoiled, or incorrect items received. Please contact us within 24 hours of delivery with photographic evidence to be eligible for a replacement or refund.",
  },
  {
    title: "5. Pre-Orders & Training Programs",
    body: "Pre-order requests and training program registrations submitted through our website are non-binding requests for information. Final pricing, availability, and terms will be confirmed directly with our team before any payment is collected.",
  },
  {
    title: "6. User Accounts",
    body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Please notify us immediately of any unauthorized use of your account.",
  },
  {
    title: "7. Intellectual Property",
    body: "All content on this website, including text, images, logos, and graphics, is the property of Vellimalai Mushroom Farm and is protected by applicable intellectual property laws. You may not reproduce or distribute this content without our written permission.",
  },
  {
    title: "8. Limitation of Liability",
    body: "Vellimalai Mushroom Farm shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products, to the fullest extent permitted by law.",
  },
  {
    title: "9. Governing Law",
    body: "These Terms of Service are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Tamil Nadu.",
  },
  {
    title: "10. Contact Us",
    body: "For any questions regarding these Terms of Service, please contact us at hello@vellimalaifarms.in or +91 98765 43210.",
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description="Last updated: June 1, 2026"
        image="https://images.unsplash.com/photo-1445282768818-728615cc910a?q=80&w=2000&auto=format&fit=crop"
      />
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-10">
          {sections.map((section, i) => (
            <FadeIn key={section.title} delay={Math.min(i * 0.05, 0.3)}>
              <h2 className="text-xl font-bold font-heading text-foreground mb-3">{section.title}</h2>
              <p className="text-[var(--color-body)] leading-relaxed">{section.body}</p>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
