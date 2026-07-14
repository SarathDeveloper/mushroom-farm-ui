import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bulkOrderSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  phone: z.string().min(7, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  location: z.string().min(2, "Location is required"),
  product: z.string().min(1, "Please specify a product"),
  quantity: z.string().min(1, "Please specify a quantity"),
  frequency: z.string().min(1, "Please specify delivery frequency"),
  requirements: z.string().optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = bulkOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  try {
    const enquiry = await prisma.bulkOrder.create({ data: parsed.data });
    return NextResponse.json(
      { message: "Enquiry submitted successfully.", id: enquiry.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bulk order submission error:", error);
    return NextResponse.json(
      {
        message:
          "We couldn't submit your enquiry right now. Please ensure the database is configured and try again.",
      },
      { status: 500 }
    );
  }
}
