"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Loader2, Plus, Info } from "lucide-react";
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
import { createDeliveryZone, updateDeliveryZone, deleteDeliveryZone } from "@/app/admin/actions";

type DeliveryZone = {
  id: string;
  name: string;
  pincodes: string[];
  charge: number;
  minOrderValue: number | null;
  isActive: boolean;
  createdAt: Date;
};

type FormData = {
  name: string;
  pincodes: string;
  charge: string;
  minOrderValue: string;
  isActive: boolean;
};

const emptyForm: FormData = {
  name: "",
  pincodes: "",
  charge: "49",
  minOrderValue: "500",
  isActive: true,
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function DeliveryZonesTable({ zones, emptyState = false }: { zones: DeliveryZone[]; emptyState?: boolean }) {
  const [editTarget, setEditTarget] = useState<DeliveryZone | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeliveryZone | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isPending, startTransition] = useTransition();

  function openCreate() {
    setFormData(emptyForm);
    setShowCreate(true);
  }

  function openEdit(zone: DeliveryZone) {
    setFormData({
      name: zone.name,
      pincodes: zone.pincodes.join(", "),
      charge: zone.charge.toString(),
      minOrderValue: zone.minOrderValue?.toString() || "",
      isActive: zone.isActive,
    });
    setEditTarget(zone);
  }

  function handleCreate() {
    if (!formData.name.trim() || !formData.charge) {
      toast.error("Name and Delivery Charge are required");
      return;
    }
    const pincodes = formData.pincodes
      .split(",")
      .map(p => p.trim())
      .filter(p => p.length > 0);

    startTransition(async () => {
      const result = await createDeliveryZone({
        name: formData.name.trim(),
        pincodes,
        charge: parseFloat(formData.charge) || 0,
        minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : null,
        isActive: formData.isActive,
      });
      if (result.success) {
        toast.success("Delivery zone created!");
        setShowCreate(false);
        setFormData(emptyForm);
      } else {
        toast.error(result.error || "Failed to create delivery zone");
      }
    });
  }

  function handleUpdate() {
    if (!editTarget || !formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const pincodes = formData.pincodes
      .split(",")
      .map(p => p.trim())
      .filter(p => p.length > 0);

    startTransition(async () => {
      const result = await updateDeliveryZone(editTarget.id, {
        name: formData.name.trim(),
        pincodes,
        charge: parseFloat(formData.charge) || 0,
        minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : null,
        isActive: formData.isActive,
      });
      if (result.success) {
        toast.success("Delivery zone updated!");
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
      const result = await deleteDeliveryZone(deleteTarget.id);
      if (result.success) {
        toast.success("Delivery zone deleted!");
      } else {
        toast.error(result.error || "Failed to delete");
      }
      setDeleteTarget(null);
    });
  }

  const dialogOpen = showCreate || !!editTarget;

  return (
    <>
      <div className={`flex justify-end mb-6 ${emptyState ? 'mt-4 w-full justify-center' : ''}`}>
        <Button className="gap-2" onClick={openCreate}>
          <Plus size={18} /> Add Delivery Zone
        </Button>
      </div>

      {!emptyState && (
        <>
          {/* Mobile card view */}
          <div className="space-y-3 md:hidden">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className={`bg-card rounded-xl border border-border p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${!zone.isActive ? "opacity-60" : ""}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-foreground text-lg">
                    {zone.name}
                  </span>
                  {zone.isActive ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
                <div className="space-y-1.5 text-base mb-3">
                  <p className="font-semibold text-primary">
                    Charge: ₹{zone.charge}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {zone.minOrderValue ? `Free delivery above ₹${zone.minOrderValue}` : "No free delivery threshold"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {zone.pincodes.length > 0 ? (
                      <span className="bg-secondary px-2 py-0.5 rounded">
                        {zone.pincodes.join(", ")}
                      </span>
                    ) : (
                      <span className="italic">Fallback / All unlisted pincodes</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    Created: {formatDate(zone.createdAt)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => openEdit(zone)}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(zone)}
                    >
                      <Trash2 size={14} />
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
                    <th className="font-semibold px-6 py-4">Name</th>
                    <th className="font-semibold px-6 py-4">Pincodes</th>
                    <th className="font-semibold px-6 py-4">Charge</th>
                    <th className="font-semibold px-6 py-4">Conditions</th>
                    <th className="font-semibold px-6 py-4">Status</th>
                    <th className="font-semibold px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {zones.map((zone) => (
                    <tr
                      key={zone.id}
                      className={`hover:bg-secondary/30 transition-colors ${!zone.isActive ? "opacity-60" : ""}`}
                    >
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {zone.name}
                      </td>
                      <td className="px-6 py-4">
                        {zone.pincodes.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {zone.pincodes.map(p => (
                              <span key={p} className="bg-secondary text-xs px-2 py-1 rounded">
                                {p}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic text-sm">Fallback (Any)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary">
                        ₹{zone.charge}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {zone.minOrderValue ? (
                          <>Free above ₹{zone.minOrderValue}</>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {zone.isActive ? (
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
                            onClick={() => openEdit(zone)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(zone)}
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
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        if (!open) {
          setShowCreate(false);
          setEditTarget(null);
          setFormData(emptyForm);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>{editTarget ? "Edit Delivery Zone" : "Add Delivery Zone"}</DialogTitle>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Zone Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Coimbatore Local"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincodes">Applicable Pincodes</Label>
              <Input
                id="pincodes"
                placeholder="641001, 641002"
                value={formData.pincodes}
                onChange={(e) => setFormData((prev) => ({ ...prev, pincodes: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info size={12} /> Leave empty to use as a fallback rule for all other areas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="charge">Delivery Charge (₹) *</Label>
                <Input
                  id="charge"
                  type="number"
                  min="0"
                  value={formData.charge}
                  onChange={(e) => setFormData((prev) => ({ ...prev, charge: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minOrderValue">Free Shipping Threshold (₹)</Label>
                <Input
                  id="minOrderValue"
                  type="number"
                  min="0"
                  placeholder="Optional"
                  value={formData.minOrderValue}
                  onChange={(e) => setFormData((prev) => ({ ...prev, minOrderValue: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Active Status</Label>
              <div className="flex items-center h-11 gap-3">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                />
                <span className="text-base">{formData.isActive ? "Active" : "Inactive"}</span>
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
          <DialogTitle>Delete Zone</DialogTitle>
          <p className="text-base text-[var(--color-body)] mt-2">
            Are you sure you want to delete <strong className="text-foreground">{deleteTarget?.name}</strong>?
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
