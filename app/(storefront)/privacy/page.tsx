import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";

export const metadata = {
  title: "Privacy Policy",
  description: "How Sri Amman Mushroom Farms collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "1. Information We Collect",
    body: "We collect information you provide directly to us, such as your name, email address, phone number, shipping address, and payment details when you create an account, place an order, or submit an enquiry form. We also automatically collect certain information about your device and usage of our website.",
  },
  {
    title: "2. How We Use Your Information",
    body: "We use the information we collect to process orders, communicate with you about your orders and enquiries, improve our website and services, send you marketing communications (with your consent), and comply with legal obligations.",
  },
  {
    title: "3. Sharing of Information",
    body: "We do not sell your personal information. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you (such as payment processors and delivery partners), as long as they agree to keep this information confidential.",
  },
  {
    title: "4. Data Security",
    body: "We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Passwords are encrypted, and payment information is processed through secure, PCI-compliant gateways.",
  },
  {
    title: "5. Your Rights",
    body: "You may access, update, or request deletion of your personal information at any time by contacting us at hello@vellimalaifarms.in. You may also opt out of marketing communications at any time using the unsubscribe link in our emails.",
  },
  {
    title: "6. Cookies",
    body: "We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.",
  },
  {
    title: "7. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page with an updated revision date.",
  },
  {
    title: "8. Contact Us",
    body: "If you have any questions about this Privacy Policy, please contact us at hello@vellimalaifarms.in or +91 93855 26105.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last updated: June 1, 2026"
        image="/gallery/farm/oyster-mushroom-growing.png"
      />
      <section className="py-10 sm:py-14 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-10">
          {sections.map((section, i) => (
            <FadeIn key={section.title} delay={Math.min(i * 0.05, 0.3)}>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground mb-3">{section.title}</h2>
              <p className="text-[var(--color-body)] text-base sm:text-lg leading-relaxed">{section.body}</p>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
