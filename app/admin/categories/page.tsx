import { Plus, FolderTree } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { CategoriesTable } from "@/components/admin/CategoriesTable";

export const metadata = {
  title: "Categories · Admin",
};

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  const categoriesWithCount = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image,
    sortOrder: c.sortOrder,
    productCount: c._count.products,
  }));

  return (
    <div className="p-6 sm:p-10">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
            Categories
          </h1>
          <p className="text-[var(--color-body)] mt-1">
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"} in your store.
          </p>
        </div>
      </header>

      {categories.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
            <FolderTree size={30} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground mb-1">No categories yet</h2>
          <p className="text-[var(--color-body)] max-w-sm mb-6">
            Create categories to organize your products.
          </p>
        </div>
      ) : (
        <CategoriesTable categories={categoriesWithCount} />
      )}
    </div>
  );
}
