"use client";

import { useRef } from "react";
import { useInViewOnce } from "@/lib/hooks/use-in-view";
import { cn } from "@/lib/utils";

/**
 * Fade + rise once when 15% visible (docs/09-ux.md A6).
 * CSS transitions and an IntersectionObserver, so no animation library ships with every page.
 * `data-reveal` lets the <noscript> rule in the root layout, and the reduced-motion rule in
 * globals.css, show content straight away.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  /** Seconds. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInViewOnce(ref, 0.15);

  return (
    <div
      ref={ref}
      data-reveal
      data-shown={shown || undefined}
      style={{ transitionDelay: shown && delay ? `${delay}s` : undefined }}
      className={cn(
        "transition-[opacity,translate] duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
