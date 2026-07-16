import Link from "next/link";
import {
  ArrowUpRight,
  IndianRupee,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  Building2,
  CalendarCheck,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Clock,
  Truck,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/SafeImage";

async function getDashboardData() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  try {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      todayOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      thisWeekOrders,
      lastWeekOrders,
      lowStockProducts,
      outOfStockProducts,
      pendingBulkOrders,
      pendingPreOrders,
      pendingRegistrations,
      recentOrders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "PROCESSING" } }),
      prisma.order.count({ where: { status: "SHIPPED" } }),
      prisma.order.findMany({
        where: { createdAt: { gte: weekStart }, paymentStatus: "COMPLETED" },
        select: { totalAmount: true },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: lastWeekStart, lt: weekStart }, paymentStatus: "COMPLETED" },
        select: { totalAmount: true },
      }),
      prisma.product.findMany({
        where: {
          stock: { gt: 0 },
          isActive: true,
        },
        select: { id: true, name: true, stock: true, lowStockThreshold: true, images: true },
      }),
      prisma.product.count({ where: { stock: 0, isActive: true } }),
      prisma.bulkOrder.count({ where: { isHandled: false } }),
      prisma.preOrder.count({ where: { isHandled: false } }),
      prisma.trainingRegistration.count({ where: { status: "PENDING" } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: { select: { name: true, email: true } }, orderItems: true },
      }),
    ]);

    const thisWeekRevenue = thisWeekOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const lastWeekRevenue = lastWeekOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const revenueChange = lastWeekRevenue > 0
      ? ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100
      : thisWeekRevenue > 0 ? 100 : 0;

    const lowStock = lowStockProducts.filter((p) => p.stock <= p.lowStockThreshold);

    return {
      totalProducts,
      totalOrders,
      totalUsers,
      todayOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      thisWeekRevenue,
      lastWeekRevenue,
      revenueChange,
      lowStockCount: lowStock.length,
      lowStockProducts: lowStock.slice(0, 5),
      outOfStockCount: outOfStockProducts,
      pendingBulkOrders,
      pendingPreOrders,
      pendingRegistrations,
      recentOrders,
    };
  } catch (error) {
    console.error("Dashboard error:", error);
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      todayOrders: 0,
      pendingOrders: 0,
      processingOrders: 0,
      shippedOrders: 0,
      thisWeekRevenue: 0,
      lastWeekRevenue: 0,
      revenueChange: 0,
      lowStockCount: 0,
      lowStockProducts: [],
      outOfStockCount: 0,
      pendingBulkOrders: 0,
      pendingPreOrders: 0,
      pendingRegistrations: 0,
      recentOrders: [],
    };
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

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  const hasAlerts =
    data.pendingOrders > 0 ||
    data.lowStockCount > 0 ||
    data.outOfStockCount > 0 ||
    data.pendingBulkOrders > 0 ||
    data.pendingPreOrders > 0 ||
    data.pendingRegistrations > 0;

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-xl md:text-2xl font-bold font-heading text-foreground">
          Dashboard
        </h1>
        <p className="text-[var(--color-body)] mt-1 text-sm sm:text-base">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </header>

      {/* Alerts Section */}
      {hasAlerts && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {data.pendingOrders > 0 && (
            <Link
              href="/admin/orders?status=PENDING"
              className="flex items-center gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock size={18} className="text-yellow-700" />
              </div>
              <div>
                <p className="font-semibold text-yellow-800">
                  {data.pendingOrders} Pending Orders
                </p>
                <p className="text-xs text-yellow-600">Needs attention</p>
              </div>
            </Link>
          )}

          {data.processingOrders > 0 && (
            <Link
              href="/admin/orders?status=PROCESSING"
              className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Package size={18} className="text-blue-700" />
              </div>
              <div>
                <p className="font-semibold text-blue-800">
                  {data.processingOrders} To Pack
                </p>
                <p className="text-xs text-blue-600">Ready to ship</p>
              </div>
            </Link>
          )}

          {data.shippedOrders > 0 && (
            <Link
              href="/admin/orders?status=SHIPPED"
              className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Truck size={18} className="text-purple-700" />
              </div>
              <div>
                <p className="font-semibold text-purple-800">
                  {data.shippedOrders} In Transit
                </p>
                <p className="text-xs text-purple-600">Out for delivery</p>
              </div>
            </Link>
          )}

          {(data.lowStockCount > 0 || data.outOfStockCount > 0) && (
            <Link
              href="/admin/products"
              className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={18} className="text-red-700" />
              </div>
              <div>
                <p className="font-semibold text-red-800">
                  {data.outOfStockCount > 0
                    ? `${data.outOfStockCount} Out of Stock`
                    : `${data.lowStockCount} Low Stock`}
                </p>
                <p className="text-xs text-red-600">Restock needed</p>
              </div>
            </Link>
          )}

          {data.pendingBulkOrders > 0 && (
            <Link
              href="/admin/bulk-orders"
              className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Building2 size={18} className="text-orange-700" />
              </div>
              <div>
                <p className="font-semibold text-orange-800">
                  {data.pendingBulkOrders} B2B Enquiries
                </p>
                <p className="text-xs text-orange-600">Awaiting response</p>
              </div>
            </Link>
          )}

          {data.pendingPreOrders > 0 && (
            <Link
              href="/admin/pre-orders"
              className="flex items-center gap-3 p-4 rounded-xl bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <CalendarCheck size={18} className="text-teal-700" />
              </div>
              <div>
                <p className="font-semibold text-teal-800">
                  {data.pendingPreOrders} Pre-Orders
                </p>
                <p className="text-xs text-teal-600">Awaiting confirmation</p>
              </div>
            </Link>
          )}

          {data.pendingRegistrations > 0 && (
            <Link
              href="/admin/training"
              className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 hover:bg-green-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <GraduationCap size={18} className="text-green-700" />
              </div>
              <div>
                <p className="font-semibold text-green-800">
                  {data.pendingRegistrations} Training Registrations
                </p>
                <p className="text-xs text-green-600">Pending payment</p>
              </div>
            </Link>
          )}
        </div>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <ShoppingBag size={18} strokeWidth={1.75} />
            </div>
            <Badge variant="success" className="text-[10px] sm:text-xs">{data.todayOrders} today</Badge>
          </div>
          <p className="text-lg md:text-xl font-bold font-heading text-foreground">{data.totalOrders}</p>
          <p className="text-xs sm:text-sm text-[var(--color-body)] mt-0.5 sm:mt-1">Total Orders</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <IndianRupee size={18} strokeWidth={1.75} />
            </div>
            <div className={`flex items-center gap-1 text-[10px] sm:text-xs font-semibold ${
              data.revenueChange >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              {data.revenueChange >= 0 ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              {Math.abs(data.revenueChange).toFixed(0)}%
            </div>
          </div>
          <p className="text-lg md:text-xl font-bold font-heading text-foreground">
            ₹{data.thisWeekRevenue.toLocaleString("en-IN")}
          </p>
          <p className="text-xs sm:text-sm text-[var(--color-body)] mt-0.5 sm:mt-1">
            <span className="hidden sm:inline">This Week (vs ₹{data.lastWeekRevenue.toLocaleString("en-IN")} last week)</span>
            <span className="sm:hidden">This Week</span>
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Package size={18} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-lg md:text-xl font-bold font-heading text-foreground">{data.totalProducts}</p>
          <p className="text-xs sm:text-sm text-[var(--color-body)] mt-0.5 sm:mt-1">Products</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users size={18} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-lg md:text-xl font-bold font-heading text-foreground">{data.totalUsers}</p>
          <p className="text-xs sm:text-sm text-[var(--color-body)] mt-0.5 sm:mt-1">Customers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 border-b border-border">
            <h2 className="font-bold font-heading text-foreground text-sm sm:text-base">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:underline"
            >
              View all <ArrowUpRight size={14} />
            </Link>
          </div>

          {data.recentOrders.length === 0 ? (
            <p className="p-4 sm:p-6 text-sm text-muted-foreground">
              No orders yet. Orders will appear here once customers start buying.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {data.recentOrders.map((order: any) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {order.user?.name ?? order.user?.email ?? "Guest"} · {order.orderItems.length} items
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <span className="font-semibold text-foreground text-sm">₹{order.totalAmount}</span>
                    <Badge variant={statusVariant[order.status] ?? "secondary"} className="text-[10px] sm:text-xs">{order.status}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Products */}
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 border-b border-border">
            <h2 className="font-bold font-heading text-foreground text-sm sm:text-base">Low Stock</h2>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:underline"
            >
              Manage <ArrowUpRight size={14} />
            </Link>
          </div>

          {data.lowStockProducts.length === 0 ? (
            <p className="p-4 sm:p-6 text-sm text-muted-foreground">
              All products are well stocked.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {data.lowStockProducts.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}/edit`}
                  className="flex items-center gap-3 p-3 sm:p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-secondary shrink-0">
                    <SafeImage
                      src={product.images[0] || ""}
                      alt={product.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground text-sm truncate">{product.name}</p>
                    <p className={`text-xs font-medium ${product.stock === 0 ? "text-[#E56D6D]" : "text-[#E5B06D]"}`}>
                      {product.stock === 0 ? "Out of Stock" : `${product.stock} left · Low Stock`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
