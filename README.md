# Portfolio

Portfolio site for a Technical Lead / Senior Software Engineer targeting Seattle.
It emphasizes engineering leadership, business impact, domain expertise, architecture, and open source.

**Status:** Phases 0–5 are done — foundation, validated content layer, all nine pages, motion, and SEO polish. What's left is real content and launch (phase 6) (see [docs/10-architecture.md](docs/10-architecture.md) §16).

## Stack

|                                                   | Version      |
| ------------------------------------------------- | ------------ |
| Next.js (App Router, Turbopack, Cache Components) | 16.4         |
| React                                             | 19.3         |
| TypeScript                                        | 6.0          |
| Tailwind CSS                                      | 4.3          |
| shadcn/ui (Radix)                                 | 4.23         |
| Motion (formerly Framer Motion)                   | 14           |
| MDX (`@next/mdx`)                                 | 16.4 / MDX 3 |
| next-themes (dark mode)                           | 0.4          |
| ESLint                                            | 10           |

## Run it

Requires Node.js 22.13 or newer (ESLint 10 needs it).

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

| Command             | What it does                          |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Start the dev server                  |
| `npm run build`     | Production build                      |
| `npm run lint`      | ESLint                                |
| `npm run typecheck` | Generate route types, then type-check |
| `npm run format`    | Format with Prettier                  |

## Where things live

| Path                 | Purpose                                                   |
| -------------------- | --------------------------------------------------------- |
| `app/`               | Pages, root layout, sitemap, robots, share image, 404     |
| `components/layout/` | Header, footer, mobile menu, theme toggle, providers      |
| `components/motion/` | Reusable animation pieces                                 |
| `components/ui/`     | shadcn components                                         |
| `lib/site.ts`        | Name, links, page list — **fill in the TODOs here first** |
| `lib/seo.ts`         | Page metadata and structured data                         |
| `app/globals.css`    | Design tokens (light and dark)                            |
| `docs/`              | Content, design, UX, and architecture docs                |

## Editing content

Everything the site says lives in `content/`. Real profile details are in; a few items are still placeholders:

- **Experience** (`content/experience/*.mdx`): titles only. Add `company`, `start` (e.g. `"2021-04"`), `end`, `location` and `achievements`; the team-size chart appears once two roles have dates and `scope.teamSize`.
- **Case studies** (`content/case-studies/*.mdx`): five `status: coming-soon` cards. Fill in `role` and `technologies`; to publish one, remove `status` and add the full fields (`caseStudySchema` in `lib/content/schemas.ts`).
- **Contact email** (`content/contact.json`): still `hello@example.com`.
- When nothing is a placeholder any more, set `"sample": false` in `content/profile.json` to remove the "work in progress" banner.

A misspelled field, a missing required field, or a link to a case study that doesn't exist stops the build and names the file.

## Contact form and résumé PDF

- **Contact form:** set `RESEND_API_KEY` and `CONTACT_TO_EMAIL` (see `.env.example`) to receive messages. Without them, messages print to the server log in development, and in production the form asks visitors to email you directly.
- **Résumé PDF:** add `public/resume.pdf` and a Download button appears on the Resume page. Until then the page offers "Save as PDF" through the browser's print dialog.

## Lighthouse

After a build, this runs Lighthouse on every page and fails below 95 performance or 100 accessibility, best practices or SEO. It needs Chrome installed. CI runs the same check.

```bash
npx @lhci/cli autorun
```

## Analytics

Off by default. Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to your domain to load Plausible (cookie-less, no consent banner needed). Goals recorded: Contact Sent, Resume Download, Resume Summary Copied.

## Configuration

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the site's real address before deploying.
