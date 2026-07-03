import { PackageSearch } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Orders · Admin",
};

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

async function getOrders() {
  try {
    return await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } }, orderItems: true },
    });
  } catch {
    return [];
  }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="p-6 sm:p-10">
      <header className="mb-10">
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">Orders</h1>
        <p className="text-[var(--color-body)] mt-1">
          {orders.length} order{orders.length !== 1 && "s"} placed to date.
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
            <PackageSearch size={30} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground mb-1">No orders yet</h2>
          <p className="text-[var(--color-body)] max-w-sm">
            Once customers start placing orders, they&apos;ll show up in this table.
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-[var(--color-body)]">
                  <th className="font-semibold px-6 py-4">Order ID</th>
                  <th className="font-semibold px-6 py-4">Customer</th>
                  <th className="font-semibold px-6 py-4">Date</th>
                  <th className="font-semibold px-6 py-4">Items</th>
                  <th className="font-semibold px-6 py-4">Total</th>
                  <th className="font-semibold px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-[var(--color-body)]">
                      {order.user?.name ?? order.user?.email ?? "Guest"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4 text-[var(--color-body)]">{order.orderItems.length}</td>
                    <td className="px-6 py-4 font-semibold text-primary">₹{order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant[order.status] ?? "secondary"}>{order.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
