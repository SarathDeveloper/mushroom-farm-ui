import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { Pagination } from "@/components/admin/Pagination";

export const metadata = {
  title: "Products · Admin",
};

export default async function AdminProductsPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, Number(searchParams?.page) || 1);
  const perPage = 20;

  let products: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    weight: string;
    stock: number;
    lowStockThreshold: number;
    isActive: boolean;
    isFeatured: boolean;
    images: string[];
    highlights: string[];
    rating: number;
    harvestDate: Date | null;
    category: { id: string; name: string };
  }[] = [];
  let totalCount = 0;

  try {
    [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          price: true,
          weight: true,
          stock: true,
          lowStockThreshold: true,
          isActive: true,
          isFeatured: true,
          images: true,
          highlights: true,
          rating: true,
          harvestDate: true,
          category: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.product.count(),
    ]);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-heading text-foreground">
            Products
          </h1>
          <p className="text-[var(--color-body)] mt-1 text-sm">
            {totalCount} product{totalCount !== 1 && "s"} in your catalog.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2 w-full sm:w-auto">
            <Plus size={18} /> Add Product
          </Button>
        </Link>
      </header>

      <ProductsTable products={products} />
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
