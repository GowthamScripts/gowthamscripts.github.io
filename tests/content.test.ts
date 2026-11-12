import { describe, expect, it } from "vitest";
import { getContent } from "@/lib/content";
import { parse, readingMinutes, splitFrontmatter, tableOfContents } from "@/lib/content/parse";
import {
  caseStudySchema,
  experienceSchema,
  metricSchema,
  plannedCaseStudySchema,
  type CaseStudy,
  type Content,
} from "@/lib/content/schemas";
import { findBrokenReferences } from "@/lib/content/validate";
import { pages } from "@/lib/site";

const routes = ["/", ...pages.map((page) => page.href)];

/** A deep copy of the real content, so each test can break it safely. */
const copyOfContent = (): Content => structuredClone(getContent());

/** A minimal valid published case study, for tests that need one. */
const studyFields = {
  title: "Example",
  subtitle: "An example case study.",
  company: "Example Co",
  role: "Technical Lead",
  timeline: "6 months",
  team: "4 engineers",
  domain: "Example",
  pillars: ["architecture"],
  heroMetric: { label: "faster", value: 2, suffix: "×" },
  tldr: { problem: "Slow.", action: "Fixed it.", result: "Fast." },
  results: [{ category: "technical", label: "Speed", before: "1", after: "2", change: "2×" }],
  date: "2025-01",
};
const exampleStudy = (slug: string): CaseStudy => ({
  ...caseStudySchema.parse(studyFields),
  slug,
  readingMinutes: 1,
  toc: [],
});

describe("the content in /content", () => {
  it("passes every schema and has no broken links", () => {
    const content = getContent();
    expect(content.caseStudies.length + content.plannedCaseStudies.length).toBeGreaterThan(0);
    expect(findBrokenReferences(content, routes)).toEqual([]);
  });

  it("only features one published case study, listed first", () => {
    const [, ...rest] = getContent().caseStudies;
    expect(rest.some((study) => study.featured)).toBe(false);
  });

  it("lists experience most recent first", () => {
    const orders = getContent().experience.map((role) => role.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it("contains no leftover sample content", () => {
    const text = JSON.stringify(getContent());
    expect(text).not.toMatch(/\(sample\)|Northlake|Cascade Commerce|\$4M/);
  });
});

describe("schema validation", () => {
  it("names the file and the field when content is invalid", () => {
    expect(() => parse(metricSchema, { label: "uptime", value: "high" }, "content/x.json")).toThrow(
      /content\/x\.json[\s\S]*value/,
    );
  });

  it("rejects misspelled fields instead of ignoring them", () => {
    expect(() =>
      parse(metricSchema, { label: "uptime", value: 1, sufix: "%" }, "content/x.json"),
    ).toThrow(/sufix/);
  });

  it("rejects a case study with no results", () => {
    expect(caseStudySchema.safeParse(studyFields).success).toBe(true);
    expect(caseStudySchema.safeParse({ ...studyFields, results: [] }).success).toBe(false);
  });

  it("accepts a coming-soon case study without results, and nothing extra", () => {
    const planned = {
      status: "coming-soon",
      title: "Hospitality Platform",
      industry: "Hospitality",
      role: "Role to be added",
      summary: "In progress.",
    };
    expect(plannedCaseStudySchema.safeParse(planned).success).toBe(true);
    expect(plannedCaseStudySchema.safeParse({ ...planned, results: [] }).success).toBe(false);
  });

  it("accepts a metric as a number or as text, but not both or neither", () => {
    expect(metricSchema.safeParse({ label: "years", value: 10, suffix: "+" }).success).toBe(true);
    expect(metricSchema.safeParse({ label: "role", display: "Technical Lead" }).success).toBe(true);
    expect(metricSchema.safeParse({ label: "x", value: 1, display: "One" }).success).toBe(false);
    expect(metricSchema.safeParse({ label: "x" }).success).toBe(false);
  });

  it("lets a role be listed with only its title", () => {
    expect(experienceSchema.safeParse({ title: "Software Engineer" }).success).toBe(true);
    expect(experienceSchema.safeParse({ title: "Lead", start: "March 2022" }).success).toBe(false);
  });
});

describe("links between content files", () => {
  it("catches an experience entry that points at a missing case study", () => {
    const content = copyOfContent();
    content.experience[0]!.caseStudies.push("does-not-exist");
    expect(findBrokenReferences(content, routes).join("\n")).toMatch(/does-not-exist/);
  });

  it("catches a metric that points at a missing case study", () => {
    const content = copyOfContent();
    content.profile.proof[0]!.caseStudy = "gone";
    expect(findBrokenReferences(content, routes).join("\n")).toMatch(/profile\.json proof/);
  });

  it("catches skill evidence that points at a page that is not on the site", () => {
    const content = copyOfContent();
    content.skills.capabilities[0]!.evidence.push({ label: "Blog", href: "/blog" });
    expect(findBrokenReferences(content, routes).join("\n")).toMatch(/"\/blog"/);
  });

  it("allows only one featured case study", () => {
    const content = copyOfContent();
    content.caseStudies = [exampleStudy("one"), exampleStudy("two")];
    content.caseStudies.forEach((study) => (study.featured = true));
    expect(findBrokenReferences(content, routes).join("\n")).toMatch(/Only one case study/);
  });
});

describe("MDX helpers", () => {
  const source = [
    "---",
    "title: Hello",
    "---",
    "",
    "## First part",
    "",
    "Some words here.",
    "",
    "```md",
    "## Not a heading",
    "```",
    "",
    "### A **bold** detail",
    "",
    "## First part",
  ].join("\n");

  it("separates front matter from the body", () => {
    const { data, body } = splitFrontmatter(source);
    expect(data).toEqual({ title: "Hello" });
    expect(body).not.toContain("title: Hello");
  });

  it("builds a table of contents, skipping code blocks and numbering duplicates", () => {
    const { body } = splitFrontmatter(source);
    expect(tableOfContents(body)).toEqual([
      { id: "first-part", text: "First part", depth: 2 },
      { id: "a-bold-detail", text: "A bold detail", depth: 3 },
      { id: "first-part-1", text: "First part", depth: 2 },
    ]);
  });

  it("estimates reading time, never below one minute", () => {
    expect(readingMinutes("short")).toBe(1);
    expect(readingMinutes("word ".repeat(441))).toBe(3);
  });
});
