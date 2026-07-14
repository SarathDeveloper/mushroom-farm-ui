"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { updatePaymentStatus } from "@/app/admin/actions";
import type { PaymentStatus } from "@/lib/status-types";

const statuses: PaymentStatus[] = ["PENDING", "COMPLETED", "FAILED", "REFUNDED"];

const statusColors: Record<PaymentStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
  FAILED: "bg-red-100 text-red-800 border-red-200",
  REFUNDED: "bg-gray-100 text-gray-800 border-gray-200",
};

export function PaymentStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: PaymentStatus;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as PaymentStatus;
    if (newStatus === currentStatus) return;

    startTransition(async () => {
      const result = await updatePaymentStatus(orderId, newStatus);
      if (result.success) {
        toast.success(`Payment status updated to ${newStatus}`);
      } else {
        toast.error(result.error || "Failed to update payment status");
      }
    });
  }

  return (
    <div className="relative inline-flex items-center">
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={isPending}
        className={`appearance-none px-3 py-1.5 pr-8 rounded-full text-xs font-bold border cursor-pointer outline-none ${statusColors[currentStatus]}`}
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {isPending && (
        <Loader2 size={14} className="absolute right-2 animate-spin text-muted-foreground" />
      )}
    </div>
  );
}
