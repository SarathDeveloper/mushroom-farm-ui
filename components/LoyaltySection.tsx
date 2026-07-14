import { Gift, Users, Star, Trophy } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const tiers = [
  { name: "Seedling", min: 0, icon: "🌱", benefits: ["Earn 1 point per ₹10", "Birthday bonus"] },
  { name: "Grower", min: 500, icon: "🌿", benefits: ["1.5x points", "Free shipping", "Early access"] },
  { name: "Harvester", min: 2000, icon: "🍄", benefits: ["2x points", "Exclusive recipes", "Priority support"] },
  { name: "Farm Patron", min: 5000, icon: "🏆", benefits: ["3x points", "Farm visit invite", "Annual gift box"] },
];

const perks = [
  { icon: Gift, title: "Earn Points", desc: "Get 1 point for every ₹10 you spend. Redeem for discounts on future orders." },
  { icon: Users, title: "Refer & Earn", desc: "Give ₹50, Get ₹50. Share your unique referral link and both of you save." },
  { icon: Star, title: "Exclusive Rewards", desc: "Unlock farm visits, recipe books, and annual gift boxes as you grow." },
  { icon: Trophy, title: "Tier Benefits", desc: "Climb through 4 tiers for multiplied points, free shipping, and VIP access." },
];

export function LoyaltySection() {
  return (
    <section className="py-20 bg-[#1A4938] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <FadeIn className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4">
            <Gift size={16} /> Loyalty Program
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-heading">
            Grow With Us, Get Rewarded
          </h2>
          <p className="text-[#A2C7B8] max-w-2xl mx-auto mt-4 text-base leading-relaxed">
            Join our loyalty program and earn points on every purchase. The more you buy, the more you save.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {perks.map((perk, i) => (
            <FadeIn key={perk.title} delay={i * 0.1}>
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 h-full hover:bg-white/10 transition-colors duration-300">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-4">
                  <perk.icon size={22} strokeWidth={1.75} />
                </div>
                <h3 className="font-bold text-white text-base mb-2 font-heading">{perk.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{perk.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/10">
            <h3 className="font-bold text-white text-lg font-heading mb-6 text-center">Membership Tiers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tiers.map((tier) => (
                <div key={tier.name} className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                  <span className="text-3xl mb-2 block">{tier.icon}</span>
                  <h4 className="font-bold text-white text-sm mb-1">{tier.name}</h4>
                  <p className="text-[11px] text-white/50 mb-3">{tier.min > 0 ? `${tier.min}+ points` : "Start here"}</p>
                  <ul className="space-y-1">
                    {tier.benefits.map((b) => (
                      <li key={b} className="text-xs text-white/70">{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn className="text-center mt-10">
          <Button asChild size="lg" className="rounded-full bg-white text-[#1A4938] hover:bg-[#F4F0E6] hover:scale-[1.02] px-8 font-semibold shadow-lg">
            <Link href="/register">Join Free — Start Earning</Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
