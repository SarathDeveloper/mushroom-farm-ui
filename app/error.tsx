"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GlobalPageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: { errorBoundary: "page" },
      extra: { digest: error.digest },
    });
    console.error("[Error Boundary]", error);
  }, [error]);

  const isChunkError = error.message?.includes("Loading chunk") || 
                        error.message?.includes("ChunkLoadError");

  const handleReset = () => {
    if (isChunkError) {
      window.location.reload();
    } else {
      reset();
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-secondary px-4 py-24">
      <div className="text-center max-w-lg">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mx-auto mb-8">
          <AlertTriangle size={32} />
        </div>
        <h1 className="text-3xl font-bold font-heading text-foreground mb-3">
          {isChunkError ? "Update Available" : "Something went wrong"}
        </h1>
        <p className="text-[var(--color-body)] mb-6">
          {isChunkError 
            ? "A new version of the app is available. Please refresh the page to continue."
            : "We hit an unexpected snag loading this page. Please try again, and if the issue persists, head back home."}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleReset} size="lg" className="rounded-full px-8">
            <RotateCcw className="mr-2" size={18} /> 
            {isChunkError ? "Refresh Page" : "Try Again"}
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
