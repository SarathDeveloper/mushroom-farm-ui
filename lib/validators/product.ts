import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with dashes only"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  compareAtPrice: z.coerce
    .number()
    .positive("Compare price must be positive")
    .optional()
    .or(z.literal(0).transform(() => undefined))
    .or(z.literal("").transform(() => undefined)),
  weight: z.string().min(1, "Weight is required"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  images: z.array(z.string()).min(1, "At least one image is required"),
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
