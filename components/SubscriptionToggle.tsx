"use client";

import { useState } from "react";
import { RefreshCw, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const frequencies = [
  { id: "weekly", label: "Weekly", discount: 15 },
  { id: "biweekly", label: "Every 2 Weeks", discount: 10 },
  { id: "monthly", label: "Monthly", discount: 5 },
];

interface SubscriptionToggleProps {
  price: number;
  onSelect: (type: "onetime" | "subscription", frequency?: string, discountedPrice?: number) => void;
}

export function SubscriptionToggle({ price, onSelect }: SubscriptionToggleProps) {
  const [mode, setMode] = useState<"onetime" | "subscription">("onetime");
  const [frequency, setFrequency] = useState("weekly");

  const selectedFreq = frequencies.find((f) => f.id === frequency)!;
  const discountedPrice = Math.round(price * (1 - selectedFreq.discount / 100));

  return (
    <div className="space-y-3">
      <div className="flex rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => {
            setMode("onetime");
            onSelect("onetime");
          }}
          className={cn(
            "flex-1 py-2.5 text-sm font-semibold transition-colors",
            mode === "onetime"
              ? "bg-primary text-white"
              : "bg-card text-[var(--color-body)] hover:bg-secondary"
          )}
        >
          One-time
        </button>
        <button
          onClick={() => {
            setMode("subscription");
            onSelect("subscription", frequency, discountedPrice);
          }}
          className={cn(
            "flex-1 py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5",
            mode === "subscription"
              ? "bg-primary text-white"
              : "bg-card text-[var(--color-body)] hover:bg-secondary"
          )}
        >
          <RefreshCw size={14} /> Subscribe & Save
        </button>
      </div>

      {mode === "subscription" && (
        <div className="space-y-2 p-3 rounded-xl bg-primary/5 border border-primary/10">
          <p className="text-xs font-semibold text-primary">Choose delivery frequency:</p>
          <div className="space-y-1.5">
            {frequencies.map((freq) => (
              <button
                key={freq.id}
                onClick={() => {
                  setFrequency(freq.id);
                  const newPrice = Math.round(price * (1 - freq.discount / 100));
                  onSelect("subscription", freq.id, newPrice);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                  frequency === freq.id
                    ? "bg-primary/10 text-primary font-semibold"
                    : "bg-card text-[var(--color-body)] hover:bg-secondary"
                )}
              >
                <span className="flex items-center gap-2">
                  {frequency === freq.id && <Check size={14} />}
                  {freq.label}
                </span>
                <span className="text-xs font-bold text-[var(--color-success)]">Save {freq.discount}%</span>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-primary/10">
            <span className="text-xs text-[var(--color-body)]">Subscription price:</span>
            <span className="font-bold text-primary">₹{discountedPrice} <span className="text-xs line-through text-muted-foreground">₹{price}</span></span>
          </div>
          <p className="text-xs text-muted-foreground">Cancel anytime. No commitment required.</p>
        </div>
      )}
    </div>
  );
}
