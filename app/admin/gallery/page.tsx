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
    <div className="p-4 sm:p-6 lg:p-10">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-xl md:text-2xl font-bold font-heading text-foreground">
          Gallery
        </h1>
        <p className="text-[var(--color-body)] mt-1 text-xs sm:text-sm">
          {items.length} image{items.length !== 1 ? "s" : ""} in your farm gallery.
        </p>
      </header>

      <GalleryManager items={items} categories={categories} />
    </div>
  );
}
