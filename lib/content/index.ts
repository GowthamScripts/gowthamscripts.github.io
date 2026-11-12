import "server-only";
import fs from "node:fs";
import path from "node:path";
import aboutJson from "@/content/about.json";
import contactJson from "@/content/contact.json";
import domainJson from "@/content/domain.json";
import glossaryJson from "@/content/glossary.json";
import openSourceJson from "@/content/open-source.json";
import profileJson from "@/content/profile.json";
import skillsJson from "@/content/skills.json";
import testimonialsJson from "@/content/testimonials.json";
import { parse, readingMinutes, splitFrontmatter, tableOfContents } from "@/lib/content/parse";
import {
  aboutSchema,
  caseStudySchema,
  contactSchema,
  domainSchema,
  experienceSchema,
  glossarySchema,
  openSourceSchema,
  plannedCaseStudySchema,
  profileSchema,
  projectSchema,
  skillsSchema,
  testimonialsSchema,
  type CaseStudy,
  type Content,
  type Experience,
  type PlannedCaseStudy,
  type Project,
} from "@/lib/content/schemas";
import { findBrokenReferences } from "@/lib/content/validate";
import { pages } from "@/lib/site";

/**
 * The content layer. Everything the site shows is read, validated and cross-checked here.
 * Any problem throws, which fails `next build` — a broken page can't ship.
 */

const contentDir = path.join(process.cwd(), "content");

// Drafts show in development and on preview deployments, never in production.
const showDrafts = process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview";

function readCollection(folder: string): { slug: string; data: unknown; body: string }[] {
  const dir = path.join(contentDir, folder);
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .sort()
    .map((file) => ({
      slug: file.replace(/\.mdx$/, ""),
      ...splitFrontmatter(fs.readFileSync(path.join(dir, file), "utf8")),
    }));
}

function load(): Content {
  const experience: Experience[] = readCollection("experience")
    .map(({ slug, data }) => ({
      slug,
      ...parse(experienceSchema, data, `content/experience/${slug}.mdx`),
    }))
    .filter((role) => showDrafts || !role.draft)
    .sort((a, b) => a.order - b.order || (b.start ?? "").localeCompare(a.start ?? ""));

  // `status: coming-soon` in the front matter marks an announced case study without a page yet.
  const isPlanned = (data: unknown) =>
    typeof data === "object" && data !== null && "status" in data && data.status === "coming-soon";
  const caseStudyFiles = readCollection("case-studies");

  const plannedCaseStudies: PlannedCaseStudy[] = caseStudyFiles
    .filter(({ data }) => isPlanned(data))
    .map(({ slug, data }) => ({
      slug,
      ...parse(plannedCaseStudySchema, data, `content/case-studies/${slug}.mdx`),
    }))
    .filter((study) => showDrafts || !study.draft)
    .sort((a, b) => a.order - b.order);

  const caseStudies: CaseStudy[] = caseStudyFiles
    .filter(({ data }) => !isPlanned(data))
    .map(({ slug, data, body }) => ({
      slug,
      ...parse(caseStudySchema, data, `content/case-studies/${slug}.mdx`),
      readingMinutes: readingMinutes(body),
      toc: tableOfContents(body),
    }))
    .filter((study) => showDrafts || !study.draft)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order);

  const projects: Project[] = readCollection("projects")
    .map(({ slug, data }) => ({
      slug,
      ...parse(projectSchema, data, `content/projects/${slug}.mdx`),
    }))
    .filter((project) => showDrafts || !project.draft)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order);

  const content: Content = {
    profile: parse(profileSchema, profileJson, "content/profile.json"),
    skills: parse(skillsSchema, skillsJson, "content/skills.json"),
    domain: parse(domainSchema, domainJson, "content/domain.json"),
    about: parse(aboutSchema, aboutJson, "content/about.json"),
    openSource: parse(openSourceSchema, openSourceJson, "content/open-source.json"),
    contact: parse(contactSchema, contactJson, "content/contact.json"),
    testimonials: parse(testimonialsSchema, testimonialsJson, "content/testimonials.json").filter(
      (t) => t.permission,
    ),
    glossary: parse(glossarySchema, glossaryJson, "content/glossary.json"),
    experience,
    caseStudies,
    plannedCaseStudies,
    projects,
  };

  const problems = findBrokenReferences(content, ["/", ...pages.map((p) => p.href)]);
  if (problems.length > 0) {
    throw new Error(`Broken links between content files:\n- ${problems.join("\n- ")}`);
  }
  return content;
}

let cached: Content | undefined;

/** All content. Cached for the build; re-read on every request in development. */
export function getContent(): Content {
  if (process.env.NODE_ENV !== "production") return load();
  return (cached ??= load());
}

export const getProfile = () => getContent().profile;
export const getExperience = () => getContent().experience;
export const getCaseStudies = () => getContent().caseStudies;
export const getPlannedCaseStudies = () => getContent().plannedCaseStudies;
export const getCaseStudy = (slug: string) => getCaseStudies().find((c) => c.slug === slug);
export const getProjects = () => getContent().projects;
export const getSkills = () => getContent().skills;
export const getDomain = () => getContent().domain;
export const getAbout = () => getContent().about;
export const getOpenSource = () => getContent().openSource;
export const getContact = () => getContent().contact;
export const getTestimonials = () => getContent().testimonials;
export const getGlossary = () => getContent().glossary;

export { formatMetric, formatMonth, formatPeriod } from "@/lib/format";
