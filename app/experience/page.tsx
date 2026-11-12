import { ExpandHint, FilteredExperience } from "@/components/experience/experience-list";
import { ContactBand } from "@/components/shared/contact-band";
import { PageIntro } from "@/components/shared/page-intro";
import { ScopeChart } from "@/components/experience/scope-chart";
import { getCaseStudies, getExperience, getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/experience");

export default function Page() {
  const roles = getExperience();
  const profile = getProfile();
  const caseStudyTitles = Object.fromEntries(
    getCaseStudies().map((study) => [study.slug, study.title]),
  );
  const starts = roles.flatMap((role) => (role.start ? [role.start] : [])).sort();
  const firstYear = starts[0]?.slice(0, 4);
  const leadingSince = roles
    .filter((role) => ((role.scope.teamSize ?? 0) > 0 || role.scope.team) && role.start)
    .map((role) => role.start!.slice(0, 4))
    .sort()[0];
  // Oldest first: "Software Engineer → Senior Software Engineer → Technical Lead".
  const progression = [...roles].reverse().map((role) => role.title);

  return (
    <div className="container-page py-12 sm:py-16">
      <PageIntro href="/experience" />
      <p className="mt-4 text-sm text-muted-foreground">
        {firstYear ? `${roles.length} roles since ${firstYear}` : progression.join(" → ")}
        {leadingSince && ` · leading teams since ${leadingSince}`}
      </p>
      <ExpandHint />

      <ScopeChart roles={roles} today={profile.lastUpdated.slice(0, 7)} />
      <FilteredExperience roles={roles} caseStudyTitles={caseStudyTitles} />

      {(profile.education.length > 0 || profile.awards.length > 0) && (
        <div className="mt-16 grid gap-10 md:grid-cols-2">
          {profile.education.length > 0 && (
            <section aria-labelledby="education">
              <h2 id="education" className="text-xl font-semibold tracking-tight">
                Education
              </h2>
              <ul className="mt-4 space-y-4">
                {profile.education.map((item) => (
                  <li key={item.qualification}>
                    <p className="font-medium">{item.qualification}</p>
                    <p className="text-sm text-muted-foreground">{item.institution}</p>
                    {item.detail && (
                      <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {profile.awards.length > 0 && (
            <section aria-labelledby="recognition">
              <h2 id="recognition" className="text-xl font-semibold tracking-tight">
                Recognition
              </h2>
              <ul className="mt-4 space-y-4">
                {profile.awards.map((award) => (
                  <li key={award.title}>
                    <p className="font-medium">{award.title}</p>
                    {award.detail && (
                      <p className="text-sm text-muted-foreground">{award.detail}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      <ContactBand />
    </div>
  );
}
