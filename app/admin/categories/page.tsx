import { prisma } from "@/lib/prisma";
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
    showOnHomepage: c.showOnHomepage,
    productCount: c._count.products,
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-heading text-foreground">
            Categories
          </h1>
          <p className="text-[var(--color-body)] mt-1 text-xs sm:text-sm">
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"} in your store.
          </p>
        </div>
      </header>

      <CategoriesTable categories={categoriesWithCount} />
    </div>
  );
}
