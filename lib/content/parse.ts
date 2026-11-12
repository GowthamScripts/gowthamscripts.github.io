import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import { z } from "zod";
import type { TocItem } from "@/lib/content/schemas";

/** Validate data against a schema; on failure, throw an error that names the file and field. */
export function parse<S extends z.ZodType>(schema: S, data: unknown, file: string): z.infer<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid content in ${file}\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

/** Split an .mdx file into its YAML front matter and its body. */
export function splitFrontmatter(source: string): { data: unknown; body: string } {
  const { data, content } = matter(source);
  return { data, body: content };
}

/** Table of contents from ## and ### headings. Ids match what rehype-slug generates. */
export function tableOfContents(body: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inCodeBlock = false;
  for (const line of body.split("\n")) {
    if (line.trimStart().startsWith("```")) inCodeBlock = !inCodeBlock;
    if (inCodeBlock) continue;
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const text = match[2]!.replace(/[*_`]/g, "");
    items.push({ id: slugger.slug(text), text, depth: match[1]!.length as 2 | 3 });
  }
  return items;
}

/** Whole minutes to read, at 220 words per minute. Never less than 1. */
export function readingMinutes(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}
