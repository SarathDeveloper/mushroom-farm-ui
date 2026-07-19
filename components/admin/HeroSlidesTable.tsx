"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Loader2, Plus, ImageIcon, Presentation } from "lucide-react";
import toast from "react-hot-toast";

import { SafeImage } from "@/components/SafeImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CloudinaryUpload } from "@/components/CloudinaryUpload";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} from "@/app/admin/actions";

type HeroSlide = {
  id: string;
  badge: string;
  headline: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
};

type FormData = {
  badge: string;
  headline: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
};

const emptyForm: FormData = {
  badge: "",
  headline: "",
  subtitle: "",
  primaryCtaLabel: "",
  primaryCtaHref: "",
  secondaryCtaLabel: "",
  secondaryCtaHref: "",
  image: "",
  sortOrder: 0,
  isActive: true,
};

export function HeroSlidesTable({ slides }: { slides: HeroSlide[] }) {
  const [editTarget, setEditTarget] = useState<HeroSlide | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HeroSlide | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isPending, startTransition] = useTransition();

  function openCreate() {
    setFormData(emptyForm);
    setShowCreate(true);
  }

  function openEdit(slide: HeroSlide) {
    setFormData({
      badge: slide.badge,
      headline: slide.headline,
      subtitle: slide.subtitle,
      primaryCtaLabel: slide.primaryCtaLabel,
      primaryCtaHref: slide.primaryCtaHref,
      secondaryCtaLabel: slide.secondaryCtaLabel,
      secondaryCtaHref: slide.secondaryCtaHref,
      image: slide.image,
      sortOrder: slide.sortOrder,
      isActive: slide.isActive,
    });
    setEditTarget(slide);
  }

  function handleCreate() {
    if (!formData.headline.trim()) {
      toast.error("Headline is required");
      return;
    }
    if (!formData.image.trim()) {
      toast.error("Background image is required");
      return;
    }
    startTransition(async () => {
      const result = await createHeroSlide({
        badge: formData.badge.trim(),
        headline: formData.headline.trim(),
        subtitle: formData.subtitle.trim(),
        primaryCtaLabel: formData.primaryCtaLabel.trim(),
        primaryCtaHref: formData.primaryCtaHref.trim(),
        secondaryCtaLabel: formData.secondaryCtaLabel.trim(),
        secondaryCtaHref: formData.secondaryCtaHref.trim(),
        image: formData.image,
        sortOrder: formData.sortOrder,
        isActive: formData.isActive,
      });
      if (result.success) {
        toast.success("Slide created!");
        setShowCreate(false);
        setFormData(emptyForm);
      } else {
        toast.error(result.error || "Failed to create slide");
      }
    });
  }

  function handleUpdate() {
    if (!editTarget || !formData.headline.trim()) {
      toast.error("Headline is required");
      return;
    }
    if (!formData.image.trim()) {
      toast.error("Background image is required");
      return;
    }
    startTransition(async () => {
      const result = await updateHeroSlide(editTarget.id, {
        badge: formData.badge.trim(),
        headline: formData.headline.trim(),
        subtitle: formData.subtitle.trim(),
        primaryCtaLabel: formData.primaryCtaLabel.trim(),
        primaryCtaHref: formData.primaryCtaHref.trim(),
        secondaryCtaLabel: formData.secondaryCtaLabel.trim(),
        secondaryCtaHref: formData.secondaryCtaHref.trim(),
        image: formData.image,
        sortOrder: formData.sortOrder,
        isActive: formData.isActive,
      });
      if (result.success) {
        toast.success("Slide updated!");
        setEditTarget(null);
        setFormData(emptyForm);
      } else {
        toast.error(result.error || "Failed to update slide");
      }
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteHeroSlide(deleteTarget.id);
      if (result.success) {
        toast.success("Slide deleted!");
      } else {
        toast.error(result.error || "Failed to delete slide");
      }
      setDeleteTarget(null);
    });
  }

  function update(field: keyof FormData, value: string | number | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  const dialogOpen = showCreate || !!editTarget;

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button className="gap-2" onClick={openCreate}>
          <Plus size={18} /> Add Slide
        </Button>
      </div>

      {slides.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
            <Presentation size={30} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-foreground mb-1">No hero slides yet</h2>
          <p className="text-[var(--color-body)] max-w-sm">
            Create slides to showcase on your homepage hero carousel.
          </p>
        </div>
      ) : (
      <>
        {/* Mobile card view */}
        <div className="space-y-3 md:hidden">
          {slides.map((slide) => (
            <div key={slide.id} className="bg-card rounded-xl border border-border overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="relative aspect-[16/7] bg-secondary">
                {slide.image ? (
                  <SafeImage
                    src={slide.image}
                    alt={slide.headline}
                    fill
                    sizes="(max-width: 768px) 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <ImageIcon size={24} />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={slide.isActive ? "default" : "secondary"}>
                    {slide.isActive ? "Active" : "Draft"}
                  </Badge>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="bg-black/60 text-white text-sm px-2 py-0.5 rounded font-mono">
                    #{slide.sortOrder}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-foreground text-base line-clamp-1 mb-1">
                  {slide.headline.replace(/\n/g, " ")}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-1 mb-1">{slide.subtitle}</p>
                {slide.badge && (
                  <p className="text-sm text-muted-foreground">Badge: {slide.badge}</p>
                )}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    {slide.primaryCtaLabel && <>{slide.primaryCtaLabel} &rarr; {slide.primaryCtaHref}</>}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => openEdit(slide)}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(slide)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
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
                  <th className="font-semibold px-6 py-4 w-10">#</th>
                  <th className="font-semibold px-6 py-4">Slide</th>
                  <th className="font-semibold px-6 py-4">Badge</th>
                  <th className="font-semibold px-6 py-4">Primary CTA</th>
                  <th className="font-semibold px-6 py-4 text-center">Status</th>
                  <th className="font-semibold px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {slides.map((slide) => (
                  <tr key={slide.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground">{slide.sortOrder}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {slide.image ? (
                          <div className="relative h-12 w-20 rounded-lg overflow-hidden shrink-0 bg-secondary">
                            <SafeImage
                              src={slide.image}
                              alt={slide.headline}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-20 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                            <ImageIcon size={16} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="font-semibold text-foreground line-clamp-1">
                            {slide.headline.replace(/\n/g, " ")}
                          </span>
                          <p className="text-sm text-muted-foreground line-clamp-1">{slide.subtitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">{slide.badge}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {slide.primaryCtaLabel} &rarr; <code className="font-mono">{slide.primaryCtaHref}</code>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={slide.isActive ? "default" : "secondary"}>
                        {slide.isActive ? "Active" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => openEdit(slide)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(slide)}
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

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreate(false);
            setEditTarget(null);
            setFormData(emptyForm);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>{editTarget ? "Edit Slide" : "Add Slide"}</DialogTitle>
          <div className="space-y-4 mt-4">
            {/* Badge */}
            <div className="space-y-2">
              <Label htmlFor="badge">Badge Text *</Label>
              <Input
                id="badge"
                placeholder="e.g. Free Delivery above ₹500"
                value={formData.badge}
                onChange={(e) => update("badge", e.target.value)}
              />
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <Label htmlFor="headline">Headline *</Label>
              <Textarea
                id="headline"
                placeholder={"e.g. Fresh Mushroom\\nMarketplace"}
                rows={2}
                value={formData.headline}
                onChange={(e) => update("headline", e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Use a new line to break the heading across two lines.</p>
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                placeholder="Supporting description text"
                rows={2}
                value={formData.subtitle}
                onChange={(e) => update("subtitle", e.target.value)}
              />
            </div>

            {/* Primary CTA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryCtaLabel">Primary CTA Label</Label>
                <Input
                  id="primaryCtaLabel"
                  placeholder="e.g. Shop Fresh Now"
                  value={formData.primaryCtaLabel}
                  onChange={(e) => update("primaryCtaLabel", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryCtaHref">Primary CTA Link</Label>
                <Input
                  id="primaryCtaHref"
                  placeholder="e.g. /shop"
                  value={formData.primaryCtaHref}
                  onChange={(e) => update("primaryCtaHref", e.target.value)}
                />
              </div>
            </div>

            {/* Secondary CTA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="secondaryCtaLabel">Secondary CTA Label</Label>
                <Input
                  id="secondaryCtaLabel"
                  placeholder="e.g. Pre-Order"
                  value={formData.secondaryCtaLabel}
                  onChange={(e) => update("secondaryCtaLabel", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryCtaHref">Secondary CTA Link</Label>
                <Input
                  id="secondaryCtaHref"
                  placeholder="e.g. /pre-order"
                  value={formData.secondaryCtaHref}
                  onChange={(e) => update("secondaryCtaHref", e.target.value)}
                />
              </div>
            </div>

            {/* Background Image */}
            <div className="space-y-2">
              <Label>Background Image *</Label>
              <CloudinaryUpload
                value={formData.image ? [formData.image] : []}
                onChange={(imgs) => update("image", imgs[0] || "")}
                label="Upload background image"
                multiple={false}
              />
            </div>

            {/* Sort Order & Active */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min="0"
                  value={formData.sortOrder}
                  onChange={(e) => update("sortOrder", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="flex items-center gap-3 sm:pt-7">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => update("isActive", checked)}
                />
                <Label>Active</Label>
              </div>
            </div>

            {/* Actions */}
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
          <DialogTitle>Delete Slide</DialogTitle>
          <p className="text-base text-[var(--color-body)] mt-2">
            Are you sure you want to delete the slide{" "}
            <strong className="text-foreground">
              &ldquo;{deleteTarget?.headline.replace(/\n/g, " ")}&rdquo;
            </strong>
            ? This action cannot be undone.
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
