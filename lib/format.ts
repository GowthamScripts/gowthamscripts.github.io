import type { Metric } from "@/lib/content/schemas";

/** Display helpers. Safe to import from client components. */

/** "$4M", "10+", "Technical Lead" — the display form of a metric. */
export function formatMetric(metric: Metric): string {
  if (metric.display !== undefined) return metric.display;
  return `${metric.prefix}${(metric.value ?? 0).toLocaleString("en-US")}${metric.suffix}`;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2022-03" → "Mar 2022"; "present" → "Present". */
export function formatMonth(value: string): string {
  if (value === "present") return "Present";
  const [year, month] = value.split("-").map(Number) as [number, number];
  return `${months[month - 1]} ${year}`;
}

/** "Mar 2022 – Present". Missing dates read "Dates to be added" (or "Current role"). */
export function formatPeriod(start?: string, end?: string): string {
  if (!start) return end === "present" ? "Current role · dates to be added" : "Dates to be added";
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "date to be added"}`;
}

export const achievementLabels = {
  LEAD: "Leadership",
  ARCH: "Architecture",
  BIZ: "Business impact",
  OPS: "Delivery",
  XFN: "Cross-functional",
  AI: "AI engineering",
  OSS: "Open source",
} as const;

export const pillarLabels = {
  leadership: "Leadership",
  business: "Business impact",
  domain: "Domain",
  architecture: "Architecture",
  "open-source": "Open source",
} as const;
