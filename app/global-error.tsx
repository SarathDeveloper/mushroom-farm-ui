"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: { errorBoundary: "global" },
      extra: { digest: error.digest },
    });
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f2f2f2",
            padding: "1rem",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "32rem" }}>
            <div
              style={{
                width: "4rem",
                height: "4rem",
                borderRadius: "1rem",
                backgroundColor: "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 2rem",
              }}
            >
              <AlertTriangle size={32} color="#dc2626" />
            </div>
            <h1
              style={{
                fontSize: "1.875rem",
                fontWeight: "bold",
                color: "#0b0b0b",
                marginBottom: "0.75rem",
              }}
            >
              Application Error
            </h1>
            <p style={{ color: "#5c6370", marginBottom: "1.5rem" }}>
              A critical error occurred while loading the application. Please refresh the page to try again.
            </p>
            {error.digest && (
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                  marginBottom: "1.5rem",
                  fontFamily: "monospace",
                }}
              >
                Error ID: {error.digest}
              </p>
            )}
            <button
              onClick={() => reset()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 2rem",
                backgroundColor: "#1A4938",
                color: "white",
                border: "none",
                borderRadius: "9999px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <RotateCcw size={18} />
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
