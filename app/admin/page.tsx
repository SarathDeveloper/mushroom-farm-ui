import Link from "next/link";
import { ArrowUpRight, IndianRupee, Package, ShoppingBag, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { products } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

async function getStats() {
  try {
    const [orderCount, userCount, orders] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.findMany({ select: { totalAmount: true } }),
    ]);
    const revenue = orders.reduce((sum: number, o: { totalAmount: number }) => sum + o.totalAmount, 0);
    return { orderCount, userCount, revenue };
  } catch {
    return { orderCount: 0, userCount: 0, revenue: 0 };
  }
}

async function getRecentOrders() {
  try {
    return await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { name: true, email: true } }, orderItems: true },
    });
  } catch {
    return [];
  }
}

const statusVariant: Record<
  string,
  "default" | "secondary" | "success" | "warning" | "destructive"
> = {
  PENDING: "warning",
  PROCESSING: "secondary",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
};

export default async function AdminOverviewPage() {
  const { orderCount, userCount, revenue } = await getStats();
  const recentOrders = await getRecentOrders();

  const cards = [
    { label: "Total Products", value: products.length.toString(), icon: Package },
    { label: "Total Orders", value: orderCount.toString(), icon: ShoppingBag },
    { label: "Registered Users", value: userCount.toString(), icon: Users },
    { label: "Revenue", value: `₹${revenue.toLocaleString("en-IN")}`, icon: IndianRupee },
  ];

  return (
    <div className="p-6 sm:p-10">
      <header className="mb-10">
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">Dashboard Overview</h1>
        <p className="text-[var(--color-body)] mt-1">A snapshot of your farm store&apos;s activity.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-card rounded-2xl border border-border p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <card.icon size={20} strokeWidth={1.75} />
              </div>
            </div>
            <p className="text-2xl font-bold font-heading text-foreground">{card.value}</p>
            <p className="text-sm text-[var(--color-body)] mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-bold font-heading text-foreground">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View all <ArrowUpRight size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            No orders yet. Orders will appear here once customers start buying.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between gap-4 p-6">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {order.user?.name ?? order.user?.email ?? "Guest"} · {order.orderItems.length} items
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-semibold text-foreground">₹{order.totalAmount}</span>
                  <Badge variant={statusVariant[order.status] ?? "secondary"}>{order.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
