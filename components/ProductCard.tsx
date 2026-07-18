"use client";

import { useState } from "react";
import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { Heart, Star, ShoppingCart, Minus, Plus, Clock } from "lucide-react";
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
  const highlights = product.highlights ?? [];
  const tags = [
    ...(product.tag ? [product.tag] : []),
    ...highlights.filter(Boolean).slice(0, product.tag ? 3 : 4),
  ];
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
    <div className="group flex flex-col bg-card rounded-xl sm:rounded-2xl overflow-hidden border border-border/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_36px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 ease-out">
      <div className="relative aspect-square sm:aspect-[3/2] overflow-hidden bg-secondary">
        <Link href={`/shop/${product.slug}`} className="relative block h-full w-full">
          <SafeImage
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </Link>

        <span
          className={cn(
            "absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold text-white shadow-sm",
            stock.tone === "in" && "bg-primary",
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
          className="absolute top-2 left-2 sm:top-3 sm:left-3 w-8 h-8 sm:w-9 sm:h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-white transition-colors shadow-sm"
        >
          <Heart
            size={14}
            className={cn("sm:hidden", wished && "fill-primary text-primary")}
          />
          <Heart
            size={16}
            className={cn("hidden sm:block", wished && "fill-primary text-primary")}
          />
        </button>
      </div>

      <div className="p-2.5 sm:p-4 flex-1 flex flex-col gap-1.5 sm:gap-2">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <Link href={`/shop/${product.slug}`} className="min-w-0">
            <h3 className="font-bold text-sm sm:text-[15px] leading-snug text-foreground line-clamp-2 font-heading hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 pt-0.5">
            <Star size={12} className="fill-[#c4a96a] text-[#c4a96a] sm:hidden" />
            <Star size={13} className="fill-[#c4a96a] text-[#c4a96a] hidden sm:block" />
            <span className="text-[11px] sm:text-xs font-medium text-muted-foreground tabular-nums">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <p className="hidden sm:block text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {product.shelfLifeDays != null && product.shelfLifeDays > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-amber-700">
            <Clock size={12} className="shrink-0" />
            Best within {product.shelfLifeDays} day{product.shelfLifeDays > 1 ? "s" : ""}
          </div>
        )}

        {tags.length > 0 && (
          <div className="hidden sm:flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary border border-primary/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-0.5 sm:pt-1 flex flex-wrap items-baseline gap-1 sm:gap-1.5">
          <span className="text-base sm:text-lg font-extrabold text-primary tabular-nums">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.compareAtPrice && (
            <span className="text-[11px] sm:text-xs text-muted-foreground line-through tabular-nums">
              ₹{product.compareAtPrice.toLocaleString("en-IN")}
            </span>
          )}
          <span className="text-[11px] sm:text-sm text-muted-foreground">
            / {product.weight}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
          <div className="hidden sm:flex items-center rounded-lg border border-border bg-secondary/60 h-9 shrink-0">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={outOfStock}
              aria-label="Decrease quantity"
              className="w-9 h-full flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
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
              className="w-9 h-full flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              <Plus size={14} />
            </button>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
            className="flex-1 min-w-0 h-8 sm:h-9 rounded-full bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-semibold gap-1 sm:gap-1.5 disabled:opacity-50 px-2"
          >
            <ShoppingCart size={14} className="sm:hidden" />
            <ShoppingCart size={15} className="hidden sm:block" />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
