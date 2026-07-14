import { GraduationCap, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { TrainingTable } from "@/components/admin/TrainingTable";

export const metadata = {
  title: "Training Programs · Admin",
};

export default async function AdminTrainingPage() {
  const programs = await prisma.training.findMany({
    include: {
      _count: { select: { registrations: true } },
      registrations: {
        include: { user: { select: { id: true, name: true, email: true, phone: true } } },
      },
    },
    orderBy: { startDate: "desc" },
  });

  const programsWithData = programs.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    modules: p.modules,
    fees: p.fees,
    duration: p.duration,
    trainer: p.trainer,
    startDate: p.startDate,
    status: p.status,
    image: p.image,
    maxCapacity: p.maxCapacity,
    registrationCount: p._count.registrations,
    registrations: p.registrations.map((r) => ({
      id: r.id,
      status: r.status,
      paymentId: r.paymentId,
      createdAt: r.createdAt,
      user: r.user,
    })),
  }));

  const stats = {
    total: programs.length,
    upcoming: programs.filter((p) => p.status === "UPCOMING").length,
    ongoing: programs.filter((p) => p.status === "ONGOING").length,
    completed: programs.filter((p) => p.status === "COMPLETED").length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-foreground">
            Training Programs
          </h1>
          <p className="text-[var(--color-body)] mt-1 text-xs sm:text-sm">
            {stats.total} program{stats.total !== 1 ? "s" : ""} · {stats.upcoming} upcoming · {stats.ongoing} ongoing
          </p>
        </div>
      </header>

      {programs.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
            <GraduationCap size={30} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground mb-1">No training programs</h2>
          <p className="text-[var(--color-body)] max-w-sm mb-6">
            Create training programs for mushroom farming education.
          </p>
        </div>
      ) : (
        <TrainingTable programs={programsWithData} />
      )}
    </div>
  );
}
