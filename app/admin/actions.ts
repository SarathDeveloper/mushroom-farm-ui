"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyOrderStatusUpdate, parseShippingContact } from "@/lib/notifications";
import type {
  OrderStatus,
  PaymentStatus,
  TrainingStatus,
} from "@/lib/status-types";

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
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      select: { id: true, status: true, shippingAddress: true },
    });
    const contact = parseShippingContact(order.shippingAddress);
    if (contact.phone) {
      await notifyOrderStatusUpdate({
        phone: contact.phone,
        fullName: contact.fullName,
        orderId: order.id,
        status: order.status,
      });
    }
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/orders");
    revalidatePath("/track-order");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("updateOrderStatus error:", error);
    return { success: false, error: "Failed to update order status." };
  }
}

export async function bulkUpdateOrderStatus(
  orderIds: string[],
  status: OrderStatus
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.order.updateMany({
      where: { id: { in: orderIds } },
      data: { status },
    });
    const orders = await prisma.order.findMany({
      where: { id: { in: orderIds } },
      select: { id: true, status: true, shippingAddress: true },
    });
    await Promise.allSettled(
      orders.map((order) => {
        const contact = parseShippingContact(order.shippingAddress);
        if (!contact.phone) return Promise.resolve();
        return notifyOrderStatusUpdate({
          phone: contact.phone,
          fullName: contact.fullName,
          orderId: order.id,
          status: order.status,
        });
      })
    );
    revalidatePath("/admin/orders");
    revalidatePath("/orders");
    revalidatePath("/track-order");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("bulkUpdateOrderStatus error:", error);
    return { success: false, error: "Failed to bulk update orders." };
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
    revalidatePath("/orders");
    revalidatePath("/track-order");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("updatePaymentStatus error:", error);
    return { success: false, error: "Failed to update payment status." };
  }
}

export async function addOrderNote(
  orderId: string,
  content: string
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const note = await prisma.orderNote.create({
      data: { orderId, content },
    });
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true, data: { id: note.id } };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("addOrderNote error:", error);
    return { success: false, error: "Failed to add note." };
  }
}

export async function deleteOrderNote(noteId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const note = await prisma.orderNote.delete({ where: { id: noteId } });
    revalidatePath(`/admin/orders/${note.orderId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("deleteOrderNote error:", error);
    return { success: false, error: "Failed to delete note." };
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
    const product = await prisma.product.update({
      where: { id: productId },
      data: { stock },
    });
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/shop");
    revalidatePath(`/shop/${product.slug}`);
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
    const product = await prisma.product.update({
      where: { id: productId },
      data: { isActive },
    });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath(`/shop/${product.slug}`);
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
  showOnHomepage?: boolean;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const category = await prisma.category.create({ data });
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");
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
    showOnHomepage?: boolean;
  }
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.category.update({ where: { id }, data });
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");
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
    revalidatePath("/shop");
    revalidatePath("/");
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
// PRE ORDERS
// =====================

export async function markPreOrderHandled(
  id: string,
  isHandled: boolean
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.preOrder.update({
      where: { id },
      data: { isHandled },
    });
    revalidatePath("/admin/pre-orders");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("markPreOrderHandled error:", error);
    return { success: false, error: "Failed to update pre-order." };
  }
}

export async function deletePreOrder(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.preOrder.delete({ where: { id } });
    revalidatePath("/admin/pre-orders");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("deletePreOrder error:", error);
    return { success: false, error: "Failed to delete pre-order." };
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
    const review = await prisma.review.update({
      where: { id },
      data: { isApproved },
      include: { product: true }
    });
    revalidatePath("/admin/reviews");
    revalidatePath(`/shop/${review.product.slug}`);
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
    const review = await prisma.review.findUnique({ where: { id }, include: { product: true } });
    await prisma.review.delete({ where: { id } });
    revalidatePath("/admin/reviews");
    if (review) revalidatePath(`/shop/${review.product.slug}`);
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
// HERO SLIDES
// =====================

export async function createHeroSlide(data: {
  badge: string;
  headline: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  image: string;
  sortOrder?: number;
  isActive?: boolean;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const slide = await prisma.heroSlide.create({ data });
    revalidatePath("/admin/hero-slides");
    revalidatePath("/");
    return { success: true, data: { id: slide.id } };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("createHeroSlide error:", error);
    return { success: false, error: "Failed to create hero slide." };
  }
}

export async function updateHeroSlide(
  id: string,
  data: {
    badge?: string;
    headline?: string;
    subtitle?: string;
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    image?: string;
    sortOrder?: number;
    isActive?: boolean;
  }
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.heroSlide.update({ where: { id }, data });
    revalidatePath("/admin/hero-slides");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("updateHeroSlide error:", error);
    return { success: false, error: "Failed to update hero slide." };
  }
}

export async function deleteHeroSlide(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.heroSlide.delete({ where: { id } });
    revalidatePath("/admin/hero-slides");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("deleteHeroSlide error:", error);
    return { success: false, error: "Failed to delete hero slide." };
  }
}

// =====================
// ADMIN USER MANAGEMENT
// =====================

export async function createAdmin(data: {
  name: string;
  phone: string;
  email?: string;
  password: string;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const bcrypt = (await import("bcryptjs")).default;

    const existingByPhone = await prisma.user.findUnique({
      where: { phone: data.phone },
    });
    if (existingByPhone) {
      return { success: false, error: "A user with this phone number already exists." };
    }

    if (data.email) {
      const existingByEmail = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingByEmail) {
        return { success: false, error: "A user with this email already exists." };
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const admin = await prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        password: hashedPassword,
        role: "ADMIN",
        isActive: true,
      },
    });
    revalidatePath("/admin/admins");
    return { success: true, data: { id: admin.id } };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("createAdmin error:", error);
    return { success: false, error: "Failed to create admin." };
  }
}

export async function updateAdmin(
  id: string,
  data: {
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
    isActive?: boolean;
  }
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const bcrypt = (await import("bcryptjs")).default;

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email || null;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    if (data.phone !== undefined) {
      const existingByPhone = await prisma.user.findUnique({
        where: { phone: data.phone },
      });
      if (existingByPhone && existingByPhone.id !== id) {
        return { success: false, error: "A user with this phone number already exists." };
      }
      updateData.phone = data.phone;
    }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    await prisma.user.update({ where: { id }, data: updateData });
    revalidatePath("/admin/admins");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("updateAdmin error:", error);
    return { success: false, error: "Failed to update admin." };
  }
}

export async function deleteAdmin(id: string): Promise<ActionResult> {
  try {
    const currentUser = await requireAdmin();
    if (currentUser.id === id) {
      return { success: false, error: "You cannot delete your own account." };
    }
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/admins");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("deleteAdmin error:", error);
    return { success: false, error: "Failed to delete admin." };
  }
}

export async function toggleAdminActive(
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  try {
    const currentUser = await requireAdmin();
    if (currentUser.id === id) {
      return { success: false, error: "You cannot deactivate your own account." };
    }
    await prisma.user.update({ where: { id }, data: { isActive } });
    revalidatePath("/admin/admins");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("toggleAdminActive error:", error);
    return { success: false, error: "Failed to update admin status." };
  }
}

// =====================
// MANUAL ORDER CREATION
// =====================

export async function createManualOrder(data: {
  userId: string;
  items: { productId: string; quantity: number; price: number }[];
  shippingAddress: string;
  paymentStatus?: string;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const totalAmount = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        totalAmount,
        status: "PENDING",
        paymentStatus: (data.paymentStatus as "PENDING" | "COMPLETED") || "PENDING",
        shippingAddress: data.shippingAddress,
        orderItems: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // Decrement stock
    for (const item of data.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { success: true, data: { id: order.id } };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("createManualOrder error:", error);
    return { success: false, error: "Failed to create order." };
  }
}
