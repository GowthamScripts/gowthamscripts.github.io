import Link from "next/link";
import { CountUp } from "@/components/motion/count-up";
import type { Metric } from "@/lib/content/schemas";

/**
 * A headline fact with its label and context. Numbers count up; text facts ("Technical Lead")
 * are shown as written. Links to the case study that proves it, if any.
 */
export function MetricTile({ metric }: { metric: Metric }) {
  const body = (
    <>
      <span className="block text-3xl font-semibold tracking-tight text-balance tabular-nums sm:text-4xl">
        {metric.display ?? (
          <CountUp
            value={metric.value ?? 0}
            from={metric.before}
            prefix={metric.prefix}
            suffix={metric.suffix}
          />
        )}
      </span>
      <span className="mt-1 block text-sm text-muted-foreground">{metric.label}</span>
      {metric.context && (
        <span className="mt-2 block text-xs text-muted-foreground">{metric.context}</span>
      )}
    </>
  );
  return metric.caseStudy ? (
    <Link
      href={`/work/${metric.caseStudy}`}
      className="block rounded-xl border bg-card p-5 transition-colors hover:border-primary/40"
    >
      {body}
    </Link>
  ) : (
    <div className="rounded-xl border bg-card p-5">{body}</div>
  );
}
