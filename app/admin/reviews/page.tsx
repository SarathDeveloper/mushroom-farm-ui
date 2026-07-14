import { MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ReviewsTable } from "@/components/admin/ReviewsTable";

export const metadata = {
  title: "Reviews · Admin",
};

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      product: { select: { id: true, name: true, slug: true, images: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: reviews.length,
    pending: reviews.filter((r) => !r.isApproved).length,
    approved: reviews.filter((r) => r.isApproved).length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-foreground">
          Reviews
        </h1>
        <p className="text-[var(--color-body)] mt-1 text-xs sm:text-sm">
          {stats.total} review{stats.total !== 1 ? "s" : ""} · {stats.pending} pending · {stats.approved} approved
        </p>
      </header>

      {reviews.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
            <MessageSquare size={30} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground mb-1">No reviews yet</h2>
          <p className="text-[var(--color-body)] max-w-sm">
            Customer reviews will appear here for moderation.
          </p>
        </div>
      ) : (
        <ReviewsTable reviews={reviews} />
      )}
    </div>
  );
}
