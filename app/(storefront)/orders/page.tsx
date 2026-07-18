import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { PackageSearch, ArrowRight } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "My Orders",
};

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive" | "success" | "warning"> = {
  PENDING: "warning",
  PROCESSING: "secondary",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
};

async function getOrders(userId: string) {
  try {
    return await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { orderItems: true },
    });
  } catch {
    return [];
  }
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const orders = await getOrders(session.user.id);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero eyebrow="Account" title="My Orders" image="/gallery/farm/oyster-mushroom-growing.png" />

      <section className="py-20 sm:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {orders.length === 0 ? (
            <FadeIn className="flex flex-col items-center text-center py-16">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
                <PackageSearch size={36} className="text-primary" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground mb-2">No orders yet</h2>
              <p className="text-[var(--color-body)] mb-8 max-w-sm text-xs sm:text-sm">
                Once you place an order, you&apos;ll be able to track its status here.
              </p>
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/shop">Start Shopping <ArrowRight className="ml-2" size={18} /></Link>
              </Button>
            </FadeIn>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {orders.map((order: any) => (
                <Link key={order.id} href={`/track-order?id=${order.id}`}>
                  <FadeIn className="p-4 sm:p-5 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors">
                    <div className="flex items-start sm:items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-xs sm:text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                          {order.orderItems.length} items · ₹{order.totalAmount}
                          {order.paymentStatus === "COMPLETED" && " · Paid"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 sm:hidden">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={statusVariant[order.status] ?? "secondary"} className="text-xs">{order.status}</Badge>
                        <ArrowRight size={16} className="text-muted-foreground hidden sm:block" />
                      </div>
                    </div>
                  </FadeIn>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
