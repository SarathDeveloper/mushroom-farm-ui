"use client";

import { useState } from "react";
import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { Heart, Star, Eye, ShoppingCart, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import type { Product } from "@/lib/data";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
              ? "fill-[#c4a96a] text-[#c4a96a]"
              : "fill-border text-border"
          }
        />
      ))}
    </div>
  );
}

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const addItem = useCartStore((s) => s.addItem);
  const wished = useWishlistStore((s) => s.has(product.id));
  const toggleWish = useWishlistStore((s) => s.toggle);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [qty, setQty] = useState(1);

  const handleAddToCart = (quantity = 1) => {
    addItem(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = () => {
    toggleWish(product.id);
    toast(wished ? `Removed from wishlist` : `Added to wishlist`, {
      icon: wished ? "💔" : "❤️",
    });
  };

  return (
    <>
      <div className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 ease-out">
        <div className="relative h-56 overflow-hidden">
          <Link href={`/shop/${product.slug}`} className="relative block h-full w-full">
            <SafeImage
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={priority}
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </Link>
          {product.tag && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent text-white text-xs font-bold uppercase tracking-wide">
              {product.tag}
            </span>
          )}
          {/* Freshness badge */}
          <span className="absolute bottom-4 left-4 px-2.5 py-1 rounded-full bg-[var(--color-success)]/90 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            Harvested Today
          </span>
          <button
            onClick={handleWishlist}
            aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            aria-pressed={wished}
            className="absolute top-4 right-4 w-10 h-10 bg-white/85 backdrop-blur-sm rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-white transition-colors"
          >
            <Heart size={20} className={cn(wished && "fill-primary text-primary")} />
          </button>
          <button
            onClick={() => setQuickViewOpen(true)}
            aria-label={`Quick view ${product.name}`}
            className="absolute bottom-4 right-4 w-10 h-10 bg-white/85 backdrop-blur-sm rounded-full flex items-center justify-center text-[var(--color-body)] opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-white transition-all translate-y-2 group-hover:translate-y-0"
          >
            <Eye size={18} />
          </button>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <Link href={`/shop/${product.slug}`}>
            <h3 className="font-bold text-lg text-foreground line-clamp-1 mb-1 font-heading hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <StarRow rating={product.rating} />
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
          {/* Stock urgency */}
          {product.stock <= 20 && (
            <p className="text-[11px] font-semibold text-[var(--color-warning)] mb-2">
              Only {product.stock} left — order soon!
            </p>
          )}
          <div className="mt-auto flex items-end justify-between">
            <div>
              <span className="text-sm text-[var(--color-body)] block mb-1">{product.weight}</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary">₹{product.price}</span>
                {product.compareAtPrice && (
                  <span className="text-sm text-muted-foreground line-through">₹{product.compareAtPrice}</span>
                )}
              </div>
            </div>
            <Button
              onClick={() => handleAddToCart(1)}
              aria-label={`Add ${product.name} to cart`}
              className="px-4 h-10"
            >
              Add
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-3xl">
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="relative h-64 sm:h-full min-h-[280px]">
              <SafeImage src={product.image} alt={product.name} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
              {product.tag && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent text-white text-xs font-bold uppercase tracking-wide">
                  {product.tag}
                </span>
              )}
            </div>
            <div className="p-6 flex flex-col">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                {product.category}
              </span>
              <h2 className="text-2xl font-bold font-heading text-foreground mb-2">{product.name}</h2>
              <div className="flex items-center gap-2 mb-4">
                <StarRow rating={product.rating} />
                <span className="text-xs text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
              <p className="text-sm text-[var(--color-body)] leading-relaxed mb-4">{product.description}</p>
              <ul className="grid grid-cols-2 gap-2 mb-6">
                {product.highlights.slice(0, 4).map((h) => (
                  <li key={h} className="text-xs text-[var(--color-body)] flex items-start gap-1.5">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" /> {h}
                  </li>
                ))}
              </ul>
              <div className="mt-auto space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                  {product.compareAtPrice && (
                    <span className="text-base text-muted-foreground line-through">₹{product.compareAtPrice}</span>
                  )}
                  <span className="text-sm text-[var(--color-body)]">/ {product.weight}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-full">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="w-9 h-9 flex items-center justify-center text-[var(--color-body)] hover:text-primary"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      aria-label="Increase quantity"
                      className="w-9 h-9 flex items-center justify-center text-[var(--color-body)] hover:text-primary"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <Button
                    onClick={() => {
                      handleAddToCart(qty);
                      setQuickViewOpen(false);
                      setQty(1);
                    }}
                    className="flex-1 h-10"
                  >
                    <ShoppingCart size={16} className="mr-1.5" /> Add to Cart
                  </Button>
                </div>
                <Link
                  href={`/shop/${product.slug}`}
                  className="block text-center text-sm font-semibold text-primary hover:underline"
                >
                  View full details
                </Link>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
