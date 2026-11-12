import type { Content, Metric } from "@/lib/content/schemas";

/**
 * Cross-reference checks that a schema alone can't do:
 * every link from one piece of content to another must point at something that exists.
 * Returns a list of problems; empty means the content is consistent.
 */
export function findBrokenReferences(content: Content, knownRoutes: string[]): string[] {
  const problems: string[] = [];
  const caseStudySlugs = new Set(content.caseStudies.map((c) => c.slug));
  const routes = new Set(knownRoutes);

  const checkCaseStudy = (slug: string | undefined, where: string) => {
    if (slug && !caseStudySlugs.has(slug)) {
      problems.push(
        `${where} links to case study "${slug}", which does not exist (or is a draft).`,
      );
    }
  };
  const checkMetrics = (metrics: Metric[], where: string) =>
    metrics.forEach((m) => checkCaseStudy(m.caseStudy, `${where} → metric "${m.label}"`));

  checkMetrics(content.profile.proof, "profile.json proof");
  checkMetrics(content.profile.numbers, "profile.json numbers");
  content.profile.principles.forEach((p) =>
    checkCaseStudy(p.caseStudy, `profile.json principle "${p.title}"`),
  );

  content.experience.forEach((role) =>
    role.caseStudies.forEach((slug) => checkCaseStudy(slug, `experience/${role.slug}.mdx`)),
  );

  content.domain.problems.forEach((p) =>
    checkCaseStudy(p.caseStudy, `domain.json problem "${p.problem}"`),
  );
  checkMetrics(content.domain.kpis, "domain.json kpis");
  checkMetrics(content.openSource.stats, "open-source.json stats");

  content.skills.capabilities.forEach((capability) =>
    capability.evidence.forEach(({ href, label }) => {
      if (!href.startsWith("/")) return;
      const path = href.split("#")[0]!;
      const where = `skills.json capability "${capability.name}" → evidence "${label}"`;
      if (path.startsWith("/work/")) {
        checkCaseStudy(path.slice("/work/".length), where);
      } else if (!routes.has(path)) {
        problems.push(`${where} links to "${path}", which is not a page on this site.`);
      }
    }),
  );

  const featured = content.caseStudies.filter((c) => c.featured);
  if (featured.length > 1) {
    problems.push(
      `Only one case study can be featured, but ${featured.length} are: ${featured.map((c) => c.slug).join(", ")}.`,
    );
  }

  return problems;
}
