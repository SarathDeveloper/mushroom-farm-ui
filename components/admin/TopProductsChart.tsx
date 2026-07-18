"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type DataPoint = {
  name: string;
  quantity: number;
};

function truncateName(name: string, max: number) {
  return name.length > max ? name.slice(0, max - 1) + "…" : name;
}

export function TopProductsChart({ data }: { data: DataPoint[] }) {
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
        Top Selling Products
      </h2>
      {data.length === 0 ? (
        <p className="text-[var(--color-body)] text-sm">No sales data available yet.</p>
      ) : (
        <div className="h-[250px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: isMobile ? 10 : 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: isMobile ? 10 : 12, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={isMobile ? 90 : 140}
                tick={{ fontSize: isMobile ? 10 : 12, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => truncateName(val, isMobile ? 12 : 20)}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
                formatter={(value) => [`${value} units`, "Sold"]}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Bar
                dataKey="quantity"
                fill="var(--color-primary-dark)"
                radius={[0, 6, 6, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
