"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, Menu, Heart, Leaf, User, LogOut, Package } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SearchDialog } from "@/components/SearchDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { useHasMounted } from "@/lib/useHasMounted";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/bulk-orders", label: "Bulk Orders" },
  { href: "/training", label: "Training" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const mounted = useHasMounted();
  const cartCount = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-dark)] text-white">
              <Leaf size={24} />
            </div>
            <span className="text-xl font-bold text-[var(--color-primary-dark)] tracking-tight font-heading">
              Vellimalai<span className="text-accent">Farms</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-[var(--color-body)]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Icons & Actions */}
          <div className="flex items-center gap-4">
            <SearchDialog />

            <Link href="/wishlist" aria-label="View wishlist" className="relative text-[var(--color-body)] hover:text-primary transition-colors">
              <Heart size={20} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" aria-label="View cart" className="relative text-[var(--color-body)] hover:text-primary transition-colors">
              <ShoppingCart size={20} />
              {mounted && cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="hidden md:flex">
              {session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20" />
                    }
                  >
                    <User size={18} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>{session.user.name ?? session.user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem render={<Link href="/orders" />}>
                      <Package size={14} /> My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
                      <LogOut size={14} /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild className="bg-[var(--color-primary-dark)] hover:bg-primary text-white font-medium">
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger aria-label="Open menu" className="text-[var(--color-body)] hover:text-primary">
                  <Menu size={24} />
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="text-left font-heading text-[var(--color-primary-dark)] font-bold text-xl flex items-center gap-2">
                      <Leaf size={20} /> Vellimalai Farms
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 flex flex-col gap-4 px-4">
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="text-lg font-medium hover:text-primary">
                        {link.label}
                      </Link>
                    ))}
                    <Link href="/wishlist" className="text-lg font-medium hover:text-primary">Wishlist</Link>
                    <Link href="/cart" className="text-lg font-medium hover:text-primary">Cart</Link>
                    <div className="mt-4 border-t pt-4">
                      {session?.user ? (
                        <Button onClick={() => signOut()} variant="outline" className="w-full">
                          Sign Out
                        </Button>
                      ) : (
                        <Button asChild className="w-full bg-[var(--color-primary-dark)] hover:bg-primary text-white">
                          <Link href="/login">Sign In</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
