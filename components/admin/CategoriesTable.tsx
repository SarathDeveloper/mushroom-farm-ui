"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Loader2, GripVertical, Plus, X } from "lucide-react";
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
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/admin/actions";
import { generateSlug } from "@/lib/validators/product";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  productCount: number;
};

type CategoryFormData = {
  name: string;
  slug: string;
  description: string;
  image: string;
  sortOrder: number;
};

const emptyForm: CategoryFormData = {
  name: "",
  slug: "",
  description: "",
  image: "",
  sortOrder: 0,
};

export function CategoriesTable({ categories }: { categories: Category[] }) {
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>(emptyForm);
  const [isPending, startTransition] = useTransition();

  function openCreate() {
    setFormData(emptyForm);
    setShowCreate(true);
  }

  function openEdit(cat: Category) {
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image: cat.image || "",
      sortOrder: cat.sortOrder,
    });
    setEditTarget(cat);
  }

  function handleNameChange(name: string) {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: showCreate || !editTarget ? generateSlug(name) : prev.slug,
    }));
  }

  function handleCreate() {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    startTransition(async () => {
      const result = await createCategory({
        name: formData.name.trim(),
        slug: formData.slug.trim() || generateSlug(formData.name),
        description: formData.description.trim() || undefined,
        image: formData.image || undefined,
        sortOrder: formData.sortOrder,
      });
      if (result.success) {
        toast.success("Category created!");
        setShowCreate(false);
        setFormData(emptyForm);
      } else {
        toast.error(result.error || "Failed to create category");
      }
    });
  }

  function handleUpdate() {
    if (!editTarget || !formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    startTransition(async () => {
      const result = await updateCategory(editTarget.id, {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || undefined,
        image: formData.image || undefined,
        sortOrder: formData.sortOrder,
      });
      if (result.success) {
        toast.success("Category updated!");
        setEditTarget(null);
        setFormData(emptyForm);
      } else {
        toast.error(result.error || "Failed to update category");
      }
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteCategory(deleteTarget.id);
      if (result.success) {
        toast.success("Category deleted!");
        setDeleteTarget(null);
      } else {
        toast.error(result.error || "Failed to delete category");
      }
    });
  }

  const dialogOpen = showCreate || !!editTarget;

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button className="gap-2" onClick={openCreate}>
          <Plus size={18} /> Add Category
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-[var(--color-body)]">
                <th className="font-semibold px-6 py-4 w-10">#</th>
                <th className="font-semibold px-6 py-4">Category</th>
                <th className="font-semibold px-6 py-4">Slug</th>
                <th className="font-semibold px-6 py-4 text-center">Products</th>
                <th className="font-semibold px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 text-muted-foreground">{cat.sortOrder}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {cat.image ? (
                        <div className="relative h-10 w-10 rounded-lg overflow-hidden shrink-0 bg-secondary">
                          <SafeImage
                            src={cat.image}
                            alt={cat.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                          <GripVertical size={16} />
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-foreground">{cat.name}</span>
                        {cat.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{cat.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{cat.slug}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={cat.productCount > 0 ? "default" : "secondary"}>
                      {cat.productCount}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => openEdit(cat)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(cat)}
                        disabled={cat.productCount > 0}
                        title={cat.productCount > 0 ? "Cannot delete category with products" : undefined}
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        if (!open) {
          setShowCreate(false);
          setEditTarget(null);
          setFormData(emptyForm);
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogTitle>{editTarget ? "Edit Category" : "Add Category"}</DialogTitle>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Oyster"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  placeholder="auto-generated"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                min="0"
                value={formData.sortOrder}
                onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Category Image</Label>
              <CloudinaryUpload
                value={formData.image ? [formData.image] : []}
                onChange={(imgs) => setFormData((prev) => ({ ...prev, image: imgs[0] || "" }))}
                label="Upload image"
                multiple={false}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreate(false);
                  setEditTarget(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editTarget ? handleUpdate : handleCreate}
                disabled={isPending}
              >
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
          <DialogTitle>Delete Category</DialogTitle>
          <p className="text-sm text-[var(--color-body)] mt-2">
            Are you sure you want to delete <strong className="text-foreground">{deleteTarget?.name}</strong>?
            This action cannot be undone.
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
