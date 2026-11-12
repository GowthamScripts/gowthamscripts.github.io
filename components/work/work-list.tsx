"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { MotionScope } from "@/components/motion/motion-scope";
import { CaseStudyCard } from "@/components/shared/case-study-card";
import { FilterChips } from "@/components/shared/filter-chips";
import { pillars, type CaseStudy } from "@/lib/content/schemas";
import { pillarLabels } from "@/lib/format";
import { useUrlList } from "@/lib/hooks/use-url-list";
import { transitions } from "@/lib/motion";

type Pillar = (typeof pillars)[number];

/** Reads the filter from the address bar (?pillar=architecture). */
export function FilteredWorkList({ studies }: { studies: CaseStudy[] }) {
  const [active, toggle] = useUrlList("pillar", pillars);
  return <WorkList studies={studies} active={active} onToggle={toggle} />;
}

function WorkList({
  studies,
  active = [],
  onToggle = () => {},
}: {
  studies: CaseStudy[];
  active?: readonly Pillar[];
  onToggle?: (pillar: Pillar | null) => void;
}) {
  // Only offer filters that match at least one case study.
  const options = pillars
    .filter((pillar) => studies.some((study) => study.pillars.includes(pillar)))
    .map((pillar) => ({ value: pillar, label: pillarLabels[pillar] }));
  const shown = studies.filter(
    (study) => active.length === 0 || active.some((pillar) => study.pillars.includes(pillar)),
  );

  return (
    <MotionScope>
      <div className="mt-8">
        <FilterChips
          label="Filter case studies"
          options={options}
          active={active}
          onToggle={onToggle}
        />
      </div>
      <p role="status" className="mt-3 text-sm text-muted-foreground">
        {shown.length} of {studies.length} case studies
      </p>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {/* Cards slide to their new places when the filter changes; removed ones fade out. */}
        <AnimatePresence initial={false} mode="popLayout">
          {shown.map((study) => (
            <m.li
              key={study.slug}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={transitions.standard}
              className={study.featured && active.length === 0 ? "md:col-span-2" : undefined}
            >
              <CaseStudyCard study={study} headingLevel={2} />
            </m.li>
          ))}
        </AnimatePresence>
      </ul>
      {shown.length === 0 && (
        <p className="mt-6 rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
          No case studies match that filter yet.
        </p>
      )}
    </MotionScope>
  );
}
