"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateInquiryStatus(id: string, isHandled: boolean) {
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
