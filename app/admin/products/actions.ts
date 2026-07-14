"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  productSchema,
  categorySchema,
  type ProductFormValues,
} from "@/lib/validators/product";
import { normalizeCloudinaryImages } from "@/lib/cloudinary-utils";

type ActionResult<T = unknown> = {
  success: boolean;
  error?: string;
  data?: T;
};

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function createProduct(
  values: ProductFormValues
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const parsed = productSchema.safeParse(values);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message };
    }

    const existing = await prisma.product.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (existing) {
      return { success: false, error: "A product with this slug already exists." };
    }

    const { compareAtPrice, tag, images, harvestDate, bestBefore, ...rest } = parsed.data;

    const normalized = normalizeCloudinaryImages(images);
    if (!normalized.ok) {
      return { success: false, error: normalized.error };
    }

    const product = await prisma.product.create({
      data: {
        ...rest,
        images: normalized.publicIds,
        compareAtPrice: compareAtPrice ?? null,
        tag: tag ?? null,
        harvestDate: harvestDate ?? null,
        bestBefore: bestBefore ?? null,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: true, data: { id: product.id } };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("createProduct error:", error);
    return { success: false, error: "Failed to create product." };
  }
}

export async function updateProduct(
  id: string,
  values: ProductFormValues
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const parsed = productSchema.safeParse(values);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message };
    }

    const existing = await prisma.product.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (existing && existing.id !== id) {
      return { success: false, error: "Another product with this slug already exists." };
    }

    const { compareAtPrice, tag, images, harvestDate, bestBefore, ...rest } = parsed.data;

    const normalized = normalizeCloudinaryImages(images);
    if (!normalized.ok) {
      return { success: false, error: normalized.error };
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...rest,
        images: normalized.publicIds,
        compareAtPrice: compareAtPrice ?? null,
        tag: tag ?? null,
        harvestDate: harvestDate ?? null,
        bestBefore: bestBefore ?? null,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}/edit`);
    revalidatePath("/shop");
    revalidatePath(`/shop/${product.slug}`);
    revalidatePath("/");

    return { success: true, data: { id: product.id } };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("updateProduct error:", error);
    return { success: false, error: "Failed to update product." };
  }
}

export async function deleteProduct(
  id: string
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const orderItems = await prisma.orderItem.findFirst({
      where: { productId: id },
    });
    if (orderItems) {
      return {
        success: false,
        error:
          "This product has associated orders and cannot be deleted. Consider setting stock to 0 instead.",
      };
    }

    await prisma.product.delete({ where: { id } });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("deleteProduct error:", error);
    return { success: false, error: "Failed to delete product." };
  }
}

export async function searchProducts(
  query: string
): Promise<ActionResult<{ id: string; name: string; slug: string; price: number; image: string }[]>> {
  try {
    if (!query || query.length < 2) {
      return { success: true, data: [] };
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: true,
      },
      take: 8,
    });

    return {
      success: true,
      data: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        image: p.images[0] || "",
      })),
    };
  } catch (error) {
    console.error("searchProducts error:", error);
    return { success: false, error: "Search failed." };
  }
}

export async function createCategory(
  values: { name: string; slug: string; description?: string }
): Promise<ActionResult<{ id: string; name: string; slug: string }>> {
  try {
    await requireAdmin();

    const parsed = categorySchema.safeParse(values);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message };
    }

    const existing = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: parsed.data.slug },
          { name: parsed.data.name },
        ],
      },
    });
    if (existing) {
      return { success: false, error: "A category with this name or slug already exists." };
    }

    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description ?? null,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");

    return {
      success: true,
      data: { id: category.id, name: category.name, slug: category.slug },
    };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("createCategory error:", error);
    return { success: false, error: "Failed to create category." };
  }
}
