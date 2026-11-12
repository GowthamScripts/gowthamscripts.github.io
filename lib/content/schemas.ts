import { z } from "zod";

/**
 * Content schemas (docs/10-architecture.md §5).
 * Objects are strict: an unknown or misspelled field fails the build.
 */

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use YYYY-MM, in quotes");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD, in quotes");
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase-words-with-hyphens");
const link = z
  .string()
  .refine((v) => v.startsWith("/") || /^https?:\/\//.test(v) || v.startsWith("mailto:"), {
    message: "Use an internal path (/work/...) or a full https:// address",
  });

/**
 * A headline fact. Either a number that can count up ("10+ years") or a short piece of text
 * ("Technical Lead") — set `value` or `display`, not both.
 */
export const metricSchema = z
  .strictObject({
    label: z.string().min(1),
    value: z.number().optional(),
    display: z.string().min(1).max(24).optional(),
    prefix: z.string().default(""),
    suffix: z.string().default(""),
    before: z.number().optional(),
    context: z.string().optional(),
    caseStudy: slugSchema.optional(),
  })
  .refine((metric) => (metric.value === undefined) !== (metric.display === undefined), {
    message: "Set either `value` (a number) or `display` (text), not both",
  });

const titledText = z.strictObject({ title: z.string().min(1), description: z.string().min(1) });

export const profileSchema = z.strictObject({
  /** true while some sections are still placeholders. Shows a "work in progress" banner. */
  sample: z.boolean().default(false),
  name: z.string().min(1),
  initials: z.string().min(1).max(3),
  role: z.string().min(1),
  specialty: z.string().min(1),
  location: z.string().min(1),
  hero: z.strictObject({
    headline: z.string().min(1).max(90),
    subheadline: z.string().min(1).max(240),
  }),
  education: z
    .array(
      z.strictObject({
        qualification: z.string().min(1),
        institution: z.string().min(1),
        detail: z.string().optional(),
      }),
    )
    .default([]),
  awards: z
    .array(z.strictObject({ title: z.string().min(1), detail: z.string().optional() }))
    .default([]),
  proof: z.array(metricSchema).min(1).max(4),
  bios: z.strictObject({
    short: z.string().min(1),
    medium: z.string().min(1),
  }),
  principles: z
    .array(
      z.strictObject({
        title: z.string().min(1),
        description: z.string().min(1),
        caseStudy: slugSchema.optional(),
      }),
    )
    .min(3)
    .max(5),
  /** Shown on Home in place of testimonials. */
  values: z.array(titledText).default([]),
  numbers: z.array(metricSchema).default([]),
  availability: z.strictObject({
    open: z.boolean(),
    label: z.string().min(1),
  }),
  seo: z.strictObject({
    description: z.string().min(50).max(160),
  }),
  lastUpdated: isoDate,
});

export const achievementTags = ["LEAD", "ARCH", "BIZ", "OPS", "XFN", "AI", "OSS"] as const;

/**
 * A role. Only the title is required, so a role can be listed before its details are written;
 * missing details show as "to be added" on the site.
 */
export const experienceSchema = z.strictObject({
  title: z.string().min(1),
  company: z.string().min(1).optional(),
  /** 1 = most recent. Roles are listed in this order, then by start date. */
  order: z.number().int().default(100),
  start: yearMonth.optional(),
  end: z.union([yearMonth, z.literal("present")]).optional(),
  location: z.string().min(1).optional(),
  context: z.string().min(1).optional(),
  scope: z
    .strictObject({
      /** Exact size, for the team-size chart. */
      teamSize: z.number().int().nonnegative().optional(),
      /** Shown as written, e.g. "Leads 5–7 engineers". */
      team: z.string().optional(),
      crossTeam: z.string().optional(),
      systems: z.array(z.string()).default([]),
      scale: z.string().optional(),
    })
    .default({ systems: [] }),
  mission: z.string().min(1).optional(),
  achievements: z
    .array(z.strictObject({ tag: z.enum(achievementTags), text: z.string().min(1) }))
    .default([]),
  promotions: z.array(z.strictObject({ date: yearMonth, title: z.string().min(1) })).default([]),
  caseStudies: z.array(slugSchema).default([]),
  technologies: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export const pillars = ["leadership", "business", "domain", "architecture", "open-source"] as const;

export const caseStudySchema = z.strictObject({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  company: z.string().min(1),
  role: z.string().min(1),
  /** Leave out until confirmed; the snapshot then skips the row. */
  timeline: z.string().min(1).optional(),
  team: z.string().min(1),
  stakeholders: z.string().optional(),
  domain: z.string().min(1),
  pillars: z.array(z.enum(pillars)).min(1),
  heroMetric: metricSchema,
  tldr: z.strictObject({
    problem: z.string().min(1),
    action: z.string().min(1),
    result: z.string().min(1),
  }),
  results: z
    .array(
      z.strictObject({
        category: z.enum(["business", "technical", "team", "people"]),
        label: z.string().min(1),
        before: z.string().min(1),
        after: z.string().min(1),
        change: z.string().min(1),
      }),
    )
    .min(1),
  /** Shown as badge groups after the results ("Backend: Laravel, Python"). */
  technologies: z
    .array(z.strictObject({ group: z.string().min(1), items: z.array(z.string().min(1)).min(1) }))
    .default([]),
  /** The closing "What this project demonstrates" section. */
  takeaways: z.array(titledText).default([]),
  date: yearMonth,
  featured: z.boolean().default(false),
  order: z.number().int().default(100),
  draft: z.boolean().default(false),
});

/**
 * A case study that is announced but not written yet: `status: coming-soon` in its front matter.
 * It shows as a "Coming soon" card and has no page of its own.
 */
export const plannedCaseStudySchema = z.strictObject({
  status: z.literal("coming-soon"),
  title: z.string().min(1),
  industry: z.string().min(1),
  role: z.string().min(1),
  summary: z.string().min(1),
  technologies: z.array(z.string().min(1)).default([]),
  order: z.number().int().default(100),
  draft: z.boolean().default(false),
});

export const projectSchema = z.strictObject({
  name: z.string().min(1),
  type: z.enum(["oss", "side"]),
  role: z.enum(["Creator", "Maintainer", "Core contributor", "Contributor"]),
  status: z.enum(["Active", "Stable", "Archived"]),
  summary: z.string().min(1),
  problem: z.string().min(1).optional(),
  architecture: z.string().min(1).optional(),
  technologies: z.array(z.string().min(1)).default([]),
  repo: z.url(),
  package: z.url().optional(),
  license: z.string().optional(),
  contributions: z
    .array(z.strictObject({ text: z.string().min(1), url: z.url().optional() }))
    .default([]),
  adoption: metricSchema.optional(),
  featured: z.boolean().default(false),
  order: z.number().int().default(100),
  draft: z.boolean().default(false),
});

export const levels = ["Expert", "Advanced", "Proficient"] as const;

export const skillsSchema = z.strictObject({
  capabilities: z
    .array(
      z.strictObject({
        name: z.string().min(1),
        level: z.enum(levels).optional(),
        proof: z.string().min(1),
        evidence: z.array(z.strictObject({ label: z.string().min(1), href: link })).default([]),
      }),
    )
    .min(1),
  leadership: z
    .array(z.strictObject({ skill: z.string().min(1), evidence: z.string().min(1) }))
    .default([]),
  architecture: z
    .array(
      z.strictObject({
        area: z.string().min(1),
        level: z.enum(levels).optional(),
        patterns: z.array(z.string()).default([]),
      }),
    )
    .default([]),
  delivery: z
    .array(z.strictObject({ practice: z.string().min(1), evidence: z.string().min(1) }))
    .default([]),
  technologies: z
    .array(
      z.strictObject({
        category: z.string().min(1),
        primary: z.array(z.string()).default([]),
        familiar: z.array(z.string()).default([]),
      }),
    )
    .default([]),
  growing: z
    .array(z.strictObject({ skill: z.string().min(1), how: z.string().min(1) }))
    .default([]),
});

export const domainSchema = z.strictObject({
  primary: z.string().min(1),
  /** Shown as written, e.g. "10+". */
  years: z.string().min(1),
  oneLiner: z.string().min(1),
  /** Industries worked in, with the kinds of business problems involved. */
  industries: z
    .array(z.strictObject({ name: z.string().min(1), problems: z.string().min(1) }))
    .min(1),
  flow: z
    .array(
      z.strictObject({
        step: z.string().min(1),
        detail: z.string().min(1),
        /** Where this step tends to break. Shown as a warning on the diagram. */
        risk: z.string().optional(),
        /** What I built or changed at this step. */
        myWork: z.string().optional(),
      }),
    )
    .default([]),
  problems: z
    .array(
      z.strictObject({
        problem: z.string().min(1),
        whyHard: z.string().min(1),
        approach: z.string().min(1),
        outcome: z.string().min(1),
        caseStudy: slugSchema.optional(),
      }),
    )
    .default([]),
  kpis: z.array(metricSchema).default([]),
  compliance: z
    .array(z.strictObject({ standard: z.string().min(1), role: z.string().min(1) }))
    .default([]),
  secondary: z
    .array(
      z.strictObject({
        domain: z.string().min(1),
        depth: z.enum(["Deep", "Working", "Exposure"]),
        highlight: z.string().min(1),
      }),
    )
    .default([]),
  seattleFit: z
    .array(z.strictObject({ strength: z.string().min(1), teams: z.string().min(1) }))
    .default([]),
});

export const aboutSchema = z.strictObject({
  /** Path under /public, e.g. "/headshot.jpg". Initials are shown until this is set. */
  headshot: z.string().startsWith("/").optional(),
  currently: z
    .strictObject({
      reading: z.string().optional(),
      learning: z.string().optional(),
    })
    .default({}),
  story: z.array(z.strictObject({ title: z.string().min(1), body: z.string().min(1) })).min(2),
  howIWork: z
    .array(z.strictObject({ title: z.string().min(1), body: z.string().min(1) }))
    .default([]),
  beyondWork: z.array(z.string().min(1)).default([]),
});

export const openSourceSchema = z.strictObject({
  philosophy: z.string().min(1),
  stats: z.array(metricSchema).max(5).default([]),
  contributionTypes: z.array(z.string().min(1)).default([]),
  writing: z
    .array(
      z.strictObject({
        type: z.enum(["Talk", "Article", "Podcast", "Workshop"]),
        title: z.string().min(1),
        venue: z.string().min(1),
        date: yearMonth,
        url: z.url().optional(),
      }),
    )
    .default([]),
  community: z
    .array(z.strictObject({ label: z.string().min(1), detail: z.string().min(1) }))
    .default([]),
});

export const contactSchema = z.strictObject({
  email: z.email(),
  links: z.strictObject({
    github: z.url(),
    linkedin: z.url(),
    calendar: z.url().optional(),
    resumePdf: z.string().startsWith("/"),
  }),
  lookingFor: z.strictObject({
    status: z.string().min(1),
    roles: z.array(z.string()).min(1),
    focus: z.array(z.string()).min(1),
    workMode: z.string().min(1),
    area: z.string().min(1),
  }),
  replyTime: z.string().min(1),
  recruiterKit: z.strictObject({
    summary: z.string().min(1),
    highlights: z.array(z.string().min(1)).length(3),
  }),
});

export const testimonialsSchema = z.array(
  z.strictObject({
    quote: z.string().min(1),
    name: z.string().min(1),
    title: z.string().min(1),
    relationship: z.enum(["manager", "peer", "report", "partner"]),
    /** Only quotes with permission: true are ever shown. */
    permission: z.boolean(),
  }),
);

export const glossarySchema = z.array(
  z.strictObject({
    term: z.string().min(1),
    short: z.string().min(1),
    long: z.string().optional(),
  }),
);

export type Metric = z.infer<typeof metricSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Experience = z.infer<typeof experienceSchema> & { slug: string };
export type PlannedCaseStudy = z.infer<typeof plannedCaseStudySchema> & { slug: string };
export type CaseStudy = z.infer<typeof caseStudySchema> & {
  slug: string;
  readingMinutes: number;
  toc: TocItem[];
};
export type Project = z.infer<typeof projectSchema> & { slug: string };
export type Skills = z.infer<typeof skillsSchema>;
export type Domain = z.infer<typeof domainSchema>;
export type About = z.infer<typeof aboutSchema>;
export type OpenSource = z.infer<typeof openSourceSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type Testimonial = z.infer<typeof testimonialsSchema>[number];
export type GlossaryTerm = z.infer<typeof glossarySchema>[number];
export type TocItem = { id: string; text: string; depth: 2 | 3 };

export type Content = {
  profile: Profile;
  experience: Experience[];
  caseStudies: CaseStudy[];
  plannedCaseStudies: PlannedCaseStudy[];
  projects: Project[];
  skills: Skills;
  domain: Domain;
  about: About;
  openSource: OpenSource;
  contact: Contact;
  testimonials: Testimonial[];
  glossary: GlossaryTerm[];
};
