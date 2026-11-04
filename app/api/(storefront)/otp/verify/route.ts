import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { indianMobileError, normalizeIndianMobile } from "@/lib/phone";
import { createPhoneVerificationToken, verifyStoredOtp } from "@/lib/otp";
import { errorResponse } from "@/lib/api-utils";
import { withRateLimit, apiLimits } from "@/lib/rate-limit";

const schema = z.object({
  phone: z.string().min(1),
  otp: z.string().min(1),
});

export async function POST(request: Request) {
  return withRateLimit(request, () => handleVerify(request), {
    limit: apiLimits.auth,
    identifier: "otp-verify",
  });
}

async function handleVerify(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return errorResponse("Unauthorized", 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request body.", 400);
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("Phone and OTP are required.", 400);
  }

  const phone = normalizeIndianMobile(parsed.data.phone);
  const otp = parsed.data.otp.replace(/\D/g, "").slice(0, 6);
  const phoneErr = indianMobileError(phone);
  if (phoneErr) {
    return errorResponse(phoneErr, 400);
  }

  const result = await verifyStoredOtp(phone, otp);
  if (!result.ok) {
    return errorResponse(result.message, 400);
  }

  // Save the number as the account's phone only if it has none yet. The phone
  // is the login id, so a delivery number verified at checkout must not
  // replace it, and it must not collide with another account.
  const [user, owner] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { phone: true } }),
    prisma.user.findUnique({ where: { phone }, select: { id: true } }),
  ]);
  if (user && !user.phone && !owner) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { phone },
    });
  }

  return NextResponse.json({
    message: "Mobile number verified successfully.",
    phoneVerifiedToken: createPhoneVerificationToken(phone),
  });
}
