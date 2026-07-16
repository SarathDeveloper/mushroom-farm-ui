import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, CreditCard, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/SafeImage";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { PaymentStatusSelect } from "@/components/admin/PaymentStatusSelect";
import { OrderActions } from "@/components/admin/OrderActions";
import { OrderNotes } from "@/components/admin/OrderNotes";

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return { title: `Order #${id.slice(0, 8).toUpperCase()} · Admin` };
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseShippingAddress(json: string) {
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}

export default async function OrderDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      orderItems: {
        include: {
          product: { select: { id: true, name: true, slug: true, images: true, weight: true } },
        },
      },
      notes: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) notFound();

  const addr = parseShippingAddress(order.shippingAddress);

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl">
      <header className="mb-6 sm:mb-8">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-body)] hover:text-primary mb-3 sm:mb-4"
        >
          <ArrowLeft size={16} /> Back to orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold font-heading text-foreground">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-[var(--color-body)] mt-1 text-xs sm:text-sm">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <OrderActions order={order} address={addr} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="font-heading font-semibold text-foreground flex items-center gap-2">
                <Package size={18} /> Order Items ({order.orderItems.length})
              </h2>
            </div>
            <div className="divide-y divide-border">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-5">
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 bg-secondary">
                    <SafeImage
                      src={item.product.images[0] || ""}
                      alt={item.product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/shop/${item.product.slug}`}
                      className="font-semibold text-foreground hover:text-primary line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {item.product.weight} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-foreground">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ₹{item.price} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 bg-secondary/30 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
              {order.couponCode && (
                <p className="text-sm text-muted-foreground mt-1">
                  Coupon applied: <span className="font-medium">{order.couponCode}</span>
                </p>
              )}
            </div>
          </section>

          {/* Shipping Address */}
          <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-5">
            <h2 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-4">
              <MapPin size={18} /> Shipping Address
            </h2>
            <div className="text-[var(--color-body)] space-y-1">
              {addr.name && <p className="font-semibold text-foreground">{addr.name}</p>}
              {addr.street && <p>{addr.street}</p>}
              <p>
                {[addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}
              </p>
              {addr.country && <p>{addr.country}</p>}
            </div>
            {addr.deliverySlot && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">Delivery Slot</p>
                <p className="font-medium text-foreground">{addr.deliverySlot}</p>
              </div>
            )}
            {addr.notes && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="text-foreground">{addr.notes}</p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-5">
            <h2 className="font-heading font-semibold text-foreground mb-4">Order Status</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Status</p>
                <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Payment</p>
                <PaymentStatusSelect orderId={order.id} currentStatus={order.paymentStatus} />
              </div>
            </div>
          </section>

          {/* Customer */}
          <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-5">
            <h2 className="font-heading font-semibold text-foreground mb-4">Customer</h2>
            <div className="space-y-3">
              <p className="font-semibold text-foreground">{order.user?.name || "Guest"}</p>
              {order.user?.email && (
                <a
                  href={`mailto:${order.user.email}`}
                  className="flex items-center gap-2 text-sm text-[var(--color-body)] hover:text-primary"
                >
                  <Mail size={14} /> {order.user.email}
                </a>
              )}
              {order.user?.phone && (
                <a
                  href={`tel:${order.user.phone}`}
                  className="flex items-center gap-2 text-sm text-[var(--color-body)] hover:text-primary"
                >
                  <Phone size={14} /> {order.user.phone}
                </a>
              )}
              {addr.phone && !order.user?.phone && (
                <a
                  href={`tel:${addr.phone}`}
                  className="flex items-center gap-2 text-sm text-[var(--color-body)] hover:text-primary"
                >
                  <Phone size={14} /> {addr.phone}
                </a>
              )}
            </div>
          </section>

          {/* Payment Info */}
          <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-5">
            <h2 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-4">
              <CreditCard size={18} /> Payment Info
            </h2>
            <div className="space-y-2 text-sm">
              {order.razorpayOrderId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Razorpay Order</span>
                  <span className="font-mono text-xs text-foreground">{order.razorpayOrderId}</span>
                </div>
              )}
              {order.paymentId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="font-mono text-xs text-foreground">{order.paymentId}</span>
                </div>
              )}
            </div>
          </section>

          {/* Timeline */}
          <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-5">
            <h2 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-4">
              <Calendar size={18} /> Timeline
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="text-foreground">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span className="text-foreground">{formatDate(order.updatedAt)}</span>
              </div>
            </div>
          </section>

          {/* Admin Notes */}
          <OrderNotes
            orderId={order.id}
            notes={order.notes.map((n) => ({
              id: n.id,
              content: n.content,
              createdAt: n.createdAt.toISOString(),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
