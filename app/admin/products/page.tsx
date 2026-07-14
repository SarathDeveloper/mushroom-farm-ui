import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ProductsTable } from "@/components/admin/ProductsTable";

export const metadata = {
  title: "Products · Admin",
};

export default async function AdminProductsPage() {
  let products: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    isFeatured: boolean;
    images: string[];
    category: { id: string; name: string };
  }[] = [];

  try {
    products = await prisma.product.findMany({
      include: { category: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  return (
    <div className="p-6 sm:p-10">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
            Products
          </h1>
          <p className="text-[var(--color-body)] mt-1">
            {products.length} product{products.length !== 1 && "s"} in your
            catalog.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus size={18} /> Add Product
          </Button>
        </Link>
      </header>

      <ProductsTable products={products} />
    </div>
  );
}
