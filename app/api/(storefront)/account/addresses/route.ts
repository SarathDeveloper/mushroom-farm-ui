import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api-utils";

const addressSchema = z.object({
  type: z.enum(["HOME", "WORK", "OTHER"]).default("HOME"),
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(5, "Valid pincode is required"),
  isDefault: z.boolean().default(false),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return errorResponse("Unauthorized", 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request body", 400);
  }

  const parsed = addressSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input", 400);
  }

  const data = parsed.data;

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  const existingCount = await prisma.address.count({
    where: { userId: session.user.id },
  });
  if (existingCount === 0) {
    data.isDefault = true;
  }

  const address = await prisma.address.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  });

  return NextResponse.json(address, { status: 201 });
}
