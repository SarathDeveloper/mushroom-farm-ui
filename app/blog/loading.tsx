import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-[45vh] min-h-[320px] bg-[var(--color-primary-dark)]" />
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Skeleton className="h-64 lg:h-96 w-full rounded-2xl mb-16" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-border">
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
