import { Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CustomersTable } from "@/components/admin/CustomersTable";

export const metadata = {
  title: "Customers · Admin",
};

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "USER" },
    include: {
      _count: { select: { orders: true } },
      orders: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true, totalAmount: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const customersWithData = customers.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    image: c.image,
    orderCount: c._count.orders,
    lastOrder: c.orders[0] || null,
    createdAt: c.createdAt,
  }));

  // Calculate stats
  const totalRevenue = await prisma.order.aggregate({
    _sum: { totalAmount: true },
    where: { paymentStatus: "COMPLETED" },
  });

  const stats = {
    total: customers.length,
    withOrders: customers.filter((c) => c._count.orders > 0).length,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-foreground">
          Customers
        </h1>
        <p className="text-[var(--color-body)] mt-1 text-xs sm:text-sm">
          {stats.total} customer{stats.total !== 1 ? "s" : ""} · {stats.withOrders} with orders ·{" "}
          ₹{stats.totalRevenue.toLocaleString("en-IN")} total revenue
        </p>
      </header>

      {customers.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
            <Users size={30} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground mb-1">No customers yet</h2>
          <p className="text-[var(--color-body)] max-w-sm">
            Customers will appear here once they create accounts.
          </p>
        </div>
      ) : (
        <CustomersTable customers={customersWithData} />
      )}
    </div>
  );
}
