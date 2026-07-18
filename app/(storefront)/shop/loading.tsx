import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-20 pb-10 sm:pt-28 sm:pb-14 md:pt-36 md:pb-20 border-b border-border/40" style={{ background: 'linear-gradient(180deg, #eaf5ed 0%, #f5faf6 50%, #ffffff 100%)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-4">
          <Skeleton className="h-8 w-24 rounded-full mx-auto" />
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-1/2 mx-auto" />
        </div>
      </div>
      <section className="py-10 sm:py-14 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-border shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                <Skeleton className="aspect-[3/2] w-full rounded-none" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
