import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-forest-green)] text-[var(--color-soft-beige)] pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-white">
               <Leaf size={28} />
               <span className="text-2xl font-bold tracking-tight">KalvarayanFarms</span>
            </Link>
            <p className="text-sm text-[var(--color-light-cream)]/80 max-w-xs">
              Premium, organic mushrooms grown in the pristine Kalvarayan Hills. Delivered farm-fresh across Chennai within 12 hours of harvest.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop Fresh Mushrooms</Link></li>
              <li><Link href="/bulk-orders" className="hover:text-white transition-colors">Chennai B2B Orders</Link></li>
              <li><Link href="/training" className="hover:text-white transition-colors">Join Training Program</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Our Farm Story</Link></li>
            </ul>
          </div>

          {/* Contact Info (Chennai Based) */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Reach Us in Chennai</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 text-[var(--color-leaf-green)]" />
                <span>Anna Nagar East, Chennai, Tamil Nadu 600102<br/>(Distribution Hub)</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-[var(--color-leaf-green)]" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-[var(--color-leaf-green)]" />
                <span>hello@kalvarayanfarms.in</span>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Chennai Delivery Hours</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Clock size={18} className="shrink-0 text-[var(--color-leaf-green)]" />
                <span>Mon - Sat: 6:00 AM - 9:00 PM</span>
              </li>
              <li className="flex items-center gap-3 text-[var(--color-light-cream)]/70">
                <span>(Same day delivery for orders before 10 AM)</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[var(--color-light-cream)]/60">
          <p>© {new Date().getFullYear()} Kalvarayan Farms. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
