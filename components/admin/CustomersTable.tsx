"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Phone, Mail, ShoppingBag, Calendar } from "lucide-react";
import { SafeImage } from "@/components/SafeImage";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type Customer = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  orderCount: number;
  lastOrder: { createdAt: Date; totalAmount: number } | null;
  createdAt: Date;
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string | null, email: string | null): string {
  if (name) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }
  if (email) return email[0].toUpperCase();
  return "?";
}

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      (c.name?.toLowerCase().includes(search.toLowerCase())) ||
      (c.email?.toLowerCase().includes(search.toLowerCase())) ||
      (c.phone?.includes(search))
  );

  return (
    <>
      {/* Search */}
      <div className="relative mb-4 sm:mb-6 max-w-sm">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Mobile card view */}
      <div className="space-y-3 md:hidden">
        {filtered.map((customer) => (
          <Link key={customer.id} href={`/admin/customers/${customer.id}`} className="block bg-card rounded-xl border border-border p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              {customer.image ? (
                <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0 bg-secondary">
                  <SafeImage
                    src={customer.image}
                    alt={customer.name || ""}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-base shrink-0">
                  {getInitials(customer.name, customer.email)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground text-base truncate">
                  {customer.name || "—"}
                </p>
                <p className="text-sm text-muted-foreground truncate">{customer.email || customer.phone || "—"}</p>
              </div>
              <Badge variant={customer.orderCount > 0 ? "default" : "secondary"} className="shrink-0">
                {customer.orderCount} orders
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t border-border">
              <div className="flex items-center gap-3">
                {customer.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={11} /> {customer.phone}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Mail size={11} /> Email
                </span>
              </div>
              {customer.lastOrder && (
                <span className="font-medium text-foreground">
                  ₹{customer.lastOrder.totalAmount.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-base">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-[var(--color-body)]">
                <th className="font-semibold px-6 py-4">Customer</th>
                <th className="font-semibold px-6 py-4">Contact</th>
                <th className="font-semibold px-6 py-4 text-center">Orders</th>
                <th className="font-semibold px-6 py-4">Last Order</th>
                <th className="font-semibold px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-secondary/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/customers/${customer.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {customer.image ? (
                        <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0 bg-secondary">
                          <SafeImage
                            src={customer.image}
                            alt={customer.name || ""}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-base">
                          {getInitials(customer.name, customer.email)}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-foreground">
                          {customer.name || "—"}
                        </span>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {customer.email || customer.phone || "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {customer.email && (
                        <a
                          href={`mailto:${customer.email}`}
                          className="flex items-center gap-1.5 text-[var(--color-body)] hover:text-primary text-sm"
                        >
                          <Mail size={12} /> Email
                        </a>
                      )}
                      {customer.phone && (
                        <a
                          href={`tel:${customer.phone}`}
                          className="flex items-center gap-1.5 text-[var(--color-body)] hover:text-primary text-sm"
                        >
                          <Phone size={12} /> {customer.phone}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={customer.orderCount > 0 ? "default" : "secondary"}>
                      {customer.orderCount}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {customer.lastOrder ? (
                      <div className="text-sm">
                        <p className="font-medium text-foreground">
                          ₹{customer.lastOrder.totalAmount.toLocaleString("en-IN")}
                        </p>
                        <p className="text-muted-foreground">
                          {formatDate(customer.lastOrder.createdAt)}
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {formatDate(customer.createdAt)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No customers found matching your search.
        </div>
      )}
    </>
  );
}
