import { Ticket } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CouponsTable } from "@/components/admin/CouponsTable";

export const metadata = {
  title: "Coupons · Admin",
};

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: coupons.length,
    active: coupons.filter((c) => c.isActive && new Date(c.expiryDate) > new Date()).length,
    expired: coupons.filter((c) => new Date(c.expiryDate) <= new Date()).length,
  };

  return (
    <div className="p-6 sm:p-10">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
          Coupons & Promotions
        </h1>
        <p className="text-[var(--color-body)] mt-1">
          {stats.total} coupon{stats.total !== 1 ? "s" : ""} · {stats.active} active · {stats.expired} expired
        </p>
      </header>

      {coupons.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
            <Ticket size={30} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground mb-1">No coupons yet</h2>
          <p className="text-[var(--color-body)] max-w-sm mb-6">
            Create discount codes for festivals, first-order discounts, and promotions.
          </p>
        </div>
      ) : (
        <CouponsTable coupons={coupons} />
      )}
    </div>
  );
}
