import { Ticket } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CouponsTable } from "@/components/admin/CouponsTable";
import { Pagination } from "@/components/admin/Pagination";

export const metadata = {
  title: "Coupons · Admin",
};

export default async function AdminCouponsPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, Number(searchParams?.page) || 1);
  const perPage = 20;

  const [coupons, totalCount] = await Promise.all([
    prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.coupon.count(),
  ]);

  const totalPages = Math.ceil(totalCount / perPage);

  const stats = {
    total: totalCount,
    active: coupons.filter((c) => c.isActive && new Date(c.expiryDate) > new Date()).length,
    expired: coupons.filter((c) => new Date(c.expiryDate) <= new Date()).length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
          Coupons & Promotions
        </h1>
        <p className="text-[var(--color-body)] mt-1 text-sm sm:text-base">
          {stats.total} coupon{stats.total !== 1 ? "s" : ""} · {stats.active} active · {stats.expired} expired
        </p>
      </header>

      {coupons.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
            <Ticket size={30} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-foreground mb-1">No coupons yet</h2>
          <p className="text-[var(--color-body)] max-w-sm mb-6">
            Create discount codes for festivals, first-order discounts, and promotions.
          </p>
        </div>
      ) : (
        <>
          <CouponsTable coupons={coupons} />
          <Pagination currentPage={page} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
