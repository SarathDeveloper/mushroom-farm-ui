"use client";

import { RefreshCw } from "lucide-react";
import Link from "next/link";

interface SubscriptionToggleProps {
  productName: string;
}

export function SubscriptionToggle({ productName }: SubscriptionToggleProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-primary/15 bg-primary/5 p-3">
      <RefreshCw size={18} className="mt-0.5 shrink-0 text-primary" />
      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-primary">Need this regularly?</p>
        <p className="text-xs leading-relaxed text-[var(--color-body)]">
          Add {productName} to your cart for a one-time order. Recurring delivery
          is currently arranged manually, so pricing and availability are confirmed
          before each dispatch.
        </p>
        <Link href="/contact" className="text-xs font-semibold text-primary hover:underline">
          Request a repeat delivery
        </Link>
      </div>
    </div>
  );
}
