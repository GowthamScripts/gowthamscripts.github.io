import type { Experience } from "@/lib/content/schemas";
import { formatMonth } from "@/lib/format";

/** Months since year 0, so dates can be placed on a line. */
const toMonths = (value: string) => {
  const [year, month] = value.split("-").map(Number) as [number, number];
  return year * 12 + (month - 1);
};

/**
 * Team size over time, as a step line (docs/09-ux.md §3).
 * One series, so no legend: the title names it. Every point is labelled directly, and the same
 * numbers are in a table for screen readers. The line is SVG; markers and labels are HTML so the
 * text stays readable at any width.
 */
export function ScopeChart({ roles, today }: { roles: Experience[]; today: string }) {
  // Only roles with a start date and a team size can be placed on the chart.
  const dated = roles.flatMap((role) =>
    role.start && role.scope.teamSize !== undefined
      ? [{ role, start: role.start, end: role.end ?? today, size: role.scope.teamSize }]
      : [],
  );
  const points = dated
    .sort((a, b) => a.start.localeCompare(b.start))
    .map((item) => ({
      role: { ...item.role, start: item.start, end: item.end },
      start: toMonths(item.start),
      end: toMonths(item.end === "present" ? today : item.end),
      size: item.size,
    }));
  if (points.length < 2) return null;

  const first = points[0]!.start;
  const last = Math.max(...points.map((point) => point.end));
  const max = Math.max(...points.map((point) => point.size), 1);
  const x = (months: number) => ((months - first) / (last - first)) * 100;
  // Leave headroom above the tallest point for its label.
  const y = (size: number) => 100 - (size / max) * 100;

  const path = points
    .map((point, index) =>
      index === 0
        ? `M ${x(point.start)} ${y(point.size)} H ${x(point.end)}`
        : `H ${x(point.start)} V ${y(point.size)} H ${x(point.end)}`,
    )
    .join(" ");

  const label = (size: number) => (size > 0 ? `Team of ${size}` : "Individual contributor");

  return (
    <figure className="mt-10 rounded-xl border bg-card p-5 sm:p-6">
      <figcaption>
        <h2 className="font-semibold">Team size over time</h2>
        <p className="mt-1 text-sm text-muted-foreground">Engineers led directly in each role.</p>
      </figcaption>

      <div aria-hidden className="relative mt-12 mr-2 ml-1 h-28">
        <div className="absolute inset-x-0 bottom-0 border-b" />
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full animate-wipe overflow-visible"
        >
          <path
            d={path}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {points.map((point, index) => (
          <div
            key={point.role.slug}
            className="absolute animate-pop"
            style={
              {
                left: `${x(point.start)}%`,
                top: `${y(point.size)}%`,
                "--i": index,
              } as React.CSSProperties
            }
          >
            {/* 10px marker with a 2px surface ring so it reads on top of the line. */}
            <span className="absolute -top-[5px] -left-[5px] size-2.5 rounded-full bg-primary ring-2 ring-card" />
            <span
              className={`absolute bottom-3 text-xs font-medium whitespace-nowrap ${index === 0 ? "left-0" : "-translate-x-1/3"}`}
            >
              {label(point.size)}
            </span>
          </div>
        ))}
      </div>
      <div aria-hidden className="relative mt-2 mr-2 ml-1 h-5 text-xs text-muted-foreground">
        {points.map((point, index) => (
          <span
            key={point.role.slug}
            className={`absolute ${index === 0 ? "" : "-translate-x-1/3"}`}
            style={{ left: `${x(point.start)}%` }}
          >
            {formatMonth(point.role.start)}
          </span>
        ))}
        <span className="absolute right-0">
          {formatMonth(points.at(-1)!.role.end === "present" ? today : points.at(-1)!.role.end)}
        </span>
      </div>

      <table className="sr-only">
        <caption>Team size by role</caption>
        <thead>
          <tr>
            <th scope="col">Role</th>
            <th scope="col">From</th>
            <th scope="col">To</th>
            <th scope="col">Engineers led</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.role.slug}>
              <th scope="row">
                {point.role.title}, {point.role.company}
              </th>
              <td>{formatMonth(point.role.start)}</td>
              <td>{formatMonth(point.role.end)}</td>
              <td>{point.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
