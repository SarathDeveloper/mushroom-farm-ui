import { cn } from "@/lib/utils";

type Variant = "wave" | "leaf";

export function SectionDivider({
  variant = "wave",
  flip = false,
  className,
  from = "bg-background",
}: {
  variant?: Variant;
  flip?: boolean;
  className?: string;
  from?: string;
}) {
  if (variant === "leaf") {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-4 py-2 select-none",
          className,
        )}
        aria-hidden="true"
      >
        <span className="h-px w-16 bg-primary/15" />
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-primary/25"
        >
          <path
            d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="h-px w-16 bg-primary/15" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden leading-[0] -mb-px",
        flip && "rotate-180",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 56"
        preserveAspectRatio="none"
        className={cn("block w-full h-10 sm:h-14", from)}
      >
        <path
          d="M0,28 C240,56 480,0 720,28 C960,56 1200,0 1440,28 L1440,56 L0,56 Z"
          className="fill-current text-background"
        />
      </svg>
    </div>
  );
}
