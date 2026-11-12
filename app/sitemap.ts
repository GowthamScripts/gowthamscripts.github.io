import type { MetadataRoute } from "next";
import { getCaseStudies, getProfile } from "@/lib/content";
import { pages, siteUrl } from "@/lib/site";

// Written to a file at build time for the static export.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = getProfile().lastUpdated;
  const paths = [
    "/",
    ...pages.map((page) => page.href),
    ...getCaseStudies().map((study) => `/work/${study.slug}`),
  ];
  return paths.map((path) => ({
    // Trailing slash, matching the canonical address of each exported page.
    url: new URL(path === "/" ? path : `${path}/`, siteUrl).toString(),
    lastModified,
    priority: path === "/" ? 1 : 0.7,
  }));
}
