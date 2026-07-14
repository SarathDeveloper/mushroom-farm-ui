"use client";

import { useState } from "react";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { ImagePlus, Loader2, X } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { CLOUDINARY_FOLDER } from "@/lib/cloudinary-utils";
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

  function handleSuccess(results: CloudinaryUploadWidgetResults) {
    const info = results.info;
    if (!info || typeof info === "string") return;

    const asset: UploadedAsset = {
      publicId: info.public_id,
      url: info.secure_url,
    };

    onUploaded?.(asset);

    if (onChange) {
      onChange(multiple ? [...value, asset.publicId] : [asset.publicId]);
    }
  }

  function removeAt(index: number) {
    if (!onChange) return;
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className={cn("space-y-3", className)}>
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-3">
          {value.map((publicId, index) => (
            <li
              key={publicId}
              className="relative h-24 w-24 overflow-hidden rounded-xl border border-border bg-secondary"
            >
              <CldImage
                src={publicId}
                alt=""
                width={96}
                height={96}
                crop={{ type: "fill", source: true }}
                className="h-full w-full object-cover"
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
