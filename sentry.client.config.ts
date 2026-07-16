import * as Sentry from "@sentry/nextjs";

const isProduction = process.env.NODE_ENV === "production";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: isProduction ? 0.1 : 1.0,
  debug: false,
  replaysOnErrorSampleRate: isProduction ? 0.5 : 1.0,
  replaysSessionSampleRate: isProduction ? 0.05 : 0.1,
  beforeSend(event) {
    if (!isProduction && event.exception) {
      console.error("[Sentry]", event.exception);
    }
    return event;
  },
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    "Non-Error promise rejection captured",
    /^Loading chunk \d+ failed/,
    /^ChunkLoadError/,
  ],
});