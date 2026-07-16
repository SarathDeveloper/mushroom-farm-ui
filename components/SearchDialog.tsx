"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SafeImage } from "@/components/SafeImage";
import { Search, ArrowRight, TrendingUp, Clock, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { searchProducts } from "@/app/admin/products/actions";

const popularSearches = ["Oyster", "Milky Mushroom", "Shiitake", "Combo Pack", "Organic"];

const quickLinks = [
  { label: "Pre-Order Mushrooms", href: "/pre-order" },
  { label: "Compare Nutrition", href: "/compare" },
  { label: "Track Order", href: "/track-order" },
  { label: "Training Programs", href: "/training" },
];

type SearchResult = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
};

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
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
    if (!open) {
      setQuery("");
      setResults([]);
      setHasSearched(false);
    }
  }, [open]);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setHasSearched(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const result = await searchProducts(q);
    setIsSearching(false);
    setHasSearched(true);

    if (result.success && result.data) {
      setResults(result.data);
    } else {
      setResults([]);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

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
        className="text-muted-foreground hover:text-primary transition-colors"
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
            {isSearching ? (
              <Loader2 size={18} className="text-primary animate-spin shrink-0" />
            ) : (
              <Search size={18} className="text-muted-foreground shrink-0" />
            )}
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
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <TrendingUp size={12} /> Popular Searches
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handlePopularSearch(term)}
                        className="px-3 py-1.5 rounded-full bg-secondary text-sm font-medium text-foreground hover:bg-[#E8F2EC] hover:text-[#2B7A5D] transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

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
                        <ArrowRight size={14} className="text-border group-hover:text-[#2B7A5D] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-2">
                {results.length > 0 && (
                  <div className="mb-2">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2.5 py-1.5">
                      Products ({results.length})
                    </h4>
                    {results.map((product) => (
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
                        </div>
                        <span className="text-xs font-semibold text-[#2B7A5D] shrink-0">₹{product.price}</span>
                      </button>
                    ))}
                  </div>
                )}

                {hasSearched && !isSearching && results.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-sm text-muted-foreground">
                      No results for &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Try searching for &ldquo;oyster&rdquo;, &ldquo;milky&rdquo;, or &ldquo;shiitake&rdquo;
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
