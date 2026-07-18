"use client";

import { PageHero } from "@/components/PageHero";
import { PreOrderSection } from "@/components/PreOrderSection";

export default function PreOrderPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Book Early"
        title="Pre-Order Mushrooms"
        description="Get farm-fresh mushrooms for an upcoming harvest. Tell us what you need and when — we'll confirm availability."
        image="https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=2000&auto=format&fit=crop"
      />

      <PreOrderSection />
    </div>
  );
}
