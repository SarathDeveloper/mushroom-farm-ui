"use client";

import { useState } from "react";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/SafeImage";
import { CLOUDINARY_FOLDER, isCloudinarySrc } from "@/lib/cloudinary-utils";
import { cn } from "@/lib/utils";

type UploadedAsset = {
  publicId: string;
  url: string;
};

type CloudinaryUploadProps = {
  /** Called with the Cloudinary public ID after a successful upload. */
  onUploaded?: (asset: UploadedAsset) => void;
  /** Prefer storing public IDs in the DB; URLs work with SafeImage too. */
  value?: string[];
  onChange?: (publicIds: string[]) => void;
  multiple?: boolean;
  folder?: string;
  className?: string;
  label?: string;
};

export function CloudinaryUpload({
  onUploaded,
  value = [],
  onChange,
  multiple = true,
  folder = CLOUDINARY_FOLDER,
  className,
  label = "Upload images",
}: CloudinaryUploadProps) {
  const [pending, setPending] = useState(false);
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const hasNonCloudinary = value.some((src) => src && !isCloudinarySrc(src));

  function handleSuccess(results: CloudinaryUploadWidgetResults) {
    const info = results.info;
    if (!info || typeof info === "string") return;

    const asset: UploadedAsset = {
      publicId: info.public_id,
      url: info.secure_url,
    };

    onUploaded?.(asset);

    if (onChange) {
      // Always persist the Cloudinary public ID (never raw external URLs).
      const next = multiple ? [...value.filter(isCloudinarySrc), asset.publicId] : [asset.publicId];
      onChange(next);
    }
  }

  function removeAt(index: number) {
    if (!onChange) return;
    onChange(value.filter((_, i) => i !== index));
  }

  function clearNonCloudinary() {
    if (!onChange) return;
    onChange(value.filter(isCloudinarySrc));
  }

  return (
    <div className={cn("space-y-3", className)}>
      {hasNonCloudinary && (
        <div className="rounded-xl border border-[var(--color-warning)]/40 bg-[var(--color-warning)]/10 px-4 py-3 text-sm text-foreground">
          <p className="font-medium">
            Some images are not stored in Cloudinary (e.g. Unsplash seed URLs).
          </p>
          <p className="mt-1 text-[var(--color-body)]">
            Remove them and upload new images so the storefront can serve them from Cloudinary.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={clearNonCloudinary}
          >
            Remove non-Cloudinary images
          </Button>
        </div>
      )}

      {value.length > 0 && (
        <ul className="flex flex-wrap gap-3">
          {value.map((src, index) => (
            <li
              key={`${src}-${index}`}
              className={cn(
                "relative h-24 w-24 overflow-hidden rounded-xl border bg-secondary",
                isCloudinarySrc(src)
                  ? "border-border"
                  : "border-[var(--color-warning)]"
              )}
            >
              <SafeImage
                src={src}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
              {onChange && (
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  aria-label="Remove image"
                >
                  <X size={12} />
                </button>
              )}
              {!isCloudinarySrc(src) && (
                <span className="absolute bottom-0 inset-x-0 bg-[var(--color-warning)]/90 text-[10px] font-bold text-center text-white py-0.5">
                  External
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <CldUploadWidget
        signatureEndpoint="/api/sign-cloudinary-params"
        {...(uploadPreset ? { uploadPreset } : {})}
        options={{
          folder,
          multiple,
          maxFiles: multiple ? 8 : 1,
          sources: ["local", "url", "camera"],
          resourceType: "image",
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "avif"],
          maxFileSize: 5_000_000,
        }}
        onSuccess={handleSuccess}
        onQueuesStart={() => setPending(true)}
        onQueuesEnd={(_result, { widget }) => {
          setPending(false);
          widget.close();
        }}
      >
        {({ open }) => (
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={pending}
            onClick={() => open()}
          >
            {pending ? (
              <Loader2 className="animate-spin" data-icon="inline-start" />
            ) : (
              <ImagePlus data-icon="inline-start" />
            )}
            {pending ? "Uploading…" : label}
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
}
