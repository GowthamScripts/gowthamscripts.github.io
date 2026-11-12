import Link from "next/link";
import { ViewTransition } from "react";
import { Tag } from "@/components/shared/page-intro";
import { formatMetric, pillarLabels } from "@/lib/format";
import type { CaseStudy } from "@/lib/content/schemas";

export function CaseStudyCard({
  study,
  headingLevel = 3,
}: {
  study: CaseStudy;
  /** 2 where the card sits directly under the page title; 3 under a section heading. */
  headingLevel?: 2 | 3;
}) {
  const Heading = `h${headingLevel}` as const;
  return (
    <Link
      href={`/work/${study.slug}`}
      className="group flex h-full flex-col gap-3 rounded-xl border bg-card p-6 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <p className="text-sm text-muted-foreground">
        {study.featured && <span className="font-medium text-primary">Featured · </span>}
        {study.role} · {study.readingMinutes} min read
      </p>
      {/* Same name as the <h1> on the case study page, so the title morphs between the two. */}
      <ViewTransition name={`case-study-title-${study.slug}`}>
        <Heading className="text-xl font-semibold tracking-tight text-balance">
          {study.title}
        </Heading>
      </ViewTransition>
      <p className="text-muted-foreground">{study.subtitle}</p>
      <p className="mt-auto pt-2">
        <span className="text-2xl font-semibold tabular-nums">
          {formatMetric(study.heroMetric)}
        </span>{" "}
        <span className="text-sm text-muted-foreground">{study.heroMetric.label}</span>
      </p>
      <p className="flex flex-wrap gap-1.5">
        {study.pillars.map((pillar) => (
          <Tag key={pillar}>{pillarLabels[pillar]}</Tag>
        ))}
      </p>
    </Link>
  );
}
