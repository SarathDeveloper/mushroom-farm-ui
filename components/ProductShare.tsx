"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import toast from "react-hot-toast";

export function ProductShare({ productName }: { productName: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success(`${productName} link copied`);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Unable to copy the link");
    }
  };

  return (
    <button
      type="button"
      onClick={copyLink}
      className="inline-flex items-center gap-1.5 hover:text-primary font-medium"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied" : "Copy Link"}
    </button>
  );
}
