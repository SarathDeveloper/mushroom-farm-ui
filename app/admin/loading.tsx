export default function AdminLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-10 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="h-8 w-48 bg-secondary rounded-lg mb-2" />
          <div className="h-4 w-64 bg-secondary rounded" />
        </div>
        <div className="h-10 w-32 bg-secondary rounded-lg" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-xl border border-border p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          >
            <div className="h-3 w-20 bg-secondary rounded mb-2" />
            <div className="h-6 w-16 bg-secondary rounded" />
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex gap-3">
            <div className="h-10 flex-1 bg-secondary rounded-lg" />
            <div className="h-10 w-28 bg-secondary rounded-lg" />
          </div>
        </div>
        <div className="divide-y divide-border">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 bg-secondary rounded-lg" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-secondary rounded mb-2" />
                <div className="h-3 w-48 bg-secondary rounded" />
              </div>
              <div className="h-6 w-20 bg-secondary rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
