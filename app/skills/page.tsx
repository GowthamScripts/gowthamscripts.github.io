import Link from "next/link";
import { ContactBand } from "@/components/shared/contact-band";
import { Disclosure } from "@/components/shared/disclosure";
import { PageIntro, Section } from "@/components/shared/page-intro";
import { TechSearch } from "@/components/skills/tech-search";
import { getExperience, getSkills } from "@/lib/content";
import { levels } from "@/lib/content/schemas";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata("/skills");

type Level = (typeof levels)[number];

const levelMeaning: Record<Level, string> = {
  Expert: "I set direction for others and am the escalation point.",
  Advanced: "I've led significant production work independently.",
  Proficient: "I've shipped production work with it and ramp quickly.",
};

/** Three-segment marker: Expert fills 3, Advanced 2, Proficient 1. Not a percentage. */
function LevelMarker({ level }: { level: Level }) {
  const filled = levels.length - levels.indexOf(level);
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
      <span aria-hidden className="flex gap-0.5">
        {levels.map((_, index) => (
          <span
            key={index}
            className={cn("h-1.5 w-4 rounded-full", index < filled ? "bg-primary" : "bg-border")}
          />
        ))}
      </span>
      {level}
    </span>
  );
}

export default function Page() {
  const skills = getSkills();
  const usesLevels = [...skills.capabilities, ...skills.architecture].some((item) => item.level);

  // Lower-cased technology → roles that list it, for "Where I used this".
  const usage: Record<string, { label: string; href: string }[]> = {};
  for (const role of getExperience()) {
    for (const tech of role.technologies) {
      (usage[tech.toLowerCase()] ??= []).push({
        label: `${role.title}, ${role.company}`,
        href: `/experience#${role.slug}`,
      });
    }
  }

  return (
    <div className="container-page py-12 sm:py-16">
      <PageIntro href="/skills" />

      {usesLevels && (
        <dl className="mt-8 grid max-w-3xl gap-3 rounded-xl border bg-card p-5 text-sm sm:grid-cols-3">
          {levels.map((level) => (
            <div key={level}>
              <dt>
                <LevelMarker level={level} />
              </dt>
              <dd className="mt-1.5 text-muted-foreground">{levelMeaning[level]}</dd>
            </div>
          ))}
        </dl>
      )}

      <Section title="Capability map">
        <div className="grid items-start gap-3 md:grid-cols-2">
          {skills.capabilities.map((capability) => (
            <Disclosure
              key={capability.name}
              summary={
                <>
                  {capability.level && <LevelMarker level={capability.level} />}
                  <h3 className={capability.level ? "mt-2 font-semibold" : "font-semibold"}>
                    {capability.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{capability.proof}</p>
                  <p className="mt-2 text-xs font-medium text-primary">
                    {capability.evidence.length > 0
                      ? `${capability.evidence.length} ${capability.evidence.length === 1 ? "link" : "links"} to evidence`
                      : "Evidence to be added"}
                  </p>
                </>
              }
            >
              <ul className="space-y-2 border-t pt-4 text-sm">
                {capability.evidence.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="font-medium text-primary hover:underline">
                      {item.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </Disclosure>
          ))}
        </div>
      </Section>

      {skills.leadership.length > 0 && (
        <Section title="Leadership">
          <dl className="grid gap-4 md:grid-cols-3">
            {skills.leadership.map((item) => (
              <div key={item.skill} className="rounded-xl border bg-card p-5">
                <dt className="font-semibold">{item.skill}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{item.evidence}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {skills.architecture.length > 0 && (
        <Section title="Architecture & system design">
          <ul className="grid gap-4 md:grid-cols-3">
            {skills.architecture.map((item) => (
              <li key={item.area} className="rounded-xl border bg-card p-5">
                {item.level && <LevelMarker level={item.level} />}
                <h3 className="mt-2 font-semibold">{item.area}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.patterns.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {skills.delivery.length > 0 && (
        <Section title="Delivery & operations">
          <dl className="grid gap-4 md:grid-cols-3">
            {skills.delivery.map((item) => (
              <div key={item.practice} className="rounded-xl border bg-card p-5">
                <dt className="font-semibold">{item.practice}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{item.evidence}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {skills.technologies.length > 0 && (
        <Section title="Technologies">
          <TechSearch groups={skills.technologies} usage={usage} />
        </Section>
      )}

      {skills.growing.length > 0 && (
        <Section title="Currently growing">
          <ul className="space-y-2 text-sm">
            {skills.growing.map((item) => (
              <li key={item.skill}>
                <span className="font-semibold">{item.skill}</span> — {item.how}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <ContactBand />
    </div>
  );
}
