"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type DataPoint = {
  date: string;
  revenue: number;
};

export function SalesChart({ data }: { data: DataPoint[] }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-4 sm:p-5">
      <h2 className="font-heading font-semibold text-foreground mb-4 sm:mb-6">
        Daily Revenue (Last 30 Days)
      </h2>
      <div className="h-[250px] sm:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: isMobile ? 10 : 20, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary-dark)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-primary-dark)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: isMobile ? 10 : 12, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              interval={isMobile ? Math.ceil(data.length / 5) - 1 : "preserveStartEnd"}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 50 : 30}
            />
            <YAxis
              tick={{ fontSize: isMobile ? 10 : 12, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              width={isMobile ? 40 : 60}
              tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "13px",
              }}
              formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
              labelStyle={{ color: "var(--foreground)" }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-primary-dark)"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
