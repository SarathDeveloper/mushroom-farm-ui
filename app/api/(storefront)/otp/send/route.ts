import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { indianMobileError, normalizeIndianMobile } from "@/lib/phone";
import { createAndStoreOtp, sendOtpSms } from "@/lib/otp";

const schema = z.object({
  phone: z.string().min(1),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Phone number is required." }, { status: 400 });
  }

  const phone = normalizeIndianMobile(parsed.data.phone);
  const phoneErr = indianMobileError(phone);
  if (phoneErr) {
    return NextResponse.json({ message: phoneErr }, { status: 400 });
  }

  try {
    const { otp, expiresAt, cooldownMs } = await createAndStoreOtp(phone);
    const { mode } = await sendOtpSms(phone, otp);

    return NextResponse.json({
      message:
        mode === "sms"
          ? "OTP sent to your mobile number."
          : "OTP generated. Check the server console (SMS not configured).",
      expiresAt: expiresAt.toISOString(),
      cooldownMs,
      // Exposed only when Fast2SMS is not configured so local checkout still works.
      ...(mode === "dev" ? { devOtp: otp } : {}),
    });
  } catch (error) {
    const cooldownMs = (error as Error & { cooldownMs?: number }).cooldownMs;
    if (cooldownMs != null) {
      return NextResponse.json(
        {
          message: "Please wait before requesting another OTP.",
          cooldownMs: Math.ceil(cooldownMs),
        },
        { status: 429 },
      );
    }
    console.error("OTP send error:", error);
    return NextResponse.json(
      { message: "Failed to send OTP. Please try again." },
      { status: 500 },
    );
  }
}
