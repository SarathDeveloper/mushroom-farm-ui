"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Search,
  Pencil,
  Trash2,
  Loader2,
  Package,
  AlertTriangle,
  EyeOff,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";

import { SafeImage } from "@/components/SafeImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteProduct } from "@/app/admin/products/actions";
import { updateProductStock, toggleProductActive } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  weight: string;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured: boolean;
  images: string[];
  highlights: string[];
  rating: number;
  harvestDate: Date | null;
  category: { id: string; name: string };
};

function stockBadge(stock: number, threshold: number) {
  if (stock === 0) return { text: "Out of Stock", tone: "out" as const };
  if (stock <= threshold) return { text: "Low Stock", tone: "low" as const };
  return { text: "In Stock", tone: "in" as const };
}

function QuickStockUpdate({ product }: { product: Product }) {
  const [stock, setStock] = useState(product.stock.toString());
  const [isPending, startTransition] = useTransition();

  function handleUpdate() {
    const newStock = parseInt(stock, 10);
    if (isNaN(newStock) || newStock < 0) {
      toast.error("Invalid stock value");
      return;
    }
    if (newStock === product.stock) return;

    startTransition(async () => {
      const result = await updateProductStock(product.id, newStock);
      if (result.success) {
        toast.success("Stock updated");
      } else {
        toast.error(result.error || "Failed to update stock");
        setStock(product.stock.toString());
      }
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground shrink-0">Stock</span>
      <Input
        type="number"
        min="0"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        onBlur={handleUpdate}
        onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
        disabled={isPending}
        className="w-16 h-8 text-center px-2 text-sm"
      />
      {isPending && (
        <Loader2 size={14} className="animate-spin text-muted-foreground" />
      )}
    </div>
  );
}

function ActiveToggle({ product }: { product: Product }) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleProductActive(product.id, !product.isActive);
      if (result.success) {
        toast.success(product.isActive ? "Product hidden" : "Product visible");
      } else {
        toast.error(result.error || "Failed to toggle");
      }
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium transition-colors",
        product.isActive
          ? "bg-[#E8F2EC] text-[#2B7A5D] hover:bg-[#dcebe3]"
          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
      )}
      title={product.isActive ? "Click to hide" : "Click to show"}
    >
      {isPending ? (
        <Loader2 size={13} className="animate-spin" />
      ) : product.isActive ? (
        <Package size={13} />
      ) : (
        <EyeOff size={13} />
      )}
      {product.isActive ? "Visible" : "Hidden"}
    </button>
  );
}

export function ProductsTable({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= p.lowStockThreshold
  ).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteProduct(deleteTarget.id);
      if (result.success) {
        toast.success(`"${deleteTarget.name}" deleted.`);
        setDeleteTarget(null);
      } else {
        toast.error(result.error || "Failed to delete product.");
      }
    });
  }

  return (
    <>
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="flex flex-wrap gap-3 mb-6">
          {outOfStockCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              <AlertTriangle size={16} />
              {outOfStockCount} product{outOfStockCount !== 1 && "s"} out of
              stock
            </div>
          )}
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm font-medium">
              <AlertTriangle size={16} />
              {lowStockCount} product{lowStockCount !== 1 && "s"} low on stock
            </div>
          )}
        </div>
      )}

      <div className="relative mb-6 max-w-sm">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((product) => {
            const stock = stockBadge(product.stock, product.lowStockThreshold);
            const tags = product.highlights.slice(0, 4);

            return (
              <div
                key={product.id}
                className={cn(
                  "flex flex-col bg-card rounded-2xl overflow-hidden border border-border/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-opacity",
                  !product.isActive && "opacity-60"
                )}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  <SafeImage
                    src={product.images[0] || ""}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
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
                  {product.isFeatured && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-[#1A4938] shadow-sm">
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-[15px] leading-snug text-foreground line-clamp-2 font-heading">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {product.category.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                      <Star
                        size={13}
                        className="fill-[#c4a96a] text-[#c4a96a]"
                      />
                      <span className="text-xs font-medium text-muted-foreground tabular-nums">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
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

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-[#1A4938] tabular-nums">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      per {product.weight}
                    </span>
                  </div>

                  <div className="mt-auto pt-2 flex flex-wrap items-center gap-2 border-t border-border/70">
                    <QuickStockUpdate product={product} />
                    <div className="flex-1" />
                    <ActiveToggle product={product} />
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-lg"
                      >
                        <Pencil size={14} />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(product)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-16 text-center">
          <Package size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {search ? "No products match your search" : "No products yet"}
          </h3>
          <p className="text-sm text-[var(--color-body)] mb-6">
            {search
              ? "Try a different search term."
              : "Add your first product to get started."}
          </p>
          {!search && (
            <Link href="/admin/products/new">
              <Button>Add Product</Button>
            </Link>
          )}
        </div>
      )}

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Delete Product</DialogTitle>
          <p className="text-sm text-[var(--color-body)] mt-2">
            Are you sure you want to delete{" "}
            <strong className="text-foreground">{deleteTarget?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending && <Loader2 className="animate-spin mr-2" size={16} />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
