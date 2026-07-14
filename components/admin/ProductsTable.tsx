"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Search, Pencil, Trash2, Loader2, Package } from "lucide-react";
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

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  isFeatured: boolean;
  images: string[];
  category: { id: string; name: string };
};

export function ProductsTable({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.name.toLowerCase().includes(search.toLowerCase())
  );

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
                  <th className="font-semibold px-6 py-4">Featured</th>
                  <th className="font-semibold px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-secondary/30 transition-colors"
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
                        <span className="font-semibold text-foreground line-clamp-1">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-body)]">
                      {product.category.name}
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4 text-[var(--color-body)]">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      {product.stock === 0 ? (
                        <Badge variant="destructive">Out of stock</Badge>
                      ) : product.stock < 20 ? (
                        <Badge variant="warning">Low stock</Badge>
                      ) : (
                        <Badge variant="success">In stock</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {product.isFeatured ? (
                        <Badge variant="default">Featured</Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
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
          <Package
            size={48}
            className="mx-auto text-muted-foreground mb-4"
          />
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

      {/* Delete Confirmation Dialog */}
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
              {isPending && (
                <Loader2 className="animate-spin mr-2" size={16} />
              )}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
