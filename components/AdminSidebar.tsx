"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Leaf, LogOut, Package, ShoppingBag, Store } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="lg:sticky lg:top-0 lg:h-screen w-full lg:w-64 shrink-0 bg-[var(--color-primary-dark)] text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white">
            <Leaf size={20} />
          </div>
          <span className="text-lg font-bold tracking-tight font-heading">
            Vellimalai<span className="text-secondary">Admin</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const isActive =
            link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
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
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Store size={18} strokeWidth={1.75} /> Back to Store
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={18} strokeWidth={1.75} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
