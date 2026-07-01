import { SafeImage } from "@/components/SafeImage";
import { Badge } from "@/components/ui/badge";
import { products } from "@/lib/data";

export const metadata = {
  title: "Products · Admin",
};

export default function AdminProductsPage() {
  return (
    <div className="p-6 sm:p-10">
      <header className="mb-10">
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">Products</h1>
        <p className="text-[var(--color-body)] mt-1">
          {products.length} products in your catalog.
        </p>
      </header>

      <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-[var(--color-body)]">
                <th className="font-semibold px-6 py-4">Product</th>
                <th className="font-semibold px-6 py-4">Category</th>
                <th className="font-semibold px-6 py-4">Price</th>
                <th className="font-semibold px-6 py-4">Stock</th>
                <th className="font-semibold px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 bg-secondary">
                        <SafeImage src={product.image} alt={product.name} fill sizes="48px" className="object-cover" />
                      </div>
                      <span className="font-semibold text-foreground line-clamp-1">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-body)]">{product.category}</td>
                  <td className="px-6 py-4 font-semibold text-primary">₹{product.price}</td>
                  <td className="px-6 py-4 text-[var(--color-body)]">{product.stock}</td>
                  <td className="px-6 py-4">
                    {product.stock === 0 ? (
                      <Badge variant="destructive">Out of stock</Badge>
                    ) : product.stock < 20 ? (
                      <Badge variant="warning">Low stock</Badge>
                    ) : (
                      <Badge variant="success">In stock</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
