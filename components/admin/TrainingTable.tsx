"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Loader2, Users, Plus, Calendar, IndianRupee, GraduationCap } from "lucide-react";
import toast from "react-hot-toast";

import { SafeImage } from "@/components/SafeImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CloudinaryUpload } from "@/components/CloudinaryUpload";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createTraining,
  updateTraining,
  deleteTraining,
  updateRegistrationStatus,
} from "@/app/admin/actions";
import { generateSlug } from "@/lib/validators/product";
import type { TrainingStatus, PaymentStatus } from "@/lib/status-types";

type Registration = {
  id: string;
  status: PaymentStatus;
  paymentId: string | null;
  createdAt: Date;
  user: { id: string; name: string | null; email: string | null; phone: string | null };
};

type Training = {
  id: string;
  title: string;
  slug: string;
  description: string;
  modules: string[];
  fees: number;
  duration: string;
  trainer: string;
  startDate: Date;
  status: TrainingStatus;
  image: string | null;
  maxCapacity: number;
  registrationCount: number;
  registrations: Registration[];
};

type FormData = {
  title: string;
  slug: string;
  description: string;
  modules: string;
  fees: number;
  duration: string;
  trainer: string;
  startDate: string;
  maxCapacity: number;
  image: string;
  status: TrainingStatus;
};

const emptyForm: FormData = {
  title: "",
  slug: "",
  description: "",
  modules: "",
  fees: 0,
  duration: "",
  trainer: "",
  startDate: "",
  maxCapacity: 20,
  image: "",
  status: "UPCOMING",
};

const statusVariant: Record<TrainingStatus, "default" | "secondary" | "success" | "warning"> = {
  UPCOMING: "secondary",
  ONGOING: "warning",
  COMPLETED: "success",
};

const paymentVariant: Record<PaymentStatus, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  PENDING: "warning",
  COMPLETED: "success",
  FAILED: "destructive",
  REFUNDED: "secondary",
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function TrainingTable({ programs }: { programs: Training[] }) {
  const [editTarget, setEditTarget] = useState<Training | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Training | null>(null);
  const [viewRegistrations, setViewRegistrations] = useState<Training | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isPending, startTransition] = useTransition();

  function openCreate() {
    setFormData(emptyForm);
    setShowCreate(true);
  }

  function openEdit(prog: Training) {
    setFormData({
      title: prog.title,
      slug: prog.slug,
      description: prog.description,
      modules: prog.modules.join("\n"),
      fees: prog.fees,
      duration: prog.duration,
      trainer: prog.trainer,
      startDate: new Date(prog.startDate).toISOString().split("T")[0],
      maxCapacity: prog.maxCapacity,
      image: prog.image || "",
      status: prog.status,
    });
    setEditTarget(prog);
  }

  function handleTitleChange(title: string) {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: showCreate || !editTarget ? generateSlug(title) : prev.slug,
    }));
  }

  function handleCreate() {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    startTransition(async () => {
      const result = await createTraining({
        title: formData.title.trim(),
        slug: formData.slug.trim() || generateSlug(formData.title),
        description: formData.description.trim(),
        modules: formData.modules.split("\n").map((m) => m.trim()).filter(Boolean),
        fees: formData.fees,
        duration: formData.duration.trim(),
        trainer: formData.trainer.trim(),
        startDate: new Date(formData.startDate),
        maxCapacity: formData.maxCapacity,
        image: formData.image || undefined,
      });
      if (result.success) {
        toast.success("Program created!");
        setShowCreate(false);
        setFormData(emptyForm);
      } else {
        toast.error(result.error || "Failed to create program");
      }
    });
  }

  function handleUpdate() {
    if (!editTarget || !formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    startTransition(async () => {
      const result = await updateTraining(editTarget.id, {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        modules: formData.modules.split("\n").map((m) => m.trim()).filter(Boolean),
        fees: formData.fees,
        duration: formData.duration.trim(),
        trainer: formData.trainer.trim(),
        startDate: new Date(formData.startDate),
        maxCapacity: formData.maxCapacity,
        image: formData.image || undefined,
        status: formData.status,
      });
      if (result.success) {
        toast.success("Program updated!");
        setEditTarget(null);
        setFormData(emptyForm);
      } else {
        toast.error(result.error || "Failed to update program");
      }
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteTraining(deleteTarget.id);
      if (result.success) {
        toast.success("Program deleted!");
        setDeleteTarget(null);
      } else {
        toast.error(result.error || "Failed to delete");
      }
    });
  }

  function handleRegistrationStatus(regId: string, status: PaymentStatus) {
    startTransition(async () => {
      const result = await updateRegistrationStatus(regId, status);
      if (result.success) {
        toast.success("Registration updated!");
      } else {
        toast.error(result.error || "Failed to update");
      }
    });
  }

  const dialogOpen = showCreate || !!editTarget;

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button className="gap-2" onClick={openCreate}>
          <Plus size={18} /> Add Program
        </Button>
      </div>

      {programs.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
            <GraduationCap size={30} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground mb-1">No training programs</h2>
          <p className="text-[var(--color-body)] max-w-sm">
            Create training programs for mushroom farming education.
          </p>
        </div>
      ) : (
      <div className="grid gap-6">
        {programs.map((prog) => (
          <div
            key={prog.id}
            className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {prog.image && (
                <div className="relative h-48 md:h-auto md:w-48 shrink-0 bg-secondary">
                  <SafeImage
                    src={prog.image}
                    alt={prog.title}
                    fill
                    sizes="192px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={statusVariant[prog.status]}>{prog.status}</Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{prog.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{prog.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(prog)}>
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(prog)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar size={14} />
                    {formatDate(prog.startDate)}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <IndianRupee size={14} />
                    ₹{prog.fees.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users size={14} />
                    {prog.registrationCount} / {prog.maxCapacity} seats
                  </div>
                </div>

                {prog.registrationCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 gap-2"
                    onClick={() => setViewRegistrations(prog)}
                  >
                    <Users size={14} /> View Registrations ({prog.registrationCount})
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        if (!open) {
          setShowCreate(false);
          setEditTarget(null);
          setFormData(emptyForm);
        }
      }}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>{editTarget ? "Edit Program" : "Add Program"}</DialogTitle>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modules">Modules (one per line)</Label>
              <Textarea
                id="modules"
                rows={4}
                placeholder="Module 1&#10;Module 2&#10;Module 3"
                value={formData.modules}
                onChange={(e) => setFormData((prev) => ({ ...prev, modules: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fees">Fees (₹) *</Label>
                <Input
                  id="fees"
                  type="number"
                  min="0"
                  value={formData.fees}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fees: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g. 3 days"
                  value={formData.duration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trainer">Trainer</Label>
                <Input
                  id="trainer"
                  value={formData.trainer}
                  onChange={(e) => setFormData((prev) => ({ ...prev, trainer: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxCapacity">Max Capacity</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  min="1"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, maxCapacity: parseInt(e.target.value) || 20 }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              {editTarget && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as TrainingStatus }))}
                    className="h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm outline-none"
                  >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Program Image</Label>
              <CloudinaryUpload
                value={formData.image ? [formData.image] : []}
                onChange={(imgs) => setFormData((prev) => ({ ...prev, image: imgs[0] || "" }))}
                label="Upload image"
                multiple={false}
              />
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

      {/* Registrations Dialog */}
      <Dialog open={!!viewRegistrations} onOpenChange={(open) => !open && setViewRegistrations(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogTitle>Registrations: {viewRegistrations?.title}</DialogTitle>
          {viewRegistrations && (
            <div className="mt-4 max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-semibold">Name</th>
                    <th className="pb-2 font-semibold">Contact</th>
                    <th className="pb-2 font-semibold">Date</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {viewRegistrations.registrations.map((reg) => (
                    <tr key={reg.id}>
                      <td className="py-3 font-medium">{reg.user.name || "—"}</td>
                      <td className="py-3">
                        <div className="text-xs">
                          {reg.user.email && <p>{reg.user.email}</p>}
                          {reg.user.phone && <p className="text-muted-foreground">{reg.user.phone}</p>}
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground">{formatDate(reg.createdAt)}</td>
                      <td className="py-3">
                        <select
                          value={reg.status}
                          onChange={(e) => handleRegistrationStatus(reg.id, e.target.value as PaymentStatus)}
                          disabled={isPending}
                          className={`text-xs px-2 py-1 rounded-full border font-bold ${
                            reg.status === "COMPLETED" ? "bg-green-100 text-green-800 border-green-200" :
                            reg.status === "PENDING" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                            reg.status === "FAILED" ? "bg-red-100 text-red-800 border-red-200" :
                            "bg-gray-100 text-gray-800 border-gray-200"
                          }`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="FAILED">FAILED</option>
                          <option value="REFUNDED">REFUNDED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Delete Program</DialogTitle>
          <p className="text-sm text-[var(--color-body)] mt-2">
            Are you sure you want to delete <strong className="text-foreground">{deleteTarget?.title}</strong>?
            This will also delete all registrations.
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
