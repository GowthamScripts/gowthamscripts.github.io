# 10 — Technical Architecture

> **Purpose:** How the portfolio is built: stack, structure, content model, theming, motion, SEO, and quality gates. It turns `08-design.md` and `09-ux.md` into engineering decisions. Still no code — this is the design doc the build follows.
>
> **Stack (as installed, Nov 2026):** Next.js 16.4 · React 19.3 · TypeScript 6.0 · Tailwind CSS 4.3 · shadcn/ui 4.23 (Radix) · Motion 14 · MDX 3 · next-themes 0.4 · ESLint 10
>
> **Status:** Phase 0 (foundation) is built. See §16.

---

## 1. Architecture Principles

1. **Static by default.** Every page is pre-rendered at build time. The site has no database and no runtime server dependency except the contact form.
2. **Content is data.** All portfolio content lives in typed MDX/JSON in the repo. Pages are templates; changing a case study never touches a component.
3. **Server Components first.** Interactive pieces (filters, diagrams, motion, theme toggle, forms) are small client "islands". Everything else ships zero JavaScript.
4. **Type-safe end to end.** Content schemas are validated at build; a missing field fails the build instead of rendering a broken page.
5. **Accessible and fast are requirements, not polish.** Budgets from `08 §7–8` are enforced in CI.
6. **The repo is part of the portfolio.** Clean structure, ADRs, tests, and a good README — a Staff engineer will read it.

---

## 2. Stack Decisions

| Layer | Choice | Why | Notes / alternatives considered |
|---|---|---|---|
| Framework | **Next.js 16.4, App Router** (Turbopack, Cache Components on) | Static generation, React Server Components, built-in Metadata API, image/font optimization, OG image generation | Latest stable. Cache Components forbids `new Date()` / `Math.random()` during prerender — use constants or client components. Astro was the main alternative — lighter, but less showcase value for React-heavy Seattle roles. |
| Language | **TypeScript 6.0 (strict)** | Typed content and props; signals rigor | TypeScript 7 is out, but the lint tooling (`typescript-eslint`) only supports up to 6.0. Move to 7 when it does. |
| Styling | **Tailwind CSS v4** | Design tokens as CSS variables, fast iteration, tiny CSS output | Tokens defined once and shared by Tailwind and shadcn |
| Components | **shadcn/ui** (Radix primitives) | Accessible primitives (Dialog, Sheet, Accordion, Tabs, Tooltip, Popover, Command) copied into the repo and fully owned | Only add components actually used; restyle to match `08` |
| Motion | **Motion 14** (formerly Framer Motion — `motion` package) | Layout animations, shared-element transitions, scroll-triggered reveals, spring physics | Use the `motion` package; use the lightweight `LazyMotion` setup to keep bundle small |
| Content | **MDX** (`@next/mdx`) + our own content layer in `lib/content` | Rich case studies with embedded components (diagrams, trade-off tables, metric tiles) | Zod 4 schemas, YAML front matter read with gray-matter, cross-reference checks. No extra build tool to keep compatible with Next.js and Turbopack (ADR-003). Velite and Content Collections were the alternatives. |
| Dark mode | **next-themes** + CSS variables | System preference by default, manual toggle, no flash on load | Tailwind `dark` variant keyed to a class on `<html>` |
| SEO | Next.js **Metadata API**, `sitemap`, `robots`, generated OG images, JSON-LD | Native to the framework, statically generated | See §10 |
| Syntax highlighting | **Shiki** (via rehype-pretty-code) | Build-time highlighting, zero client JS, light + dark themes | |
| Icons | **lucide-react** | Default for shadcn, tree-shakeable | |
| Fonts | **next/font** (self-hosted) | No layout shift, no third-party requests | Max 2 families + mono (`08 §5`) |
| Forms | React 19 `useActionState` + **Zod**, submitted to a **Server Action** | Shared validation client + server; no form library needed | Email delivery via Resend's HTTP API when `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are set (no SDK). Swap providers in `lib/email.ts`. |
| Analytics | `{{Plausible / Umami / Vercel Analytics}}` | Privacy-first, cookie-less | |
| Hosting | **Vercel** | First-class Next.js support, preview deployments per PR | Alternatives: Netlify, Cloudflare |
| Package manager | **npm** | Already installed; no extra tooling | pnpm is a drop-in swap later |
| Linting | **ESLint 10** + eslint-config-next | Latest stable | Needs Node ≥ 22.13. One plugin (`eslint-plugin-import`) has not declared ESLint 10 support yet; it runs clean today. |

---

## 3. Rendering Strategy

| Route | Rendering | Interactive islands |
|---|---|---|
| `/` Home | Static | Hero intro animation, metric count-ups, before/after slider, testimonial carousel |
| `/about` | Static | Story progress / TOC, expandable "How I work" cards |
| `/experience` | Static | Filter chips (URL state), expand/collapse, scope chart |
| `/domain` | Static | Interactive flow diagram, glossary popovers |
| `/work` | Static | Filter/sort with layout animation |
| `/work/[slug]` | Static (`generateStaticParams`) | TOC scroll-spy, skim mode, diagram toggle/lightbox, count-ups |
| `/open-source` | Static today; **ISR** for live GitHub stats is planned, not built | None yet (numbers come from `content/open-source.json`) |
| `/skills` | Static | Capability accordions, tech search, optional Role Fit Checker (local only) |
| `/resume` | Static | Copy buttons, variant tabs, download |
| `/contact` | Static page + **Server Action** | Form |
| `/opengraph-image` per route | Generated at build | — |

- No client-side data fetching on page load.
- GitHub data fetched at build/revalidation time with a token stored as an environment variable; failures fall back to the last committed snapshot (`09 A9`).

---

## 4. Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx               Root layout: fonts, theme provider, header, footer, JSON-LD Person
│   ├── page.tsx                 Home
│   ├── about/
│   ├── experience/
│   ├── domain/
│   ├── work/
│   │   ├── page.tsx             Case study index
│   │   └── [slug]/
│   │       ├── page.tsx         Case study detail
│   │       └── opengraph-image  Per-case-study OG image
│   ├── open-source/
│   ├── skills/
│   ├── resume/
│   ├── contact/
│   │   └── actions              Server Action for the form
│   ├── not-found                Custom 404 ("This page went off-call")
│   ├── sitemap                  Generated sitemap
│   ├── robots                   Generated robots rules
│   └── opengraph-image          Default OG image
│
├── components/
│   ├── ui/                      shadcn primitives (owned, restyled)
│   ├── layout/                  Header, Footer, MobileNav, ThemeToggle, CommandPalette
│   ├── motion/                  Reveal, Stagger, CountUp, PageTransition, ReducedMotion wrappers
│   ├── sections/                Page sections: Hero, ProofBar, HowILead, CareerSnapshot…
│   ├── mdx/                     Components usable inside MDX (see §5.3)
│   └── shared/                  Card, MetricTile, Tag, CopyButton, Toast…
│
├── content/
│   ├── profile.json             From 01-personal.md
│   ├── experience/              One file per role (from 02)
│   ├── domain.mdx               From 03
│   ├── case-studies/            One MDX per case study (from 04)
│   ├── projects/                One file per OSS/side project (from 05)
│   ├── skills.json              From 06
│   ├── contact.json             From 07
│   ├── testimonials.json
│   └── glossary.json            Domain terms (powers tooltips site-wide)
│
├── lib/
│   ├── content/                 Content loaders and Zod schemas
│   ├── seo/                     Metadata helpers, JSON-LD builders
│   ├── github/                  Build-time GitHub stats fetch + fallback snapshot
│   └── utils/
│
├── styles/                      Global CSS, design tokens (light + dark)
├── public/                      Résumé PDF, images, diagrams (SVG), favicons
├── docs/                        These docs + adr/
├── tests/                       Unit, component, e2e, accessibility
└── .github/workflows/           CI
```

---

## 5. Content Model (MDX + JSON)

All content is validated against schemas at build. Fields map directly to the doc that defines them.

### 5.1 Collections

| Collection | Format | Key fields | Source doc |
|---|---|---|---|
| `profile` | JSON | name, title, positioning, hero copy, proof metrics, bios, principles, signature numbers, availability, SEO | `01` |
| `experience` | MDX (one per role) | company, title, start, end, location, context, scope (team size, scale, systems), mission, achievements (each with a **tag**: LEAD / ARCH / BIZ / OPS / XFN / OSS), promotions, linked case studies, technologies, order | `02` |
| `caseStudies` | MDX | slug, title, subtitle, company (or anonymized), role, timeline, team, stakeholders, domain, pillars, hero metric, results table data, featured flag, order, reading time (computed), draft flag | `04` |
| `projects` | MDX | name, role, repo, package, license, status, adoption, problem, contribution, highlights, PR links, featured flag, type (OSS / side) | `05` |
| `skills` | JSON | capabilities (name, level, proof, evidence links), leadership, architecture, delivery, technologies (primary / familiar by category), growing | `06` |
| `contact` | JSON | channels, availability, CTA copy, recruiter kit, references | `07` |
| `testimonials` | JSON | quote, name, title, relationship, permission, placements | `07 §6` |
| `glossary` | JSON | term, short definition, long definition | `03` |

### 5.1a How it is implemented

| Piece | Where |
|---|---|
| Schemas (strict: a misspelled field fails) | `lib/content/schemas.ts` |
| Front matter, table of contents, reading time | `lib/content/parse.ts` |
| Links between content files | `lib/content/validate.ts` |
| Loaders (`getProfile()`, `getCaseStudies()`, …) | `lib/content/index.ts` |
| Tests | `tests/content.test.ts` (`npm test`) |

- JSON collections: `profile`, `about`, `skills`, `domain`, `open-source`, `contact`, `testimonials`, `glossary`. `domain` is JSON, not MDX — it is all structured data.
- MDX collections: `experience`, `case-studies`, `projects`. Data lives in YAML front matter; the file name is the slug. Only case studies render a body so far.
- `profile.sample: true` shows a "Sample content" banner on every page. Set it to `false` once real content is in.
- An unknown case-study address shows the 404 page with a `noindex` tag but returns HTTP 200: with Cache Components the page shell is sent before the slug is checked.

### 5.2 Content rules
- **`draft: true`** content renders in development and preview deploys only, never in production.
- **Cross-references are validated:** a case study linked from an experience entry must exist, or the build fails.
- **Metrics are structured data** (`before`, `after`, `unit`, `context`), not strings, so they can animate and power tooltips.
- **Reading time** and **table of contents** are computed from MDX headings at build.

### 5.3 MDX components (available inside case studies)

| Component | Purpose | UX ref |
|---|---|---|
| Snapshot | Top-of-page role/team/timeline card | `09 §5b.2` |
| TLDR | Problem / What I did / Result | `09 §5b.3` |
| Constraints | Icon list of constraints | `09 §5b.5` |
| TradeOffTable | Options with chosen row highlighted | `09 §5b.7` |
| ArchitectureDiagram | Before/After toggle, lightbox, hover tooltips, text alternative | `09 §5b.8` |
| Decision | "Why?" expandable rationale callout | `09 §5b` interactions |
| Milestones | Animated timeline | `09 §5b.9` |
| Callout | Lesson / Warning / What went wrong variants | `09 §5b.10` |
| ResultsTable | Before → after → change with count-up | `09 §5b.11` |
| Metric | Inline metric with context tooltip | `09 A7` |
| Term | Glossary popover | `09 §4` |
| Quote | Testimonial | `09 §5b.13` |
| Figure | Image/diagram with caption | — |

---

## 6. Design Tokens & Theming

### 6.1 Token flow
```
08-design.md tokens
      ↓
CSS variables (light values on :root, dark values on .dark)
      ↓
Tailwind theme (colors, spacing, radius, fonts read the variables)
      ↓
shadcn components (use the same variables: background, foreground, primary, muted, border, ring…)
```

- One source of truth: changing `accent` in one place updates Tailwind utilities, shadcn components, diagrams, and OG images.
- Token names follow shadcn's conventions (`background`, `foreground`, `card`, `primary`, `muted`, `accent`, `border`, `ring`) plus portfolio-specific ones (`success`, `warning`, `diagram-stroke`, `diagram-highlight`).

### 6.2 Dark mode behavior
| Requirement | Approach |
|---|---|
| Default follows OS | next-themes with `system` default |
| Manual toggle (light / dark / system) | Theme toggle in header + command palette action |
| No flash of wrong theme | next-themes injects the theme class before paint; `<html>` suppresses hydration warning |
| Remembers choice | Stored locally by next-themes |
| Images & diagrams | SVG diagrams use `currentColor` and tokens so they recolor; raster screenshots have light/dark variants where needed |
| Code blocks | Shiki dual themes switch with the class |
| OG images | Always light theme (predictable in link previews) |
| Smooth switch | Short color transition on theme change; disabled under reduced motion |

---

## 7. shadcn/ui Component Map

| UX need (`09`) | shadcn component(s) |
|---|---|
| Mobile nav sheet / project drawer / domain step panel | Sheet, Drawer |
| Command palette (⌘K) | Command + Dialog |
| Role cards, "How I work", capability cards, principles | Accordion, Collapsible |
| Filter chips | Toggle Group |
| Before/After, résumé variants | Tabs |
| Tooltips on metrics, badges, levels | Tooltip, Hover Card |
| Glossary terms, footnotes | Popover |
| Diagram lightbox, booking modal | Dialog |
| Toasts ("Copied", "Résumé downloaded") | Sonner |
| Contact form | Form, Input, Textarea, Select, Label, Button |
| Skeleton loading | Skeleton |
| Section separators | Separator |
| Résumé sections / OSS tables | Table |
| Scroll areas (horizontal timeline, carousels) | Scroll Area, Carousel |

All components restyled to the tokens in §6; no default shadcn look left untouched on visible surfaces.

---

## 8. Motion Architecture (Framer Motion)

### 8.1 Motion tokens → implementation
| `09 A6` token | Implementation |
|---|---|
| instant / quick / standard | Shared transition presets (duration + easing) in one motion config file |
| expressive | Spring preset (low bounce) |
| stagger | Shared parent/child variants with a stagger delay |

### 8.2 Reusable motion primitives (`components/motion/`)
| Primitive | Behavior | Used on |
|---|---|---|
| Reveal | Fade + rise ≤ 16px once, at 15% in view | All pages |
| Stagger | Children reveal in sequence | Card grids, lists |
| CountUp | Animates number from `from` to `to` when in view; shows final value under reduced motion | Proof bar, KPIs, results |
| DrawLine | SVG path draws as it enters | Timelines, chart lines, trade-off highlight |
| PageTransition | Enter/exit fade + shift between routes | Root template |
| SharedElement | Shared `layoutId` for card → detail morph | Work index → case study |
| LayoutGroup lists | Animated re-flow when filtering | Experience, Work, Open Source |
| FlowPlayer | Token travelling along a path, step highlighting, replay | Domain diagram |

### 8.2a What is built, and how

| Animation | How | File |
|---|---|---|
| Page enter, hero intro, chart reveal | CSS keyframes, no JavaScript | `app/globals.css`, `app/template.tsx` |
| Scroll reveal | Motion `whileInView` | `components/motion/reveal.tsx` |
| Number count-up | Motion `animate`, writes text directly | `components/motion/count-up.tsx` |
| Case-study title morph | React `<ViewTransition>` with a shared name | `components/shared/case-study-card.tsx`, `app/work/[slug]/page.tsx` |
| Filter re-flow | Motion `layout` + `AnimatePresence` | `components/work/work-list.tsx` |
| Reading progress | Motion `useScroll` | `components/work/reading-progress.tsx` |
| Domain walk-through | Timers + Motion `layoutId` ring | `components/domain/flow-diagram.tsx` |
| Nav underline | Motion `layoutId` | `components/layout/header.tsx` |

The hero intro plays on every visit to Home, not only the first of a session.

### 8.3 Rules
- A single **reduced-motion provider** reads the OS preference; every primitive checks it and falls back to opacity-only or no animation.
- Use `LazyMotion` with only the features needed to keep motion JavaScript small; heavier features (layout, drag) load only on pages that use them.
- Animate only `transform` and `opacity` (GPU-friendly); never animate layout properties directly — use layout animations.
- Server-rendered content is visible without JavaScript; animations enhance an already-readable page.
- Shared-element route transitions: start with Motion's `layoutId` approach; evaluate the browser View Transitions API support in Next.js as a later improvement (ADR-005).

---

## 9. Interaction & State

| Concern | Approach |
|---|---|
| Filter state (Experience, Work, Open Source) | URL search params (shareable, back-button friendly) |
| Skim mode, theme, résumé variant | Local preference storage, with safe defaults if unavailable |
| Contact form draft | Local storage, cleared on successful submit |
| Command palette index | Built at build time from content collections; searched client-side |
| Scroll-spy TOC | Intersection Observer in a small client component |
| Global UI state | None needed — no state library |

---

## 10. SEO Architecture

| Item | Approach |
|---|---|
| Per-page metadata | Metadata API: static `metadata` for fixed pages; `generateMetadata` for case studies and projects, built from content frontmatter |
| Title template | `%s — {{FULL_NAME}}`; home uses full positioning title (`01 §9`) |
| Canonical URLs | Set on every page via metadata base + alternates |
| Open Graph / Twitter cards | Generated OG images per route: name, title, page title, and hero metric for case studies; consistent template |
| Structured data (JSON-LD) | `Person` (root), `ProfilePage` (home/about), `Article` (case studies), `BreadcrumbList` (detail pages), `CreativeWork`/`SoftwareSourceCode` (OSS projects) |
| Sitemap | Generated from routes + content collections, with last-modified from content dates |
| Robots | Allow all in production; **noindex on preview deployments** |
| Semantic HTML | One `h1` per page, ordered headings, landmarks — also the a11y baseline |
| Performance as SEO | Core Web Vitals budgets in §11 |
| Résumé | HTML version on `/resume` is indexable; PDF linked with a descriptive filename |
| Keywords | Target phrases from `01 §9` appear naturally in headings and copy — no keyword stuffing |
| Analytics goals | Résumé download, contact submit, booking click, outbound GitHub/LinkedIn |

---

### 10.1 What is built

| Item | Where |
|---|---|
| Shared Open Graph fields + per-page metadata | `lib/seo.ts` (`sharedOpenGraph`, `pageMetadata`) |
| Default share image, one per case study | `app/opengraph-image.tsx`, `app/work/[slug]/opengraph-image.tsx`, drawn by `lib/og.tsx` |
| Tab icon, home-screen icon, manifest | `app/icon.tsx`, `app/apple-icon.tsx`, `app/manifest.ts` |
| Structured data | Person (every page), ProfilePage (About), Article + BreadcrumbList (case studies) |
| Sitemap, robots | `app/sitemap.ts`, `app/robots.ts` (previews are not indexed) |
| Security headers | `next.config.ts` (`headers()`) |
| Analytics + goals | `components/layout/analytics.tsx`, `lib/analytics.ts` (Contact Sent, Resume Download, Resume Summary Copied) |
| Lighthouse budget | `lighthouserc.json`, run in CI and locally with `npx @lhci/cli autorun` |

Gotcha: a page that sets its own `openGraph` replaces the root layout's, including the share image. Always spread `sharedOpenGraph()`.

Filters on Experience and Work read the address with `useSyncExternalStore` (`lib/hooks/use-url-list.ts`), not `useSearchParams`. The latter forced the list to be re-created in the browser after load, which pushed Largest Contentful Paint to 4 s.

## 11. Performance Budget & Techniques

Budgets from `08 §8` (LCP < 1.8s, CLS < 0.05, INP < 150ms, home JS < `{{50KB gz}}`).

| Technique | Detail |
|---|---|
| Server Components by default | Client components only for islands in §3 |
| Code splitting | Diagrams, lightbox, command palette, and booking modal load on demand |
| Images | `next/image`, AVIF/WebP, explicit sizes, priority only for the hero image |
| Fonts | `next/font`, subset, `display: swap`, preload ≤ 2 files |
| Diagrams | Inline/optimized SVG, not raster |
| Third parties | None on page load; booking and video embeds load on click |
| Bundle checks | Bundle analyzer in CI; budget failure blocks merge |

---

## 12. Accessibility Implementation
- Radix/shadcn primitives provide focus management, ARIA, and keyboard behavior for dialogs, sheets, accordions, tabs, popovers.
- Skip link, visible focus ring token, landmarks in root layout.
- Live region for toasts, form results, and filter counts.
- Every interactive diagram has keyboard navigation and a text alternative stored in its content entry.
- Automated checks: axe in component and end-to-end tests; manual screen-reader passes (VoiceOver, NVDA) before launch.

---

## 13. Quality & Delivery

| Area | Tooling |
|---|---|
| Linting & formatting | ESLint (Next + TypeScript + jsx-a11y rules), Prettier with Tailwind class sorting |
| Type checking | `tsc --noEmit` in CI |
| Content validation | Schema validation at build; cross-reference checks |
| Unit / component tests | Vitest + Testing Library (CountUp, filters, form validation, content loaders) |
| End-to-end | Playwright: key journeys from `09 Part C`, theme toggle, form submit, mobile viewport |
| Accessibility | axe-core in Playwright on every page, light and dark |
| Performance | Lighthouse CI with budgets on Home, a case study, and Contact |
| Visual regression | `{{optional: Playwright screenshots / Chromatic}}` |
| CI | GitHub Actions: install → lint → typecheck → test → build → Lighthouse → e2e |
| Previews | Vercel preview deployment per PR (noindex) |
| Branching | `main` = production; short-lived feature branches; conventional commits |

---

## 14. Environment & Configuration

| Variable | Purpose | Where |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL for metadata, sitemap, OG | All envs |
| `GITHUB_TOKEN` | Build-time GitHub stats | Build only, server-side |
| `RESEND_API_KEY` | Contact form delivery | Server only |
| `CONTACT_FROM_EMAIL` | Optional sender address on a verified domain | Server only |
| `CONTACT_TO_EMAIL` | Destination inbox | Server only |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Turns analytics on | Production only |
| `NEXT_PUBLIC_PLAUSIBLE_SRC` | Optional self-hosted or proxied script address | Production only |

Secrets never reach client bundles; only `NEXT_PUBLIC_` values are public.

---

## 15. Architecture Decision Records (to write in `docs/adr/`)

| ADR | Decision | Status |
|---|---|---|
| 001 | Next.js 16 App Router over Astro | Accepted |
| 002 | Static generation + ISR only for GitHub stats | `{{Proposed}}` |
| 003 | Content layer: own Zod loader in `lib/content` over Velite / Content Collections | Accepted |
| 004 | Tailwind v4 tokens shared with shadcn | `{{Proposed}}` |
| 005 | Shared-element transitions: React `<ViewTransition>` (browser View Transitions API) over Motion `layoutId` | Accepted |
| 006 | Contact form: Server Action + Resend over HTTP, no form library | Accepted (provider easy to swap) |
| 007 | Analytics: Plausible-compatible script, off unless `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set | Accepted (provider easy to swap) |
| 008 | Hosting on Vercel | `{{Proposed}}` |

---

## 16. Build Plan (milestones)

| Phase | Scope | Done when |
|---|---|---|
| 0. Foundation ✅ | Repo, tooling, CI, tokens, fonts, theme, root layout, header/footer | **Done locally:** nine placeholder pages build statically with light/dark working; lint, typecheck and build pass. Not yet deployed. |
| 1. Content layer ✅ | Schemas, collections, sample content from docs `01`–`07` | **Done:** build fails on invalid content or broken links (verified); all pages read typed data; 13 tests. Content is still sample data. |
| 2. Core pages ✅ | Home, Experience, Work index + detail, Contact, Resume | **Done:** both journeys work end to end in the browser, on desktop and phone sizes. Deferred to phase 4: scope chart, scroll-spy, reading progress, résumé variants. Not built: rate limiting on the contact form; education/awards (no content yet). |
| 3. Depth pages ✅ | About, Domain, Open Source, Skills | **Done:** all nine pages are built and prerendered as static pages. Deferred: live GitHub numbers (the planned 24-hour refresh), the animated flow token and site-wide glossary tooltips (phase 4), the Role Fit Checker (open decision). |
| 4. Motion & interactions ✅ | Motion primitives, filters, diagrams, command palette | **Done:** hero intro, page transitions, count-ups, title morph, filter re-flow, reading progress, scroll-spy contents, team-size chart, Domain walk-through with replay, ⌘K palette, glossary pop-ups in MDX. Reduced-motion fallbacks are coded but were not tested in a browser. Not built: before/after architecture diagrams and the animated trade-off table (no diagram content yet), testimonial carousel, résumé variants. |
| 5. SEO & polish ✅ | Metadata, OG images, JSON-LD, sitemap, 404, analytics | **Done:** Lighthouse scores 100 in performance, accessibility, best practices and SEO on all ten tested pages (mobile profile, light theme, local production build). Accessibility was checked through Lighthouse's axe-based audits, not a separate axe run; dark theme and screen readers were not tested. Analytics is built but off until configured. |
| 6. Launch | Domain, content review, launch checklist (`08 §12`) | Live on `{{DOMAIN_NAME}}` |
