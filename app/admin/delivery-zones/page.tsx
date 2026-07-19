import { Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeliveryZonesTable } from "@/components/admin/DeliveryZonesTable";
import { Pagination } from "@/components/admin/Pagination";

export const metadata = {
  title: "Delivery Zones · Admin",
};

export default async function AdminDeliveryZonesPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, Number(searchParams?.page) || 1);
  const perPage = 20;

  const [zones, totalCount] = await Promise.all([
    prisma.deliveryZone.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.deliveryZone.count(),
  ]);

  const totalPages = Math.ceil(totalCount / perPage);

  const stats = {
    total: totalCount,
    active: zones.filter((z) => z.isActive).length,
    inactive: zones.filter((z) => !z.isActive).length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
          Delivery Zones & Charges
        </h1>
        <p className="text-[var(--color-body)] mt-1 text-sm sm:text-base">
          {stats.total} zone{stats.total !== 1 ? "s" : ""} · {stats.active} active · {stats.inactive} inactive
        </p>
      </header>

      {zones.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
            <Truck size={30} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-foreground mb-1">No delivery zones yet</h2>
          <p className="text-[var(--color-body)] max-w-sm mb-6">
            Create delivery rules based on pincodes to manage shipping charges and free delivery thresholds.
          </p>
          <DeliveryZonesTable zones={[]} emptyState />
        </div>
      ) : (
        <>
          <DeliveryZonesTable zones={zones} />
          {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} />}
        </>
      )}
    </div>
  );
}
