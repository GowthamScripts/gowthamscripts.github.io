import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { ContactBand } from "@/components/shared/contact-band";
import { Disclosure } from "@/components/shared/disclosure";
import { MetricTile } from "@/components/shared/metric-tile";
import { Section, Tag } from "@/components/shared/page-intro";
import { getAbout, getProfile, getSkills } from "@/lib/content";
import { stagger } from "@/lib/motion";
import { jsonLdString, pageMetadata, profilePageJsonLd } from "@/lib/seo";

export const metadata = pageMetadata("/about");

const chapterId = (title: string) =>
  `story-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

export default function Page() {
  const profile = getProfile();
  const about = getAbout();
  const capabilities = getSkills().capabilities.slice(0, 4);
  const currently = [
    ["Role", `${profile.role}, ${profile.location}`],
    [
      "Education",
      profile.education[0] &&
        `${profile.education[0].qualification}, ${profile.education[0].institution}`,
    ],
    ["Reading", about.currently.reading],
    ["Learning", about.currently.learning],
  ].filter((row): row is [string, string] => Boolean(row[1]));

  return (
    <div className="container-page py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(profilePageJsonLd()) }}
      />
      <header className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
        {about.headshot ? (
          <Image
            src={about.headshot}
            alt={`Portrait of ${profile.name}`}
            width={176}
            height={176}
            priority
            className="size-32 rounded-2xl object-cover sm:size-44"
          />
        ) : (
          <div
            aria-hidden
            className="grid size-32 place-items-center rounded-2xl bg-accent font-mono text-4xl text-accent-foreground sm:size-44"
          >
            {profile.initials}
          </div>
        )}
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-widest text-primary uppercase">About</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {profile.name}
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{profile.bios.medium}</p>
        </div>
      </header>

      <div className="mt-14 grid gap-10 lg:grid-cols-[180px_minmax(0,1fr)_240px]">
        {/* Chapter links: a sideways-scrolling row on phones, a sticky list on desktop. */}
        <nav
          aria-label="My story"
          className="sticky top-14 z-20 -mx-4 bg-background/90 px-4 py-2 backdrop-blur-md lg:top-24 lg:mx-0 lg:self-start lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
        >
          <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-2.5 lg:border-l">
            {about.story.map((chapter) => (
              <li key={chapter.title} className="shrink-0">
                <a
                  href={`#${chapterId(chapter.title)}`}
                  className="inline-flex h-9 items-center rounded-full border bg-card px-3.5 text-sm text-muted-foreground hover:text-foreground lg:-ml-px lg:h-auto lg:rounded-none lg:border-0 lg:border-l lg:border-transparent lg:bg-transparent lg:pl-4 lg:hover:border-primary"
                >
                  {chapter.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-label="My story" className="space-y-10">
          {about.story.map((chapter, index) => (
            <div key={chapter.title} id={chapterId(chapter.title)} className="scroll-mt-28">
              <p className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">{chapter.title}</h2>
              <p className="mt-3 text-lg leading-8 text-pretty">{chapter.body}</p>
            </div>
          ))}
        </section>

        <aside aria-labelledby="currently" className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border bg-card p-5">
            <h2 id="currently" className="text-sm font-semibold">
              Currently
            </h2>
            <dl className="mt-3 space-y-3 text-sm">
              {currently.map(([term, value]) => (
                <div key={term}>
                  <dt className="text-xs text-muted-foreground">{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>

      <Section title="Leadership philosophy">
        <ol className="grid gap-4 md:grid-cols-3">
          {profile.principles.map((principle, index) => (
            <li key={principle.title} className="rounded-xl border bg-card p-6">
              <span className="font-mono text-xs text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-semibold">{principle.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{principle.description}</p>
              {principle.caseStudy && (
                <Link
                  href={`/work/${principle.caseStudy}`}
                  className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                >
                  See it in practice →
                </Link>
              )}
            </li>
          ))}
        </ol>
      </Section>

      {about.howIWork.length > 0 && (
        <Section title="How I work">
          <div className="grid items-start gap-3 md:grid-cols-2">
            {about.howIWork.map((item, index) => (
              <Disclosure
                key={item.title}
                defaultOpen={index === 0}
                summary={<h3 className="font-semibold">{item.title}</h3>}
              >
                <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
              </Disclosure>
            ))}
          </div>
        </Section>
      )}

      {profile.numbers.length > 0 && (
        <Section title="By the numbers">
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {profile.numbers.map((metric, index) => (
              <li key={metric.label}>
                <Reveal delay={index * stagger} className="h-full [&>*]:h-full">
                  <MetricTile metric={metric} />
                </Reveal>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="What I'm strongest at">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((capability) => (
            <li key={capability.name} className="rounded-xl border bg-card p-5">
              {capability.level && <Tag>{capability.level}</Tag>}
              <h3 className="mt-2 font-semibold">{capability.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{capability.proof}</p>
            </li>
          ))}
        </ul>
        <Link
          href="/skills"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          See all skills, with evidence →
        </Link>
      </Section>

      {about.beyondWork.length > 0 && (
        <Section title="Beyond work">
          <ul className="flex flex-wrap gap-2">
            {about.beyondWork.map((item) => (
              <li key={item} className="rounded-full border bg-card px-4 py-2 text-sm">
                {item}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <ContactBand />
    </div>
  );
}
