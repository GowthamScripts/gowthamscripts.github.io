"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { Skills } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

type Usage = Record<string, { label: string; href: string }[]>;

/**
 * Technologies with a search box (docs/09-ux.md §7): typing highlights matches and lists where
 * each matching technology was used.
 */
export function TechSearch({
  groups,
  usage,
}: {
  groups: Skills["technologies"];
  /** Lower-cased technology name → places it was used. */
  usage: Usage;
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const all = groups.flatMap((group) => [...group.primary, ...group.familiar]);
  const matches = q ? all.filter((tech) => tech.toLowerCase().includes(q)) : [];
  const isMatch = (tech: string) => matches.includes(tech);

  return (
    <div>
      <div className="relative max-w-sm">
        <Search
          aria-hidden
          className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search technologies, e.g. Kafka"
          aria-label="Search technologies"
          className="h-11 pl-9"
        />
      </div>

      <p role="status" className="mt-3 min-h-5 text-sm text-muted-foreground">
        {q &&
          (matches.length > 0
            ? `${matches.length} matching`
            : `Nothing matches “${query.trim()}”. Ask me about it.`)}
      </p>

      <dl className="mt-3 space-y-4 text-sm">
        {groups.map((group) => (
          <div key={group.category} className="grid gap-2 sm:grid-cols-[12rem_1fr]">
            <dt className="pt-1 font-semibold">{group.category}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {[
                ...group.primary.map((tech) => [tech, true] as const),
                ...group.familiar.map((tech) => [tech, false] as const),
              ].map(([tech, primary]) => (
                <span
                  key={tech}
                  className={cn(
                    "rounded-md border px-2.5 py-1 transition-opacity",
                    primary ? "bg-card font-medium" : "border-dashed text-muted-foreground",
                    q && isMatch(tech) && "border-primary bg-accent text-accent-foreground",
                    q && !isMatch(tech) && "opacity-35",
                  )}
                >
                  {tech}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-muted-foreground">
        Solid border: used daily, in depth. Dashed: shipped with it.
      </p>

      {matches.length > 0 && (
        <div className="mt-6 rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold">Where I used this</h3>
          <dl className="mt-3 space-y-3 text-sm">
            {matches.map((tech) => {
              const places = usage[tech.toLowerCase()] ?? [];
              return (
                <div key={tech} className="grid gap-1 sm:grid-cols-[8rem_1fr]">
                  <dt className="font-medium">{tech}</dt>
                  <dd className="flex flex-wrap gap-x-4 gap-y-1">
                    {places.length > 0 ? (
                      places.map((place) => (
                        <Link
                          key={place.href}
                          href={place.href}
                          className="text-primary hover:underline"
                        >
                          {place.label}
                        </Link>
                      ))
                    ) : (
                      <span className="text-muted-foreground">Not tied to a listed role yet.</span>
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      )}
    </div>
  );
}
