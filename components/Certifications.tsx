import { ShieldCheck, Leaf, BadgeCheck, FlaskConical, type LucideIcon } from "lucide-react";
import { certifications } from "@/lib/data";
import { FadeIn } from "@/components/FadeIn";

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Leaf,
  BadgeCheck,
  FlaskConical,
};

export function Certifications() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {certifications.map((cert, i) => {
        const Icon = iconMap[cert.icon] ?? ShieldCheck;
        return (
          <FadeIn key={cert.name} delay={i * 0.05} direction="up">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
              <Icon size={18} className="text-[#2B7A5D]" strokeWidth={1.75} />
              <span className="text-sm font-medium text-foreground whitespace-nowrap">{cert.name}</span>
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}
