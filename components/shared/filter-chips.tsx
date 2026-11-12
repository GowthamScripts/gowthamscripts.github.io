"use client";

import { cn } from "@/lib/utils";

type FilterChipsProps<T extends string> = {
  label: string;
  options: readonly { value: T; label: string }[];
  active: readonly T[];
  /** null clears the filter. */
  onToggle: (value: T | null) => void;
};

/** Multi-select filter chips. Scrolls sideways on narrow screens. */
export function FilterChips<T extends string>({
  label,
  options,
  active,
  onToggle,
}: FilterChipsProps<T>) {
  const chip =
    "inline-flex h-9 shrink-0 items-center rounded-full border px-3.5 text-sm font-medium transition-colors";
  const on = "border-primary bg-primary text-primary-foreground";
  const off = "bg-card text-muted-foreground hover:text-foreground";

  return (
    <div
      role="group"
      aria-label={label}
      className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      <button
        type="button"
        aria-pressed={active.length === 0}
        onClick={() => onToggle(null)}
        className={cn(chip, active.length === 0 ? on : off)}
      >
        All
      </button>
      {options.map((option) => {
        const pressed = active.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={pressed}
            onClick={() => onToggle(option.value)}
            className={cn(chip, pressed ? on : off)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
