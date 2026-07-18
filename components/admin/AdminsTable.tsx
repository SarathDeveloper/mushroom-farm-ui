"use client";

import { useState, useTransition } from "react";
import {
  Pencil,
  Trash2,
  Loader2,
  Plus,
  Eye,
  EyeOff,
  Phone,
  User,
  Lock,
  Mail,
} from "lucide-react";
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
import {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  toggleAdminActive,
} from "@/app/admin/actions";

type Admin = {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: Date;
};

type FormData = {
  name: string;
  phone: string;
  email: string;
  password: string;
  isActive: boolean;
};

const emptyForm: FormData = {
  name: "",
  phone: "",
  email: "",
  password: "",
  isActive: true,
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AdminsTable({
  admins,
  currentUserId,
}: {
  admins: Admin[];
  currentUserId: string;
}) {
  const [editTarget, setEditTarget] = useState<Admin | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  function openCreate() {
    setFormData(emptyForm);
    setShowPassword(false);
    setShowCreate(true);
  }

  function openEdit(admin: Admin) {
    setFormData({
      name: admin.name || "",
      phone: admin.phone || "",
      email: admin.email || "",
      password: "",
      isActive: admin.isActive,
    });
    setShowPassword(false);
    setEditTarget(admin);
  }

  function handleCreate() {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.password) {
      toast.error("Name, mobile number and password are required");
      return;
    }
    startTransition(async () => {
      const result = await createAdmin({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        password: formData.password,
      });
      if (result.success) {
        toast.success("Admin created!");
        setShowCreate(false);
        setFormData(emptyForm);
      } else {
        toast.error(result.error || "Failed to create admin");
      }
    });
  }

  function handleUpdate() {
    if (!editTarget || !formData.name.trim() || !formData.phone.trim()) {
      toast.error("Name and mobile number are required");
      return;
    }
    startTransition(async () => {
      const result = await updateAdmin(editTarget.id, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        password: formData.password || undefined,
        isActive: formData.isActive,
      });
      if (result.success) {
        toast.success("Admin updated!");
        setEditTarget(null);
        setFormData(emptyForm);
      } else {
        toast.error(result.error || "Failed to update admin");
      }
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteAdmin(deleteTarget.id);
      if (result.success) {
        toast.success("Admin deleted!");
        setDeleteTarget(null);
      } else {
        toast.error(result.error || "Failed to delete admin");
      }
    });
  }

  function handleToggleActive(admin: Admin) {
    startTransition(async () => {
      const result = await toggleAdminActive(admin.id, !admin.isActive);
      if (result.success) {
        toast.success(
          admin.isActive ? "Admin deactivated" : "Admin activated"
        );
      } else {
        toast.error(result.error || "Failed to update status");
      }
    });
  }

  const dialogOpen = showCreate || !!editTarget;

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button className="gap-2" onClick={openCreate}>
          <Plus size={18} /> Add Admin
        </Button>
      </div>

      {/* Mobile card view */}
      <div className="space-y-3 md:hidden">
        {admins.map((admin) => {
          const isSelf = admin.id === currentUserId;
          return (
            <div
              key={admin.id}
              className={`bg-card rounded-xl border border-border p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${!admin.isActive ? "opacity-60" : ""}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-foreground">
                  {admin.name || "Unnamed"}
                  {isSelf && (
                    <span className="text-sm text-muted-foreground ml-1.5">
                      (You)
                    </span>
                  )}
                </span>
                {admin.isActive ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="destructive">Deactivated</Badge>
                )}
              </div>
              <div className="space-y-1 text-base text-muted-foreground mb-3">
                <p className="flex items-center gap-1.5">
                  <Phone size={14} /> {admin.phone || "—"}
                </p>
                {admin.email && (
                  <p className="flex items-center gap-1.5">
                    <Mail size={14} /> {admin.email}
                  </p>
                )}
                <p className="text-sm">Joined: {formatDate(admin.createdAt)}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                {!isSelf && (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={admin.isActive}
                      onCheckedChange={() => handleToggleActive(admin)}
                      disabled={isPending}
                    />
                    <span className="text-sm text-muted-foreground">
                      {admin.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                )}
                {isSelf && <div />}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => openEdit(admin)}
                  >
                    <Pencil size={14} />
                  </Button>
                  {!isSelf && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(admin)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-base">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-[var(--color-body)]">
                <th className="font-semibold px-6 py-4">Name</th>
                <th className="font-semibold px-6 py-4">Mobile Number</th>
                <th className="font-semibold px-6 py-4">Email</th>
                <th className="font-semibold px-6 py-4">Status</th>
                <th className="font-semibold px-6 py-4">Joined</th>
                <th className="font-semibold px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {admins.map((admin) => {
                const isSelf = admin.id === currentUserId;
                return (
                  <tr
                    key={admin.id}
                    className={`hover:bg-secondary/30 transition-colors ${!admin.isActive ? "opacity-60" : ""}`}
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {admin.name || "Unnamed"}
                      {isSelf && (
                        <span className="text-sm text-muted-foreground ml-1.5">
                          (You)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {admin.phone || "—"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {admin.email || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {!isSelf && (
                          <Switch
                            checked={admin.isActive}
                            onCheckedChange={() => handleToggleActive(admin)}
                            disabled={isPending}
                          />
                        )}
                        {admin.isActive ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="destructive">Deactivated</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDate(admin.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => openEdit(admin)}
                        >
                          <Pencil size={14} />
                        </Button>
                        {!isSelf && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(admin)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
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
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreate(false);
            setEditTarget(null);
            setFormData(emptyForm);
            setShowPassword(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogTitle>
            {editTarget ? "Edit Admin" : "Add Admin"}
          </DialogTitle>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="admin-name">Name *</Label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="admin-name"
                  placeholder="Admin name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-phone">Mobile Number *</Label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="admin-phone"
                  type="tel"
                  placeholder="+91 93855 26105"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-email">Email (Optional)</Label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">
                Password {editTarget ? "(leave blank to keep current)" : "*"}
              </Label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder={editTarget ? "••••••••" : "At least 6 characters"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="pl-9 pr-10"
                  minLength={editTarget ? undefined : 6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {editTarget && (
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center h-11 gap-3">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isActive: checked }))
                    }
                    disabled={editTarget.id === currentUserId}
                  />
                  <span className="text-base">
                    {formData.isActive ? "Active" : "Deactivated"}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreate(false);
                  setEditTarget(null);
                  setShowPassword(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editTarget ? handleUpdate : handleCreate}
                disabled={isPending}
              >
                {isPending && (
                  <Loader2 className="animate-spin mr-2" size={16} />
                )}
                {editTarget ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Delete Admin</DialogTitle>
          <p className="text-base text-[var(--color-body)] mt-2">
            Are you sure you want to delete admin{" "}
            <strong className="text-foreground">
              {deleteTarget?.name || deleteTarget?.phone}
            </strong>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending && (
                <Loader2 className="animate-spin mr-2" size={16} />
              )}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
