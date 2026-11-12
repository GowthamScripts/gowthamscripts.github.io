/**
 * Goal tracking (docs/10-architecture.md §10). Does nothing unless analytics is switched on
 * with NEXT_PUBLIC_PLAUSIBLE_DOMAIN — see components/layout/analytics.tsx.
 */
export type AnalyticsEvent = "Contact Sent" | "Resume Download" | "Resume Summary Copied";

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

export function track(event: AnalyticsEvent, props?: Record<string, string>) {
  if (typeof window !== "undefined") window.plausible?.(event, props ? { props } : undefined);
}
