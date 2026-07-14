import { Image as ImageIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { GalleryManager } from "@/components/admin/GalleryManager";

export const metadata = {
  title: "Gallery · Admin",
};

export default async function AdminGalleryPage() {
  const items = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
  });

  const categories = [...new Set(items.map((i) => i.category).filter(Boolean))] as string[];

  return (
    <div className="p-6 sm:p-10">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
          Gallery
        </h1>
        <p className="text-[var(--color-body)] mt-1">
          {items.length} image{items.length !== 1 ? "s" : ""} in your farm gallery.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
            <ImageIcon size={30} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground mb-1">No gallery items</h2>
          <p className="text-[var(--color-body)] max-w-sm mb-6">
            Add photos and videos of your farm for marketing.
          </p>
        </div>
      ) : (
        <GalleryManager items={items} categories={categories} />
      )}
    </div>
  );
}
