"use client";

import { useState } from "react";
import { CloudinaryUpload } from "@/components/CloudinaryUpload";

/**
 * Admin helper to verify Cloudinary credentials and copy public IDs
 * for use in Product.images.
 */
export function AdminImageUploader() {
  const [ids, setIds] = useState<string[]>([]);

  return (
    <div className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
      <h2 className="font-heading text-xl font-semibold text-foreground">Media library</h2>
      <p className="mt-1 text-base text-[var(--color-body)]">
        Upload product images to Cloudinary. Store the public ID (e.g.{" "}
        <code className="rounded bg-secondary px-1 py-0.5 text-sm">mushroom-farm/…</code>) in{" "}
        <code className="rounded bg-secondary px-1 py-0.5 text-sm">Product.images</code>.
      </p>

      <div className="mt-4">
        <CloudinaryUpload value={ids} onChange={setIds} label="Upload to Cloudinary" />
      </div>

      {ids.length > 0 && (
        <ul className="mt-4 space-y-1 text-sm text-[var(--color-body)]">
          {ids.map((id) => (
            <li key={id}>
              <code className="break-all rounded bg-secondary px-1.5 py-0.5">{id}</code>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
