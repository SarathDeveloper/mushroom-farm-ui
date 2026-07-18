"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createManualOrder } from "@/app/admin/actions";
import toast from "react-hot-toast";

type Customer = { id: string; name: string | null; email: string | null; phone: string | null };
type Product = { id: string; name: string; price: number; stock: number; weight: string; image: string };
type OrderItem = { productId: string; name: string; price: number; quantity: number; maxStock: number };

export function ManualOrderForm({
  customers,
  products,
}: {
  customers: Customer[];
  products: Product[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [address, setAddress] = useState({ street: "", city: "", state: "", pincode: "", phone: "" });
  const [paymentStatus, setPaymentStatus] = useState("PENDING");

  const filteredCustomers = customerSearch.length >= 2
    ? customers.filter(
        (c) =>
          c.name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
          c.email?.toLowerCase().includes(customerSearch.toLowerCase()) ||
          c.phone?.includes(customerSearch)
      ).slice(0, 8)
    : [];

  const filteredProducts = productSearch.length >= 2
    ? products
        .filter((p) =>
          p.name.toLowerCase().includes(productSearch.toLowerCase()) &&
          !items.some((i) => i.productId === p.id)
        )
        .slice(0, 8)
    : [];

  function addProduct(product: Product) {
    setItems((prev) => [
      ...prev,
      { productId: product.id, name: product.name, price: product.price, quantity: 1, maxStock: product.stock },
    ]);
    setProductSearch("");
  }

  function updateQuantity(productId: string, delta: number) {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.max(1, Math.min(i.maxStock, i.quantity + delta)) }
          : i
      )
    );
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCustomer) {
      toast.error("Please select a customer");
      return;
    }
    if (items.length === 0) {
      toast.error("Please add at least one product");
      return;
    }
    if (!address.street || !address.city || !address.state || !address.pincode) {
      toast.error("Please fill in the shipping address");
      return;
    }

    startTransition(async () => {
      const shippingAddress = JSON.stringify({
        name: selectedCustomer.name,
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        phone: address.phone || selectedCustomer.phone,
        country: "India",
      });

      const res = await createManualOrder({
        userId: selectedCustomer.id,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
        shippingAddress,
        paymentStatus,
      });

      if (res.success) {
        toast.success("Order created successfully");
        router.push(`/admin/orders/${res.data!.id}`);
      } else {
        toast.error(res.error || "Failed to create order");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Selection */}
      <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-5">
        <h2 className="font-heading font-semibold text-foreground mb-4">Customer</h2>
        {selectedCustomer ? (
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div>
              <p className="font-semibold text-foreground">{selectedCustomer.name || selectedCustomer.email || selectedCustomer.phone}</p>
              <p className="text-xs text-muted-foreground">
                {selectedCustomer.email || ""} {selectedCustomer.phone && `${selectedCustomer.email ? "· " : ""}${selectedCustomer.phone}`}
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => setSelectedCustomer(null)}>
              Change
            </Button>
          </div>
        ) : (
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="pl-9"
            />
            {filteredCustomers.length > 0 && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredCustomers.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCustomer(c);
                      setCustomerSearch("");
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-secondary/50 transition-colors text-sm"
                  >
                    <p className="font-medium text-foreground">{c.name || c.email || c.phone}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.email || ""} {c.phone && `${c.email ? "· " : ""}${c.phone}`}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Product Selection */}
      <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-5">
        <h2 className="font-heading font-semibold text-foreground mb-4">Products</h2>
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products to add..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="pl-9"
          />
          {filteredProducts.length > 0 && (
            <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredProducts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => addProduct(p)}
                  className="w-full text-left px-4 py-2.5 hover:bg-secondary/50 transition-colors text-sm flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.weight} · Stock: {p.stock}</p>
                  </div>
                  <span className="font-semibold text-foreground">₹{p.price}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="h-7 w-7 rounded-md border border-border flex items-center justify-center hover:bg-secondary"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="h-7 w-7 rounded-md border border-border flex items-center justify-center hover:bg-secondary"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="font-semibold text-foreground text-sm w-20 text-right ml-auto sm:ml-0">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="p-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center pt-3 border-t border-border">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-primary">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No products added yet.</p>
        )}
      </section>

      {/* Shipping Address */}
      <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-5">
        <h2 className="font-heading font-semibold text-foreground mb-4">Shipping Address</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <Input
              placeholder="Street address"
              value={address.street}
              onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))}
            />
          </div>
          <Input
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
          />
          <Input
            placeholder="State"
            value={address.state}
            onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
          />
          <Input
            placeholder="Pincode"
            value={address.pincode}
            onChange={(e) => setAddress((a) => ({ ...a, pincode: e.target.value }))}
          />
          <Input
            placeholder="Phone (optional)"
            value={address.phone}
            onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))}
          />
        </div>
      </section>

      {/* Payment Status */}
      <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-5">
        <h2 className="font-heading font-semibold text-foreground mb-4">Payment Status</h2>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
        >
          <option value="PENDING">Pending (COD / Pay Later)</option>
          <option value="COMPLETED">Completed (Already Paid)</option>
        </select>
      </section>

      {/* Submit */}
      <Button type="submit" disabled={isPending} className="w-full h-11 text-base">
        {isPending ? "Creating Order..." : "Create Order"}
      </Button>
    </form>
  );
}
