import { prisma } from "@/lib/prisma";
import { SalesChart } from "@/components/admin/SalesChart";
import { TopProductsChart } from "@/components/admin/TopProductsChart";

export const metadata = {
  title: "Analytics · Admin",
};

export default async function AdminAnalyticsPage() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Fetch completed orders from last 30 days for revenue chart
  const recentOrders = await prisma.order.findMany({
    where: {
      paymentStatus: "COMPLETED",
      createdAt: { gte: thirtyDaysAgo },
    },
    select: { totalAmount: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  // Group by date
  const revenueByDay: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    revenueByDay[key] = 0;
  }
  for (const order of recentOrders) {
    const key = new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    if (key in revenueByDay) {
      revenueByDay[key] += order.totalAmount;
    }
  }
  const salesData = Object.entries(revenueByDay).map(([date, revenue]) => ({
    date,
    revenue: Math.round(revenue),
  }));

  // Top selling products
  const topProductsRaw = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 10,
  });

  const productIds = topProductsRaw.map((p) => p.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p.name]));

  const topProductsData = topProductsRaw.map((p) => ({
    name: productMap.get(p.productId) || "Unknown",
    quantity: p._sum.quantity || 0,
  }));

  // Summary stats
  const [totalRevenue, totalOrders, avgOrderValue] = await Promise.all([
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: "COMPLETED" },
    }),
    prisma.order.count({ where: { paymentStatus: "COMPLETED" } }),
    prisma.order.aggregate({
      _avg: { totalAmount: true },
      where: { paymentStatus: "COMPLETED" },
    }),
  ]);

  const stats = {
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    totalOrders,
    avgOrderValue: Math.round(avgOrderValue._avg.totalAmount || 0),
    last30Revenue: recentOrders.reduce((sum, o) => sum + o.totalAmount, 0),
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-xl md:text-2xl font-bold font-heading text-foreground">
          Analytics
        </h1>
        <p className="text-[var(--color-body)] mt-1 text-xs sm:text-sm">
          Sales performance and product insights
        </p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-card rounded-xl border border-border p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] min-w-0">
          <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-base md:text-lg font-bold text-foreground truncate">
            ₹{stats.totalRevenue.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] min-w-0">
          <p className="text-xs text-muted-foreground mb-1">Last 30 Days</p>
          <p className="text-base md:text-lg font-bold text-foreground truncate">
            ₹{Math.round(stats.last30Revenue).toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] min-w-0">
          <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
          <p className="text-base md:text-lg font-bold text-foreground truncate">{stats.totalOrders}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] min-w-0">
          <p className="text-xs text-muted-foreground mb-1">Avg Order Value</p>
          <p className="text-base md:text-lg font-bold text-foreground truncate">
            ₹{stats.avgOrderValue.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <SalesChart data={salesData} />
        <TopProductsChart data={topProductsData} />
      </div>
    </div>
  );
}
