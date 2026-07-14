import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

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
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = preOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  try {
    const enquiry = await prisma.preOrder.create({ data: parsed.data });
    return NextResponse.json(
      { message: "Pre-order submitted successfully.", id: enquiry.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Pre-order submission error:", error);
    return NextResponse.json(
      {
        message:
          "We couldn't submit your pre-order right now. Please ensure the database is configured and try again.",
      },
      { status: 500 }
    );
  }
}
