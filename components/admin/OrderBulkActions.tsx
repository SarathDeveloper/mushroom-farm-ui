"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { bulkUpdateOrderStatus } from "@/app/admin/actions";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";
import type { OrderStatus } from "@/lib/status-types";

type OrderData = {
  id: string;
  status: OrderStatus;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  shippingAddress: string;
  user: { name: string | null; email: string | null; phone: string | null } | null;
  orderItems: { id: string }[];
};

type Props = {
  orders: OrderData[];
};

const statusVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  PENDING: "warning",
  PROCESSING: "secondary",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
};

const paymentVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  PENDING: "warning",
  COMPLETED: "success",
  FAILED: "destructive",
  REFUNDED: "secondary",
};

const bulkStatuses: { value: OrderStatus; label: string }[] = [
  { value: "PROCESSING", label: "Mark Processing" },
  { value: "SHIPPED", label: "Mark Shipped" },
  { value: "DELIVERED", label: "Mark Delivered" },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function parseCity(json: string): string {
  try {
    return JSON.parse(json).city || "—";
  } catch {
    return "—";
  }
}

export function OrderBulkActions({ orders }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const allSelected = orders.length > 0 && selected.size === orders.length;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(orders.map((o) => o.id)));
    }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleBulkAction(status: OrderStatus) {
    const ids = Array.from(selected);
    startTransition(async () => {
      const res = await bulkUpdateOrderStatus(ids, status);
      if (res.success) {
        toast.success(`${ids.length} order(s) updated to ${status}`);
        setSelected(new Set());
      } else {
        toast.error(res.error || "Failed to update orders");
      }
    });
  }

  return (
    <>
      {/* Mobile card view */}
      <div className="space-y-3 md:hidden">
        {orders.map((order) => (
          <div key={order.id} className="bg-card rounded-xl border border-border p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                checked={selected.has(order.id)}
                onChange={() => toggle(order.id)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="font-bold text-foreground text-sm flex-1">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
              <Badge variant={statusVariant[order.status] ?? "secondary"} className="text-[10px]">
                {order.status}
              </Badge>
            </div>
            <div className="space-y-1.5 text-sm mb-3 pl-7">
              <p className="text-foreground font-medium">{order.user?.name || "Guest"}</p>
              <p className="text-xs text-muted-foreground">{order.user?.email || order.user?.phone || ""}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{formatDate(order.createdAt)}</span>
                <span>· {order.orderItems.length} items</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{formatCurrency(order.totalAmount)}</span>
                <Badge variant={paymentVariant[order.paymentStatus] ?? "secondary"} className="text-[10px]">
                  {order.paymentStatus}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                <Link href={`/admin/orders/${order.id}`}>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Eye size={14} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-[var(--color-body)]">
                <th className="px-4 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                </th>
                <th className="font-semibold px-6 py-4">Order</th>
                <th className="font-semibold px-6 py-4">Customer</th>
                <th className="font-semibold px-6 py-4">City</th>
                <th className="font-semibold px-6 py-4">Date</th>
                <th className="font-semibold px-6 py-4">Items</th>
                <th className="font-semibold px-6 py-4">Total</th>
                <th className="font-semibold px-6 py-4">Payment</th>
                <th className="font-semibold px-6 py-4">Status</th>
                <th className="font-semibold px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selected.has(order.id)}
                      onChange={() => toggle(order.id)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{order.user?.name || "Guest"}</p>
                      <p className="text-xs text-muted-foreground">{order.user?.email || order.user?.phone || ""}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-body)]">
                    {parseCity(order.shippingAddress)}
                  </td>
                  <td className="px-6 py-4 text-[var(--color-body)]">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-[var(--color-body)]">
                    {order.orderItems.length}
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={paymentVariant[order.paymentStatus] ?? "secondary"}>
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="h-8 gap-1.5">
                        <Eye size={14} /> View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-xl shadow-lg px-4 sm:px-5 py-3 flex flex-wrap items-center justify-center gap-2 sm:gap-4 max-w-[calc(100vw-2rem)]">
          <span className="text-sm font-medium text-foreground">
            {selected.size} selected
          </span>
          {bulkStatuses.map((s) => (
            <button
              key={s.value}
              onClick={() => handleBulkAction(s.value)}
              disabled={isPending}
              className="text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {s.label}
            </button>
          ))}
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-lg border border-border hover:bg-secondary transition-colors"
          >
            Clear
          </button>
        </div>
      )}
    </>
  );
}
