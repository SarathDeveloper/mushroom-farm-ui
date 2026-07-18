"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const inquirySchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number is invalid"),
  location: z.string().optional(),
  company: z.string().optional(),
  inquiryType: z.string().min(1, "Please select an inquiry type"),
  preferredContact: z.string().min(1, "Please select a preferred contact method"),
  message: z.string().optional(),
});

export async function submitInquiry(prevState: any, formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      location: (formData.get("location") as string) || undefined,
      company: (formData.get("company") as string) || undefined,
      inquiryType: formData.get("inquiryType") as string,
      preferredContact: formData.get("preferredContact") as string,
      message: (formData.get("message") as string) || undefined,
    };

    const validatedData = inquirySchema.parse(rawData);

    await prisma.inquiry.create({
      data: validatedData,
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
