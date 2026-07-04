import Link from "next/link";
import {
  ArrowRight,
  Trophy,
  MapPin,
  Package,
  Leaf,
  ChefHat,
  Truck
} from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { SafeImage } from "@/components/SafeImage";

export function HomeHero() {
  return (
    <section className="bg-[#FCFAF5] pt-12 lg:pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column - Text */}
          <FadeIn direction="up" className="max-w-[540px]">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8F2EC] text-[#2B7A5D] text-[10px] font-bold uppercase tracking-wider mb-6">
              <span>Organic Certified</span>
              <span className="w-1 h-1 rounded-full bg-[#2B7A5D]/50"></span>
              <span>Daily Harvest</span>
            </div>

            <h1 className="text-5xl sm:text-5xl lg:text-[4rem] font-extrabold text-[#0B0B0B] leading-[1.05] font-heading mb-6 tracking-tight">
              Healthy mushrooms,<br />
              <span className="text-[#1A4938]">grown for your wellness.</span>
            </h1>

            <p className="text-[#5C6370] text-lg mb-8 leading-relaxed max-w-[480px]">
              Fresh, organic mushrooms — hand-picked by experts and delivered to your door daily. Elevate your meals and hit your nutrition goals with premium quality fungi.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F76B46] text-white font-semibold px-8 py-4 text-base hover:bg-[#E05A35] hover:scale-[1.02] shadow-[0_8px_20px_rgba(247,107,70,0.25)] transition-all duration-300"
              >
                Shop Fresh Harvest
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white border border-[#E0E0E0] text-[#0B0B0B] font-semibold px-8 py-4 text-base hover:bg-gray-50 transition-all shadow-sm"
              >
                Explore Our Farm
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
              <div className="flex flex-col gap-1">
                <Trophy size={20} className="text-[#F76B46] mb-1.5" />
                <span className="text-xs sm:text-sm font-bold text-[#0B0B0B] leading-tight">Best Farm Award</span>
                <span className="text-[10px] sm:text-xs text-[#5C6370]">Tamil Nadu 2023</span>
              </div>
              <div className="flex flex-col gap-1">
                <MapPin size={20} className="text-[#E56D6D] mb-1.5" />
                <span className="text-xs sm:text-sm font-bold text-[#0B0B0B] leading-tight">Trusted by Chefs</span>
                <span className="text-[10px] sm:text-xs text-[#5C6370]">Top Restaurants</span>
              </div>
              <div className="flex flex-col gap-1">
                <Package size={20} className="text-[#6D5DD3] mb-1.5" />
                <span className="text-xs sm:text-sm font-bold text-[#0B0B0B] leading-tight">10,000+ orders</span>
                <span className="text-[10px] sm:text-xs text-[#5C6370]">delivered since 2021</span>
              </div>
            </div>
          </FadeIn>

          {/* Right Column - Image */}
          <FadeIn direction="left" delay={0.2} className="relative lg:ml-auto w-full max-w-[600px] mt-8 lg:mt-0">
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-white border-8 border-white">
              <SafeImage
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/2025-10-26_D500-1200_Achim-Lammerts_Pleurotus-ostreatus.jpg/1280px-2025-10-26_D500-1200_Achim-Lammerts_Pleurotus-ostreatus.jpg"
                alt="Fresh organic mushrooms harvested daily"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            
            {/* Floating Badge Top Left */}
            <div className="absolute top-10 -left-2 sm:-left-8 bg-white rounded-full p-2.5 pr-5 flex items-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-10 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300 fill-mode-both">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#E8F2EC] flex items-center justify-center text-[#2B7A5D]">
                <Leaf size={18} />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#0B0B0B]">Fresh, organic harvest</span>
            </div>

            {/* Floating Badge Bottom Right */}
            <div className="absolute bottom-16 -right-2 sm:-right-8 bg-white rounded-full p-2.5 pr-5 flex items-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-10 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-500 fill-mode-both">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FFF0ED] flex items-center justify-center text-[#F76B46]">
                <Truck size={18} />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#0B0B0B]">Delivered daily <span className="font-normal text-[#5C6370]">to you</span></span>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Bottom Dark Green Info Bar */}
      <div className="bg-[#1A4938] mt-20 lg:mt-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="flex items-center gap-4 sm:justify-center pt-4 sm:pt-0 first:pt-0">
              <Leaf className="text-[#7DD681] shrink-0" size={32} strokeWidth={1.5} />
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">100% Chemical-Free</h3>
                <p className="text-[#A2C7B8] text-xs sm:text-sm mt-0.5">grown naturally & safely</p>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:justify-center pt-4 sm:pt-0">
              <ChefHat className="text-[#7DD681] shrink-0" size={32} strokeWidth={1.5} />
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">Expert-Cultivated</h3>
                <p className="text-[#A2C7B8] text-xs sm:text-sm mt-0.5">FSSAI-approved farm</p>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:justify-center pt-4 sm:pt-0">
              <Truck className="text-[#7DD681] shrink-0" size={32} strokeWidth={1.5} />
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">Free doorstep delivery</h3>
                <p className="text-[#A2C7B8] text-xs sm:text-sm mt-0.5">every single day</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
