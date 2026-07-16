"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Search } from "lucide-react";

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
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/admin/orders?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateFilter("q", searchValue.trim());
  }

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-6">
      <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search order ID, name, email..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="h-9 rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary w-full sm:w-[260px]"
        />
      </form>

      <div className="flex flex-wrap items-center gap-3">
        <Filter size={18} className="text-muted-foreground hidden sm:block" />
        
        <select
          value={searchParams.get("status") || "all"}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="h-9 flex-1 sm:flex-none rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
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
          className="h-9 flex-1 sm:flex-none rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
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
            className="h-9 flex-1 sm:flex-none rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
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
    </div>
  );
}
