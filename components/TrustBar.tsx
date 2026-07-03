import { Star, ShieldCheck, Users, Truck } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

const trustItems = [
  { icon: Users, value: "12,000+", label: "Happy Customers" },
  { icon: Star, value: "4.9/5", label: "Google Rating" },
  { icon: ShieldCheck, value: "FSSAI", label: "Lic: 12421033000123" },
  { icon: Truck, value: "2,340+", label: "Orders This Month" },
];

export function TrustBar() {
  return (
    <section className="py-6 bg-primary/5 border-y border-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3 justify-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <item.icon size={18} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-sm md:text-base font-bold text-foreground leading-tight">{item.value}</p>
                  <p className="text-[11px] md:text-xs text-muted-foreground">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
