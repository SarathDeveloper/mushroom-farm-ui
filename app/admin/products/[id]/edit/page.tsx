import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { isCloudinarySrc, toCloudinaryPublicId } from "@/lib/cloudinary-utils";

export const metadata = {
  title: "Edit Product · Admin",
};

export default async function EditProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) notFound();

  // Prefer Cloudinary public IDs in the form; keep legacy external URLs so
  // the admin can see and replace them.
  const images = product.images.map((src) =>
    isCloudinarySrc(src) ? toCloudinaryPublicId(src) : src
  );

  return (
    <ProductForm
      categories={categories}
      mode="edit"
      defaultValues={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice ?? undefined,
        weight: product.weight,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold,
        harvestDate: product.harvestDate ? product.harvestDate.toISOString().split("T")[0] : undefined,
        bestBefore: product.bestBefore ? product.bestBefore.toISOString().split("T")[0] : undefined,
        isActive: product.isActive,
        images,
        isFeatured: product.isFeatured,
        tag: product.tag ?? "",
        highlights: product.highlights,
        categoryId: product.categoryId,
      }}
    />
  );
}
