"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const dateOptions = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

export function OrderFilters({ cities }: { cities: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/admin/orders?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <Filter size={18} className="text-muted-foreground" />
      
      <select
        value={searchParams.get("status") || "all"}
        onChange={(e) => updateFilter("status", e.target.value)}
        className="h-9 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("date") || "all"}
        onChange={(e) => updateFilter("date", e.target.value)}
        className="h-9 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
      >
        {dateOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {cities.length > 0 && (
        <select
          value={searchParams.get("city") || "all"}
          onChange={(e) => updateFilter("city", e.target.value)}
          className="h-9 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
        >
          <option value="all">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
