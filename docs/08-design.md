# 08 — Design & Experience Specification

> **Purpose:** Defines how the portfolio looks, reads, and behaves — the brief a designer and frontend engineer build from. No code here; decisions and rationale only.
>
> **Design north star:** *"Reads like a well-written engineering design doc, feels like a polished product."* Calm, confident, content-first. The work is the hero, not the animations.

---

## 1. Goals & Success Metrics

| Goal | Metric | Target |
|---|---|---|
| Recruiter understands fit in 30s | Hero comprehension (5-second test with 5 people) | 4/5 can state role + specialty + 1 metric |
| Hiring managers read deep | Avg. time on case-study pages | `{{e.g., > 3 min}}` |
| Convert to conversation | Contact / booking clicks per visit | `{{TARGET}}` |
| Résumé downloads | Downloads per month | `{{TARGET}}` |
| Craft signal | Lighthouse Perf / A11y / BP / SEO | ≥ 95 / 100 / 100 / 100 |
| Inclusive | WCAG level | 2.2 AA |

---

## 2. Audience & Jobs-to-be-Done

| Persona | Time budget | Job to be done | What they must find |
|---|---|---|---|
| **Technical recruiter** | 30–60s | "Is this person a match for my Senior/Lead req?" | Title, level, location, top metrics, résumé |
| **Hiring manager / EM** | 3–10 min | "Can they lead my team and own architecture?" | Case studies, leadership philosophy, scope |
| **Staff / Principal engineer (interviewer)** | 5–15 min | "Do they have real technical depth?" | Architecture decisions, trade-offs, OSS code |
| **Director / VP** | 1–2 min | "Will they move business metrics?" | Business impact numbers, domain fluency |
| **OSS peer / community** | Varies | "Can I collaborate with them?" | Projects, writing, contact |

---

## 3. Information Architecture

> Page-level UX (sections, animations, interactions, responsive behavior) is specified in `09-ux.md`.

```
/                       Home
├── /about              Bio, story, leadership      → 01-personal.md
├── /experience         Career timeline             → 02-experience.md
├── /domain             Domain expertise            → 03-domain.md
├── /work               Case studies index          → 04-case-studies.md
│   └── /work/{{slug}}  Case study detail
├── /open-source        Projects, OSS, writing      → 05-projects.md
├── /skills             Capabilities with evidence  → 06-skills.md
├── /resume             Web résumé + recruiter kit  → 07-contact.md §5  (+ PDF download)
└── /contact            Contact                     → 07-contact.md
```

**Primary nav:** Work · Experience · Domain · Open Source · About · **Contact** (button). Skills and Resume are reached from in-page links, the footer, and the mobile sticky bar.

### Homepage section order
1. **Hero** — positioning, proof bar, CTAs (`01 §4`)
2. **Selected case studies** — 3 cards (`04`)
3. **Impact at a glance** — signature numbers strip (`01 §7`)
4. **How I lead** — 3–5 principles (`01 §6`)
5. **Domain expertise** — hard problems & KPIs moved (`03 §3–4`)
6. **Open source** — 2–3 featured projects (`05 §3`)
7. **Experience snapshot** — career summary strip (`02`)
8. **Testimonials** — 2–3 quotes (`07 §6`)
9. **Contact CTA** band + footer

---

## 4. Brand & Tone

| Attribute | Is | Is not |
|---|---|---|
| Voice | Clear, specific, confident, humble | Hype, buzzwords, "passionate rockstar" |
| Personality | Thoughtful engineer-leader | Flashy creative agency |
| Writing | Short sentences, active voice, numbers | Walls of text, tech-stack lists |
| Visual | Editorial, structured, generous whitespace | Neon gradients, gimmicky 3D, heavy parallax |

**Brand keywords:** `{{e.g., Precise · Calm · Systems-minded · Human}}`

**Personal mark / logo:** `{{e.g., monogram "FL" in display face}}`

---

## 5. Visual Design System (decisions, not code)

### Color
| Token | Role | Light | Dark |
|---|---|---|---|
| `bg` | Page background | `{{e.g., warm off-white}}` | `{{e.g., near-black, not pure #000}}` |
| `surface` | Cards | `{{VALUE}}` | `{{VALUE}}` |
| `text` | Body | `{{VALUE}}` | `{{VALUE}}` |
| `text-muted` | Secondary | `{{VALUE}}` | `{{VALUE}}` |
| `accent` | Links, CTAs, highlights | `{{ONE_ACCENT — e.g., deep blue or Puget-Sound teal}}` | `{{VALUE}}` |
| `border` | Dividers | `{{VALUE}}` | `{{VALUE}}` |
| `success / warn` | Metric deltas | `{{VALUE}}` | `{{VALUE}}` |

- One accent color only. All text/bg pairs ≥ 4.5:1 contrast.
- Dark mode follows system preference with a manual toggle.

### Typography
| Role | Typeface | Notes |
|---|---|---|
| Display / headings | `{{e.g., a confident grotesk or editorial serif}}` | Tight tracking at large sizes |
| Body | `{{e.g., highly legible sans}}` | 17–19px base, 1.6 line-height, 65–75ch measure |
| Mono | `{{e.g., code-friendly mono}}` | Metrics, tags, code snippets |

- Type scale: `{{e.g., 1.25 modular scale}}`
- Max 2 families + mono; self-hosted, subset, `font-display: swap`.

### Layout & Spacing
- Grid: `{{e.g., 12-col desktop, 4-col mobile}}`; content max width `{{e.g., 1120px}}`; reading column `{{e.g., 680px}}`
- Spacing scale: `{{e.g., 4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96}}`
- Breakpoints: `{{e.g., 640 / 960 / 1280}}`

### Components Inventory
| Component | Used on | Notes |
|---|---|---|
| Header + sticky Contact CTA | All | Collapses to menu < 640px |
| Hero | Home | Text-first; optional subtle background diagram motif |
| Metric / stat tile | Home, case studies | Big number, label, context tooltip |
| Case study card | Home, /work | Title, outcome, hero metric, pillar tags |
| Snapshot card | Case study | Role, team, timeline, outcome |
| Trade-off table | Case study | Chosen option visually highlighted |
| Before/after diagram | Case study | Toggle or side-by-side |
| Timeline / role card | Experience | Expandable; scope badges |
| Tag / filter chip | Experience, work | Leadership, Architecture, Business, Reliability, OSS |
| OSS project card | Open source | Role badge, adoption metric, live stars |
| Quote / testimonial | Home, case studies | Name, role, relationship |
| Callout (Lesson / Decision) | Case study | Highlights judgment moments |
| Copy-to-clipboard block | Contact | Recruiter kit |
| Footer | All | Links, availability, last-updated date |

### Diagrams
- Consistent style across all case studies: `{{e.g., monochrome boxes + single accent for "what changed"}}`
- Tool: `{{e.g., Excalidraw / Figma / D2}}` exported to accessible SVG with text alternatives
- Every diagram has a 1-sentence caption explaining *the point*, not the boxes

### Imagery
- Headshot: `{{STYLE}}`
- No stock photos. Visuals = diagrams, product screenshots (sanitized), charts.
- Optional subtle Seattle/PNW motif: `{{e.g., topographic lines, Cascades silhouette in footer}}`

### Motion
- Purposeful only: reveal on scroll (subtle), number count-ups on metrics, diagram step-throughs.
- Durations `{{e.g., 150–300ms}}`; respect `prefers-reduced-motion` (disable all non-essential motion).

---

## 6. Content Design Rules
- Lead every section with the **outcome**, then the how.
- Every number has context (*from → to*, timeframe, scope).
- Headlines are sentences, not labels ("We cut p99 latency 70%" > "Performance").
- Technologies appear last on any page.
- Readability target: `{{e.g., Grade 9–10}}`.
- Each page answers: *What did they do? How hard was it? Why did it matter?*

---

## 7. Accessibility (WCAG 2.2 AA)
- Semantic landmarks and heading order; skip link.
- Full keyboard navigation with visible focus states.
- Color is never the only signal (metric deltas use icons + text).
- Alt text for all images; long descriptions for architecture diagrams.
- Touch targets ≥ 44×44px.
- Tested with `{{e.g., VoiceOver, NVDA, axe}}`.

---

## 8. Performance Budget
| Metric | Budget |
|---|---|
| LCP | < 1.8s on 4G mid-tier mobile |
| CLS | < 0.05 |
| INP | < 150ms |
| JS on home page | `{{e.g., < 50KB gz}}` |
| Total page weight (home) | `{{e.g., < 500KB}}` |
| Fonts | ≤ 2 files preloaded |

---

## 9. SEO & Sharing
- Unique title + description per page (source: `01 §9`).
- Structured data: `Person`, `ProfilePage`, `Article` for case studies.
- OG images per case study: title + hero metric.
- Sitemap, robots, canonical URLs, clean slugs.

---

## 10. Tech Stack

> Full rationale, structure, and build plan in `10-architecture.md`.

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript 6 | Static generation, Server Components, Metadata API |
| Content source | MDX + JSON in repo, schema-validated | Content as typed data; no CMS needed |
| Styling | Tailwind CSS + shadcn/ui | Shared tokens; accessible Radix primitives |
| Motion | Motion 14 (formerly Framer Motion) | Layout, shared-element, scroll reveals |
| Dark mode | next-themes + CSS variables | System default, manual toggle, no flash |
| Hosting | `{{Vercel}}` | Preview deploys per PR |
| Analytics | `{{Plausible / Umami}}` | Privacy-first, no cookie banner |
| Forms | Server Action + `{{email provider}}` | Shared Zod validation |
| Diagrams | `{{Excalidraw / Figma / D2}}` → SVG | Theme-aware, accessible |

> Record each as an ADR in `/docs/adr/` — the portfolio itself becomes evidence of how you make decisions.

---

## 11. Inspiration & References
| Reference | What to borrow |
|---|---|
| `{{URL}}` | `{{e.g., case-study structure}}` |
| `{{URL}}` | `{{e.g., typography}}` |
| `{{URL}}` | `{{e.g., metric presentation}}` |

---

## 12. Launch Checklist
- [ ] All `{{PLACEHOLDERS}}` resolved across docs 01–07
- [ ] Confidentiality review of case studies complete
- [ ] 5-second test passed with 5 people (incl. 1 Seattle recruiter if possible)
- [ ] Reviewed by 2 senior engineers / EMs
- [ ] Lighthouse & axe pass budgets
- [ ] Tested on iOS Safari, Android Chrome, desktop Chrome/Firefox/Safari
- [ ] Résumé, LinkedIn, and site tell the same story
- [ ] Custom domain + HTTPS + email forwarding working
- [ ] Analytics goals configured (contact, résumé download, booking)
- [ ] "Last updated" date in footer

---

## 13. Post-Launch Iteration
- Review analytics monthly: which case study gets read, where people drop.
- Refresh "Currently" items and availability quarterly.
- Add one piece of writing or OSS update per `{{CADENCE}}`.
