"use client";

import { useState } from "react";
import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { Heart, Star, ShoppingCart, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import type { Product } from "@/lib/data";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function stockLabel(stock: number) {
  if (stock <= 0) return { text: "Out of Stock", tone: "out" as const };
  if (stock <= 20) return { text: "Low Stock", tone: "low" as const };
  return { text: "In Stock", tone: "in" as const };
}

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const wished = useWishlistStore((s) => s.has(product.id));
  const toggleWish = useWishlistStore((s) => s.toggle);
  const [qty, setQty] = useState(1);

  const stock = stockLabel(product.stock);
  const tags = product.highlights.slice(0, 4);
  const outOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (outOfStock) return;
    addItem(product, qty);
    toast.success(`${qty} × ${product.name} added to cart`);
    setQty(1);
  };

  const handleWishlist = () => {
    toggleWish(product.id);
    toast(wished ? "Removed from wishlist" : "Added to wishlist", {
      icon: wished ? "💔" : "❤️",
    });
  };

  return (
    <div className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_36px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 ease-out">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <Link href={`/shop/${product.slug}`} className="relative block h-full w-full">
          <SafeImage
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </Link>

        <span
          className={cn(
            "absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white shadow-sm",
            stock.tone === "in" && "bg-[#2B7A5D]",
            stock.tone === "low" && "bg-[#E5B06D]",
            stock.tone === "out" && "bg-[#E56D6D]"
          )}
        >
          {stock.text}
        </span>

        <button
          onClick={handleWishlist}
          aria-label={
            wished
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={wished}
          className="absolute top-3 left-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-white transition-colors shadow-sm"
        >
          <Heart
            size={16}
            className={cn(wished && "fill-[#2B7A5D] text-[#2B7A5D]")}
          />
        </button>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col gap-2.5 sm:gap-3">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/shop/${product.slug}`} className="min-w-0">
            <h3 className="font-bold text-[15px] leading-snug text-foreground line-clamp-2 font-heading hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 shrink-0 pt-0.5">
            <Star size={13} className="fill-[#c4a96a] text-[#c4a96a]" />
            <span className="text-xs font-medium text-muted-foreground tabular-nums">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {product.description}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-[#E8F2EC] px-2.5 py-0.5 text-[11px] font-medium text-[#2B7A5D] border border-[#2B7A5D]/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-1 flex items-baseline gap-1.5">
          <span className="text-xl font-extrabold text-[#1A4938] tabular-nums">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-muted-foreground line-through tabular-nums">
              ₹{product.compareAtPrice.toLocaleString("en-IN")}
            </span>
          )}
          <span className="text-sm text-muted-foreground">
            per {product.weight}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 pt-1">
          <div className="flex items-center rounded-lg border border-border bg-secondary/60 h-10 shrink-0">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={outOfStock}
              aria-label="Decrease quantity"
              className="w-9 sm:w-8 h-full flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              <Minus size={14} />
            </button>
            <span className="w-7 text-center text-sm font-semibold tabular-nums">
              {qty}
            </span>
            <button
              type="button"
              onClick={() =>
                setQty((q) => Math.min(Math.max(product.stock, 1), q + 1))
              }
              disabled={outOfStock}
              aria-label="Increase quantity"
              className="w-9 sm:w-8 h-full flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              <Plus size={14} />
            </button>
            <span className="hidden sm:inline pr-2.5 text-xs text-muted-foreground border-l border-border ml-0.5 pl-2">
              {product.weight}
            </span>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
            className="flex-1 h-10 rounded-lg bg-[#1A4938] hover:bg-[#14392c] text-white text-sm font-semibold gap-1.5 disabled:opacity-50"
          >
            <ShoppingCart size={15} />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
