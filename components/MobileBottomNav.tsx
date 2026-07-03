"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useHasMounted } from "@/lib/useHasMounted";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/shop", icon: ShoppingBag, label: "Shop" },
  { href: "/cart", icon: ShoppingCart, label: "Cart" },
  { href: "/login", icon: User, label: "Account" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const mounted = useHasMounted();
  const cartCount = useCartStore((s) => s.totalItems());

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full relative transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <tab.icon size={22} strokeWidth={isActive ? 2 : 1.5} />
                {tab.label === "Cart" && mounted && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
