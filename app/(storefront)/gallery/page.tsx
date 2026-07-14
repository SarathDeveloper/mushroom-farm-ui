"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  galleryItems,
  galleryCategories,
  type GalleryCategory,
  type GalleryItem,
} from "@/lib/gallery";

function getSpanClass(item: GalleryItem, index: number): string {
  if (item.span) {
    switch (item.span) {
      case "large":
        return "col-span-1 row-span-1 sm:col-span-2 sm:row-span-2";
      case "tall":
        return "row-span-2";
      case "wide":
        return "col-span-1 sm:col-span-2";
      default:
        return "";
    }
  }
  if (index % 7 === 3) return "row-span-2";
  return "";
}

function LightboxDialog({
  item,
  items,
  onClose,
  onNavigate,
}: {
  item: GalleryItem;
  items: GalleryItem[];
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
}) {
  const currentIndex = items.findIndex((i) => i.id === item.id);
  const total = items.length;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate("prev");
      if (e.key === "ArrowRight") onNavigate("next");
    },
    [onClose, onNavigate]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="Close lightbox"
        >
          <X size={20} />
        </button>

        <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium tabular-nums">
          {currentIndex + 1} / {total}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate("prev");
          }}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="Previous image"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate("next");
          }}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="Next image"
        >
          <ChevronRight size={22} />
        </button>

        <motion.div
          key={item.id}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-5xl w-full max-h-[85vh] flex flex-col px-4 sm:px-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full flex-1 min-h-0 flex items-center justify-center">
            <Image
              src={item.src}
              alt={item.title}
              width={1200}
              height={800}
              className="max-h-[72vh] w-auto max-w-full object-contain rounded-lg"
              priority
            />
          </div>
          <div className="mt-5 text-center">
            <h3 className="text-white text-xl font-bold font-heading">
              {item.title}
            </h3>
            <p className="text-white/60 text-sm mt-1.5 max-w-2xl mx-auto leading-relaxed">
              {item.description}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] =
    useState<GalleryCategory>("all");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const filtered =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  const handleNavigate = useCallback(
    (direction: "prev" | "next") => {
      if (!lightboxItem) return;
      const currentIndex = filtered.findIndex(
        (i) => i.id === lightboxItem.id
      );
      const nextIndex =
        direction === "next"
          ? (currentIndex + 1) % filtered.length
          : (currentIndex - 1 + filtered.length) % filtered.length;
      setLightboxItem(filtered[nextIndex]);
    },
    [lightboxItem, filtered]
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Immersive Full-Bleed Hero */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src="/gallery/farm/oyster-mushroom-growing.png"
          alt="Sari Amman Oyster Mushroom Farm"
          fill
          priority
          className="object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        <div className="absolute bottom-10 md:bottom-14 left-6 md:left-12 lg:left-16">
          <div className="flex items-center gap-2 mb-3">
            <Camera size={16} className="text-white/70" />
            <span className="text-white/70 text-xs font-medium uppercase tracking-[0.2em]">
              Our Journey in Photos
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading leading-tight">
            Farm Gallery
          </h1>
          <p className="text-white/60 text-base md:text-lg mt-3 max-w-lg leading-relaxed">
            Real moments from our facility, products, media coverage, and
            government recognition.
          </p>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-10 md:py-14 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Underline Tab Navigation */}
          <div className="flex gap-1 sm:gap-6 border-b border-border mb-10 md:mb-12 overflow-x-auto scrollbar-hide">
            {galleryCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={cn(
                  "pb-3 px-1 text-sm font-medium transition-colors relative whitespace-nowrap cursor-pointer",
                  activeCategory === cat.value
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {cat.label}
                {activeCategory === cat.value && (
                  <motion.div
                    layoutId="gallery-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Photo count */}
          <div className="mb-6 text-sm text-muted-foreground">
            {filtered.length} photo{filtered.length !== 1 && "s"}
          </div>

          {/* Bento Masonry Grid */}
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[140px] sm:auto-rows-[180px] md:auto-rows-[200px] lg:auto-rows-[220px] gap-2 md:gap-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  className={cn(
                    "relative group rounded-xl overflow-hidden cursor-pointer",
                    getSpanClass(item, i)
                  )}
                  onClick={() => setLightboxItem(item)}
                >
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-white/70 text-[10px] md:text-xs font-medium uppercase tracking-wider">
                      {galleryCategories.find(
                        (c) => c.value === item.category
                      )?.label ?? item.category}
                    </span>
                    <h3 className="text-white font-bold text-sm md:text-base leading-snug mt-0.5">
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-24 text-muted-foreground">
              <Camera size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-lg">No photos in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxItem && (
        <LightboxDialog
          item={lightboxItem}
          items={filtered}
          onClose={() => setLightboxItem(null)}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
