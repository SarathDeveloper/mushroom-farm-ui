import { z } from "zod";
import { isCloudinarySrc, toCloudinaryPublicId } from "@/lib/cloudinary-utils";

const cloudinaryImage = z
  .string()
  .min(1)
  .transform((src) => toCloudinaryPublicId(src));

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with dashes only"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().nonnegative("Price must be 0 or greater"),
  compareAtPrice: z.union([
    z.literal("").transform(() => undefined),
    z.coerce.number().nonnegative("Compare price must be 0 or greater").optional()
  ]),
  weight: z.string().min(1, "Weight is required"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  lowStockThreshold: z.coerce.number().int().min(0).default(10),
  harvestDate: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  bestBefore: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  isActive: z.boolean().default(true),
  images: z
    .array(cloudinaryImage)
    .min(1, "Upload at least one image via Cloudinary"),
  isFeatured: z.boolean().default(false),
  tag: z
    .string()
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  highlights: z.array(z.string()).default([]),
  categoryId: z.string().min(1, "Please select a category"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with dashes only"),
  description: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
