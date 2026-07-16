"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Loader2, Plus, Percent, IndianRupee, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { createCoupon, updateCoupon, deleteCoupon } from "@/app/admin/actions";

type Coupon = {
  id: string;
  code: string;
  discountValue: number;
  isPercentage: boolean;
  maxDiscount: number | null;
  minOrderValue: number | null;
  expiryDate: Date;
  isActive: boolean;
  createdAt: Date;
};

type FormData = {
  code: string;
  discountValue: number;
  isPercentage: boolean;
  maxDiscount: string;
  minOrderValue: string;
  expiryDate: string;
  isActive: boolean;
};

const emptyForm: FormData = {
  code: "",
  discountValue: 10,
  isPercentage: true,
  maxDiscount: "",
  minOrderValue: "",
  expiryDate: "",
  isActive: true,
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1 rounded hover:bg-secondary text-muted-foreground"
      title="Copy code"
    >
      {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
    </button>
  );
}

export function CouponsTable({ coupons }: { coupons: Coupon[] }) {
  const [editTarget, setEditTarget] = useState<Coupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isPending, startTransition] = useTransition();

  const now = new Date();

  function openCreate() {
    setFormData(emptyForm);
    setShowCreate(true);
  }

  function openEdit(coupon: Coupon) {
    setFormData({
      code: coupon.code,
      discountValue: coupon.discountValue,
      isPercentage: coupon.isPercentage,
      maxDiscount: coupon.maxDiscount?.toString() || "",
      minOrderValue: coupon.minOrderValue?.toString() || "",
      expiryDate: new Date(coupon.expiryDate).toISOString().split("T")[0],
      isActive: coupon.isActive,
    });
    setEditTarget(coupon);
  }

  function handleCreate() {
    if (!formData.code.trim() || !formData.expiryDate) {
      toast.error("Code and expiry date are required");
      return;
    }
    startTransition(async () => {
      const result = await createCoupon({
        code: formData.code.trim().toUpperCase(),
        discountValue: formData.discountValue,
        isPercentage: formData.isPercentage,
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
        minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : undefined,
        expiryDate: new Date(formData.expiryDate),
        isActive: formData.isActive,
      });
      if (result.success) {
        toast.success("Coupon created!");
        setShowCreate(false);
        setFormData(emptyForm);
      } else {
        toast.error(result.error || "Failed to create coupon");
      }
    });
  }

  function handleUpdate() {
    if (!editTarget || !formData.code.trim()) {
      toast.error("Code is required");
      return;
    }
    startTransition(async () => {
      const result = await updateCoupon(editTarget.id, {
        code: formData.code.trim().toUpperCase(),
        discountValue: formData.discountValue,
        isPercentage: formData.isPercentage,
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : null,
        expiryDate: new Date(formData.expiryDate),
        isActive: formData.isActive,
      });
      if (result.success) {
        toast.success("Coupon updated!");
        setEditTarget(null);
        setFormData(emptyForm);
      } else {
        toast.error(result.error || "Failed to update");
      }
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteCoupon(deleteTarget.id);
      if (result.success) {
        toast.success("Coupon deleted!");
        setDeleteTarget(null);
      } else {
        toast.error(result.error || "Failed to delete");
      }
    });
  }

  const dialogOpen = showCreate || !!editTarget;

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button className="gap-2" onClick={openCreate}>
          <Plus size={18} /> Add Coupon
        </Button>
      </div>

      {/* Mobile card view */}
      <div className="space-y-3 md:hidden">
        {coupons.map((coupon) => {
          const isExpired = new Date(coupon.expiryDate) <= now;
          return (
            <div
              key={coupon.id}
              className={`bg-card rounded-xl border border-border p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${!coupon.isActive || isExpired ? "opacity-60" : ""}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-foreground bg-secondary px-2 py-1 rounded text-sm">
                    {coupon.code}
                  </span>
                  <CopyButton text={coupon.code} />
                </div>
                {isExpired ? (
                  <Badge variant="destructive">Expired</Badge>
                ) : coupon.isActive ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </div>
              <div className="space-y-1.5 text-sm mb-3">
                <p className="font-semibold text-primary">
                  {coupon.isPercentage ? (
                    <>
                      {coupon.discountValue}% off
                      {coupon.maxDiscount && (
                        <span className="text-xs text-muted-foreground ml-1">
                          (max ₹{coupon.maxDiscount})
                        </span>
                      )}
                    </>
                  ) : (
                    <>₹{coupon.discountValue} off</>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {coupon.minOrderValue ? `Min order: ₹${coupon.minOrderValue}` : "No minimum order"}
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  Expires: {formatDate(coupon.expiryDate)}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => openEdit(coupon)}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(coupon)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-[var(--color-body)]">
                <th className="font-semibold px-6 py-4">Code</th>
                <th className="font-semibold px-6 py-4">Discount</th>
                <th className="font-semibold px-6 py-4">Conditions</th>
                <th className="font-semibold px-6 py-4">Expiry</th>
                <th className="font-semibold px-6 py-4">Status</th>
                <th className="font-semibold px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coupons.map((coupon) => {
                const isExpired = new Date(coupon.expiryDate) <= now;
                return (
                  <tr
                    key={coupon.id}
                    className={`hover:bg-secondary/30 transition-colors ${!coupon.isActive || isExpired ? "opacity-60" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="font-mono font-bold text-foreground bg-secondary px-2 py-1 rounded">
                          {coupon.code}
                        </span>
                        <CopyButton text={coupon.code} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-semibold text-primary">
                        {coupon.isPercentage ? (
                          <>
                            {coupon.discountValue}%
                            {coupon.maxDiscount && (
                              <span className="text-xs text-muted-foreground ml-1">
                                (max ₹{coupon.maxDiscount})
                              </span>
                            )}
                          </>
                        ) : (
                          <>₹{coupon.discountValue}</>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {coupon.minOrderValue ? (
                        <>Min order: ₹{coupon.minOrderValue}</>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDate(coupon.expiryDate)}
                    </td>
                    <td className="px-6 py-4">
                      {isExpired ? (
                        <Badge variant="destructive">Expired</Badge>
                      ) : coupon.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => openEdit(coupon)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(coupon)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        if (!open) {
          setShowCreate(false);
          setEditTarget(null);
          setFormData(emptyForm);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>{editTarget ? "Edit Coupon" : "Add Coupon"}</DialogTitle>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code *</Label>
              <Input
                id="code"
                placeholder="e.g. FIRST10"
                value={formData.code}
                onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className="font-mono uppercase"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountValue">Discount Value *</Label>
                <div className="relative">
                  <Input
                    id="discountValue"
                    type="number"
                    min="0"
                    value={formData.discountValue}
                    onChange={(e) => setFormData((prev) => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                    className="pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {formData.isPercentage ? "%" : "₹"}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <div className="flex items-center h-11 gap-3">
                  <Switch
                    checked={formData.isPercentage}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPercentage: checked }))}
                  />
                  <span className="text-sm">{formData.isPercentage ? "Percentage" : "Fixed Amount"}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minOrderValue">Min Order (₹)</Label>
                <Input
                  id="minOrderValue"
                  type="number"
                  min="0"
                  placeholder="Optional"
                  value={formData.minOrderValue}
                  onChange={(e) => setFormData((prev) => ({ ...prev, minOrderValue: e.target.value }))}
                />
              </div>
              {formData.isPercentage && (
                <div className="space-y-2">
                  <Label htmlFor="maxDiscount">Max Discount (₹)</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    min="0"
                    placeholder="Optional"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, maxDiscount: e.target.value }))}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Active</Label>
                <div className="flex items-center h-11 gap-3">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                  />
                  <span className="text-sm">{formData.isActive ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => { setShowCreate(false); setEditTarget(null); }}>
                Cancel
              </Button>
              <Button onClick={editTarget ? handleUpdate : handleCreate} disabled={isPending}>
                {isPending && <Loader2 className="animate-spin mr-2" size={16} />}
                {editTarget ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Delete Coupon</DialogTitle>
          <p className="text-sm text-[var(--color-body)] mt-2">
            Are you sure you want to delete coupon <strong className="text-foreground font-mono">{deleteTarget?.code}</strong>?
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
