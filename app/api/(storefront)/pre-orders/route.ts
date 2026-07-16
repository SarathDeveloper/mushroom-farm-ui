import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api-utils";

const preOrderSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  product: z.string().min(1, "Please specify a product"),
  quantity: z.string().min(1, "Please specify a quantity"),
  preferredDate: z.string().min(1, "Please choose a preferred date"),
  location: z.string().min(2, "Location is required"),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request body.", 400);
  }

  const parsed = preOrderSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input.", 400);
  }

  try {
    const enquiry = await prisma.preOrder.create({ data: parsed.data });
    return NextResponse.json(
      { message: "Pre-order submitted successfully.", id: enquiry.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Pre-order submission error:", error);
    return errorResponse("We couldn't submit your pre-order right now. Please ensure the database is configured and try again.", 500);
  }
}
