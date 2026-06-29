import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Clock, Truck, Star, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center bg-zinc-900 overflow-hidden">
        {/* We'll use a placeholder image URL for the background */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop" 
            alt="Mushroom farming background"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
              <Leaf size={16} className="text-[var(--color-leaf-green)]" />
              <span>Kalvarayan Hills to Chennai within 12 Hours</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              Premium Organic <br /> Mushrooms, Delivered Fresh.
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-xl">
              Experience the unmatched taste of naturally grown mushrooms from the pristine Kalvarayan Hills. Hygienically packed and delivered directly to your doorstep across Chennai.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/shop" className="inline-flex items-center justify-center gap-2 bg-[var(--color-leaf-green)] hover:bg-[var(--color-forest-green)] text-white px-8 py-4 rounded-full font-semibold transition-all">
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link href="/bulk-orders" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/30 px-8 py-4 rounded-full font-semibold transition-all">
                Bulk Orders (Chennai B2B)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Cards Section */}
      <section className="relative z-20 -mt-16 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Leaf, title: "100% Organic", desc: "Naturally grown without chemicals" },
            { icon: Clock, title: "Daily Harvest", desc: "Picked fresh every morning" },
            { icon: Truck, title: "Same Day Chennai Delivery", desc: "For all orders placed before 10 AM" },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-soft-beige)] text-[var(--color-forest-green)] flex items-center justify-center">
                <item.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-zinc-900">{item.title}</h3>
                <p className="text-zinc-600 text-sm mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-zinc-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">The Kalvarayan Difference</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto mb-16">
            We bridge the gap between traditional organic farming and modern convenience. Our mushrooms are cultivated in the cool climate of Kalvarayan Hills and brought to Chennai's warm homes with ultimate care.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Premium Quality", desc: "Hand-picked and sorted to ensure only the best reaches you." },
              { icon: Leaf, title: "Sustainable Farming", desc: "Eco-friendly practices that protect our environment." },
              { icon: Star, title: "Hygienically Packed", desc: "Vacuum sealed to lock in freshness and nutrients." }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-zinc-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-forest-green)] text-white flex items-center justify-center mb-6">
                  <feature.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">{feature.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900 mb-2">Fresh Harvest Arrivals</h2>
              <p className="text-zinc-600">Explore our premium selection available for Chennai delivery.</p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 text-[var(--color-forest-green)] font-semibold hover:gap-3 transition-all">
              View All Products <ArrowRight size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Premium Oyster Mushrooms", price: "₹150", weight: "250g", img: "https://images.unsplash.com/photo-1590740924976-15ff4eb430d8?q=80&w=1000&auto=format&fit=crop" },
              { name: "Fresh Milky Mushrooms", price: "₹180", weight: "250g", img: "https://images.unsplash.com/photo-1508216127116-43b98c56cc19?q=80&w=1000&auto=format&fit=crop" },
              { name: "Organic Button Mushrooms", price: "₹120", weight: "200g", img: "https://images.unsplash.com/photo-1611105637889-3fa70db2b271?q=80&w=1000&auto=format&fit=crop" }
            ].map((product, i) => (
              <div key={i} className="group flex flex-col bg-zinc-50 rounded-3xl overflow-hidden border border-zinc-100 hover:shadow-xl transition-all">
                <div className="relative h-64 overflow-hidden">
                  <Image src={product.img} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-white transition-colors">
                    <Heart size={20} />
                  </button>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-zinc-900 line-clamp-1">{product.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map(star => <Star key={star} size={14} className="fill-amber-400 text-amber-400" />)}
                    <span className="text-xs text-zinc-500 ml-1">(4.9)</span>
                  </div>
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <span className="text-sm text-zinc-500 block">{product.weight}</span>
                      <span className="text-xl font-bold text-[var(--color-forest-green)]">{product.price}</span>
                    </div>
                    <button className="bg-zinc-900 hover:bg-[var(--color-forest-green)] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
