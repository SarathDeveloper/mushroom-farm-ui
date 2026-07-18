import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api-utils";

const updateAddressSchema = z.object({
  type: z.enum(["HOME", "WORK", "OTHER"]).optional(),
  street: z.string().min(3).optional(),
  city: z.string().min(2).optional(),
  state: z.string().min(2).optional(),
  pincode: z.string().min(5).optional(),
  isDefault: z.boolean().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return errorResponse("Unauthorized", 401);
  }

  const { id } = await params;

  const address = await prisma.address.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!address) {
    return errorResponse("Address not found", 404);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request body", 400);
  }

  const parsed = updateAddressSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input", 400);
  }

  const data = parsed.data;

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id, id: { not: id } },
      data: { isDefault: false },
    });
  }

  const updated = await prisma.address.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return errorResponse("Unauthorized", 401);
  }

  const { id } = await params;

  const address = await prisma.address.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!address) {
    return errorResponse("Address not found", 404);
  }

  await prisma.address.delete({ where: { id } });

  if (address.isDefault) {
    const nextDefault = await prisma.address.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    if (nextDefault) {
      await prisma.address.update({
        where: { id: nextDefault.id },
        data: { isDefault: true },
      });
    }
  }

  return NextResponse.json({ success: true });
}
