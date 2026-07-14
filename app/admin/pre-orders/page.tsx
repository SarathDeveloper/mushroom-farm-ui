import { CalendarCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PreOrdersTable } from "@/components/admin/PreOrdersTable";

export const metadata = {
  title: "Pre Orders · Admin",
};

export default async function AdminPreOrdersPage() {
  const preOrders = await prisma.preOrder.findMany({
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: preOrders.length,
    pending: preOrders.filter((o) => !o.isHandled).length,
    handled: preOrders.filter((o) => o.isHandled).length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-foreground">
          Pre-Order Mushrooms
        </h1>
        <p className="text-[var(--color-body)] mt-1 text-xs sm:text-sm">
          {stats.total} request{stats.total !== 1 ? "s" : ""} · {stats.pending} pending ·{" "}
          {stats.handled} handled
        </p>
      </header>

      {preOrders.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
            <CalendarCheck size={30} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground mb-1">
            No pre-order requests
          </h2>
          <p className="text-[var(--color-body)] max-w-sm">
            Customer pre-orders will appear here when someone submits the form.
          </p>
        </div>
      ) : (
        <PreOrdersTable
          orders={preOrders.map((order) => ({
            ...order,
            createdAt: order.createdAt.toISOString(),
          }))}
        />
      )}
    </div>
  );
}
