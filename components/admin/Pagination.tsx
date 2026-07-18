"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, "...", total];
  }

  if (current >= total - 2) {
    return [1, "...", total - 3, total - 2, total - 1, total];
  }

  return [1, "...", current - 1, current, current + 1, "...", total];
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <Button
        variant="outline"
        size="sm"
        className="h-9 w-9 p-0"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft size={16} />
      </Button>

      {/* Mobile: show current/total */}
      <span className="sm:hidden text-base text-muted-foreground px-3">
        {currentPage} / {totalPages}
      </span>

      {/* Desktop: show page numbers */}
      <div className="hidden sm:flex items-center gap-1.5">
        {pages.map((page, i) =>
          page === "..." ? (
            <span key={`dots-${i}`} className="px-2 text-muted-foreground text-base">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              className="h-9 w-9 p-0 text-base"
              onClick={() => goToPage(page)}
            >
              {page}
            </Button>
          )
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="h-9 w-9 p-0"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
