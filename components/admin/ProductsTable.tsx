"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Search, Pencil, Trash2, Loader2, Package, AlertTriangle, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import { SafeImage } from "@/components/SafeImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteProduct } from "@/app/admin/products/actions";
import { updateProductStock, toggleProductActive } from "@/app/admin/actions";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured: boolean;
  images: string[];
  harvestDate: Date | null;
  category: { id: string; name: string };
};

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
    <div className="flex items-center gap-1">
      <Input
        type="number"
        min="0"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        onBlur={handleUpdate}
        onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
        disabled={isPending}
        className="w-20 h-8 text-center px-2"
      />
      {isPending && <Loader2 size={14} className="animate-spin text-muted-foreground" />}
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
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
        product.isActive
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      }`}
      title={product.isActive ? "Click to hide" : "Click to show"}
    >
      {isPending ? (
        <Loader2 size={14} className="animate-spin" />
      ) : product.isActive ? (
        <Package size={14} />
      ) : (
        <EyeOff size={14} />
      )}
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

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
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
      {/* Stock Alerts */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="flex flex-wrap gap-3 mb-6">
          {outOfStockCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              <AlertTriangle size={16} />
              {outOfStockCount} product{outOfStockCount !== 1 && "s"} out of stock
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

      {/* Search */}
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

      {/* Table */}
      {filtered.length > 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-[var(--color-body)]">
                  <th className="font-semibold px-6 py-4">Product</th>
                  <th className="font-semibold px-6 py-4">Category</th>
                  <th className="font-semibold px-6 py-4">Price</th>
                  <th className="font-semibold px-6 py-4">Stock</th>
                  <th className="font-semibold px-6 py-4">Status</th>
                  <th className="font-semibold px-6 py-4">Visible</th>
                  <th className="font-semibold px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((product) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-secondary/30 transition-colors ${!product.isActive ? "opacity-60" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 bg-secondary">
                          <SafeImage
                            src={product.images[0] || ""}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-semibold text-foreground line-clamp-1">
                            {product.name}
                          </span>
                          {product.isFeatured && (
                            <Badge variant="default" className="mt-1 text-[10px]">Featured</Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-body)]">
                      {product.category.name}
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4">
                      <QuickStockUpdate product={product} />
                    </td>
                    <td className="px-6 py-4">
                      {product.stock === 0 ? (
                        <Badge variant="destructive">Out of stock</Badge>
                      ) : product.stock <= product.lowStockThreshold ? (
                        <Badge variant="warning">Low stock</Badge>
                      ) : (
                        <Badge variant="success">In stock</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <ActiveToggle product={product} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Pencil size={14} />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(product)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-16 text-center">
          <Package size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {search ? "No products match your search" : "No products yet"}
          </h3>
          <p className="text-sm text-[var(--color-body)] mb-6">
            {search ? "Try a different search term." : "Add your first product to get started."}
          </p>
          {!search && (
            <Link href="/admin/products/new">
              <Button>Add Product</Button>
            </Link>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Delete Product</DialogTitle>
          <p className="text-sm text-[var(--color-body)] mt-2">
            Are you sure you want to delete <strong className="text-foreground">{deleteTarget?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isPending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending && <Loader2 className="animate-spin mr-2" size={16} />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
