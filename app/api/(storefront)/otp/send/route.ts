import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { indianMobileError, normalizeIndianMobile } from "@/lib/phone";
import { createAndStoreOtp, sendOtpSms } from "@/lib/otp";
import { errorResponse } from "@/lib/api-utils";
import { withRateLimit, apiLimits } from "@/lib/rate-limit";

const schema = z.object({
  phone: z.string().min(1),
});

export async function POST(request: Request) {
  return withRateLimit(
    request,
    async () => {
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
        return errorResponse("Phone number is required.", 400);
      }

      const phone = normalizeIndianMobile(parsed.data.phone);
      const phoneErr = indianMobileError(phone);
      if (phoneErr) {
        return errorResponse(phoneErr, 400);
      }

      try {
        const { otp, expiresAt, cooldownMs } = await createAndStoreOtp(phone);
        const { mode } = await sendOtpSms(phone, otp);

        const isDev = process.env.NODE_ENV !== "production";

        return NextResponse.json({
          message:
            mode === "sms"
              ? "OTP sent to your mobile number."
              : "OTP generated. Check the server console (SMS not configured).",
          expiresAt: expiresAt.toISOString(),
          cooldownMs,
          ...(isDev && mode === "dev" ? { devOtp: otp } : {}),
        });
      } catch (error) {
        const cooldownMs = (error as Error & { cooldownMs?: number }).cooldownMs;
        if (cooldownMs != null) {
          return errorResponse("Please wait before requesting another OTP.", 429);
        }
        console.error("OTP send error:", error);
        return errorResponse("Failed to send OTP. Please try again.", 500);
      }
    },
    { limit: apiLimits.otp, identifier: "otp-send" }
  );
}
