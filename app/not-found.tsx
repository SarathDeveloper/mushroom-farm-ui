import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-secondary px-4 py-24">
      <div className="text-center max-w-lg">
        <div className="relative mx-auto mb-8 h-16 w-16 overflow-hidden rounded-full ring-1 ring-[var(--color-primary-dark)]/20">
          <Image
            src="/gallery/brand-logo.png"
            alt="Sri Amman Mushroom Farms"
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <p className="text-9xl font-bold font-heading text-primary/20 mb-2">404</p>
        <h1 className="text-4xl font-bold font-heading text-foreground mb-3">This patch hasn&apos;t sprouted yet</h1>
        <p className="text-[var(--color-body)] mb-10">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s get you back to fresh ground.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/">Back to Home <ArrowRight className="ml-2" size={18} /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8">
            <Link href="/shop"><Search className="mr-2" size={18} /> Browse Shop</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
