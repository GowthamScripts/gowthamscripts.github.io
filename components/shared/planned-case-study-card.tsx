import { Tag } from "@/components/shared/page-intro";
import type { PlannedCaseStudy } from "@/lib/content/schemas";

/** A case study that is announced but not written yet. Not a link: there is no page yet. */
export function PlannedCaseStudyCard({
  study,
  headingLevel = 3,
}: {
  study: PlannedCaseStudy;
  headingLevel?: 2 | 3;
}) {
  const Heading = `h${headingLevel}` as const;
  return (
    <article className="flex h-full flex-col gap-3 rounded-xl border border-dashed bg-card p-6">
      <p className="flex items-center justify-between gap-3 text-sm">
        <span className="font-mono text-xs tracking-widest text-primary uppercase">
          {study.industry}
        </span>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
          Coming soon
        </span>
      </p>
      <Heading className="text-xl font-semibold tracking-tight text-balance">{study.title}</Heading>
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Role: </span>
        {study.role}
      </p>
      <p className="text-muted-foreground">{study.summary}</p>
      {study.technologies.length > 0 && (
        <p className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {study.technologies.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </p>
      )}
    </article>
  );
}
