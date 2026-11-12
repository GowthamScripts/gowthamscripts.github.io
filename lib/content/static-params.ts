import "server-only";
import { getCaseStudies } from "@/lib/content";

/**
 * Slugs for /work/[slug]. A static export refuses an empty list, so while no case
 * study is published yet one placeholder slug is returned; it renders the 404 page.
 */
export function caseStudyStaticParams() {
  const studies = getCaseStudies();
  if (studies.length === 0) return [{ slug: "coming-soon" }];
  return studies.map((study) => ({ slug: study.slug }));
}
