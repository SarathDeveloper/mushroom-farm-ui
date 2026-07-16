import Link from "next/link";
import { PackageSearch, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { OrderFilters } from "@/components/admin/OrderFilters";
import { OrderBulkActions } from "@/components/admin/OrderBulkActions";
import { Pagination } from "@/components/admin/Pagination";

export const metadata = {
  title: "Orders · Admin",
};

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
  const searchQuery = searchParams?.q as string | undefined;
  const page = Math.max(1, Number(searchParams?.page) || 1);
  const perPage = 20;

  // Build Prisma where clause for database-level filtering
  const where: Record<string, unknown> = {};

  if (searchQuery) {
    where.OR = [
      { id: { contains: searchQuery, mode: "insensitive" } },
      { user: { name: { contains: searchQuery, mode: "insensitive" } } },
      { user: { email: { contains: searchQuery, mode: "insensitive" } } },
    ];
  }

  if (statusFilter && statusFilter !== "all") {
    where.status = statusFilter;
  }

  if (dateFilter) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateFilter === "today") {
      where.createdAt = { gte: today };
    } else if (dateFilter === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      where.createdAt = { gte: weekAgo };
    } else if (dateFilter === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      where.createdAt = { gte: monthAgo };
    }
  }

  let orders: any[] = [];
  let totalCount = 0;
  try {
    [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          user: { select: { name: true, email: true, phone: true } },
          orderItems: { include: { product: { select: { name: true, images: true } } } },
        },
      }),
      prisma.order.count({ where }),
    ]);
  } catch {
    orders = [];
  }
  const totalPages = Math.ceil(totalCount / perPage);

  // City filtering stays client-side (requires JSON parsing of shippingAddress)
  let filtered = orders;
  if (cityFilter && cityFilter !== "all") {
    filtered = filtered.filter((o) => {
      const addr = parseShippingAddress(o.shippingAddress);
      return addr.city?.toLowerCase().includes(cityFilter.toLowerCase());
    });
  }

  // Get unique cities for filter (from all fetched orders)
  const cities = [
    ...new Set(
      orders
        .map((o) => parseShippingAddress(o.shippingAddress).city)
        .filter((city): city is string => Boolean(city))
    ),
  ];

  // Stats from unfiltered count (for the header summary)
  let totalOrders = 0;
  let pendingOrders = 0;
  let processingOrders = 0;
  let shippedOrders = 0;
  try {
    [totalOrders, pendingOrders, processingOrders, shippedOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "PROCESSING" } }),
      prisma.order.count({ where: { status: "SHIPPED" } }),
    ]);
  } catch {
    // fallback to 0
  }

  const stats = {
    total: totalOrders,
    pending: pendingOrders,
    processing: processingOrders,
    shipped: shippedOrders,
  };

  // Serialize orders for client component
  const serializedOrders = filtered.map((o: any) => ({
    id: o.id,
    status: o.status,
    paymentStatus: o.paymentStatus,
    totalAmount: o.totalAmount as number,
    createdAt: o.createdAt.toISOString(),
    shippingAddress: o.shippingAddress,
    user: o.user ? { name: o.user.name, email: o.user.email } : null,
    orderItems: o.orderItems.map((item: any) => ({ id: item.id })),
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-heading text-foreground">Orders</h1>
          <p className="text-[var(--color-body)] mt-1 text-xs sm:text-sm">
            {stats.total} total · {stats.pending} pending · {stats.processing} processing · {stats.shipped} shipped
          </p>
        </div>
        <Link href="/admin/orders/new">
          <Button className="gap-2 w-full sm:w-auto">
            <Plus size={18} /> Create Order
          </Button>
        </Link>
      </header>

      <OrderFilters cities={cities} />

      {filtered.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
            <PackageSearch size={30} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground mb-1">No orders found</h2>
          <p className="text-[var(--color-body)] max-w-sm">
            {statusFilter || dateFilter || cityFilter || searchQuery
              ? "Try adjusting your filters."
              : "Orders will appear here once customers start buying."}
          </p>
        </div>
      ) : (
        <>
          <OrderBulkActions orders={serializedOrders} />
          <Pagination currentPage={page} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
