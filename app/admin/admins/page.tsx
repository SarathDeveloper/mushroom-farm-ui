import { ShieldCheck } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminsTable } from "@/components/admin/AdminsTable";

export const metadata = {
  title: "Admin Users · Admin",
};

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: admins.length,
    active: admins.filter((a) => a.isActive).length,
    deactivated: admins.filter((a) => !a.isActive).length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
          Admin Users
        </h1>
        <p className="text-[var(--color-body)] mt-1 text-sm sm:text-base">
          {stats.total} admin{stats.total !== 1 ? "s" : ""} · {stats.active}{" "}
          active · {stats.deactivated} deactivated
        </p>
      </header>

      {admins.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
            <ShieldCheck size={30} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-foreground mb-1">
            No admin users yet
          </h2>
          <p className="text-[var(--color-body)] max-w-sm mb-6">
            Add admin users to manage your store.
          </p>
        </div>
      ) : (
        <AdminsTable admins={admins} currentUserId={session!.user.id} />
      )}
    </div>
  );
}
