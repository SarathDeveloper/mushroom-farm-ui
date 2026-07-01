import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary-dark)] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-white">
               <Leaf size={28} />
               <span className="text-2xl font-bold tracking-tight font-heading">Vellimalai<span className="text-secondary">Farms</span></span>
            </Link>
            <p className="text-sm text-white/80 max-w-xs">
              Premium, organic mushrooms grown in the pristine Kalvarayan Hills, Vellimalai. We offer farm-fresh mushrooms, bulk orders, and expert farming training.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm text-secondary">
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop Fresh Mushrooms</Link></li>
              <li><Link href="/bulk-orders" className="hover:text-white transition-colors">Bulk Orders</Link></li>
              <li><Link href="/training" className="hover:text-white transition-colors">Join Training Program</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Our Farm Story</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Reach Us</h3>
            <ul className="space-y-4 text-sm text-white/90">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 text-secondary" />
                <span>Vellimalai, Kalvarayan Hills,<br/>Tamil Nadu, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-secondary" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-secondary" />
                <span>hello@vellimalaifarms.in</span>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Working Hours</h3>
            <ul className="space-y-3 text-sm text-white/90">
              <li className="flex items-center gap-3">
                <Clock size={18} className="shrink-0 text-secondary" />
                <span>Mon - Sat: 8:00 AM - 6:00 PM</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <span>(Farm visits by appointment only)</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/60">
          <p>© {new Date().getFullYear()} Vellimalai Mushroom Farm. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
