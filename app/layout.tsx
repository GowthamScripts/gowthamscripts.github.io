import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@/components/layout/analytics";
import { CommandPaletteLoader } from "@/components/layout/command-palette-loader";
import type { PaletteItem } from "@/components/layout/command-palette";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ToasterLoader } from "@/components/layout/toaster-loader";
import { Providers } from "@/components/layout/providers";
import { getCaseStudies, getContact, getProfile, getProjects } from "@/lib/content";
import { jsonLdString, personJsonLd, sharedOpenGraph } from "@/lib/seo";
import { pages, siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const profile = getProfile();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.role} · ${profile.specialty} · ${profile.location}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.seo.description,
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
  alternates: { canonical: "/" },
  openGraph: { ...sharedOpenGraph(), url: "/" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1014" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Search index for the ⌘K palette, built from the content at build time.
  const paletteItems: PaletteItem[] = [
    { group: "Pages", label: "Home", href: "/" },
    ...pages.map((page) => ({
      group: "Pages",
      label: page.title,
      href: page.href,
      keywords: page.description,
    })),
    ...getCaseStudies().map((study) => ({
      group: "Case studies",
      label: study.title,
      href: `/work/${study.slug}`,
      keywords: `${study.subtitle} ${study.domain}`,
    })),
    ...getProjects().map((project) => ({
      group: "Projects",
      label: project.name,
      href: `/open-source#${project.slug}`,
      keywords: project.summary,
    })),
  ];

  return (
    // suppressHydrationWarning: next-themes sets the theme class on <html> before React hydrates.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <noscript>
          {/* Without JavaScript, show everything that would otherwise animate in. */}
          <style>{`[data-reveal]{animation:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Providers>
          {profile.sample && (
            <p className="bg-warning/15 px-4 py-1.5 text-center text-xs text-foreground print:hidden">
              This site is a work in progress — some details are still being added.
            </p>
          )}
          <Header
            name={profile.name}
            initials={profile.initials}
            availability={profile.availability}
          />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          {/* On phones, sit above the bottom action bar. */}
          <CommandPaletteLoader items={paletteItems} email={getContact().email} />
          <ToasterLoader />
        </Providers>
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdString(personJsonLd()),
          }}
        />
      </body>
    </html>
  );
}
