import Image from "next/image";

export default function RootLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative h-14 w-14 overflow-hidden rounded-full ring-1 ring-[var(--color-primary-dark)]/20 animate-pulse">
        <Image
          src="/gallery/brand-logo.png"
          alt="Sri Amman Mushroom Farms"
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>
      <p className="text-sm text-muted-foreground">Loading fresh content...</p>
    </div>
  );
}
