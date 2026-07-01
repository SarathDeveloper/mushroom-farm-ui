import { Leaf } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-dark)] text-white animate-pulse">
        <Leaf size={28} />
      </div>
      <p className="text-sm text-muted-foreground">Loading fresh content...</p>
    </div>
  );
}
