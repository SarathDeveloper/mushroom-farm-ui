"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { galleryItems, galleryCategories, type GalleryCategory, type GalleryItem } from "@/lib/gallery";

function LightboxDialog({
  item,
  onClose,
}: {
  item: GalleryItem | null;
  onClose: () => void;
}) {
  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="Close lightbox"
        >
          <X size={20} />
        </button>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-5xl w-full max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full flex-1 min-h-0 flex items-center justify-center">
            <Image
              src={item.src}
              alt={item.title}
              width={1200}
              height={800}
              className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg"
              priority
            />
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-white text-xl font-bold font-heading">
              {item.title}
            </h3>
            <p className="text-white/70 text-sm mt-1 max-w-2xl mx-auto">
              {item.description}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const filtered =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Our Journey"
        title="Farm Gallery"
        description="Real photos from Sari Amman Oyster Mushroom Farm — our facility, products, media coverage, and government recognition."
        image="/gallery/farm/oyster-mushroom-growing.png"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <FadeIn className="flex flex-wrap justify-center gap-2 mb-12">
            {galleryCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.value
                    ? "bg-primary text-white shadow-md"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </FadeIn>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group relative rounded-2xl overflow-hidden bg-card border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-shadow duration-300 cursor-pointer"
                  onClick={() => setLightboxItem(item)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <ZoomIn size={22} />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2 capitalize">
                      {galleryCategories.find(
                        (c) => c.value === item.category
                      )?.label ?? item.category}
                    </span>
                    <h3 className="font-bold text-foreground font-heading text-lg leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No photos in this category yet.
            </div>
          )}
        </div>
      </section>

      {lightboxItem && (
        <LightboxDialog
          item={lightboxItem}
          onClose={() => setLightboxItem(null)}
        />
      )}
    </div>
  );
}
