import { ContactBand } from "@/components/shared/contact-band";
import { PageIntro } from "@/components/shared/page-intro";
import { PlannedCaseStudyCard } from "@/components/shared/planned-case-study-card";
import { FilteredWorkList } from "@/components/work/work-list";
import { getCaseStudies, getPlannedCaseStudies } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/work");

export default function Page() {
  const studies = getCaseStudies();
  const planned = getPlannedCaseStudies();
  return (
    <div className="container-page py-12 sm:py-16">
      <PageIntro href="/work" />
      {studies.length > 0 && <FilteredWorkList studies={studies} />}

      {planned.length > 0 && (
        <section aria-labelledby="coming-soon" className="mt-12">
          <h2 id="coming-soon" className="text-xl font-semibold tracking-tight">
            Coming soon
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Write-ups in progress. Each will cover the business problem, the architecture decisions
            and the outcome.
          </p>
          <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {planned.map((study) => (
              <li key={study.slug}>
                <PlannedCaseStudyCard study={study} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
        Confidential details such as client names and internal figures are left out. I&apos;m happy
        to walk through more in conversation.
      </p>
      <ContactBand />
    </div>
  );
}
