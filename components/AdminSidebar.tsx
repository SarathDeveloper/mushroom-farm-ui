"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Store,
  FolderTree,
  CalendarCheck,
  GraduationCap,
  Ticket,
  MessageSquare,
  Users,
  Presentation,
  BarChart3,
  ShieldCheck,
  Truck,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/pre-orders", label: "Pre Orders", icon: CalendarCheck },
  { href: "/admin/training", label: "Training", icon: GraduationCap },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/delivery-zones", label: "Delivery Zones", icon: Truck },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/hero-slides", label: "Hero Slides", icon: Presentation },
  { href: "/admin/admins", label: "Admin Users", icon: ShieldCheck },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navContent = (
    <>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-base font-medium transition-colors",
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <link.icon size={18} strokeWidth={1.75} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-base font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Store size={18} strokeWidth={1.75} /> Back to Store
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-base font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={18} strokeWidth={1.75} /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-[var(--color-primary-dark)] px-4 py-3 lg:hidden">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/gallery/brand-logo.png"
              alt="Sri Amman Mushroom Farms"
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <span className="leading-none flex flex-col justify-center">
            <span className="block font-display text-base font-extrabold tracking-[0.01em] text-white">
              Sri Amman
            </span>
            <span className="block font-sans text-[8px] font-semibold tracking-[0.16em] uppercase text-white/60 mt-0.5">
              Mushroom Farms
            </span>
            <svg className="w-5 h-1 text-white/30 mt-1 transition-all duration-300 group-hover:w-8 group-hover:text-[#2B7A5D]" viewBox="0 0 32 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 4.5C8 2 24 1.5 31 3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[8px] font-extrabold tracking-wider uppercase bg-[#2B7A5D] text-white/95 ring-1 ring-white/10">
            Admin
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-white/80 hover:bg-white/10 transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile slide-out drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-72 bg-[var(--color-primary-dark)] text-white flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/gallery/brand-logo.png"
                alt="Sri Amman Mushroom Farms"
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
            <span className="leading-none flex flex-col justify-center">
              <span className="block font-display text-base font-extrabold tracking-[0.01em] text-white">
                Sri Amman
              </span>
              <span className="block font-sans text-[8px] font-semibold tracking-[0.18em] uppercase text-white/60 mt-0.5">
                Mushroom Farms
              </span>
              <svg className="w-6 h-1.5 text-white/30 mt-1 transition-all duration-300 group-hover:w-9 group-hover:text-[#2B7A5D]" viewBox="0 0 32 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4.5C8 2 24 1.5 31 3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </span>
            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[8px] font-extrabold tracking-wider uppercase bg-[#2B7A5D] text-white/95 ring-1 ring-white/10">
              Admin
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-white/70 hover:bg-white/10"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:sticky lg:top-0 lg:h-screen w-64 shrink-0 bg-[var(--color-primary-dark)] text-white flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/gallery/brand-logo.png"
                alt="Sri Amman Mushroom Farms"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <span className="leading-none flex flex-col justify-center">
              <span className="block font-display text-lg font-extrabold tracking-[0.01em] text-white">
                Sri Amman
              </span>
              <span className="block font-sans text-[10px] font-semibold tracking-[0.18em] uppercase text-white/60 mt-0.5">
                Mushroom Farms
              </span>
              <svg className="w-7 h-1.5 text-white/30 mt-1 transition-all duration-300 group-hover:w-11 group-hover:text-[#2B7A5D]" viewBox="0 0 32 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4.5C8 2 24 1.5 31 3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </span>
            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[8px] font-extrabold tracking-wider uppercase bg-[#2B7A5D] text-white/95 ring-1 ring-white/10">
              Admin
            </span>
          </Link>
        </div>
        {navContent}
      </aside>
    </>
  );
}
