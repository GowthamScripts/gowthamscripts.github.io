import { cn } from "@/lib/utils";

/**
 * Fade + rise as the content scrolls into view (docs/09-ux.md A6).
 *
 * Pure CSS, driven by the scroll position (`animation-timeline: view()`, see `.reveal` in
 * globals.css). Content is never left hidden waiting for a script: browsers without scroll-driven
 * animations, readers who prefer reduced motion, print and full-page screenshots all get it
 * fully visible. `data-reveal` lets the print and no-JavaScript rules find it.
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  /** Kept for existing callers; scroll position, not time, now orders the reveal. */
  delay?: number;
  className?: string;
}) {
  return (
    <div data-reveal className={cn("reveal", className)}>
      {children}
    </div>
  );
}
