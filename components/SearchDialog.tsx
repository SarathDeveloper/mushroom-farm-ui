"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SafeImage } from "@/components/SafeImage";
import { Search, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { products } from "@/lib/data";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return products.slice(0, 5);
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query]);

  const goToProduct = (slug: string) => {
    setOpen(false);
    router.push(`/shop/${slug}`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search products"
        className="text-[var(--color-body)] hover:text-primary transition-colors"
      >
        <Search size={20} />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="top-[15%] max-w-xl translate-y-0 rounded-2xl p-0 gap-0 overflow-hidden sm:max-w-xl"
        >
          <DialogTitle className="sr-only">Search products</DialogTitle>
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search size={18} className="text-muted-foreground shrink-0" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for mushrooms, categories..."
              className="h-14 border-none shadow-none focus-visible:ring-0 px-0 text-base"
            />
            <kbd className="hidden sm:inline-block text-[10px] font-semibold text-muted-foreground border border-border rounded px-1.5 py-0.5">
              ESC
            </kbd>
          </div>
          <div className="max-h-96 overflow-y-auto p-2">
            {results.length === 0 ? (
              <p className="text-sm text-[var(--color-body)] text-center py-10">
                No products found for &ldquo;{query}&rdquo;
              </p>
            ) : (
              results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => goToProduct(product.slug)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/50 text-left transition-colors group"
                >
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 bg-secondary">
                    <SafeImage src={product.image} alt={product.name} fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-[var(--color-body)]">{product.category} · ₹{product.price}</p>
                  </div>
                  <ArrowRight size={16} className="text-border group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
