"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, Heart, Leaf, User, LogOut, Package, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const SearchDialog = dynamic(
  () => import("@/components/SearchDialog").then((m) => ({ default: m.SearchDialog })),
  { ssr: false, loading: () => <Search size={20} className="text-muted-foreground" /> },
);

const MobileSheet = dynamic(
  () => import("@/components/NavbarMobileSheet"),
  { ssr: false },
);

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
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105">
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
              <span className="block font-sans text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-primary/90 mt-1">
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
                    "text-base font-medium transition-colors hover:text-primary",
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
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F76B46] text-xs font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" aria-label="View cart" className="relative flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-primary transition-colors">
              <ShoppingCart size={20} />
              {mounted && cartCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F76B46] text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="hidden md:flex">
              {session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
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
              <MobileSheet />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
