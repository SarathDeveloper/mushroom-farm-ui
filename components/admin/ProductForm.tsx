"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Loader2, Plus, X, ArrowLeft, Star, ShoppingCart } from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { CloudinaryUpload } from "@/components/CloudinaryUpload";
import { SafeImage } from "@/components/SafeImage";
import { cn } from "@/lib/utils";

import {
  productSchema,
  type ProductFormValues,
  generateSlug,
} from "@/lib/validators/product";
import {
  createProduct,
  updateProduct,
  createCategory,
} from "@/app/admin/products/actions";

type Category = { id: string; name: string; slug: string };

type ProductFormProps = {
  categories: Category[];
  defaultValues?: ProductFormValues & { id?: string };
  mode: "create" | "edit";
};

export function ProductForm({
  categories: initialCategories,
  defaultValues,
  mode,
}: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState(initialCategories);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [categoryPending, setCategoryPending] = useState(false);
  const [highlightInput, setHighlightInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: defaultValues ?? {
      name: "",
      slug: "",
      description: "",
      price: 0,
      compareAtPrice: undefined,
      weight: "200g",
      stock: 0,
      lowStockThreshold: 10,
      harvestDate: undefined,
      bestBefore: undefined,
      isActive: true,
      images: [],
      isFeatured: false,
      tag: "",
      highlights: [],
      categoryId: "",
    },
  });

  const name = watch("name");
  const images = watch("images");
  const highlights = watch("highlights");
  const slug = watch("slug");
  const description = watch("description");
  const price = watch("price");
  const weight = watch("weight");
  const stock = watch("stock");
  const compareAtPrice = watch("compareAtPrice");

  useEffect(() => {
    if (mode === "create" && name) {
      const generated = generateSlug(name);
      if (generated !== slug) {
        setValue("slug", generated);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, mode, setValue]);

  function onSubmit(values: ProductFormValues) {
    startTransition(async () => {
      const result =
        mode === "edit" && defaultValues?.id
          ? await updateProduct(defaultValues.id, values)
          : await createProduct(values);

      if (result.success) {
        toast.success(
          mode === "edit" ? "Product updated!" : "Product created!"
        );
        router.push("/admin/products");
      } else {
        toast.error(result.error || "Something went wrong.");
      }
    });
  }

  function addHighlight() {
    const trimmed = highlightInput.trim();
    if (trimmed && !highlights.includes(trimmed)) {
      setValue("highlights", [...highlights, trimmed]);
      setHighlightInput("");
    }
  }

  function removeHighlight(index: number) {
    setValue(
      "highlights",
      highlights.filter((_, i) => i !== index)
    );
  }

  async function handleCreateCategory() {
    if (!newCategoryName.trim()) return;
    setCategoryPending(true);

    const catSlug =
      newCategorySlug.trim() || generateSlug(newCategoryName);
    const result = await createCategory({
      name: newCategoryName.trim(),
      slug: catSlug,
    });

    setCategoryPending(false);

    if (result.success && result.data) {
      setCategories((prev) => [...prev, result.data!]);
      setValue("categoryId", result.data.id);
      setShowCategoryDialog(false);
      setNewCategoryName("");
      setNewCategorySlug("");
      toast.success("Category created!");
    } else {
      toast.error(result.error || "Failed to create category.");
    }
  }

  const stockNum = Number(stock) || 0;
  const previewStock =
    stockNum <= 0 ? "Out of Stock" : stockNum <= 10 ? "Low Stock" : "In Stock";
  const previewStockTone =
    stockNum <= 0 ? "out" : stockNum <= 10 ? "low" : "in";

  return (
    <div className="p-6 sm:p-10 max-w-6xl">
      <header className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-base text-[var(--color-body)] hover:text-primary mb-4"
        >
          <ArrowLeft size={16} /> Back to products
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground">
          {mode === "edit" ? "Edit Product" : "Add New Product"}
        </h1>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-8">
        {/* Basic Info */}
        <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-6 space-y-5">
          <h2 className="font-heading font-semibold text-foreground text-xl">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Premium Oyster Mushroom"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                placeholder="auto-generated-from-name"
                {...register("slug")}
              />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the product in detail..."
              rows={4}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </section>

        {/* Pricing & Inventory */}
        <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-6 space-y-5">
          <h2 className="font-heading font-semibold text-foreground text-xl">
            Pricing & Inventory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-sm text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="compareAtPrice">Compare at Price (₹)</Label>
              <Input
                id="compareAtPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="Optional"
                {...register("compareAtPrice")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight *</Label>
              <Input
                id="weight"
                placeholder="e.g. 250g"
                {...register("weight")}
              />
              {errors.weight && (
                <p className="text-sm text-destructive">
                  {errors.weight.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                {...register("stock")}
              />
              {errors.stock && (
                <p className="text-sm text-destructive">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                min="0"
                placeholder="10"
                {...register("lowStockThreshold")}
              />
              <p className="text-sm text-muted-foreground">Alert when stock falls below this</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="harvestDate">Harvest Date</Label>
              <Input
                id="harvestDate"
                type="date"
                {...register("harvestDate")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bestBefore">Best Before</Label>
              <Input
                id="bestBefore"
                type="date"
                {...register("bestBefore")}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="isActive"
                />
              )}
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Product is active and visible on storefront
            </Label>
          </div>
        </section>

        {/* Organization */}
        <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-6 space-y-5">
          <h2 className="font-heading font-semibold text-foreground text-xl">
            Organization
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category *</Label>
              <div className="flex gap-2">
                <select
                  id="categoryId"
                  className="flex-1 h-11 rounded-xl border border-border bg-card px-3.5 text-base outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20"
                  {...register("categoryId")}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 shrink-0"
                  onClick={() => setShowCategoryDialog(true)}
                >
                  <Plus size={18} />
                </Button>
              </div>
              {errors.categoryId && (
                <p className="text-sm text-destructive">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag">Tag</Label>
              <Input
                id="tag"
                placeholder="e.g. Bestseller, New, Chef's Choice"
                {...register("tag")}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Controller
              name="isFeatured"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="isFeatured"
                />
              )}
            />
            <Label htmlFor="isFeatured" className="cursor-pointer">
              Featured product (show on homepage)
            </Label>
          </div>
        </section>

        {/* Highlights */}
        <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-6 space-y-5">
          <div>
            <h2 className="font-heading font-semibold text-foreground text-xl">
              Highlights
            </h2>
            <p className="text-base text-muted-foreground mt-1">
              Shown as green tags on the storefront product card.
            </p>
          </div>

          {highlights.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {highlights.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F2EC] px-3 py-1.5 text-base font-medium text-[#2B7A5D] border border-[#2B7A5D]/10"
                >
                  {h}
                  <button
                    type="button"
                    onClick={() => removeHighlight(i)}
                    className="text-[#2B7A5D]/70 hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="e.g. Organic, Fresh Daily, Premium Quality"
              value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addHighlight();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addHighlight}>
              Add
            </Button>
          </div>
          {errors.highlights && (
            <p className="text-sm text-destructive">
              {errors.highlights.message}
            </p>
          )}
        </section>

        {/* Images */}
        <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-6 space-y-5">
          <h2 className="font-heading font-semibold text-foreground text-xl">
            Product Images *
          </h2>
          <p className="text-base text-[var(--color-body)]">
            Images are uploaded to Cloudinary and the public ID is saved in the
            database. The storefront and admin panels both load them from
            Cloudinary. The first image is the main display image.
          </p>

          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <CloudinaryUpload
                value={field.value}
                onChange={field.onChange}
                label="Upload product images"
              />
            )}
          />
          {errors.images && (
            <p className="text-sm text-destructive">
              {errors.images.message}
            </p>
          )}
        </section>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={isPending}
            className="px-8 h-11"
          >
            {isPending && <Loader2 className="animate-spin mr-2" size={18} />}
            {mode === "edit" ? "Update Product" : "Create Product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </Button>
        </div>
        </div>

        {/* Live storefront card preview */}
        <aside className="xl:sticky xl:top-6 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Storefront preview
          </p>
          <div className="flex flex-col bg-card rounded-2xl overflow-hidden border border-border/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
              <SafeImage
                src={images[0] || ""}
                alt={name || "Product preview"}
                fill
                sizes="340px"
                className="object-cover"
              />
              <span
                className={cn(
                  "absolute top-3 right-3 px-2.5 py-1 rounded-full text-sm font-semibold text-white shadow-sm",
                  previewStockTone === "in" && "bg-[#2B7A5D]",
                  previewStockTone === "low" && "bg-[#E5B06D]",
                  previewStockTone === "out" && "bg-[#E56D6D]"
                )}
              >
                {previewStock}
              </span>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-lg leading-snug text-foreground line-clamp-2 font-heading">
                  {name || "Product name"}
                </h3>
                <div className="flex items-center gap-1 shrink-0 pt-0.5">
                  <Star size={13} className="fill-[#c4a96a] text-[#c4a96a]" />
                  <span className="text-sm font-medium text-muted-foreground">
                    4.8
                  </span>
                </div>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed line-clamp-3">
                {description || "Product description will appear here."}
              </p>
              {highlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {highlights.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-[#E8F2EC] px-2.5 py-0.5 text-sm font-medium text-[#2B7A5D] border border-[#2B7A5D]/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-[#1A4938] tabular-nums">
                  ₹{(Number(price) || 0).toLocaleString("en-IN")}
                </span>
                {compareAtPrice ? (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{Number(compareAtPrice).toLocaleString("en-IN")}
                  </span>
                ) : null}
                <span className="text-base text-muted-foreground">
                  per {weight || "unit"}
                </span>
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <div className="flex items-center rounded-lg border border-border bg-secondary/60 h-10 shrink-0 px-2.5 text-sm text-muted-foreground">
                  − 1 + · {weight || "kg"}
                </div>
                <div className="flex-1 h-10 rounded-lg bg-[#1A4938] text-white text-base font-semibold flex items-center justify-center gap-1.5">
                  <ShoppingCart size={14} />
                  Add to Cart
                </div>
              </div>
            </div>
          </div>
        </aside>
      </form>

      {/* Add Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Add New Category</DialogTitle>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Category Name *</Label>
              <Input
                id="cat-name"
                placeholder="e.g. Oyster"
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value);
                  setNewCategorySlug(generateSlug(e.target.value));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-slug">Slug</Label>
              <Input
                id="cat-slug"
                placeholder="auto-generated"
                value={newCategorySlug}
                onChange={(e) => setNewCategorySlug(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCategoryDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCategory}
                disabled={categoryPending || !newCategoryName.trim()}
              >
                {categoryPending && (
                  <Loader2 className="animate-spin mr-2" size={16} />
                )}
                Create Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
