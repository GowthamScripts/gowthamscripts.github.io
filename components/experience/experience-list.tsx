"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { FilterChips } from "@/components/shared/filter-chips";
import { Tag } from "@/components/shared/page-intro";
import { Button } from "@/components/ui/button";
import { achievementTags, type Experience } from "@/lib/content/schemas";
import { achievementLabels, formatMonth, formatPeriod } from "@/lib/format";
import { useUrlList } from "@/lib/hooks/use-url-list";
import { cn } from "@/lib/utils";

type AchievementTag = (typeof achievementTags)[number];
type Props = { roles: Experience[]; caseStudyTitles: Record<string, string> };

/** Reads the filter from the address bar (?focus=LEAD,ARCH). */
export function FilteredExperience(props: Props) {
  const [active, toggle] = useUrlList("focus", achievementTags);
  return <ExperienceList {...props} active={active} onToggle={toggle} />;
}

/** The timeline itself. Rendered unfiltered on the server, so the full history is in the HTML. */
function ExperienceList({
  roles,
  caseStudyTitles,
  active = [],
  onToggle = () => {},
}: Props & {
  active?: readonly AchievementTag[];
  onToggle?: (tag: AchievementTag | null) => void;
}) {
  const filtering = active.length > 0;
  const matches = roles.reduce(
    (count, role) =>
      count + role.achievements.filter((a) => !filtering || active.includes(a.tag)).length,
    0,
  );

  const anyAchievements = roles.some((role) => role.achievements.length > 0);
  // Only offer filters that match at least one achievement.
  const filterOptions = achievementTags
    .filter((tag) => roles.some((role) => role.achievements.some((a) => a.tag === tag)))
    .map((tag) => ({ value: tag, label: achievementLabels[tag] }));

  return (
    <>
      {anyAchievements && (
        <>
          <div className="sticky top-14 z-20 -mx-4 mt-8 bg-background/90 px-4 py-2 backdrop-blur-md sm:static sm:mx-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none print:hidden">
            <FilterChips
              label="Filter achievements"
              options={filterOptions}
              active={active}
              onToggle={onToggle}
            />
          </div>
          <p role="status" className="mt-3 text-sm text-muted-foreground print:hidden">
            {filtering
              ? `${matches} ${matches === 1 ? "achievement" : "achievements"} tagged ${active.map((tag) => achievementLabels[tag]).join(" or ")}`
              : `${matches} achievements across ${roles.length} roles`}
          </p>
        </>
      )}

      <ol className="mt-8 space-y-5 border-l pl-5 sm:pl-8">
        {roles.map((role, index) => (
          <RoleCard
            key={role.slug}
            role={role}
            active={active}
            defaultOpen={index === 0}
            caseStudyTitles={caseStudyTitles}
          />
        ))}
      </ol>
    </>
  );
}

function roleAsText(role: Experience): string {
  return [
    `${role.title}, ${role.company}`,
    [formatPeriod(role.start, role.end), role.location].filter(Boolean).join(" · "),
    "",
    ...role.achievements.map((a) => `• ${a.text}`),
  ].join("\n");
}

function RoleCard({
  role,
  active,
  defaultOpen,
  caseStudyTitles,
}: {
  role: Experience;
  active: readonly AchievementTag[];
  defaultOpen: boolean;
  caseStudyTitles: Record<string, string>;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const filtering = active.length > 0;
  const shown = role.achievements.filter((a) => !filtering || active.includes(a.tag));
  // While a filter is on, every role with a match is expanded so nothing relevant is hidden.
  const expanded = filtering ? shown.length > 0 : open;
  const panelId = `${role.slug}-details`;

  return (
    <li id={role.slug} className="relative scroll-mt-28">
      <span
        aria-hidden
        className={cn(
          "absolute top-7 -left-[26px] size-2.5 rounded-full border-2 border-primary sm:-left-[38px]",
          expanded ? "bg-primary" : "bg-background",
        )}
      />
      <div className="rounded-xl border bg-card">
        <h2>
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={panelId}
            disabled={filtering}
            onClick={() => setOpen((value) => !value)}
            className="flex w-full items-start justify-between gap-4 rounded-xl p-5 text-left sm:p-6"
          >
            <span>
              <span className="block text-sm font-normal text-muted-foreground">
                {[formatPeriod(role.start, role.end), role.location].filter(Boolean).join(" · ")}
              </span>
              <span className="mt-1 block text-xl font-semibold tracking-tight">
                {role.title}{" "}
                <span className="text-muted-foreground">
                  · {role.company ?? "Employer to be added"}
                </span>
              </span>
              <span className="mt-2 flex flex-wrap gap-1.5">
                {(role.scope.teamSize ?? 0) > 0 && <Tag>Team of {role.scope.teamSize}</Tag>}
                {role.scope.team && <Tag>{role.scope.team}</Tag>}
                {role.scope.crossTeam && <Tag>{role.scope.crossTeam}</Tag>}
                {role.scope.scale && <Tag>{role.scope.scale}</Tag>}
              </span>
            </span>
            {!filtering && (
              <ChevronDown
                aria-hidden
                className={cn(
                  "mt-1 size-5 shrink-0 text-muted-foreground transition-transform duration-200",
                  expanded && "rotate-180",
                )}
              />
            )}
          </button>
        </h2>

        {filtering && shown.length === 0 && (
          <p className="px-5 pb-5 text-sm text-muted-foreground sm:px-6">
            No matching achievements in this role.
          </p>
        )}

        <div id={panelId} hidden={!expanded} className="px-5 pb-5 sm:px-6 sm:pb-6">
          {role.context && <p className="text-sm text-muted-foreground">{role.context}</p>}
          {role.mission && <p className="mt-3 font-medium">{role.mission}</p>}
          {role.achievements.length === 0 && (
            <p className="text-sm text-muted-foreground">Details for this role are coming soon.</p>
          )}

          <ul className="mt-4 space-y-3">
            {shown.map((achievement) => (
              <li key={achievement.text} className="text-sm leading-6">
                <span className="mr-2 font-mono text-xs text-primary uppercase">
                  {achievementLabels[achievement.tag]}
                </span>
                <span className="block sm:inline">{achievement.text}</span>
              </li>
            ))}
          </ul>

          {role.promotions.length > 1 && (
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Progression: </span>
              {role.promotions
                .map((step) => `${step.title} (${formatMonth(step.date)})`)
                .join(" → ")}
            </p>
          )}

          {role.caseStudies.length > 0 && (
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <span className="text-muted-foreground">Case studies:</span>
              {role.caseStudies.map((slug) => (
                <Link
                  key={slug}
                  href={`/work/${slug}`}
                  className="font-medium text-primary hover:underline"
                >
                  {caseStudyTitles[slug] ?? slug}
                </Link>
              ))}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            {role.technologies.length > 0 && (
              <p className="text-xs text-muted-foreground">{role.technologies.join(" · ")}</p>
            )}
            <CopyButton
              text={roleAsText(role)}
              label="Copy as text"
              copiedMessage="Role copied"
              variant="ghost"
              className="print:hidden"
            />
          </div>
        </div>
      </div>
    </li>
  );
}

export function ExpandHint() {
  return (
    <Button asChild variant="link" className="px-0">
      <Link href="/resume">Prefer the short version? See the resume →</Link>
    </Button>
  );
}
