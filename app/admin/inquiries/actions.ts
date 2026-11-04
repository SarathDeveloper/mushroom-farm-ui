"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

export async function updateInquiryStatus(id: string, isHandled: boolean) {
  if (!(await isAdmin())) {
    return { success: false, message: "Unauthorized" };
  }
  try {
    await prisma.inquiry.update({
      where: { id },
      data: { isHandled },
    });
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to update status" };
  }
}

export async function updateInquiryNotes(id: string, adminNotes: string) {
  if (!(await isAdmin())) {
    return { success: false, message: "Unauthorized" };
  }
  try {
    await prisma.inquiry.update({
      where: { id },
      data: { adminNotes },
    });
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to update notes" };
  }
}
