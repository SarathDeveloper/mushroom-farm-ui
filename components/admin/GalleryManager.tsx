"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Loader2, Plus, Filter } from "lucide-react";
import toast from "react-hot-toast";

import { SafeImage } from "@/components/SafeImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CloudinaryUpload } from "@/components/CloudinaryUpload";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "@/app/admin/actions";

type GalleryItem = {
  id: string;
  title: string;
  url: string;
  type: string;
  category: string | null;
  createdAt: Date;
};

type FormData = {
  title: string;
  url: string;
  type: string;
  category: string;
};

const emptyForm: FormData = {
  title: "",
  url: "",
  type: "IMAGE",
  category: "",
};

export function GalleryManager({
  items,
  categories,
}: {
  items: GalleryItem[];
  categories: string[];
}) {
  const [filter, setFilter] = useState<string>("all");
  const [editTarget, setEditTarget] = useState<GalleryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isPending, startTransition] = useTransition();

  const filtered = items.filter((item) => {
    if (filter === "all") return true;
    return item.category === filter;
  });

  function openCreate() {
    setFormData(emptyForm);
    setShowCreate(true);
  }

  function openEdit(item: GalleryItem) {
    setFormData({
      title: item.title,
      url: item.url,
      type: item.type,
      category: item.category || "",
    });
    setEditTarget(item);
  }

  function handleCreate() {
    if (!formData.title.trim() || !formData.url.trim()) {
      toast.error("Title and image are required");
      return;
    }
    startTransition(async () => {
      const result = await createGalleryItem({
        title: formData.title.trim(),
        url: formData.url,
        type: formData.type,
        category: formData.category.trim() || undefined,
      });
      if (result.success) {
        toast.success("Image added!");
        setShowCreate(false);
        setFormData(emptyForm);
      } else {
        toast.error(result.error || "Failed to add image");
      }
    });
  }

  function handleUpdate() {
    if (!editTarget || !formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    startTransition(async () => {
      const result = await updateGalleryItem(editTarget.id, {
        title: formData.title.trim(),
        url: formData.url,
        type: formData.type,
        category: formData.category.trim() || undefined,
      });
      if (result.success) {
        toast.success("Image updated!");
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
      const result = await deleteGalleryItem(deleteTarget.id);
      if (result.success) {
        toast.success("Image deleted!");
        setDeleteTarget(null);
      } else {
        toast.error(result.error || "Failed to delete");
      }
    });
  }

  const dialogOpen = showCreate || !!editTarget;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Filter size={18} className="text-muted-foreground" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-9 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <Button className="gap-2" onClick={openCreate}>
          <Plus size={18} /> Add Image
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-secondary border border-border"
          >
            <SafeImage
              src={item.url}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
              <p className="text-white font-semibold text-sm truncate">{item.title}</p>
              {item.category && (
                <Badge variant="secondary" className="mt-1 w-fit text-xs">
                  {item.category}
                </Badge>
              )}
              <div className="flex gap-2 mt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => openEdit(item)}
                >
                  <Pencil size={12} />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                  onClick={() => setDeleteTarget(item)}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No images found for this category.
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
        <DialogContent className="sm:max-w-md">
          <DialogTitle>{editTarget ? "Edit Image" : "Add Image"}</DialogTitle>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Farm harvest day"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g. Farm, Training, Products"
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                list="gallery-categories"
              />
              <datalist id="gallery-categories">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            <div className="space-y-2">
              <Label>Image *</Label>
              <CloudinaryUpload
                value={formData.url ? [formData.url] : []}
                onChange={(urls) => setFormData((prev) => ({ ...prev, url: urls[0] || "" }))}
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
                {editTarget ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Delete Image</DialogTitle>
          <p className="text-sm text-[var(--color-body)] mt-2">
            Are you sure you want to delete <strong className="text-foreground">{deleteTarget?.title}</strong>?
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
