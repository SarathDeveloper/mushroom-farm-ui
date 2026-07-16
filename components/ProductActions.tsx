"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import toast from "react-hot-toast";
import type { Product } from "@/lib/data";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { SubscriptionToggle } from "@/components/SubscriptionToggle";
import { cn } from "@/lib/utils";

export function ProductActions({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [purchaseMode, setPurchaseMode] = useState<"onetime" | "subscription">("onetime");
  const [subscriptionFreq, setSubscriptionFreq] = useState<string | undefined>();
  const addItem = useCartStore((s) => s.addItem);
  const wished = useWishlistStore((s) => s.has(product.id));
  const toggleWish = useWishlistStore((s) => s.toggle);

  const handleSubscriptionSelect = (type: "onetime" | "subscription", frequency?: string) => {
    setPurchaseMode(type);
    setSubscriptionFreq(frequency);
  };

  return (
    <div className="space-y-4">
      {/* Subscription toggle */}
      <SubscriptionToggle price={product.price} onSelect={handleSubscriptionSelect} />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center rounded-lg border border-border bg-secondary/60 h-11 w-fit">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="w-9 h-full flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center font-semibold tabular-nums">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            aria-label="Increase quantity"
            className="w-9 h-full flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <Plus size={16} />
          </button>
          <span className="pr-3 text-xs text-muted-foreground border-l border-border ml-0.5 pl-2.5">
            {product.weight}
          </span>
        </div>
        <Button
          onClick={() => {
            addItem(product, qty);
            const msg = purchaseMode === "subscription"
              ? `${qty} × ${product.name} added to subscription (${subscriptionFreq})`
              : `${qty} × ${product.name} added to cart`;
            toast.success(msg);
            setQty(1);
          }}
          size="lg"
          className="flex-1 rounded-lg h-11 bg-[#1A4938] hover:bg-[#14392c]"
        >
          <ShoppingCart size={18} className="mr-2" />
          {purchaseMode === "subscription" ? "Subscribe" : "Add to Cart"}
        </Button>
        <Button
          onClick={() => {
            toggleWish(product.id);
            toast.success(wished ? "Removed from wishlist!" : "Added to wishlist!");
          }}
          variant="outline"
          size="lg"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className="rounded-lg h-11 w-11 p-0 shrink-0"
        >
          <Heart size={18} className={cn(wished && "fill-primary text-primary")} />
        </Button>
      </div>
    </div>
  );
}
