"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, ShoppingBag, Menu, Heart, Leaf, User, LogOut, Package } from "lucide-react";
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
          <div className="flex items-center gap-2 sm:gap-4">
            <SearchDialog />

            <Link href="/wishlist" aria-label="View wishlist" className="relative flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-primary transition-colors">
              <Heart size={20} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F76B46] text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" aria-label="View cart" className="relative flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-primary transition-colors">
              <ShoppingCart size={20} />
              {mounted && cartCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F76B46] text-[10px] font-bold text-white">
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
                    <DropdownMenuItem render={<Link href="/account" />}>
                      <User size={14} /> My Profile
                    </DropdownMenuItem>
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
                        <span className="block font-display text-lg font-extrabold tracking-[0.01em] text-primary">
                          Sri Amman
                        </span>
                        <span className="block font-sans text-[9px] font-semibold tracking-[0.22em] uppercase text-primary/70 mt-0.5">
                          Mushroom Farms
                        </span>
                      </span>
                    </SheetTitle>
                  </SheetHeader>

                  <nav className="flex flex-col py-4">
                    {/* Main navigation */}
                    <div className="px-4 space-y-1">
                      {navLinks.map((link) => {
                        const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-colors",
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

                    {/* Secondary links */}
                    <div className="mx-6 my-4 border-t border-border" />
                    <div className="px-4 space-y-1">
                      <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                        Quick Access
                      </p>
                      <Link href="/track-order" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors">
                        <Package size={16} className="text-muted-foreground" />
                        Track Order
                      </Link>
                      <Link href="/compare" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors">
                        <ShoppingBag size={16} className="text-muted-foreground" />
                        Compare Varieties
                      </Link>
                      <Link href="/wishlist" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors">
                        <Heart size={16} className="text-muted-foreground" />
                        Wishlist
                        {mounted && wishlistCount > 0 && (
                          <span className="ml-auto text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>
                      <Link href="/cart" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors">
                        <ShoppingCart size={16} className="text-muted-foreground" />
                        Cart
                        {mounted && cartCount > 0 && (
                          <span className="ml-auto text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </div>

                    {/* Account section */}
                    <div className="mx-6 my-4 border-t border-border" />
                    <div className="px-4 space-y-1">
                      <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                        Account
                      </p>
                      {session?.user ? (
                        <>
                          <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors">
                            <User size={16} className="text-muted-foreground" />
                            My Profile
                          </Link>
                          <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors">
                            <Package size={16} className="text-muted-foreground" />
                            My Orders
                          </Link>
                          {session.user.role === "ADMIN" && (
                            <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
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
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
