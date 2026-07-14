"use client";

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
  Building2,
  GraduationCap,
  Ticket,
  MessageSquare,
  Image as ImageIcon,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/bulk-orders", label: "Bulk Orders", icon: Building2 },
  { href: "/admin/training", label: "Training", icon: GraduationCap },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="lg:sticky lg:top-0 lg:h-screen w-full lg:w-64 shrink-0 bg-[var(--color-primary-dark)] text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/gallery/Logo.png"
            alt="Vellimalai Farms"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <span className="text-lg font-bold tracking-tight font-heading">
            Vellimalai<span className="text-secondary">Admin</span>
          </span>
        </Link>
      </div>

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
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
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
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Store size={18} strokeWidth={1.75} /> Back to Store
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={18} strokeWidth={1.75} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
