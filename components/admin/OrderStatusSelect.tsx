"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { updateOrderStatus } from "@/app/admin/actions";
import type { OrderStatus } from "@/lib/status-types";

const statuses: OrderStatus[] = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusColors: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
  SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as OrderStatus;
    if (newStatus === currentStatus) return;

    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error(result.error || "Failed to update status");
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
