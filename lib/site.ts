/**
 * Site structure: the pages and navigation. Safe to import from client components.
 * Personal facts (name, links, bio) live in /content and are read through lib/content.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export type SitePage = {
  href: string;
  label: string;
  title: string;
  description: string;
  /** The one question this page answers (docs/09-ux.md). */
  goal: string;
  /** Planned sections, in order (docs/09-ux.md Part B). */
  sections: string[];
  /** Which doc supplies the content. */
  source: string;
};

export const pages: SitePage[] = [
  {
    href: "/about",
    label: "About",
    title: "About",
    description: "The person behind the work, and how I lead.",
    goal: "Show the person behind the work and how they lead.",
    sections: [
      "Intro",
      "My story",
      "Leadership philosophy",
      "How I work",
      "By the numbers",
      "Capabilities preview",
      "Beyond work",
    ],
    source: "docs/01-personal.md",
  },
  {
    href: "/experience",
    label: "Experience",
    title: "Experience",
    description: "A career timeline showing growing scope, from contributor to multiplier.",
    goal: "Prove growing scope over time.",
    sections: [
      "Career summary",
      "Scope growth chart",
      "Filter bar",
      "Role timeline",
      "Earlier roles",
      "Education & certifications",
      "Awards, talks & publications",
    ],
    source: "docs/02-experience.md",
  },
  {
    href: "/domain",
    label: "Domain",
    title: "Domain Expertise",
    description:
      "The industries I've built software for, and the technical specialties behind that work.",
    goal: "Show business fluency in the domain.",
    sections: [
      "How the domain works",
      "Hard problems I've solved",
      "Business metrics I've moved",
      "Compliance & risk",
      "Technical specialties",
      "Seattle fit",
      "Glossary",
    ],
    source: "docs/03-domain.md",
  },
  {
    href: "/work",
    label: "Work",
    title: "Case Studies",
    description: "Selected work: the problem, the trade-offs, the architecture, and the results.",
    goal: "Prove judgment through 3–4 flagship stories.",
    sections: ["Filter & sort", "Featured case study", "Case study grid", "Confidentiality note"],
    source: "docs/04-case-studies.md",
  },
  {
    href: "/open-source",
    label: "Open Source",
    title: "Open Source",
    description: "Software I design and build in the open.",
    goal: "Show influence without authority, in public.",
    sections: [
      "Impact strip",
      "Featured projects",
      "Upstream contributions",
      "Side projects",
      "Writing & speaking",
      "Community & mentorship",
    ],
    source: "docs/05-projects.md",
  },
  {
    href: "/skills",
    label: "Skills",
    title: "Skills",
    description:
      "Capabilities with evidence: leadership, architecture, delivery, then technologies.",
    goal: "Present capabilities with evidence.",
    sections: [
      "Capability map",
      "Leadership skills",
      "Architecture & system design",
      "Delivery & operations",
      "Technologies",
      "Currently growing",
    ],
    source: "docs/06-skills.md",
  },
  {
    href: "/resume",
    label: "Resume",
    title: "Resume",
    description: "Web résumé, PDF download, and a copy-paste kit for recruiters.",
    goal: "Give recruiters what they need to submit me, fast.",
    sections: ["Action bar", "Web résumé", "Recruiter kit", "References"],
    source: "docs/07-contact.md §5",
  },
  {
    href: "/contact",
    label: "Contact",
    title: "Contact",
    description: "Email me or send a message.",
    goal: "Turn interest into a conversation.",
    sections: ["Quick actions", "Contact form", "What I'm looking for", "Elsewhere"],
    source: "docs/07-contact.md",
  },
];

export function getPage(href: string): SitePage {
  const page = pages.find((p) => p.href === href);
  if (!page) throw new Error(`Unknown page: ${href}`);
  return page;
}

/** Header links (docs/09-ux.md A1). Contact is rendered as a button. */
export const primaryNav = ["/work", "/experience", "/domain", "/open-source", "/about"].map(
  getPage,
);
