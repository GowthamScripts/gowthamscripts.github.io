import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FlowDiagram } from "@/components/domain/flow-diagram";
import { CountUp } from "@/components/motion/count-up";
import { ContactBand } from "@/components/shared/contact-band";
import { Disclosure } from "@/components/shared/disclosure";
import { PageIntro, Section, Tag } from "@/components/shared/page-intro";
import { formatMetric, getDomain, getGlossary, getSkills } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/domain");

/** Sections other than "Industries" appear only once their content exists. */
export default function Page() {
  const domain = getDomain();
  const glossary = getGlossary();
  const specialties = getSkills().architecture;

  return (
    <div className="container-page py-12 sm:py-16">
      <PageIntro href="/domain" />
      <p className="mt-8 max-w-2xl text-lg leading-8">
        <span className="font-semibold">
          {domain.primary} · {domain.years} years.
        </span>{" "}
        {domain.oneLiner}
      </p>

      <Section title="Industries">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {domain.industries.map((industry, index) => (
            <li
              key={industry.name}
              className="animate-rise"
              style={{ "--i": index } as React.CSSProperties}
            >
              {/* CSS animation: these cards are on the first screen. */}
              <div className="h-full rounded-xl border bg-card p-6">
                <h3 className="font-semibold">{industry.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{industry.problems}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {domain.flow.length >= 2 && (
        <Section title="How the domain works">
          <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
            Select a step to see what happens, where it tends to break, and what I built there.
          </p>
          <FlowDiagram steps={domain.flow} />
        </Section>
      )}

      {domain.problems.length > 0 && (
        <Section title="Hard problems I've solved">
          <div className="grid items-start gap-3 md:grid-cols-2">
            {domain.problems.map((item, index) => (
              <Disclosure
                key={item.problem}
                defaultOpen={index === 0}
                summary={
                  <>
                    <h3 className="font-semibold">{item.problem}</h3>
                    <p className="mt-1 text-sm font-medium text-success">{item.outcome}</p>
                  </>
                }
              >
                <dl className="space-y-3 text-sm leading-6">
                  <div>
                    <dt className="text-xs text-muted-foreground">Why it&apos;s hard</dt>
                    <dd>{item.whyHard}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">My approach</dt>
                    <dd>{item.approach}</dd>
                  </div>
                </dl>
                {item.caseStudy && (
                  <Link
                    href={`/work/${item.caseStudy}`}
                    className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                  >
                    Full case study →
                  </Link>
                )}
              </Disclosure>
            ))}
          </div>
        </Section>
      )}

      {domain.kpis.length > 0 && (
        <Section title="Business metrics I've moved">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {domain.kpis.map((metric) => (
              <li key={metric.label} className="h-full rounded-xl border bg-card p-5">
                <span className="block text-sm text-muted-foreground capitalize">
                  {metric.label}
                </span>
                <span className="mt-2 flex flex-wrap items-baseline gap-2">
                  {metric.before !== undefined && metric.value !== undefined && (
                    <>
                      <span className="text-lg text-muted-foreground tabular-nums line-through decoration-1">
                        {formatMetric({ ...metric, value: metric.before })}
                      </span>
                      <ArrowRight
                        className="size-4 self-center text-muted-foreground"
                        aria-label="to"
                      />
                    </>
                  )}
                  <span className="text-3xl font-semibold tracking-tight tabular-nums">
                    {metric.value !== undefined ? (
                      <CountUp
                        value={metric.value}
                        from={metric.before}
                        prefix={metric.prefix}
                        suffix={metric.suffix}
                      />
                    ) : (
                      metric.display
                    )}
                  </span>
                </span>
                {metric.context && (
                  <span className="mt-2 block text-xs text-muted-foreground">{metric.context}</span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {domain.compliance.length > 0 && (
        <Section title="Compliance & risk">
          <ul className="grid gap-4 md:grid-cols-2">
            {domain.compliance.map((item) => (
              <li key={item.standard} className="flex gap-4 rounded-xl border bg-card p-5">
                <span className="grid h-9 shrink-0 place-items-center rounded-md bg-accent px-3 font-mono text-xs font-semibold text-accent-foreground">
                  {item.standard}
                </span>
                <span className="text-sm leading-6">{item.role}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {specialties.length > 0 && (
        <Section title="Technical specialties">
          <ul className="grid gap-4 md:grid-cols-3">
            {specialties.map((item) => (
              <li key={item.area} className="rounded-xl border bg-card p-5">
                {item.level && <Tag>{item.level}</Tag>}
                <h3 className="mt-2 font-semibold">{item.area}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.patterns.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {domain.seattleFit.length > 0 && (
        <Section title="Where this fits in Seattle">
          <dl className="grid gap-4 md:grid-cols-3">
            {domain.seattleFit.map((row) => (
              <div key={row.strength} className="rounded-xl border bg-card p-5">
                <dt className="font-semibold">{row.strength}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{row.teams}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {glossary.length > 0 && (
        <Section title="Glossary">
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {glossary.map((entry) => (
              <div key={entry.term}>
                <dt className="font-semibold">{entry.term}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{entry.short}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      <ContactBand />
    </div>
  );
}
