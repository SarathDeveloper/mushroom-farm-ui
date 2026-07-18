"use client";

import { useState, useTransition } from "react";
import { CheckCircle, XCircle, Phone, Mail, Trash2, Loader2, Filter } from "lucide-react";
import toast from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { markPreOrderHandled, deletePreOrder } from "@/app/admin/actions";

type PreOrder = {
  id: string;
  name: string;
  phone: string;
  email: string;
  product: string;
  quantity: string;
  preferredDate: string;
  location: string;
  notes: string | null;
  isHandled: boolean;
  createdAt: string;
};

function formatDate(date: string) {
  const [year, month, day] = date.slice(0, 10).split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${months[(month ?? 1) - 1]} ${year}`;
}

export function PreOrdersTable({ orders }: { orders: PreOrder[] }) {
  const [filter, setFilter] = useState<"all" | "pending" | "handled">("all");
  const [deleteTarget, setDeleteTarget] = useState<PreOrder | null>(null);
  const [viewTarget, setViewTarget] = useState<PreOrder | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = orders.filter((o) => {
    if (filter === "pending") return !o.isHandled;
    if (filter === "handled") return o.isHandled;
    return true;
  });

  function handleToggle(order: PreOrder) {
    startTransition(async () => {
      const result = await markPreOrderHandled(order.id, !order.isHandled);
      if (result.success) {
        toast.success(order.isHandled ? "Marked as pending" : "Marked as handled");
      } else {
        toast.error(result.error || "Failed to update");
      }
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deletePreOrder(deleteTarget.id);
      if (result.success) {
        toast.success("Pre-order deleted");
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
          onChange={(e) => setFilter(e.target.value as "all" | "pending" | "handled")}
          className="h-9 rounded-lg border border-border bg-card px-3 text-base outline-none focus:border-primary"
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="handled">Handled</option>
        </select>
      </div>

      {/* Mobile card view */}
      <div className="space-y-3 md:hidden">
        {filtered.map((order) => (
          <div
            key={order.id}
            className={`bg-card rounded-xl border border-border p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${order.isHandled ? "opacity-60" : ""}`}
            onClick={() => setViewTarget(order)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-foreground text-base">{order.name}</span>
              <Badge variant={order.isHandled ? "success" : "warning"} className="text-xs">
                {order.isHandled ? "Handled" : "Pending"}
              </Badge>
            </div>
            <div className="text-base text-foreground">{order.product} · {order.quantity}</div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
              <span>Preferred: {formatDate(order.preferredDate)}</span>
              <span>· {order.location}</span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</span>
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <a href={`tel:${order.phone}`} className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-foreground">
                  <Phone size={13} />
                </a>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleToggle(order)} disabled={isPending}>
                  {order.isHandled ? <XCircle size={13} /> : <CheckCircle size={13} />}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-base">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-[var(--color-body)]">
                <th className="font-semibold px-6 py-4">Customer</th>
                <th className="font-semibold px-6 py-4">Product</th>
                <th className="font-semibold px-6 py-4">Qty</th>
                <th className="font-semibold px-6 py-4">Preferred Date</th>
                <th className="font-semibold px-6 py-4">Location</th>
                <th className="font-semibold px-6 py-4">Submitted</th>
                <th className="font-semibold px-6 py-4">Status</th>
                <th className="font-semibold px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className={`hover:bg-secondary/30 transition-colors cursor-pointer ${order.isHandled ? "opacity-60" : ""}`}
                  onClick={() => setViewTarget(order)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-foreground">{order.name}</p>
                      <a
                        href={`tel:${order.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        <Phone size={12} className="inline mr-1" />
                        {order.phone}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground">{order.product}</td>
                  <td className="px-6 py-4 text-muted-foreground">{order.quantity}</td>
                  <td className="px-6 py-4 text-[var(--color-body)]">{formatDate(order.preferredDate)}</td>
                  <td className="px-6 py-4 text-[var(--color-body)]">{order.location}</td>
                  <td className="px-6 py-4 text-muted-foreground">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={order.isHandled ? "success" : "warning"}>
                      {order.isHandled ? "Handled" : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`tel:${order.phone}`}
                        className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors"
                        title="Call"
                      >
                        <Phone size={14} />
                      </a>
                      <a
                        href={`mailto:${order.email}`}
                        className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors"
                        title="Email"
                      >
                        <Mail size={14} />
                      </a>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleToggle(order)}
                        disabled={isPending}
                        title={order.isHandled ? "Mark pending" : "Mark handled"}
                      >
                        {order.isHandled ? <XCircle size={14} /> : <CheckCircle size={14} />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(order)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!viewTarget} onOpenChange={(open) => !open && setViewTarget(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogTitle>{viewTarget?.name}</DialogTitle>
          {viewTarget && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <a href={`tel:${viewTarget.phone}`} className="font-medium text-primary">
                    {viewTarget.phone}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href={`mailto:${viewTarget.email}`} className="font-medium text-primary">
                    {viewTarget.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-medium">{viewTarget.product}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium">{viewTarget.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preferred Date</p>
                  <p className="font-medium">{formatDate(viewTarget.preferredDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{viewTarget.location}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium">{formatDate(viewTarget.createdAt)}</p>
                </div>
              </div>
              {viewTarget.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-foreground mt-1">{viewTarget.notes}</p>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <a href={`tel:${viewTarget.phone}`} className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <Phone size={14} /> Call
                  </Button>
                </a>
                <a href={`mailto:${viewTarget.email}`} className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <Mail size={14} /> Email
                  </Button>
                </a>
                <Button
                  className="flex-1"
                  onClick={() => {
                    handleToggle(viewTarget);
                    setViewTarget(null);
                  }}
                >
                  {viewTarget.isHandled ? "Mark Pending" : "Mark Handled"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Delete Pre-Order</DialogTitle>
          <p className="text-base text-[var(--color-body)] mt-2">
            Are you sure you want to delete the pre-order from{" "}
            <strong className="text-foreground">{deleteTarget?.name}</strong>?
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
