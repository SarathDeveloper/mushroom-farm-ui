"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { OrderStatus, PaymentStatus, TrainingStatus } from "@prisma/client";

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

// =====================
// ORDER MANAGEMENT
// =====================

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("updateOrderStatus error:", error);
    return { success: false, error: "Failed to update order status." };
  }
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus },
    });
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("updatePaymentStatus error:", error);
    return { success: false, error: "Failed to update payment status." };
  }
}

// =====================
// INVENTORY MANAGEMENT
// =====================

export async function updateProductStock(
  productId: string,
  stock: number
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.product.update({
      where: { id: productId },
      data: { stock },
    });
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/shop");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("updateProductStock error:", error);
    return { success: false, error: "Failed to update stock." };
  }
}

export async function toggleProductActive(
  productId: string,
  isActive: boolean
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.product.update({
      where: { id: productId },
      data: { isActive },
    });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("toggleProductActive error:", error);
    return { success: false, error: "Failed to toggle product." };
  }
}

// =====================
// CATEGORY MANAGEMENT
// =====================

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder?: number;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const category = await prisma.category.create({ data });
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { success: true, data: { id: category.id } };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("createCategory error:", error);
    return { success: false, error: "Failed to create category." };
  }
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    image?: string;
    sortOrder?: number;
  }
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.category.update({ where: { id }, data });
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("updateCategory error:", error);
    return { success: false, error: "Failed to update category." };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const productsCount = await prisma.product.count({ where: { categoryId: id } });
    if (productsCount > 0) {
      return { success: false, error: `Cannot delete category with ${productsCount} product(s). Move or delete products first.` };
    }
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("deleteCategory error:", error);
    return { success: false, error: "Failed to delete category." };
  }
}

// =====================
// BULK ORDERS (B2B)
// =====================

export async function markBulkOrderHandled(
  id: string,
  isHandled: boolean
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.bulkOrder.update({
      where: { id },
      data: { isHandled },
    });
    revalidatePath("/admin/bulk-orders");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("markBulkOrderHandled error:", error);
    return { success: false, error: "Failed to update bulk order." };
  }
}

export async function deleteBulkOrder(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.bulkOrder.delete({ where: { id } });
    revalidatePath("/admin/bulk-orders");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("deleteBulkOrder error:", error);
    return { success: false, error: "Failed to delete bulk order." };
  }
}

// =====================
// TRAINING MANAGEMENT
// =====================

export async function createTraining(data: {
  title: string;
  slug: string;
  description: string;
  modules: string[];
  fees: number;
  duration: string;
  trainer: string;
  startDate: Date;
  maxCapacity: number;
  image?: string;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const training = await prisma.training.create({ data });
    revalidatePath("/admin/training");
    revalidatePath("/training");
    return { success: true, data: { id: training.id } };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("createTraining error:", error);
    return { success: false, error: "Failed to create training." };
  }
}

export async function updateTraining(
  id: string,
  data: {
    title?: string;
    slug?: string;
    description?: string;
    modules?: string[];
    fees?: number;
    duration?: string;
    trainer?: string;
    startDate?: Date;
    maxCapacity?: number;
    image?: string;
    status?: TrainingStatus;
  }
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.training.update({ where: { id }, data });
    revalidatePath("/admin/training");
    revalidatePath("/training");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("updateTraining error:", error);
    return { success: false, error: "Failed to update training." };
  }
}

export async function deleteTraining(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.trainingRegistration.deleteMany({ where: { trainingId: id } });
    await prisma.training.delete({ where: { id } });
    revalidatePath("/admin/training");
    revalidatePath("/training");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("deleteTraining error:", error);
    return { success: false, error: "Failed to delete training." };
  }
}

export async function updateRegistrationStatus(
  id: string,
  status: PaymentStatus
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.trainingRegistration.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/training");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("updateRegistrationStatus error:", error);
    return { success: false, error: "Failed to update registration." };
  }
}

// =====================
// COUPON MANAGEMENT
// =====================

export async function createCoupon(data: {
  code: string;
  discountValue: number;
  isPercentage: boolean;
  maxDiscount?: number;
  minOrderValue?: number;
  expiryDate: Date;
  isActive: boolean;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const coupon = await prisma.coupon.create({ data });
    revalidatePath("/admin/coupons");
    return { success: true, data: { id: coupon.id } };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("createCoupon error:", error);
    return { success: false, error: "Failed to create coupon." };
  }
}

export async function updateCoupon(
  id: string,
  data: {
    code?: string;
    discountValue?: number;
    isPercentage?: boolean;
    maxDiscount?: number | null;
    minOrderValue?: number | null;
    expiryDate?: Date;
    isActive?: boolean;
  }
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.coupon.update({ where: { id }, data });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("updateCoupon error:", error);
    return { success: false, error: "Failed to update coupon." };
  }
}

export async function deleteCoupon(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.coupon.delete({ where: { id } });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("deleteCoupon error:", error);
    return { success: false, error: "Failed to delete coupon." };
  }
}

// =====================
// REVIEW MODERATION
// =====================

export async function updateReviewApproval(
  id: string,
  isApproved: boolean
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.review.update({
      where: { id },
      data: { isApproved },
    });
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("updateReviewApproval error:", error);
    return { success: false, error: "Failed to update review." };
  }
}

export async function deleteReview(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.review.delete({ where: { id } });
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("deleteReview error:", error);
    return { success: false, error: "Failed to delete review." };
  }
}

// =====================
// GALLERY MANAGEMENT
// =====================

export async function createGalleryItem(data: {
  title: string;
  url: string;
  type: string;
  category?: string;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const item = await prisma.gallery.create({ data });
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return { success: true, data: { id: item.id } };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("createGalleryItem error:", error);
    return { success: false, error: "Failed to create gallery item." };
  }
}

export async function updateGalleryItem(
  id: string,
  data: {
    title?: string;
    url?: string;
    type?: string;
    category?: string;
  }
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.gallery.update({ where: { id }, data });
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("updateGalleryItem error:", error);
    return { success: false, error: "Failed to update gallery item." };
  }
}

export async function deleteGalleryItem(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.gallery.delete({ where: { id } });
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("deleteGalleryItem error:", error);
    return { success: false, error: "Failed to delete gallery item." };
  }
}
