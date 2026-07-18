import { prisma } from "@/lib/prisma";
import { InquiriesTable } from "@/components/admin/InquiriesTable";

export const metadata = {
  title: "Inquiries | Admin Dashboard",
};

export default async function InquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unhandledCount = inquiries.filter((i: any) => !i.isHandled).length;

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">Inquiries & Leads</h1>
        <p className="text-base text-muted-foreground mt-1">
          Manage contact form submissions and training registrations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-4">
          <p className="text-sm font-medium text-muted-foreground mb-1">Total Inquiries</p>
          <p className="text-lg md:text-xl font-bold text-foreground truncate">{inquiries.length}</p>
        </div>
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-4">
          <p className="text-sm font-medium text-amber-600 mb-1">Pending Follow-up</p>
          <p className="text-lg md:text-xl font-bold text-amber-600 truncate">{unhandledCount}</p>
        </div>
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-4">
          <p className="text-sm font-medium text-green-600 mb-1">Handled</p>
          <p className="text-lg md:text-xl font-bold text-green-600 truncate">{inquiries.length - unhandledCount}</p>
        </div>
      </div>

      <InquiriesTable initialData={inquiries} />
    </div>
  );
}
