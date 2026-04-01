"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTransition, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RegistrationsSearchProps {
  defaultQuery: string;
  defaultStatus: string;
  defaultCheckin: string;
}

const STATUS_OPTIONS = [
  { value: "all",       label: "All statuses" },
  { value: "confirmed", label: "Confirmed" },
  { value: "pending",   label: "Pending" },
  { value: "waitlisted",label: "Waitlisted" },
];

const CHECKIN_OPTIONS = [
  { value: "all", label: "All" },
  { value: "yes", label: "Checked in" },
  { value: "no",  label: "Not checked in" },
];

export function RegistrationsSearch({
  defaultQuery,
  defaultStatus,
  defaultCheckin,
}: RegistrationsSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(defaultQuery);

  function push(updates: Record<string, string>) {
    const params = new URLSearchParams();
    const merged = {
      q: query,
      status: defaultStatus,
      checkin: defaultCheckin,
      ...updates,
    };
    Object.entries(merged).forEach(([k, v]) => {
      if (v && v !== "all" && v !== "") params.set(k, v);
    });
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleSearch(value: string) {
    setQuery(value);
    push({ q: value });
  }

  function clearAll() {
    setQuery("");
    startTransition(() => router.push(pathname));
  }

  const hasFilters = query || defaultStatus !== "all" || defaultCheckin !== "all";

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="pl-9"
        />
        {query && (
          <button
            onClick={() => handleSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status filter */}
      <select
        value={defaultStatus}
        onChange={(e) => push({ status: e.target.value })}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Check-in filter */}
      <select
        value={defaultCheckin}
        onChange={(e) => push({ checkin: e.target.value })}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {CHECKIN_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className={cn(
            "h-9 px-3 rounded-md text-sm text-muted-foreground hover:text-foreground",
            "border border-border hover:border-foreground/30 transition-colors"
          )}
        >
          Clear
        </button>
      )}
    </div>
  );
}
