import { caseStudyStaticParams } from "@/lib/content/static-params";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ContactBand } from "@/components/shared/contact-band";
import { Tag } from "@/components/shared/page-intro";
import { StickyBar } from "@/components/shared/sticky-bar";
import { Button } from "@/components/ui/button";
import { ReadingProgress } from "@/components/work/reading-progress";
import { SkimToggle } from "@/components/work/skim-toggle";
import { TocNav } from "@/components/work/toc-nav";
import { formatMetric, getCaseStudies, getCaseStudy, getProfile } from "@/lib/content";
import { pillarLabels } from "@/lib/format";
import { shareImageSize } from "@/lib/og";
import { breadcrumbJsonLd, jsonLdString, sharedOpenGraph } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return caseStudyStaticParams();
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.subtitle,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: {
      ...sharedOpenGraph(),
      // This case study's own share image (share-image.png/route.tsx in this folder).
      images: [{ url: `/work/${study.slug}/share-image.png`, ...shareImageSize, alt: study.title }],
      type: "article",
      title: study.title,
      description: study.subtitle,
      url: `/work/${study.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: study.title,
      description: study.subtitle,
      images: [`/work/${study.slug}/share-image.png`],
    },
  };
}

// Every published slug is listed in generateStaticParams, so the whole page is prerendered.
// No <Suspense> here on purpose: around a long article it makes React send a skeleton first and
// swap the content in afterwards, which delays the largest paint.
export default async function Page({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  // The body is compiled from MDX at build time; the front matter was validated by the content layer.
  const { default: Body } = await import(`@/content/case-studies/${study.slug}.mdx`);

  const studies = getCaseStudies();
  const next = studies[(studies.indexOf(study) + 1) % studies.length];
  const snapshot = [
    ["Company", study.company],
    ["My role", study.role],
    ["Timeline", study.timeline],
    ["Team", study.team],
    ["Stakeholders", study.stakeholders],
    ["Domain", study.domain],
  ].filter((row): row is [string, string] => Boolean(row[1]));

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.subtitle,
    author: { "@type": "Person", name: getProfile().name, url: siteUrl },
    datePublished: `${study.date}-01`,
    mainEntityOfPage: new URL(`/work/${study.slug}`, siteUrl).toString(),
  };

  return (
    <article className="container-page py-12 sm:py-16">
      <ReadingProgress />
      <header className="max-w-3xl">
        <p className="text-sm text-muted-foreground">
          <Link href="/work" className="font-medium text-primary hover:underline">
            Case studies
          </Link>{" "}
          · {study.readingMinutes} min read
        </p>
        <ViewTransition name={`case-study-title-${study.slug}`}>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {study.title}
          </h1>
        </ViewTransition>
        <p className="mt-4 text-xl text-muted-foreground">{study.subtitle}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="flex flex-wrap gap-1.5">
            {study.pillars.map((pillar) => (
              <Tag key={pillar}>{pillarLabels[pillar]}</Tag>
            ))}
          </p>
          <SkimToggle />
        </div>
      </header>

      <section
        aria-label="Snapshot"
        className="mt-10 grid gap-6 rounded-xl border bg-card p-6 md:grid-cols-[2fr_1fr]"
      >
        <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          {snapshot.map(([term, value]) => (
            <div key={term}>
              <dt className="text-xs text-muted-foreground">{term}</dt>
              <dd className="mt-0.5 text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="md:border-l md:pl-6">
          <span className="block text-4xl font-semibold tracking-tight text-primary tabular-nums">
            {formatMetric(study.heroMetric)}
          </span>
          <span className="mt-1 block text-sm text-muted-foreground">{study.heroMetric.label}</span>
          {study.heroMetric.context && (
            <span className="mt-1 block text-xs text-muted-foreground">
              {study.heroMetric.context}
            </span>
          )}
        </p>
      </section>

      <div
        data-skim-grid
        className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[220px_minmax(0,720px)]"
      >
        <TocNav
          items={[
            { id: "tldr", text: "TL;DR" },
            ...study.toc.filter((item) => item.depth === 2),
            { id: "results", text: "Results" },
            ...(study.technologies.length > 0
              ? [{ id: "technologies", text: "Technologies" }]
              : []),
            ...(study.takeaways.length > 0
              ? [{ id: "takeaways", text: "What this project demonstrates" }]
              : []),
          ]}
        />

        <div>
          <section
            aria-labelledby="tldr"
            className="rounded-xl bg-accent p-6 text-accent-foreground"
          >
            <h2 id="tldr" className="font-mono text-xs tracking-widest uppercase">
              TL;DR
            </h2>
            <dl className="mt-4 space-y-3">
              {(
                [
                  ["Problem", study.tldr.problem],
                  ["What I did", study.tldr.action],
                  ["Result", study.tldr.result],
                ] as const
              ).map(([term, value]) => (
                <div key={term} className="grid gap-1 sm:grid-cols-[7rem_1fr]">
                  <dt className="text-sm font-semibold">{term}</dt>
                  <dd className="text-sm">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <details className="mt-6 rounded-xl border bg-card lg:hidden" data-skim-hide>
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium">On this page</summary>
            <ul className="space-y-2 px-4 pb-4 text-sm">
              {study.toc
                .filter((item) => item.depth === 2)
                .map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="text-muted-foreground hover:text-foreground">
                      {item.text}
                    </a>
                  </li>
                ))}
              <li>
                <a href="#results" className="text-muted-foreground hover:text-foreground">
                  Results
                </a>
              </li>
              {study.takeaways.length > 0 && (
                <li>
                  <a href="#takeaways" className="text-muted-foreground hover:text-foreground">
                    What this project demonstrates
                  </a>
                </li>
              )}
            </ul>
          </details>

          <div className="mt-10" data-skim-hide>
            <Body />
          </div>

          <section aria-labelledby="results" className="mt-12">
            <h2 id="results" className="text-2xl font-semibold tracking-tight">
              Results
            </h2>
            <div className="mt-4 overflow-x-auto rounded-xl border">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 font-medium">
                      Area
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-medium">
                      Before
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-medium">
                      After
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-medium">
                      Change
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {study.results.map((row) => (
                    <tr key={row.label} className="border-t">
                      <th scope="row" className="px-4 py-3 font-medium">
                        {row.label}
                        <span className="block text-xs font-normal text-muted-foreground capitalize">
                          {row.category}
                        </span>
                      </th>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">{row.before}</td>
                      <td className="px-4 py-3 tabular-nums">{row.after}</td>
                      <td className="px-4 py-3 font-medium text-success tabular-nums">
                        {row.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {study.technologies.length > 0 && (
            <section aria-labelledby="technologies" className="mt-12">
              <h2 id="technologies" className="text-2xl font-semibold tracking-tight">
                Technologies
              </h2>
              <dl className="mt-4 space-y-3">
                {study.technologies.map((group) => (
                  <div key={group.group} className="grid gap-2 sm:grid-cols-[8rem_1fr]">
                    <dt className="pt-0.5 text-sm text-muted-foreground">{group.group}</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <Tag key={item}>{item}</Tag>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {study.takeaways.length > 0 && (
            <section aria-labelledby="takeaways" className="mt-12">
              <h2 id="takeaways" className="text-2xl font-semibold tracking-tight">
                What this project demonstrates
              </h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {study.takeaways.map((item) => (
                  <li key={item.title} className="rounded-xl border bg-card p-5">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {next && next.slug !== study.slug && (
            <Link
              href={`/work/${next.slug}`}
              className="mt-12 block rounded-xl border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <span className="text-sm text-muted-foreground">Next case study →</span>
              <span className="mt-1 block text-lg font-semibold">{next.title}</span>
            </Link>
          )}
        </div>
      </div>

      <ContactBand
        title="Want to dig into this one?"
        text="I'm happy to walk through the decisions and trade-offs in more detail."
      />

      <StickyBar>
        {next && next.slug !== study.slug ? (
          <Button asChild variant="outline">
            <Link href={`/work/${next.slug}`}>Next case study</Link>
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href="/work">All case studies</Link>
          </Button>
        )}
        <Button asChild>
          <Link href="/contact">Contact</Link>
        </Button>
      </StickyBar>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              ["Home", "/"],
              ["Case studies", "/work"],
              [study.title, `/work/${study.slug}`],
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(articleJsonLd) }}
      />
    </article>
  );
}
