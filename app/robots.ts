import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Written to a file at build time for the static export.
export const dynamic = "force-static";

// Preview deployments must not be indexed (docs/10-architecture.md §10).
const isPreview = process.env.VERCEL_ENV === "preview";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isPreview ? { userAgent: "*", disallow: "/" } : { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
