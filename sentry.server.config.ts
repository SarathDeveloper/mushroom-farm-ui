import * as Sentry from "@sentry/nextjs";

const isProduction = process.env.NODE_ENV === "production";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: !!process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: isProduction ? 0.1 : 1.0,
  debug: false,
  beforeSend(event) {
    if (event.exception?.values?.[0]?.type === "PrismaClientKnownRequestError") {
      event.fingerprint = ["prisma-error", event.exception.values[0].value || "unknown"];
    }
    return event;
  },
});