"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, Trash2, Loader2, Star, Filter } from "lucide-react";
import toast from "react-hot-toast";

import { SafeImage } from "@/components/SafeImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateReviewApproval, deleteReview } from "@/app/admin/actions";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  isApproved: boolean;
  createdAt: Date;
  user: { id: string; name: string | null; email: string | null };
  product: { id: string; name: string; slug: string; images: string[] };
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

export function ReviewsTable({ reviews }: { reviews: Review[] }) {
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = reviews.filter((r) => {
    if (filter === "pending") return !r.isApproved;
    if (filter === "approved") return r.isApproved;
    return true;
  });

  function handleToggle(review: Review) {
    startTransition(async () => {
      const result = await updateReviewApproval(review.id, !review.isApproved);
      if (result.success) {
        toast.success(review.isApproved ? "Review hidden" : "Review approved");
      } else {
        toast.error(result.error || "Failed to update");
      }
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteReview(deleteTarget.id);
      if (result.success) {
        toast.success("Review deleted");
        setDeleteTarget(null);
      } else {
        toast.error(result.error || "Failed to delete");
      }
    });
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Filter size={18} className="text-muted-foreground" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="h-9 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
        >
          <option value="all">All Reviews</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((review) => (
          <div
            key={review.id}
            className={`bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-5 ${!review.isApproved ? "border-yellow-200 bg-yellow-50/30" : ""}`}
          >
            <div className="flex gap-4">
              {/* Product Image */}
              <Link href={`/shop/${review.product.slug}`} className="shrink-0">
                <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-secondary">
                  <SafeImage
                    src={review.product.images[0] || ""}
                    alt={review.product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              </Link>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StarRating rating={review.rating} />
                      <Badge variant={review.isApproved ? "success" : "warning"}>
                        {review.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                    <Link
                      href={`/shop/${review.product.slug}`}
                      className="font-semibold text-foreground hover:text-primary"
                    >
                      {review.product.name}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleToggle(review)}
                      disabled={isPending}
                      title={review.isApproved ? "Hide review" : "Approve review"}
                    >
                      {review.isApproved ? <XCircle size={14} /> : <CheckCircle size={14} />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(review)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>

                {review.comment && (
                  <p className="text-[var(--color-body)] mt-2">{review.comment}</p>
                )}

                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span>By {review.user.name || review.user.email || "User"}</span>
                  <span>·</span>
                  <span>{formatDate(review.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No reviews found for this filter.
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Delete Review</DialogTitle>
          <p className="text-sm text-[var(--color-body)] mt-2">
            Are you sure you want to delete this review from <strong className="text-foreground">{deleteTarget?.user.name || deleteTarget?.user.email || "this user"}</strong>?
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isPending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending && <Loader2 className="animate-spin mr-2" size={16} />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
