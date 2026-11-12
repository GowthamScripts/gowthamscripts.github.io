# Portfolio Documentation

Content and design source of truth for a **Technical Lead / Senior Software Engineer** portfolio targeting **Seattle**.

The site emphasizes, in order: **engineering leadership → business impact → domain expertise → architecture → open source**. Technologies are supporting evidence, never the headline.

## Files

| File | What it defines | Feeds site section |
|---|---|---|
| [01-personal.md](01-personal.md) | Identity, positioning, hero copy, bio, leadership philosophy, SEO | Home hero, About |
| [02-experience.md](02-experience.md) | Career timeline, scope, impact bullets, leadership story bank | Experience |
| [03-domain.md](03-domain.md) | Business domain depth, KPIs moved, Seattle market fit | Domain band / page |
| [04-case-studies.md](04-case-studies.md) | 3–4 flagship case studies (problem → trade-offs → architecture → results) | Work |
| [05-projects.md](05-projects.md) | Open source, side projects, writing, speaking, community | Open Source |
| [06-skills.md](06-skills.md) | Capabilities with evidence; technologies last | About / Skills |
| [07-contact.md](07-contact.md) | Contact channels, CTAs, recruiter kit, testimonials | Contact, footer |
| [08-design.md](08-design.md) | IA, design system, accessibility, performance, launch checklist | Whole site |
| [09-ux.md](09-ux.md) | Page-by-page UX: sections, animations, interactions, responsive behavior | All nine pages |
| [10-architecture.md](10-architecture.md) | Stack, project structure, content model, theming, motion, SEO, CI, build plan | Engineering |

## Placeholder convention

- `{{UPPER_SNAKE}}` — information to fill in. Text inside `{{e.g., ...}}` is an example to replace.
- `- [ ]` — a decision or checklist item still open.
- Find what's left:

```bash
grep -rno "{{[^}]*}}" docs | wc -l
```

## Suggested fill order

1. `01-personal.md` §2–3 (target roles + positioning) — this frames everything else
2. `02-experience.md` — raw material
3. `04-case-studies.md` — pick 3–4 stories from the experience bank
4. `03-domain.md`, `05-projects.md`, `06-skills.md`
5. `07-contact.md`
6. `08-design.md` — decide once the content exists
