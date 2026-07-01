"use client";

import { useEffect } from "react";
import Link from "next/link";
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
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-secondary px-4 py-24">
      <div className="text-center max-w-lg">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mx-auto mb-8">
          <AlertTriangle size={32} />
        </div>
        <h1 className="text-3xl font-bold font-heading text-foreground mb-3">Something went wrong</h1>
        <p className="text-[var(--color-body)] mb-10">
          We hit an unexpected snag loading this page. Please try again, and if the issue persists, head back home.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => reset()} size="lg" className="rounded-full px-8">
            <RotateCcw className="mr-2" size={18} /> Try Again
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
