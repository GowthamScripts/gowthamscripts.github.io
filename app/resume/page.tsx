import fs from "node:fs";
import path from "node:path";
import { Download } from "lucide-react";
import Link from "next/link";
import { PrintButton } from "@/components/resume/print-button";
import { CopyButton } from "@/components/shared/copy-button";
import { StickyBar } from "@/components/shared/sticky-bar";
import { Button } from "@/components/ui/button";
import { formatPeriod, getContact, getExperience, getProfile, getSkills } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export const metadata = pageMetadata("/resume");

export default function Page() {
  const profile = getProfile();
  const contact = getContact();
  const roles = getExperience();
  const skills = getSkills();
  const kit = contact.recruiterKit;

  // Offer the PDF only if the file is really there; otherwise "Save as PDF" (print) stands in.
  const pdfPath = contact.links.resumePdf;
  const hasPdf = fs.existsSync(path.join(process.cwd(), "public", pdfPath));
  const pdfName = `${profile.name.replace(/\s+/g, "-")}-${profile.role.replace(/\s+/g, "-")}-Resume.pdf`;

  const highlightsText = kit.highlights.map((item, index) => `${index + 1}. ${item}`).join("\n");
  const linksText = [
    `Portfolio: ${siteUrl}`,
    `LinkedIn: ${contact.links.linkedin}`,
    `GitHub: ${contact.links.github}`,
    `Email: ${contact.email}`,
  ].join("\n");

  const download = hasPdf ? (
    <Button asChild>
      <a href={pdfPath} download={pdfName}>
        <Download data-icon="inline-start" /> Download PDF
      </a>
    </Button>
  ) : (
    <PrintButton label="Save as PDF" />
  );

  return (
    <div className="container-page py-10 sm:py-14 print:py-0">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="text-sm text-muted-foreground">Last updated {profile.lastUpdated}</p>
        <div className="flex flex-wrap gap-2 [&>*]:h-10 [&>*]:px-3.5">
          {download}
          {hasPdf && <PrintButton variant="outline" />}
          <CopyButton
            text={kit.summary}
            label="Copy summary"
            copiedMessage="Summary copied"
            event="Resume Summary Copied"
            size="default"
          />
          <CopyButton
            text="current-url"
            label="Share link"
            copiedMessage="Link copied"
            size="default"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] print:mt-0 print:block">
        {/* Phones get the recruiter kit first (order-first); desktop shows it as a sidebar. */}
        <aside
          aria-labelledby="kit"
          className="order-first lg:sticky lg:top-24 lg:order-last lg:self-start print:hidden"
        >
          <div className="space-y-5 rounded-xl border bg-card p-6">
            <h2 id="kit" className="text-lg font-semibold tracking-tight">
              Recruiter kit
            </h2>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Summary</h3>
              <p className="text-sm text-muted-foreground">{kit.summary}</p>
              <CopyButton
                text={kit.summary}
                label="Copy summary"
                copiedMessage="Summary copied"
                event="Resume Summary Copied"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Top 3 highlights</h3>
              <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
                {kit.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
              <CopyButton
                text={highlightsText}
                label="Copy highlights"
                copiedMessage="Highlights copied"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Links</h3>
              <CopyButton text={linksText} label="Copy all links" copiedMessage="Links copied" />
            </div>
            <p className="border-t pt-4 text-sm text-muted-foreground">
              {contact.lookingFor.status}. {contact.lookingFor.workMode}, {contact.lookingFor.area}.
              References available on request.
            </p>
          </div>
        </aside>

        <article className="rounded-xl border bg-card p-6 sm:p-10 print:border-0 print:p-0">
          <header className="border-b pb-6">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{profile.name}</h1>
            <p className="mt-1 text-lg text-muted-foreground">
              {profile.role} · {profile.specialty} · {profile.location}
            </p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                {contact.email}
              </a>
              <a href={contact.links.linkedin} className="text-primary hover:underline">
                LinkedIn
              </a>
              <a href={contact.links.github} className="text-primary hover:underline">
                GitHub
              </a>
            </p>
          </header>

          <section aria-labelledby="summary" className="mt-6">
            <h2 id="summary" className="font-mono text-xs tracking-widest text-primary uppercase">
              Summary
            </h2>
            <p className="mt-2 leading-7">{kit.summary}</p>
          </section>

          <section aria-labelledby="experience" className="mt-8">
            <h2
              id="experience"
              className="font-mono text-xs tracking-widest text-primary uppercase"
            >
              Experience
            </h2>
            <ol className="mt-3 space-y-6">
              {roles.map((role) => (
                <li key={role.slug} className="break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6">
                    <h3 className="font-semibold">
                      {role.title} · {role.company ?? "Employer to be added"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formatPeriod(role.start, role.end)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {[
                      role.location,
                      (role.scope.teamSize ?? 0) > 0 && `Led a team of ${role.scope.teamSize}`,
                      role.scope.team,
                      role.scope.scale,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6">
                    {role.achievements.map((achievement) => (
                      <li key={achievement.text}>{achievement.text}</li>
                    ))}
                  </ul>
                  <Link
                    href={`/experience#${role.slug}`}
                    className="mt-2 inline-block text-sm font-medium text-primary hover:underline print:hidden"
                  >
                    More detail →
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          {profile.education.length > 0 && (
            <section aria-labelledby="education" className="mt-8 break-inside-avoid">
              <h2
                id="education"
                className="font-mono text-xs tracking-widest text-primary uppercase"
              >
                Education
              </h2>
              <ul className="mt-3 space-y-1.5 text-sm leading-6">
                {profile.education.map((item) => (
                  <li key={item.qualification}>
                    <span className="font-semibold">{item.qualification}</span>, {item.institution}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {profile.awards.length > 0 && (
            <section aria-labelledby="recognition" className="mt-8 break-inside-avoid">
              <h2
                id="recognition"
                className="font-mono text-xs tracking-widest text-primary uppercase"
              >
                Recognition
              </h2>
              <ul className="mt-3 space-y-1.5 text-sm leading-6">
                {profile.awards.map((award) => (
                  <li key={award.title}>
                    {award.title}
                    {award.detail && ` (${award.detail})`}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="skills" className="mt-8 break-inside-avoid">
            <h2 id="skills" className="font-mono text-xs tracking-widest text-primary uppercase">
              Skills
            </h2>
            <ul className="mt-3 space-y-1.5 text-sm leading-6">
              {skills.capabilities.map((capability) => (
                <li key={capability.name}>
                  <span className="font-semibold">{capability.name}:</span> {capability.proof}
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1.5 text-sm">
              {skills.technologies.map((group) => (
                <div key={group.category} className="grid gap-x-4 sm:grid-cols-[11rem_1fr]">
                  <dt className="font-semibold">{group.category}</dt>
                  <dd>{[...group.primary, ...group.familiar].join(", ")}</dd>
                </div>
              ))}
            </dl>
          </section>
        </article>
      </div>

      <StickyBar after={240}>
        {hasPdf ? (
          <Button asChild>
            <a href={pdfPath} download={pdfName}>
              Download PDF
            </a>
          </Button>
        ) : (
          <PrintButton label="Save as PDF" />
        )}
        <CopyButton
          text={kit.summary}
          label="Copy summary"
          copiedMessage="Summary copied"
          event="Resume Summary Copied"
          size="default"
        />
      </StickyBar>
    </div>
  );
}
