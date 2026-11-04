"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { indianMobileError, normalizeIndianMobile } from "@/lib/phone";
import { rateLimit } from "@/lib/rate-limit";

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80, "Name is too long"),
  email: z.string().trim().email("Invalid email address").max(120).optional().or(z.literal("")),
  phone: z.string().trim().min(1, "Phone number is required"),
  location: z.string().trim().max(80).optional(),
  company: z.string().trim().max(120).optional(),
  inquiryType: z.string().trim().min(1, "Please select an inquiry type").max(40),
  preferredContact: z.string().trim().min(1, "Please select a preferred contact method").max(20),
  message: z.string().trim().max(2000, "Message is too long").optional(),
});

// 5 enquiries per 10 minutes per IP is plenty for a real visitor.
const inquiryLimiter = rateLimit({ interval: 10 * 60 * 1000, uniqueTokenPerInterval: 500 });
const INQUIRY_LIMIT = 5;

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function submitInquiry(prevState: any, formData: FormData) {
  try {
    // Honeypot: the "website" field is hidden from people, so only bots fill it.
    // Pretend success so they don't retry.
    if ((formData.get("website") as string | null)?.trim()) {
      return { success: true, message: "Inquiry submitted successfully" };
    }

    if (!inquiryLimiter.check(`inquiry:${await clientIp()}`, INQUIRY_LIMIT).success) {
      return {
        success: false,
        message: "Too many enquiries from this connection. Please try again later or WhatsApp us.",
      };
    }

    const rawData = {
      name: formData.get("name") as string,
      email: (formData.get("email") as string) || undefined,
      phone: formData.get("phone") as string,
      location: (formData.get("location") as string) || undefined,
      company: (formData.get("company") as string) || undefined,
      inquiryType: formData.get("inquiryType") as string,
      preferredContact: formData.get("preferredContact") as string,
      message: (formData.get("message") as string) || undefined,
    };

    const validatedData = inquirySchema.parse(rawData);

    const phone = normalizeIndianMobile(validatedData.phone);
    const phoneErr = indianMobileError(phone);
    if (phoneErr) {
      return { success: false, message: phoneErr };
    }

    await prisma.inquiry.create({
      data: { ...validatedData, phone },
    });

    return { success: true, message: "Inquiry submitted successfully" };
  } catch (error) {
    console.error("Inquiry submission error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues[0]?.message || "Invalid form data"
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again later."
    };
  }
}
