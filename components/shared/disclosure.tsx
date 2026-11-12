import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Expandable card built on <details>, so it works without JavaScript and is keyboard- and
 * screen-reader-friendly by default. Give several the same `group` to allow only one open at a time.
 */
export function Disclosure({
  summary,
  children,
  group,
  defaultOpen,
  className,
}: {
  summary: React.ReactNode;
  children: React.ReactNode;
  group?: string;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details
      name={group}
      open={defaultOpen}
      className={cn("group rounded-xl border bg-card", className)}
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-xl p-5 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1">{summary}</span>
        <ChevronDown
          aria-hidden
          className="mt-0.5 size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
        />
      </summary>
      <div className="px-5 pb-5">{children}</div>
    </details>
  );
}
