import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ContactBand } from "@/components/shared/contact-band";
import { MetricTile } from "@/components/shared/metric-tile";
import { PageIntro, Section, Tag } from "@/components/shared/page-intro";
import { formatMetric, formatMonth, getOpenSource, getProjects } from "@/lib/content";
import type { Project } from "@/lib/content/schemas";
import { stagger } from "@/lib/motion";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/open-source");

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
    >
      {children}
      <ArrowUpRight className="size-3.5" aria-hidden />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  return (
    <li
      id={project.slug}
      className="grid scroll-mt-24 gap-6 rounded-xl border bg-card p-6 sm:p-8 lg:grid-cols-[1fr_1.2fr]"
    >
      <div>
        <p className="flex flex-wrap gap-1.5">
          <Tag>{project.role}</Tag>
          <Tag>{project.status}</Tag>
          {project.license && <Tag>{project.license}</Tag>}
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">{project.name}</h3>
        <p className="mt-2 text-muted-foreground">{project.summary}</p>
        {project.adoption && (
          <p className="mt-4">
            <span className="text-3xl font-semibold tracking-tight tabular-nums">
              {formatMetric(project.adoption)}
            </span>{" "}
            <span className="text-sm text-muted-foreground">{project.adoption.label}</span>
          </p>
        )}
        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <ExternalLink href={project.repo}>View on GitHub</ExternalLink>
          {project.package && <ExternalLink href={project.package}>Package</ExternalLink>}
        </p>
      </div>
      <dl className="space-y-4 text-sm leading-6">
        {project.problem && (
          <div>
            <dt className="text-xs text-muted-foreground">What it does</dt>
            <dd>{project.problem}</dd>
          </div>
        )}
        {project.architecture && (
          <div>
            <dt className="text-xs text-muted-foreground">Architecture</dt>
            <dd>{project.architecture}</dd>
          </div>
        )}
        {project.technologies.length > 0 && (
          <div>
            <dt className="text-xs text-muted-foreground">Technology</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </dd>
          </div>
        )}
        {project.contributions.length > 0 && (
          <div>
            <dt className="text-xs text-muted-foreground">What I did</dt>
            <dd>
              <ul className="mt-1 list-disc space-y-1.5 pl-5">
                {project.contributions.map((item) => (
                  <li key={item.text}>
                    {item.text}{" "}
                    {item.url && <ExternalLink href={item.url}>View change</ExternalLink>}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
    </li>
  );
}

export default function Page() {
  const openSource = getOpenSource();
  const projects = getProjects();
  const featured = projects.filter((project) => project.type === "oss" && project.featured);
  const upstream = projects.filter((project) => project.type === "oss" && !project.featured);
  const side = projects.filter((project) => project.type === "side");

  return (
    <div className="container-page py-12 sm:py-16">
      <PageIntro href="/open-source" />
      <p className="mt-8 max-w-2xl text-lg leading-8">{openSource.philosophy}</p>

      {openSource.stats.length > 0 && (
        <section aria-label="Open-source impact" className="mt-10">
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {openSource.stats.map((metric, index) => (
              <li key={metric.label}>
                <Reveal delay={index * stagger} className="h-full [&>*]:h-full">
                  <MetricTile metric={metric} />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}

      {featured.length > 0 && (
        <Section title="Featured projects">
          <ul className="space-y-4">
            {featured.map((project) => (
              <FeaturedProject key={project.slug} project={project} />
            ))}
          </ul>
        </Section>
      )}

      {upstream.length > 0 && (
        <Section title="Upstream contributions">
          {/* A table on desktop; each project becomes a stacked card on phones. */}
          <ul className="divide-y rounded-xl border bg-card">
            {upstream.map((project) => (
              <li
                key={project.slug}
                id={project.slug}
                className="grid scroll-mt-24 gap-x-8 gap-y-2 p-5 md:grid-cols-[14rem_1fr]"
              >
                <div>
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{project.role}</p>
                  <p className="mt-2 text-sm">
                    <ExternalLink href={project.repo}>Repository</ExternalLink>
                  </p>
                </div>
                <div className="text-sm leading-6">
                  {project.problem && <p className="text-muted-foreground">{project.problem}</p>}
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {project.contributions.map((item) => (
                      <li key={item.text}>
                        {item.text}{" "}
                        {item.url && <ExternalLink href={item.url}>View change</ExternalLink>}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {openSource.contributionTypes.length > 0 && (
        <Section title="How I contribute">
          <ul className="flex flex-wrap gap-2">
            {openSource.contributionTypes.map((type) => (
              <li key={type} className="rounded-full border bg-card px-4 py-2 text-sm">
                {type}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {side.length > 0 && (
        <Section title="Side projects">
          <ul className="grid gap-4 md:grid-cols-2">
            {side.map((project) => (
              <li
                key={project.slug}
                id={project.slug}
                className="flex scroll-mt-24 flex-col gap-2 rounded-xl border bg-card p-6"
              >
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-sm text-muted-foreground">{project.summary}</p>
                <p className="mt-auto pt-2 text-sm">
                  <ExternalLink href={project.repo}>Repository</ExternalLink>
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {openSource.writing.length > 0 && (
        <Section title="Writing & speaking">
          <ul className="divide-y rounded-xl border bg-card">
            {openSource.writing.map((item) => (
              <li
                key={item.title}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 p-5"
              >
                <div>
                  <p className="font-mono text-xs text-primary uppercase">{item.type}</p>
                  <h3 className="mt-1 font-semibold">
                    {item.url ? (
                      <ExternalLink href={item.url}>{item.title}</ExternalLink>
                    ) : (
                      item.title
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.venue}</p>
                </div>
                <p className="text-sm text-muted-foreground">{formatMonth(item.date)}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {openSource.community.length > 0 && (
        <Section title="Community & mentorship">
          <dl className="grid gap-4 md:grid-cols-2">
            {openSource.community.map((item) => (
              <div key={item.label} className="rounded-xl border bg-card p-5">
                <dt className="font-semibold">{item.label}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      <ContactBand />
    </div>
  );
}
