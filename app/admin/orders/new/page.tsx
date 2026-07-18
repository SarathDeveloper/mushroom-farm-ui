import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ManualOrderForm } from "@/components/admin/ManualOrderForm";

export const metadata = {
  title: "Create Order · Admin",
};

export default async function NewOrderPage() {
  const [customers, products] = await Promise.all([
    prisma.user.findMany({
      where: { role: "USER" },
      select: { id: true, name: true, email: true, phone: true },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      where: { isActive: true, stock: { gt: 0 } },
      select: { id: true, name: true, price: true, stock: true, weight: true, images: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-4xl">
      <header className="mb-6 sm:mb-8">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-base text-[var(--color-body)] hover:text-primary mb-3 sm:mb-4"
        >
          <ArrowLeft size={16} /> Back to orders
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
          Create Manual Order
        </h1>
        <p className="text-[var(--color-body)] mt-1 text-sm sm:text-base">
          Create an order for phone/walk-in customers
        </p>
      </header>

      <ManualOrderForm
        customers={customers.map((c) => ({
          id: c.id,
          name: c.name || "",
          email: c.email,
          phone: c.phone || "",
        }))}
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          stock: p.stock,
          weight: p.weight,
          image: p.images[0] || "",
        }))}
      />
    </div>
  );
}
