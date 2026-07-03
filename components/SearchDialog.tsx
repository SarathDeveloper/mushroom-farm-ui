"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SafeImage } from "@/components/SafeImage";
import { Search, ArrowRight, TrendingUp, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { products } from "@/lib/data";
import { recipes } from "@/lib/recipes";

const popularSearches = ["Oyster", "Milky Mushroom", "Shiitake", "Combo Pack", "Organic"];

const quickLinks = [
  { label: "Compare Nutrition", href: "/compare" },
  { label: "Recipes", href: "/recipes" },
  { label: "Track Order", href: "/track-order" },
  { label: "Training Programs", href: "/training" },
];

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

  const productResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query]);

  const recipeResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return recipes.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.mushroomType.toLowerCase().includes(q)
    ).slice(0, 3);
  }, [query]);

  const goTo = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const handlePopularSearch = (term: string) => {
    setQuery(term);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search products (Ctrl+K)"
        className="text-[var(--color-body)] hover:text-primary transition-colors"
      >
        <Search size={20} />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="top-[12%] max-w-xl translate-y-0 rounded-2xl p-0 gap-0 overflow-hidden sm:max-w-xl"
        >
          <DialogTitle className="sr-only">Search products and recipes</DialogTitle>
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search size={18} className="text-muted-foreground shrink-0" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mushrooms, recipes, pages..."
              className="h-14 border-none shadow-none focus-visible:ring-0 px-0 text-base"
            />
            <kbd className="hidden sm:inline-block text-[10px] font-semibold text-muted-foreground border border-border rounded px-1.5 py-0.5">
              ESC
            </kbd>
          </div>
          <div className="max-h-[28rem] overflow-y-auto">
            {!query.trim() ? (
              <div className="p-4 space-y-5">
                {/* Popular Searches */}
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <TrendingUp size={12} /> Popular Searches
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handlePopularSearch(term)}
                        className="px-3 py-1.5 rounded-full bg-secondary text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Clock size={12} /> Quick Links
                  </h4>
                  <div className="space-y-1">
                    {quickLinks.map((link) => (
                      <button
                        key={link.href}
                        onClick={() => goTo(link.href)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary/50 text-left transition-colors group"
                      >
                        <span className="text-sm font-medium text-foreground">{link.label}</span>
                        <ArrowRight size={14} className="text-border group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-2">
                {/* Product Results */}
                {productResults.length > 0 && (
                  <div className="mb-2">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-2.5 py-1.5">
                      Products ({productResults.length})
                    </h4>
                    {productResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => goTo(`/shop/${product.slug}`)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/50 text-left transition-colors group"
                      >
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 bg-secondary">
                          <SafeImage src={product.image} alt={product.name} fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{product.name}</p>
                          <p className="text-xs text-[var(--color-body)]">
                            {product.category} · ₹{product.price} · {product.weight}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-primary shrink-0">₹{product.price}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Recipe Results */}
                {recipeResults.length > 0 && (
                  <div className="mb-2">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-2.5 py-1.5">
                      Recipes ({recipeResults.length})
                    </h4>
                    {recipeResults.map((recipe) => (
                      <button
                        key={recipe.id}
                        onClick={() => goTo(`/recipes/${recipe.slug}`)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/50 text-left transition-colors group"
                      >
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 bg-secondary">
                          <SafeImage src={recipe.image} alt={recipe.title} fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{recipe.title}</p>
                          <p className="text-xs text-[var(--color-body)]">{recipe.category} · {recipe.difficulty}</p>
                        </div>
                        <ArrowRight size={14} className="text-border group-hover:text-primary transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                )}

                {productResults.length === 0 && recipeResults.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-sm text-[var(--color-body)]">
                      No results for &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Try searching for &ldquo;oyster&rdquo;, &ldquo;curry recipe&rdquo;, or &ldquo;shiitake&rdquo;
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
