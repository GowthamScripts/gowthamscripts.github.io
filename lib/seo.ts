import type { Metadata } from "next";
import { getContact, getProfile } from "@/lib/content";
import { shareImageSize } from "@/lib/og";
import { getPage, siteUrl } from "@/lib/site";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/**
 * Open Graph fields every page shares. A page that sets its own `openGraph` replaces the root
 * layout's entirely (Next.js does not merge them), so each page spreads this in.
 */
export function sharedOpenGraph(): OpenGraph {
  const profile = getProfile();
  return {
    type: "website",
    siteName: profile.name,
    locale: "en_US",
    images: [
      { url: "/share-image.png", ...shareImageSize, alt: `${profile.name} — ${profile.role}` },
    ],
  };
}

/** Metadata for a top-level page. */
export function pageMetadata(href: string): Metadata {
  const page = getPage(href);
  const title = `${page.title} — ${getProfile().name}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.href },
    openGraph: { ...sharedOpenGraph(), title, description: page.description, url: page.href },
    twitter: { card: "summary_large_image", title, description: page.description },
  };
}

function person() {
  const profile = getProfile();
  const contact = getContact();
  return {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: profile.name,
    jobTitle: profile.role,
    description: profile.seo.description,
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Seattle",
      addressRegion: "WA",
      addressCountry: "US",
    },
    sameAs: [contact.links.github, contact.links.linkedin],
  };
}

/** schema.org Person, rendered once in the root layout. */
export function personJsonLd() {
  return { "@context": "https://schema.org", ...person() };
}

/** schema.org ProfilePage, for the About page. */
export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${siteUrl}/about`,
    dateModified: getProfile().lastUpdated,
    mainEntity: { "@id": `${siteUrl}/#person` },
  };
}

/** schema.org BreadcrumbList from [name, path] pairs, outermost first. */
export function breadcrumbJsonLd(trail: [name: string, path: string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: new URL(path, siteUrl).toString(),
    })),
  };
}

/** Safe to inline in a <script type="application/ld+json">. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
