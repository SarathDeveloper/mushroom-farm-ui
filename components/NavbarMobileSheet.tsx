"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, ShoppingBag, Menu, Heart, User, LogOut, Package, Leaf } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { useHasMounted } from "@/lib/useHasMounted";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/shop", label: "Shop" },
  { href: "/pre-order", label: "Pre Order" },
  { href: "/training", label: "Training" },
  { href: "/contact", label: "Contact" },
];

export default function NavbarMobileSheet() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const mounted = useHasMounted();
  const cartCount = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  return (
    <Sheet>
      <SheetTrigger aria-label="Open menu" className="flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-primary">
        <Menu size={24} />
      </SheetTrigger>
      <SheetContent className="p-0 overflow-y-auto">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="text-left flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/10">
              <Image src="/gallery/brand-logo.png" alt="Logo" fill sizes="40px" className="object-cover" />
            </div>
            <span className="leading-none flex flex-col justify-center">
              <span className="block font-display text-xl font-extrabold tracking-[0.01em] text-primary">
                Sri Amman
              </span>
              <span className="block font-sans text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/70 mt-0.5">
                Mushroom Farms
              </span>
            </span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col py-4">
          <div className="px-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-secondary hover:text-primary"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mx-6 my-4 border-t border-border" />
          <div className="px-4 space-y-1">
            <p className="px-4 mb-2 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Quick Access
            </p>
            <Link href="/track-order" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors">
              <Package size={16} className="text-muted-foreground" />
              Track Order
            </Link>
            <Link href="/compare" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors">
              <ShoppingBag size={16} className="text-muted-foreground" />
              Compare Varieties
            </Link>
            <Link href="/wishlist" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors">
              <Heart size={16} className="text-muted-foreground" />
              Wishlist
              {mounted && wishlistCount > 0 && (
                <span className="ml-auto text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors">
              <ShoppingCart size={16} className="text-muted-foreground" />
              Cart
              {mounted && cartCount > 0 && (
                <span className="ml-auto text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="mx-6 my-4 border-t border-border" />
          <div className="px-4 space-y-1">
            <p className="px-4 mb-2 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Account
            </p>
            {session?.user ? (
              <>
                <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors">
                  <User size={16} className="text-muted-foreground" />
                  My Profile
                </Link>
                <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors">
                  <Package size={16} className="text-muted-foreground" />
                  My Orders
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-medium text-primary hover:bg-primary/10 transition-colors">
                    <Leaf size={16} />
                    Admin Dashboard
                  </Link>
                )}
                <div className="px-4 pt-3">
                  <Button onClick={() => signOut()} variant="outline" className="w-full rounded-full h-11">
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="px-4 pt-1 space-y-2">
                <Button asChild className="w-full rounded-full h-11 bg-primary hover:bg-primary/90 text-white">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild variant="outline" className="w-full rounded-full h-11">
                  <Link href="/register">Create Account</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
