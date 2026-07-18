"use client";

import Link from "next/link";
import Image from "next/image";
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
  { href: "/about", label: "About Us" },
  { href: "/shop", label: "Shop" },
  { href: "/pre-order", label: "Pre Order" },
  { href: "/training", label: "Training" },
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
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 min-w-0 group">
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/10 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/gallery/brand-logo.png"
                alt="Sri Amman Mushroom Farms"
                fill
                sizes="56px"
                className="object-cover"
                priority
              />
            </div>
            <span className="leading-none min-w-0 flex flex-col justify-center">
              <span className="block font-display text-[17px] sm:text-[21px] font-extrabold tracking-[0.01em] text-primary transition-colors duration-300 group-hover:text-primary/90">
                Sri Amman
              </span>
              <span className="block font-sans text-[9px] sm:text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/90 mt-1">
                Mushroom Farms
              </span>
              <svg className="w-7 h-1.5 text-primary/40 mt-1 transition-all duration-300 group-hover:w-11 group-hover:text-primary" viewBox="0 0 32 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4.5C8 2 24 1.5 31 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
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
                    isActive ? "text-primary" : "text-muted-foreground"
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

            <Link href="/wishlist" aria-label="View wishlist" className="relative text-muted-foreground hover:text-primary transition-colors">
              <Heart size={20} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F76B46] text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" aria-label="View cart" className="relative text-muted-foreground hover:text-primary transition-colors">
              <ShoppingCart size={20} />
              {mounted && cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F76B46] text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="hidden md:flex">
              {session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white" />
                    }
                  >
                    <User size={18} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>{session.user.name ?? session.user.email ?? "User"}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {session.user.role === "ADMIN" && (
                      <DropdownMenuItem render={<Link href="/admin" />}>
                        <Leaf size={14} /> Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem render={<Link href="/orders" />}>
                      <Package size={14} /> My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
                      <LogOut size={14} /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild className="bg-primary hover:bg-primary/90 text-white font-medium">
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger aria-label="Open menu" className="text-muted-foreground hover:text-primary">
                  <Menu size={24} />
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="text-left flex items-center gap-2.5">
                      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/10">
                        <Image src="/gallery/brand-logo.png" alt="Logo" fill sizes="32px" className="object-cover" />
                      </div>
                      <span className="leading-none flex flex-col justify-center">
                        <span className="block font-display text-base font-extrabold tracking-[0.01em] text-primary">
                          Sri Amman
                        </span>
                        <span className="block font-sans text-[9px] font-semibold tracking-[0.2em] uppercase text-primary/90 mt-0.5">
                          Mushroom Farms
                        </span>
                        <svg className="w-6 h-1 text-primary/40 mt-1" viewBox="0 0 32 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 4.5C8 2 24 1.5 31 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 flex flex-col gap-4 px-4">
                    {navLinks.map((link) => {
                      const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "text-lg font-medium transition-colors hover:text-primary",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                    <Link href="/track-order" className="text-lg font-medium text-muted-foreground hover:text-primary">Track Order</Link>
                    <Link href="/compare" className="text-lg font-medium text-muted-foreground hover:text-primary">Compare</Link>
                    <Link href="/wishlist" className="text-lg font-medium text-muted-foreground hover:text-primary">Wishlist</Link>
                    <Link href="/cart" className="text-lg font-medium text-muted-foreground hover:text-primary">Cart</Link>
                    <div className="mt-4 border-t pt-4">
                      {session?.user ? (
                        <>
                          <Link href="/orders" className="block text-lg font-medium text-muted-foreground hover:text-primary mb-4">
                            My Orders
                          </Link>
                          {session.user.role === "ADMIN" && (
                            <Link href="/admin" className="block text-lg font-medium text-primary mb-4">
                              Admin Dashboard
                            </Link>
                          )}
                          <Button onClick={() => signOut()} variant="outline" className="w-full">
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
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
