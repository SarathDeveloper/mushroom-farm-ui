"use client";

import { useState } from "react";
import { MapPin, Check, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SERVICEABLE_PINCODES: Record<string, { area: string; days: number }> = {
  "636001": { area: "Salem", days: 1 },
  "636002": { area: "Salem", days: 1 },
  "636003": { area: "Salem", days: 1 },
  "636004": { area: "Salem Town", days: 1 },
  "636005": { area: "Salem Steel City", days: 1 },
  "636006": { area: "Suramangalam", days: 1 },
  "636007": { area: "Hasthampatti", days: 1 },
  "636008": { area: "Ammapet", days: 1 },
  "636009": { area: "Fairlands", days: 1 },
  "636010": { area: "Kondalampatti", days: 1 },
  "636011": { area: "Attur Main", days: 1 },
  "636012": { area: "Salem North", days: 1 },
  "636102": { area: "Attur", days: 1 },
  "636104": { area: "Gangavalli", days: 2 },
  "636105": { area: "Valapady", days: 1 },
  "636106": { area: "Thammampatti", days: 2 },
  "636109": { area: "Yercaud", days: 2 },
  "636201": { area: "Mettur", days: 2 },
  "636301": { area: "Omalur", days: 1 },
  "636302": { area: "Mecheri", days: 2 },
  "636401": { area: "Rasipuram", days: 2 },
  "636502": { area: "Sankari", days: 2 },
  "637001": { area: "Namakkal", days: 2 },
  "637002": { area: "Namakkal", days: 2 },
  "637003": { area: "Namakkal", days: 2 },
  "638001": { area: "Erode", days: 2 },
  "638002": { area: "Erode", days: 2 },
  "638003": { area: "Erode", days: 2 },
  "641001": { area: "Coimbatore", days: 2 },
  "641002": { area: "Coimbatore", days: 2 },
  "600001": { area: "Chennai", days: 3 },
  "600002": { area: "Chennai", days: 3 },
  "600017": { area: "Chennai T Nagar", days: 3 },
  "600028": { area: "Chennai Adyar", days: 3 },
  "560001": { area: "Bangalore", days: 3 },
  "560002": { area: "Bangalore", days: 3 },
  "620001": { area: "Trichy", days: 2 },
  "620002": { area: "Trichy", days: 2 },
  "625001": { area: "Madurai", days: 2 },
  "625002": { area: "Madurai", days: 2 },
};

interface PincodeCheckerProps {
  compact?: boolean;
}

export function PincodeChecker({ compact = false }: PincodeCheckerProps) {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<{ available: boolean; area?: string; days?: number } | null>(null);
  const [checking, setChecking] = useState(false);

  const checkPincode = () => {
    if (pincode.length !== 6) return;
    setChecking(true);
    setTimeout(() => {
      const match = SERVICEABLE_PINCODES[pincode];
      if (match) {
        setResult({ available: true, area: match.area, days: match.days });
      } else {
        setResult({ available: false });
      }
      setChecking(false);
    }, 500);
  };

  return (
    <div className={compact ? "" : "rounded-2xl border border-border bg-card p-5"}>
      {!compact && (
        <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
          <MapPin size={16} className="text-primary" /> Check Delivery Availability
        </h3>
      )}
      <div className="flex gap-2">
        <Input
          value={pincode}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 6);
            setPincode(val);
            if (val.length < 6) setResult(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && checkPincode()}
          placeholder="Enter 6-digit pincode"
          className="h-10 flex-1"
        />
        <Button
          onClick={checkPincode}
          disabled={pincode.length !== 6 || checking}
          size="sm"
          className="h-10 px-4"
        >
          {checking ? <Loader2 size={16} className="animate-spin" /> : "Check"}
        </Button>
      </div>
      {result && (
        <div className={`mt-3 flex items-start gap-2 text-sm ${result.available ? "text-[var(--color-success)]" : "text-[var(--color-error)]"}`}>
          {result.available ? (
            <>
              <Check size={16} className="shrink-0 mt-0.5" />
              <span>
                Delivery available to <strong>{result.area}</strong> — arrives in{" "}
                <strong>{result.days === 1 ? "1 day" : `${result.days} days`}</strong>
              </span>
            </>
          ) : (
            <>
              <X size={16} className="shrink-0 mt-0.5" />
              <span>Sorry, we don&apos;t deliver to this pincode yet. <a href="/bulk-orders" className="underline text-primary">Try bulk orders</a> or <a href="https://wa.me/919876543210" className="underline text-primary">contact us on WhatsApp</a>.</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
