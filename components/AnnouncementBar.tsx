"use client";

import { useState } from "react";
import { X, Truck } from "lucide-react";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative bg-[#1A4938] text-white">
      <div className="container mx-auto flex items-center justify-center px-4 py-1.5 text-sm sm:text-base font-medium tracking-wide">
        <Truck size={14} className="mr-2 shrink-0 opacity-80" />
        <span className="pr-8">
          Free Delivery for orders above{" "}
          <span className="font-bold">₹500</span>{" "}
          <span className="hidden sm:inline">— Fresh to your home</span>
        </span>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-3 sm:right-4 p-0.5 rounded hover:bg-white/15 transition-colors cursor-pointer"
          aria-label="Dismiss announcement"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
