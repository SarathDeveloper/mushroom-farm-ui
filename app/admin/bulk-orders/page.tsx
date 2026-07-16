import { Building2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BulkOrdersTable } from "@/components/admin/BulkOrdersTable";

export const metadata = {
  title: "Bulk Orders · Admin",
};

export default async function AdminBulkOrdersPage() {
  const bulkOrders = await prisma.bulkOrder.findMany({
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: bulkOrders.length,
    pending: bulkOrders.filter((o) => !o.isHandled).length,
    handled: bulkOrders.filter((o) => o.isHandled).length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-xl md:text-2xl font-bold font-heading text-foreground">
          Bulk Orders (B2B)
        </h1>
        <p className="text-[var(--color-body)] mt-1 text-xs sm:text-sm">
          {stats.total} enquir{stats.total !== 1 ? "ies" : "y"} · {stats.pending} pending · {stats.handled} handled
        </p>
      </header>

      {bulkOrders.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
            <Building2 size={30} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground mb-1">No bulk order enquiries</h2>
          <p className="text-[var(--color-body)] max-w-sm">
            B2B enquiries will appear here when businesses contact you.
          </p>
        </div>
      ) : (
        <BulkOrdersTable orders={bulkOrders} />
      )}
    </div>
  );
}
