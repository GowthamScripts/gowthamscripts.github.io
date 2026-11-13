# Portfolio

Portfolio of Gowthaman Thillainathan, Technical Lead. Live at https://gowthaman-thillainathan.github.io and https://gowthamscripts.github.io.

It emphasizes engineering leadership, business impact, domain expertise, architecture, and open source.

## Stack

|                                                | Version      |
| ---------------------------------------------- | ------------ |
| Next.js (App Router, Turbopack, static export) | 16.4         |
| React                                          | 19.3         |
| TypeScript                                     | 6.0          |
| Tailwind CSS                                   | 4.3          |
| shadcn/ui (Radix)                              | 4.23         |
| Motion (formerly Framer Motion)                | 14           |
| MDX (`@next/mdx`)                              | 16.4 / MDX 3 |
| next-themes (dark mode)                        | 0.4          |
| ESLint                                         | 10           |

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
| `npm run build`     | Build the static site into `out/`     |
| `npm run lint`      | ESLint                                |
| `npm run typecheck` | Generate route types, then type-check |
| `npm run format`    | Format with Prettier                  |

## Where things live

| Path                 | Purpose                                               |
| -------------------- | ----------------------------------------------------- |
| `app/`               | Pages, root layout, sitemap, robots, share image, 404 |
| `components/layout/` | Header, footer, mobile menu, theme toggle, providers  |
| `components/motion/` | Reusable animation pieces                             |
| `components/ui/`     | shadcn components                                     |
| `lib/site.ts`        | Page list and navigation                              |
| `lib/seo.ts`         | Page metadata and structured data                     |
| `app/globals.css`    | Design tokens (light and dark)                        |
| `content/`           | Everything the site says                              |

## Editing content

Everything the site says lives in `content/`: the profile, experience, case studies, projects and skills. Case studies are MDX files in `content/case-studies/`; a file with `status: coming-soon` shows as a "Coming soon" card until it is filled in (`caseStudySchema` in `lib/content/schemas.ts`).

A misspelled field, a missing required field, or a link to a case study that doesn't exist stops the build and names the file.

## Deploying

The site is a static export, published to GitHub Pages by `.github/workflows/ci.yml`. Every push to `main` runs lint, type checks, formatting, tests, the build and Lighthouse, and deploys only if all of them pass. The site address is taken from the repository owner (`https://<owner>.github.io`).

The contact form opens the visitor's email app with the message filled in, so no server is needed.

## Lighthouse

After a build, this runs Lighthouse on every page and fails below 95 performance or 100 accessibility, best practices or SEO. It needs Chrome installed. CI runs the same check.

```bash
npm run build
npx @lhci/cli autorun
```

## Analytics

Off by default. Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to your domain to load Plausible (cookie-less, no consent banner needed). Goals recorded: Contact Sent, Resume Download, Resume Summary Copied.

## Configuration

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the site's real address before deploying.
