# 01 — Personal & Positioning

> **Purpose:** Defines *who you are* and *what you want next*. Everything else on the site supports this file. The hero section, meta tags, About page, and recruiter summary all come from here.
>
> **Target reader:** A Seattle hiring manager or recruiter who spends **~30 seconds** on the page before deciding to read more.

---

## 1. Identity

| Field | Value |
|---|---|
| Full name | `{{FULL_NAME}}` |
| Preferred name / pronunciation | `{{PREFERRED_NAME}}` · `{{PRONUNCIATION_GUIDE}}` |
| Current title | `{{CURRENT_TITLE}}` (e.g., Technical Lead, Senior Software Engineer) |
| Current company | `{{CURRENT_COMPANY}}` |
| Years of experience | `{{YEARS_TOTAL}}` total · `{{YEARS_LEADING}}` leading teams |
| Location | `{{CURRENT_CITY}}` → Seattle, WA |
| Work authorization | `{{WORK_AUTH_STATUS}}` (e.g., US Citizen, Green Card, H-1B transfer — decide whether to show publicly) |
| Relocation | `{{RELOCATION_STATUS}}` (Based in Seattle / Relocating by `{{DATE}}` / Open to relocation) |
| Work mode preference | `{{ONSITE / HYBRID / REMOTE}}` |
| Headshot | `{{HEADSHOT_PATH}}` — professional, neutral background, 1:1 and 4:5 crops |

---

## 2. Target Roles

**Primary:** `{{PRIMARY_TARGET_ROLE}}` — e.g., Technical Lead / Staff-track Senior Engineer
**Secondary:** `{{SECONDARY_TARGET_ROLE}}` — e.g., Senior Software Engineer (backend / distributed systems / platform)

**Target company types in Seattle:**
- [ ] Big Tech (Amazon, Microsoft, Google Kirkland/Seattle, Meta)
- [ ] Cloud & infra (AWS, Azure, Snowflake, Databricks, HashiCorp)
- [ ] Growth-stage product companies (Zillow, Expedia, Redfin, Tableau/Salesforce, Smartsheet, Remitly, Convoy alumni companies)
- [ ] Domain-specific (`{{DOMAIN}}`-focused companies — see `03-domain.md`)
- [ ] Other: `{{OTHER_TARGETS}}`

**Level mapping** (helps calibrate how you write impact):

| Company | Target level |
|---|---|
| Amazon | `{{e.g., SDE III / Principal track}}` |
| Microsoft | `{{e.g., Senior SWE 63–64 / Principal 65}}` |
| Google | `{{e.g., L5 / L6}}` |
| Meta | `{{e.g., E5 / E6}}` |
| Startups | `{{e.g., Tech Lead / Staff}}` |

---

## 3. Positioning Statement

> One sentence. Who you are + what you're known for + the outcome you drive.

**Formula:** *I'm a [role] who [unique strength] to [business outcome] in [domain].*

```
{{POSITIONING_STATEMENT}}
```

**Example (replace):**
> "Technical Lead who turns ambiguous, high-scale problems into reliable distributed systems — leading teams of 6–10 engineers to ship platforms that moved `{{METRIC}}` in `{{DOMAIN}}`."

### Alternate versions (A/B test on LinkedIn & site)
1. `{{POSITIONING_ALT_1}}` — leadership-forward
2. `{{POSITIONING_ALT_2}}` — architecture-forward
3. `{{POSITIONING_ALT_3}}` — domain-forward

---

## 4. Hero Section Copy

| Element | Copy | Notes |
|---|---|---|
| Eyebrow | `{{e.g., Technical Lead · Distributed Systems · Seattle}}` | ≤ 6 words |
| Headline | `{{HEADLINE}}` | ≤ 12 words. Outcome-led, not tool-led. |
| Subheadline | `{{SUBHEADLINE}}` | 1–2 sentences: scope + proof. |
| Proof bar (3–4 metrics) | `{{METRIC_1}}` · `{{METRIC_2}}` · `{{METRIC_3}}` · `{{METRIC_4}}` | e.g., "Led 8 engineers", "$4M/yr saved", "99.99% uptime", "2K★ OSS" |
| Primary CTA | `View case studies` | Links to `04-case-studies` |
| Secondary CTA | `Download résumé` | PDF, also in `07-contact` |
| Availability badge | `{{e.g., Open to Senior / Lead roles in Seattle — Q1 2027}}` | Optional, toggleable |

**Rules**
- No "passionate", "ninja", "rockstar", or tech-stack lists in the hero.
- Every claim in the hero must be backed by a case study further down.

---

## 5. About / Bio

### Short bio (≈ 50 words — for conference talks, OSS profiles, meta description)
```
{{SHORT_BIO}}
```

### Medium bio (≈ 150 words — About page intro)
```
{{MEDIUM_BIO}}
```

### Long narrative (≈ 400 words — About page, optional)
Structure:
1. **Origin** — how you got into engineering: `{{ORIGIN_STORY}}`
2. **Inflection point** — when you moved from building to leading: `{{INFLECTION_POINT}}`
3. **What you're known for** — the problems people bring to you: `{{KNOWN_FOR}}`
4. **How you lead** — your philosophy in one paragraph (see §6): `{{LEADERSHIP_SUMMARY}}`
5. **What's next** — why Seattle, why this role, why now: `{{WHATS_NEXT}}`

---

## 6. Leadership Philosophy

> Hiring managers for lead roles screen for *how* you lead. 3–5 principles, each with a one-line real example.

| # | Principle | Evidence (1 line, link to case study) |
|---|---|---|
| 1 | `{{e.g., Make the right thing the easy thing}}` | `{{EXAMPLE}}` → `{{CASE_STUDY_LINK}}` |
| 2 | `{{e.g., Write it down — decisions live in docs, not DMs}}` | `{{EXAMPLE}}` |
| 3 | `{{e.g., Grow people by giving them the hard problem}}` | `{{EXAMPLE}}` |
| 4 | `{{e.g., Measure outcomes, not output}}` | `{{EXAMPLE}}` |
| 5 | `{{PRINCIPLE_5}}` | `{{EXAMPLE}}` |

---

## 7. Signature Numbers ("Career at a glance")

Displayed as a stats strip. Use only numbers you can defend in an interview.

| Stat | Value | Source / context |
|---|---|---|
| Engineers led / mentored | `{{N}}` | `{{CONTEXT}}` |
| Engineers promoted under you | `{{N}}` | |
| Systems designed & shipped to prod | `{{N}}` | |
| Peak scale handled | `{{e.g., 50K RPS / 2B events/day}}` | |
| Revenue enabled or cost saved | `{{$ VALUE}}` | |
| OSS contributions | `{{e.g., N PRs merged / N★}}` | See `05-projects.md` |
| Patents / talks / publications | `{{N}}` | |

---

## 8. Personal Touch (optional, keep brief)

Humanizes you; useful culture-fit signal in Seattle.

- Outside work: `{{HOBBIES}}` (e.g., hiking the Cascades, climbing, coffee, chess)
- Currently reading: `{{BOOK}}`
- Currently learning: `{{TOPIC}}`
- Volunteering / community: `{{COMMUNITY}}` (e.g., Seattle meetup organizer, mentoring bootcamp grads)

---

## 9. SEO & Social Metadata

| Field | Value |
|---|---|
| `<title>` | `{{FULL_NAME}} — Technical Lead · {{SPECIALTY}} · Seattle` |
| Meta description (≤ 155 chars) | `{{META_DESCRIPTION}}` |
| Keywords to rank for | `{{FULL_NAME}}`, "technical lead Seattle", "senior software engineer Seattle", `{{DOMAIN}} engineer` |
| OG image | `{{OG_IMAGE_PATH}}` (1200×630, name + title + 1 metric) |
| Canonical domain | `{{DOMAIN_NAME}}` (e.g., firstlast.dev) |

---

## 10. Résumé Alignment Checklist

- [ ] Positioning statement matches LinkedIn headline
- [ ] Title and dates match résumé exactly
- [ ] Every hero metric appears in a case study
- [ ] Tone consistent: confident, specific, no buzzwords
- [ ] Reviewed by `{{PEER_REVIEWER}}` (ideally a Seattle-based EM or Staff engineer)
