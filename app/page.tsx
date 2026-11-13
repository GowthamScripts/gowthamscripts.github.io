import { ArrowRight, ArrowUpRight, Download, Plus } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { CaseStudyCard } from "@/components/shared/case-study-card";
import { ContactBand } from "@/components/shared/contact-band";
import { MetricTile } from "@/components/shared/metric-tile";
import { Tag } from "@/components/shared/page-intro";
import { PlannedCaseStudyCard } from "@/components/shared/planned-case-study-card";
import { StickyBar } from "@/components/shared/sticky-bar";
import { Button } from "@/components/ui/button";
import {
  formatPeriod,
  getCaseStudies,
  getContact,
  getDomain,
  getExperience,
  getPlannedCaseStudies,
  getProfile,
  getProjects,
} from "@/lib/content";
import { stagger } from "@/lib/motion";

function SectionHeading({
  id,
  title,
  link,
}: {
  id: string;
  title: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h2 id={id} className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {link && (
        <Link
          href={link.href}
          className="shrink-0 text-sm font-medium text-primary hover:underline"
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const profile = getProfile();
  const contact = getContact();
  const domain = getDomain();
  const studies = getCaseStudies();
  const planned = getPlannedCaseStudies();
  const projects = getProjects()
    .filter((project) => project.type === "oss")
    .slice(0, 2);
  // Oldest first, so the timeline reads as a progression.
  const roles = [...getExperience()].reverse();

  const words = profile.hero.headline.split(" ");
  const headlineGroups = Math.ceil(words.length / 3);

  return (
    <div className="container-page">
      <section className="max-w-3xl py-16 sm:py-24">
        <p
          className="animate-rise font-mono text-xs tracking-widest text-primary uppercase"
          style={{ "--i": 0 } as React.CSSProperties}
        >
          {profile.role} · {profile.specialty} · {profile.location}
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-6xl sm:leading-[1.05]">
          {/* Each word is its own box so the line can wrap anywhere on narrow screens;
              words rise in groups of three. */}
          {words.map((word, index) => (
            <span key={index}>
              <span
                className="inline-block animate-rise"
                style={{ "--i": Math.floor(index / 3) + 1 } as React.CSSProperties}
              >
                {word}
              </span>
              {index < words.length - 1 && " "}
            </span>
          ))}
        </h1>
        <div className="animate-rise" style={{ "--i": headlineGroups + 2 } as React.CSSProperties}>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            {profile.hero.subheadline}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-5 text-base">
              <Link href="/work">
                View case studies <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-5 text-base">
              <Link href="/resume">
                <Download data-icon="inline-start" /> Resume
              </Link>
            </Button>
          </div>
          {profile.availability.open && (
            <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-2 shrink-0 rounded-full bg-success" aria-hidden />
              {profile.availability.label}
            </p>
          )}
        </div>
      </section>

      <section aria-label="At a glance">
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {profile.proof.map((metric, index) => (
            <li
              key={metric.label}
              className="animate-rise [&>*]:h-full"
              style={{ "--i": headlineGroups + 3 + index } as React.CSSProperties}
            >
              {/* CSS, not <Reveal>: these tiles are on the first screen, so they must not wait
                  for JavaScript before they count as painted. */}
              <MetricTile metric={metric} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="selected-work" className="mt-24">
        <SectionHeading
          id="selected-work"
          title="Selected case studies"
          link={{ href: "/work", label: "All case studies" }}
        />
        {studies.length === 0 && (
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Detailed write-ups are in progress. Each will cover the business problem, the
            architecture decisions and the outcome, without confidential details.
          </p>
        )}
        <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {studies.slice(0, 3).map((study, index) => (
            <li key={study.slug}>
              <Reveal delay={index * stagger} className="h-full">
                <CaseStudyCard study={study} />
              </Reveal>
            </li>
          ))}
          {planned.slice(0, Math.max(0, 6 - studies.length)).map((study, index) => (
            <li key={study.slug}>
              <Reveal delay={(studies.length + index) * stagger} className="h-full">
                <PlannedCaseStudyCard study={study} />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="philosophy" className="mt-24">
        <SectionHeading id="philosophy" title="Engineering philosophy" />
        <ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {profile.principles.map((principle, index) => (
            <li key={principle.title}>
              <Reveal delay={index * stagger} className="h-full">
                <div className="h-full rounded-xl border bg-card p-6">
                  <span className="font-mono text-xs text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-semibold">{principle.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {principle.description}
                  </p>
                  {principle.caseStudy && (
                    <Link
                      href={`/work/${principle.caseStudy}`}
                      className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                    >
                      See it in practice →
                    </Link>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="domain" className="mt-24">
        <SectionHeading
          id="domain"
          title="Domain expertise"
          link={{ href: "/domain", label: "Explore" }}
        />
        <p className="mt-3 max-w-2xl text-muted-foreground">{domain.oneLiner}</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {domain.industries.map((industry, index) => (
            <li key={industry.name}>
              <Reveal delay={index * stagger} className="h-full">
                <div className="h-full rounded-xl border bg-card p-6">
                  <h3 className="font-semibold">{industry.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {industry.problems}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="open-source" className="mt-24">
        <SectionHeading
          id="open-source"
          title="Open source"
          link={{ href: "/open-source", label: "All projects" }}
        />
        <ul className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
          {projects.map((project) => (
            <li key={project.slug}>
              <Reveal className="h-full">
                <div className="flex h-full flex-col gap-4 rounded-xl border bg-card p-6 sm:p-8">
                  <p className="font-mono text-xs tracking-widest text-primary uppercase">
                    {project.role}
                  </p>
                  <h3 className="-mt-2 text-2xl font-semibold tracking-tight">{project.name}</h3>
                  <p className="text-muted-foreground">{project.summary}</p>
                  {project.architecture && (
                    <div>
                      <h4 className="text-sm font-semibold">Architecture</h4>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {project.architecture}
                      </p>
                    </div>
                  )}
                  {project.technologies.length > 0 && (
                    <p className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <Tag key={tech}>{tech}</Tag>
                      ))}
                    </p>
                  )}
                  <div className="mt-auto pt-2">
                    <Button asChild variant="outline" className="h-11 px-4">
                      <a href={project.repo} target="_blank" rel="noreferrer">
                        View on GitHub <ArrowUpRight data-icon="inline-end" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </Button>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
          <li>
            <Reveal delay={stagger} className="h-full">
              <div className="flex h-full flex-col items-start justify-center gap-3 rounded-xl border border-dashed p-6 sm:p-8">
                <span className="grid size-10 place-items-center rounded-full bg-secondary">
                  <Plus className="size-5 text-muted-foreground" aria-hidden />
                </span>
                <h3 className="font-semibold">More open-source work</h3>
                <p className="text-sm text-muted-foreground">
                  New projects will appear here as they are published.
                </p>
                <a
                  href={contact.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Follow on GitHub ↗<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </Reveal>
          </li>
        </ul>
      </section>

      <section aria-labelledby="career" className="mt-24">
        <SectionHeading
          id="career"
          title="Career timeline"
          link={{ href: "/experience", label: "Full experience" }}
        />
        {/* A vertical line on phones, a horizontal one from the md breakpoint up. */}
        <ol className="mt-8 grid gap-0 border-l md:auto-cols-fr md:grid-flow-col md:border-t md:border-l-0">
          {roles.map((role, index) => {
            const current = role.end === "present";
            return (
              <li key={role.slug} className="relative pb-8 pl-6 md:pt-6 md:pr-6 md:pb-0 md:pl-0">
                <span
                  aria-hidden
                  className={`absolute top-1.5 -left-[5px] size-2.5 rounded-full md:-top-[5px] md:left-0 ${current ? "bg-primary ring-4 ring-primary/20" : "bg-primary"}`}
                />
                <Reveal delay={index * 0.12}>
                  <Link href={`/experience#${role.slug}`} className="group block">
                    <span className="block font-mono text-xs text-muted-foreground uppercase">
                      {current ? "Current role" : `Step ${index + 1}`}
                    </span>
                    <span className="mt-1 block text-lg font-semibold group-hover:text-primary">
                      {role.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {role.company ?? "Employer to be added"}
                    </span>
                    {role.start && (
                      <span className="block text-xs text-muted-foreground">
                        {formatPeriod(role.start, role.end)}
                      </span>
                    )}
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </section>

      {profile.values.length > 0 && (
        <section aria-labelledby="values" className="mt-24">
          <SectionHeading id="values" title="Professional values" />
          <dl className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {profile.values.map((value) => (
              <div key={value.title} className="border-t-2 border-primary pt-4">
                <dt className="font-semibold">{value.title}</dt>
                <dd className="mt-2 text-sm leading-6 text-muted-foreground">
                  {value.description}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <ContactBand text={`${profile.availability.label}. ${contact.replyTime}`} />

      <StickyBar>
        <Button asChild variant="outline">
          <Link href="/resume">Resume</Link>
        </Button>
        <Button asChild>
          <Link href="/contact">Contact</Link>
        </Button>
      </StickyBar>
    </div>
  );
}
