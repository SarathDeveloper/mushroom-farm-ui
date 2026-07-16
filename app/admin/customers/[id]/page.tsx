import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar, ShoppingBag, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/SafeImage";

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const user = await prisma.user.findUnique({ where: { id }, select: { name: true, email: true } });
  return { title: `${user?.name || user?.email || "Customer"} · Admin` };
}

const statusVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  PENDING: "warning",
  PROCESSING: "secondary",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
};

const paymentVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
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

export default async function CustomerDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          orderItems: { include: { product: { select: { name: true } } } },
        },
      },
      addresses: true,
    },
  });

  if (!customer) notFound();

  const totalSpent = customer.orders
    .filter((o) => o.paymentStatus === "COMPLETED")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const orderCount = customer.orders.length;
  const avgOrderValue = orderCount > 0 ? Math.round(totalSpent / orderCount) : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl">
      <header className="mb-6 sm:mb-8">
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-body)] hover:text-primary mb-3 sm:mb-4"
        >
          <ArrowLeft size={16} /> Back to customers
        </Link>
        <div className="flex items-center gap-4">
          {customer.image ? (
            <div className="relative h-14 w-14 rounded-full overflow-hidden shrink-0 bg-secondary">
              <SafeImage
                src={customer.image}
                alt={customer.name || ""}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shrink-0">
              {customer.name?.[0]?.toUpperCase() || customer.email[0].toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-xl md:text-2xl font-bold font-heading text-foreground">
              {customer.name || "Unnamed Customer"}
            </h1>
            <p className="text-[var(--color-body)] mt-0.5 text-xs sm:text-sm">
              Customer since {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main - Order History */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-heading font-semibold text-foreground flex items-center gap-2">
                <ShoppingBag size={18} /> Order History ({orderCount})
              </h2>
            </div>
            {customer.orders.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No orders yet.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {customer.orders.map((order) => (
                  <div key={order.id} className="p-5 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground text-sm">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <Badge variant={statusVariant[order.status] ?? "secondary"} className="text-[10px]">
                          {order.status}
                        </Badge>
                        <Badge variant={paymentVariant[order.paymentStatus] ?? "secondary"} className="text-[10px]">
                          {order.paymentStatus}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)} · {order.orderItems.length} item{order.orderItems.length !== 1 && "s"} ·{" "}
                        {order.orderItems.map((i) => i.product.name).join(", ")}
                      </p>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-3">
                      <span className="font-bold text-foreground">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </span>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Eye size={14} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-5">
            <h2 className="font-heading font-semibold text-foreground mb-4">Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Spent</span>
                <span className="font-bold text-foreground">₹{totalSpent.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Orders</span>
                <span className="font-bold text-foreground">{orderCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Order Value</span>
                <span className="font-bold text-foreground">₹{avgOrderValue.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-5">
            <h2 className="font-heading font-semibold text-foreground mb-4">Contact</h2>
            <div className="space-y-3">
              <a
                href={`mailto:${customer.email}`}
                className="flex items-center gap-2 text-sm text-[var(--color-body)] hover:text-primary"
              >
                <Mail size={14} /> {customer.email}
              </a>
              {customer.phone && (
                <a
                  href={`tel:${customer.phone}`}
                  className="flex items-center gap-2 text-sm text-[var(--color-body)] hover:text-primary"
                >
                  <Phone size={14} /> {customer.phone}
                </a>
              )}
              <div className="flex items-center gap-2 text-sm text-[var(--color-body)]">
                <Calendar size={14} /> Joined {formatDate(customer.createdAt)}
              </div>
            </div>
          </section>

          {/* Addresses */}
          {customer.addresses.length > 0 && (
            <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-5">
              <h2 className="font-heading font-semibold text-foreground mb-4">Addresses</h2>
              <div className="space-y-3">
                {customer.addresses.map((addr) => (
                  <div key={addr.id} className="text-sm text-[var(--color-body)] p-3 rounded-lg bg-secondary/50">
                    <p className="font-medium text-foreground mb-0.5">{addr.type}</p>
                    <p>{addr.street}</p>
                    <p>{addr.city}, {addr.state} {addr.pincode}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
