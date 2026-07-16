type NotificationMode = "sms" | "whatsapp" | "dev" | "disabled";

type NotificationResult = {
  delivered: boolean;
  mode: NotificationMode;
};

type ShippingContact = {
  phone?: string;
  fullName?: string;
};

const INDIA_COUNTRY_CODE = "+91";

let _twilioWarned = false;

function toE164(phone: string): string {
  const trimmed = phone.trim();
  if (trimmed.startsWith("+")) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${INDIA_COUNTRY_CODE}${digits}`;
  }
  return `+${digits}`;
}

function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return `Rs ${formatted}`;
}

function getBaseUrl(): string | null {
  const base =
    process.env.NEXTAUTH_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.APP_BASE_URL ??
    "";
  const normalized = base.trim().replace(/\/$/, "");
  return normalized.length > 0 ? normalized : null;
}

function hasTwilioCreds(): boolean {
  return !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);
}

function warnMissingTwilio(channel: string): void {
  if (_twilioWarned) return;
  _twilioWarned = true;
  console.warn(
    `[Notifications] Twilio credentials missing — ${channel} notifications disabled. ` +
      "Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.",
  );
}

export function parseShippingContact(shippingAddress: string): ShippingContact {
  try {
    const parsed = JSON.parse(shippingAddress) as {
      phone?: string;
      fullName?: string;
    };
    return { phone: parsed.phone, fullName: parsed.fullName };
  } catch {
    return {};
  }
}

async function sendTwilioMessage(params: {
  to: string;
  from: string;
  body: string;
}): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const body = new URLSearchParams({
    To: params.to,
    From: params.from,
    Body: params.body,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "unknown error");
    throw new Error(`Twilio API error (${res.status}): ${text}`);
  }
}

export async function sendTwilioSms(
  phone: string,
  message: string,
): Promise<NotificationResult> {
  const from = process.env.TWILIO_SMS_FROM;
  if (!hasTwilioCreds() || !from) {
    warnMissingTwilio("SMS");
    return { delivered: false, mode: "disabled" };
  }

  await sendTwilioMessage({
    to: toE164(phone),
    from,
    body: message,
  });
  return { delivered: true, mode: "sms" };
}

async function sendTwilioWhatsapp(
  phone: string,
  message: string,
): Promise<NotificationResult> {
  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!hasTwilioCreds() || !from) {
    warnMissingTwilio("WhatsApp");
    return { delivered: false, mode: "disabled" };
  }

  await sendTwilioMessage({
    to: `whatsapp:${toE164(phone)}`,
    from: from.startsWith("whatsapp:") ? from : `whatsapp:${from}`,
    body: message,
  });

  return { delivered: true, mode: "whatsapp" };
}

async function sendSmsMessage(
  phone: string,
  message: string,
): Promise<NotificationResult> {
  try {
    return await sendTwilioSms(phone, message);
  } catch (error) {
    console.error("[SMS] Failed to send notification:", error);
    return { delivered: false, mode: "dev" };
  }
}

async function sendWhatsAppMessage(
  phone: string,
  message: string,
): Promise<NotificationResult> {
  try {
    return await sendTwilioWhatsapp(phone, message);
  } catch (error) {
    console.error("[WhatsApp] Failed to send notification:", error);
    return { delivered: false, mode: "dev" };
  }
}

function buildTrackingLine(orderId: string): string | null {
  const base = getBaseUrl();
  if (!base) return null;
  return `Track: ${base}/track-order?id=${orderId}`;
}

function orderConfirmationMessage(params: {
  fullName?: string;
  orderId: string;
  totalAmount: number;
}): string {
  const namePart = params.fullName ? `Hi ${params.fullName}, ` : "";
  const total = formatCurrency(params.totalAmount);
  return `${namePart}your order ${params.orderId} is confirmed. Total ${total}. We'll notify you when it ships. - Sri Amman Mushroom Farms`;
}

function orderStatusMessage(params: {
  fullName?: string;
  orderId: string;
  status: string;
}): string {
  const namePart = params.fullName ? `Hi ${params.fullName}, ` : "";
  const tracking = buildTrackingLine(params.orderId);
  const trackingPart = tracking ? ` ${tracking}` : "";
  return `${namePart}your order ${params.orderId} status is now ${params.status}.${trackingPart} - Sri Amman Mushroom Farms`;
}

export async function notifyOrderConfirmation(params: {
  phone: string;
  fullName?: string;
  orderId: string;
  totalAmount: number;
}): Promise<void> {
  const message = orderConfirmationMessage(params);
  await Promise.allSettled([
    sendSmsMessage(params.phone, message),
    sendWhatsAppMessage(params.phone, message),
  ]);
}

export async function notifyOrderStatusUpdate(params: {
  phone: string;
  fullName?: string;
  orderId: string;
  status: string;
}): Promise<void> {
  const message = orderStatusMessage(params);
  await Promise.allSettled([
    sendSmsMessage(params.phone, message),
    sendWhatsAppMessage(params.phone, message),
  ]);
}
