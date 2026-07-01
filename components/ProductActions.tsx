"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import toast from "react-hot-toast";
import type { Product } from "@/lib/data";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProductActions({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const wished = useWishlistStore((s) => s.has(product.id));
  const toggleWish = useWishlistStore((s) => s.toggle);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center border border-border rounded-full w-fit">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
          className="w-11 h-11 flex items-center justify-center text-[var(--color-body)] hover:text-primary"
        >
          <Minus size={16} />
        </button>
        <span className="w-10 text-center font-semibold">{qty}</span>
        <button
          onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
          aria-label="Increase quantity"
          className="w-11 h-11 flex items-center justify-center text-[var(--color-body)] hover:text-primary"
        >
          <Plus size={16} />
        </button>
      </div>
      <Button
        onClick={() => {
          addItem(product, qty);
          toast.success(`${qty} × ${product.name} added to cart`);
          setQty(1);
        }}
        size="lg"
        className="flex-1 rounded-full h-[46px]"
      >
        <ShoppingCart size={18} className="mr-2" /> Add to Cart
      </Button>
      <Button
        onClick={() => {
          toggleWish(product.id);
          toast(wished ? "Removed from wishlist" : "Added to wishlist", {
            icon: wished ? "💔" : "❤️",
          });
        }}
        variant="outline"
        size="lg"
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wished}
        className="rounded-full h-[46px] w-[46px] p-0 shrink-0"
      >
        <Heart size={18} className={cn(wished && "fill-accent text-accent")} />
      </Button>
    </div>
  );
}
