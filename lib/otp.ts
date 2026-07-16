import { createHash, createHmac, randomInt, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { isValidIndianMobile } from "@/lib/phone";
import { sendTwilioSms } from "@/lib/notifications";

const OTP_TTL_MS = 10 * 60 * 1000;
const VERIFY_TTL_MS = 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = 45 * 1000;
const MAX_ATTEMPTS = 5;

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const TEST_OTP = "1234";

function otpIdentifier(phone: string) {
  return `phone-otp:${phone}`;
}

function hashOtp(phone: string, otp: string) {
  return createHash("sha256").update(`${phone}:${otp}`).digest("hex");
}

function verificationSecret() {
  return process.env.NEXTAUTH_SECRET ?? "dev-otp-secret";
}

export function createPhoneVerificationToken(phone: string): string {
  const expires = Date.now() + VERIFY_TTL_MS;
  const payload = `${phone}.${expires}`;
  const sig = createHmac("sha256", verificationSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

export function verifyPhoneVerificationToken(
  token: string,
  phone: string,
): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [tokenPhone, expiresStr, sig] = parts;
  if (tokenPhone !== phone) return false;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;

  const payload = `${tokenPhone}.${expiresStr}`;
  const expected = createHmac("sha256", verificationSecret())
    .update(payload)
    .digest("hex");

  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function createAndStoreOtp(phone: string): Promise<{
  otp: string;
  expiresAt: Date;
  cooldownMs: number;
}> {
  if (!isValidIndianMobile(phone)) {
    throw new Error("Invalid phone number");
  }

  const identifier = otpIdentifier(phone);
  const existing = await prisma.verificationToken.findFirst({
    where: { identifier },
    orderBy: { expires: "desc" },
  });

  if (existing) {
    const issuedAt = existing.expires.getTime() - OTP_TTL_MS;
    const elapsed = Date.now() - issuedAt;
    if (elapsed < RESEND_COOLDOWN_MS) {
      const err = new Error("Please wait before requesting another OTP.");
      (err as Error & { cooldownMs: number }).cooldownMs =
        RESEND_COOLDOWN_MS - elapsed;
      throw err;
    }
    await prisma.verificationToken.deleteMany({ where: { identifier } });
  }

  const otp = String(randomInt(100000, 1000000));
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await prisma.verificationToken.create({
    data: {
      identifier,
      token: `${hashOtp(phone, otp)}:0`,
      expires: expiresAt,
    },
  });

  return { otp, expiresAt, cooldownMs: RESEND_COOLDOWN_MS };
}

export async function verifyStoredOtp(
  phone: string,
  otp: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!isValidIndianMobile(phone)) {
    return { ok: false, message: "Invalid phone number." };
  }

  const identifier = otpIdentifier(phone);

  if (!IS_PRODUCTION && otp === TEST_OTP) {
    await prisma.verificationToken.deleteMany({ where: { identifier } });
    return { ok: true };
  }

  if (!/^\d{6}$/.test(otp)) {
    return { ok: false, message: "Enter the 6-digit OTP." };
  }

  const record = await prisma.verificationToken.findFirst({
    where: { identifier },
    orderBy: { expires: "desc" },
  });

  if (!record || record.expires.getTime() < Date.now()) {
    if (record) {
      await prisma.verificationToken.deleteMany({ where: { identifier } });
    }
    return { ok: false, message: "OTP expired. Please request a new one." };
  }

  const [hash, attemptsStr] = record.token.split(":");
  const attempts = Number(attemptsStr ?? "0");
  if (attempts >= MAX_ATTEMPTS) {
    await prisma.verificationToken.deleteMany({ where: { identifier } });
    return {
      ok: false,
      message: "Too many incorrect attempts. Request a new OTP.",
    };
  }

  const expected = hashOtp(phone, otp);
  const match =
    hash.length === expected.length &&
    timingSafeEqual(Buffer.from(hash), Buffer.from(expected));

  if (!match) {
    await prisma.verificationToken.updateMany({
      where: { identifier, token: record.token },
      data: { token: `${hash}:${attempts + 1}` },
    });
    return { ok: false, message: "Incorrect OTP. Please try again." };
  }

  await prisma.verificationToken.deleteMany({ where: { identifier } });
  return { ok: true };
}

export async function sendOtpSms(
  phone: string,
  otp: string,
): Promise<{ delivered: boolean; mode: "sms" | "dev" }> {
  const message = `Your Sri Amman Mushroom Farms verification code is ${otp}. Valid for 10 minutes.`;

  const result = await sendTwilioSms(phone, message);
  if (result.delivered) {
    return { delivered: true, mode: "sms" };
  }

  if (IS_PRODUCTION) {
    throw new Error("SMS delivery failed — Twilio not configured in production.");
  }

  console.info(`[OTP-DEV] ${phone} => ${otp}`);
  return { delivered: true, mode: "dev" };
}
