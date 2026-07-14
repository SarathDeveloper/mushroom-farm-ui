import Link from "next/link";
import { PackageSearch, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { OrderFilters } from "@/components/admin/OrderFilters";

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

const paymentVariant: Record<
  string,
  "default" | "secondary" | "success" | "warning" | "destructive"
> = {
  PENDING: "warning",
  COMPLETED: "success",
  FAILED: "destructive",
  REFUNDED: "secondary",
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function parseShippingAddress(json: string): { city?: string } {
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}

export default async function AdminOrdersPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const statusFilter = searchParams?.status as string | undefined;
  const dateFilter = searchParams?.date as string | undefined;
  const cityFilter = searchParams?.city as string | undefined;

  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        orderItems: { include: { product: { select: { name: true, images: true } } } },
      },
    });
  } catch {
    orders = [];
  }

  // Apply filters
  let filtered = orders;
  if (statusFilter && statusFilter !== "all") {
    filtered = filtered.filter((o) => o.status === statusFilter);
  }
  if (dateFilter) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateFilter === "today") {
      filtered = filtered.filter((o) => new Date(o.createdAt) >= today);
    } else if (dateFilter === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter((o) => new Date(o.createdAt) >= weekAgo);
    } else if (dateFilter === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter((o) => new Date(o.createdAt) >= monthAgo);
    }
  }
  if (cityFilter && cityFilter !== "all") {
    filtered = filtered.filter((o) => {
      const addr = parseShippingAddress(o.shippingAddress);
      return addr.city?.toLowerCase().includes(cityFilter.toLowerCase());
    });
  }

  // Get unique cities for filter
  const cities = [...new Set(orders.map((o) => parseShippingAddress(o.shippingAddress).city).filter(Boolean))];

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    processing: orders.filter((o) => o.status === "PROCESSING").length,
    shipped: orders.filter((o) => o.status === "SHIPPED").length,
  };

  return (
    <div className="p-6 sm:p-10">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">Orders</h1>
        <p className="text-[var(--color-body)] mt-1">
          {orders.length} total · {stats.pending} pending · {stats.processing} processing · {stats.shipped} shipped
        </p>
      </header>

      <OrderFilters cities={cities} />

      {filtered.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
            <PackageSearch size={30} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground mb-1">No orders found</h2>
          <p className="text-[var(--color-body)] max-w-sm">
            {statusFilter || dateFilter || cityFilter
              ? "Try adjusting your filters."
              : "Orders will appear here once customers start buying."}
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-[var(--color-body)]">
                  <th className="font-semibold px-6 py-4">Order</th>
                  <th className="font-semibold px-6 py-4">Customer</th>
                  <th className="font-semibold px-6 py-4">City</th>
                  <th className="font-semibold px-6 py-4">Date</th>
                  <th className="font-semibold px-6 py-4">Items</th>
                  <th className="font-semibold px-6 py-4">Total</th>
                  <th className="font-semibold px-6 py-4">Payment</th>
                  <th className="font-semibold px-6 py-4">Status</th>
                  <th className="font-semibold px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((order: any) => {
                  const addr = parseShippingAddress(order.shippingAddress);
                  return (
                    <tr key={order.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {order.user?.name || "Guest"}
                          </p>
                          <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[var(--color-body)]">
                        {addr.city || "—"}
                      </td>
                      <td className="px-6 py-4 text-[var(--color-body)]">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-[var(--color-body)]">
                        {order.orderItems.length}
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={paymentVariant[order.paymentStatus] ?? "secondary"}>
                          {order.paymentStatus}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <OrderStatusSelect
                          orderId={order.id}
                          currentStatus={order.status}
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="h-8 gap-1.5">
                            <Eye size={14} /> View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
