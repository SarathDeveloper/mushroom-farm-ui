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
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10 shrink-0">
              <Image
                src="/gallery/Logo.png"
                alt="Sri Amman Mushroom Farms"
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-[#1A4938] tracking-tight font-heading">
              Sri Amman <span className="text-[#2B7A5D]">Farms</span>
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
                    "text-sm font-medium transition-colors hover:text-[#2B7A5D]",
                    isActive ? "text-[#2B7A5D]" : "text-[#5C6370]"
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

            <Link href="/wishlist" aria-label="View wishlist" className="relative text-[#5C6370] hover:text-[#2B7A5D] transition-colors">
              <Heart size={20} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F76B46] text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" aria-label="View cart" className="relative text-[#5C6370] hover:text-[#2B7A5D] transition-colors">
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
                      <Button variant="ghost" size="icon" className="rounded-full bg-[#E8F2EC] text-[#2B7A5D] hover:bg-[#2B7A5D] hover:text-white" />
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
                <Button asChild className="bg-[#2B7A5D] hover:bg-[#1A4938] text-white font-medium">
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger aria-label="Open menu" className="text-[#5C6370] hover:text-[#2B7A5D]">
                  <Menu size={24} />
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="text-left font-heading text-[#1A4938] font-bold text-xl flex items-center gap-2">
                      <div className="relative h-7 w-7">
                        <Image src="/gallery/Logo.png" alt="Logo" fill sizes="28px" className="object-contain" />
                      </div>
                      Sri Amman Farms
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
                            "text-lg font-medium transition-colors hover:text-[#2B7A5D]",
                            isActive ? "text-[#2B7A5D]" : "text-[#5C6370]"
                          )}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                    <Link href="/track-order" className="text-lg font-medium text-[#5C6370] hover:text-[#2B7A5D]">Track Order</Link>
                    <Link href="/compare" className="text-lg font-medium text-[#5C6370] hover:text-[#2B7A5D]">Compare</Link>
                    <Link href="/wishlist" className="text-lg font-medium text-[#5C6370] hover:text-[#2B7A5D]">Wishlist</Link>
                    <Link href="/cart" className="text-lg font-medium text-[#5C6370] hover:text-[#2B7A5D]">Cart</Link>
                    <div className="mt-4 border-t pt-4">
                      {session?.user ? (
                        <>
                          {session.user.role === "ADMIN" && (
                            <Link href="/admin" className="block text-lg font-medium text-[#2B7A5D] mb-4">
                              Admin Dashboard
                            </Link>
                          )}
                          <Button onClick={() => signOut()} variant="outline" className="w-full">
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <Button asChild className="w-full bg-[#2B7A5D] hover:bg-[#1A4938] text-white">
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
