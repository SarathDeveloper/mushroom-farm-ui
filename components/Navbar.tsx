import Link from 'next/link';
import { ShoppingCart, Menu, Search, Leaf } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-warm-gray bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-forest-green)] text-white">
              <Leaf size={24} />
            </div>
            <span className="text-xl font-bold text-[var(--color-forest-green)] tracking-tight">Kalvarayan<span className="text-[var(--color-earth-brown)]">Farms</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-zinc-900 hover:text-[var(--color-forest-green)] transition-colors">Home</Link>
            <Link href="/shop" className="text-sm font-medium text-zinc-600 hover:text-[var(--color-forest-green)] transition-colors">Shop Fresh</Link>
            <Link href="/bulk-orders" className="text-sm font-medium text-zinc-600 hover:text-[var(--color-forest-green)] transition-colors">B2B (Chennai)</Link>
            <Link href="/training" className="text-sm font-medium text-zinc-600 hover:text-[var(--color-forest-green)] transition-colors">Training</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="text-zinc-600 hover:text-[var(--color-forest-green)] transition-colors">
              <Search size={20} />
            </button>
            <Link href="/cart" className="relative text-zinc-600 hover:text-[var(--color-forest-green)] transition-colors">
              <ShoppingCart size={20} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-leaf-green)] text-[10px] font-bold text-white">3</span>
            </Link>
            <button className="md:hidden text-zinc-600 hover:text-[var(--color-forest-green)]">
              <Menu size={24} />
            </button>
            <Link href="/login" className="hidden md:flex items-center justify-center rounded-full bg-[var(--color-forest-green)] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-leaf-green)]">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
