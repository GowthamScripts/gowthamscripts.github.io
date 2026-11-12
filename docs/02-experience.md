# 02 — Experience

> **Purpose:** A scannable career timeline that proves *growing scope* — from individual contributor to someone who multiplies a team. Each role is written as **scope → leadership → impact**, not a list of duties.
>
> **Rule of thumb:** For lead roles, at least half of each role's bullets should be about *decisions, people, and outcomes* — not what you personally coded.

---

## How to write each bullet

Use **XYZ + Leadership** format:

> **Led / Drove / Designed** [what] **by** [how — the decision or approach] **resulting in** [measurable business outcome].

| ❌ Weak | ✅ Strong |
|---|---|
| "Worked on payments microservices using Java and Kafka." | "Led a 6-engineer team to re-architect the payments pipeline onto event-driven services, cutting settlement latency from 4h to 6min and unlocking `{{$X}}` in same-day payouts." |
| "Mentored junior engineers." | "Built an onboarding and design-review program; 3 engineers promoted to Senior within 18 months." |

**Bullet categories to cover per role** (tag each bullet so the site can filter):
- `[LEAD]` People leadership, mentoring, hiring, team health
- `[ARCH]` Architecture & technical direction
- `[BIZ]` Business / customer / revenue impact
- `[OPS]` Reliability, scale, operational excellence
- `[XFN]` Cross-functional influence (PM, design, other orgs)
- `[OSS]` Open-source or community work

---

## Career Summary Strip

| Period | Company | Title | Team size | Headline impact |
|---|---|---|---|---|
| `{{YYYY–Present}}` | `{{COMPANY_1}}` | `{{TITLE}}` | `{{N}}` | `{{ONE_LINE_IMPACT}}` |
| `{{YYYY–YYYY}}` | `{{COMPANY_2}}` | `{{TITLE}}` | `{{N}}` | `{{ONE_LINE_IMPACT}}` |
| `{{YYYY–YYYY}}` | `{{COMPANY_3}}` | `{{TITLE}}` | `{{N}}` | `{{ONE_LINE_IMPACT}}` |
| `{{YYYY–YYYY}}` | `{{COMPANY_4}}` | `{{TITLE}}` | `{{N}}` | `{{ONE_LINE_IMPACT}}` |

---

## Role Template (copy per role)

### `{{COMPANY_NAME}}` — `{{TITLE}}`
**`{{START_MONTH YYYY}}` – `{{END_MONTH YYYY / Present}}`** · `{{LOCATION / Remote}}`
`{{COMPANY_URL}}` · `{{COMPANY_LOGO_PATH}}`

**Company context (1 line):** `{{e.g., Series C fintech, 400 employees, processing $2B/yr in transactions}}`

**Scope**
| Dimension | Value |
|---|---|
| Team(s) | `{{TEAM_NAME}}` |
| Direct reports / engineers led | `{{N}}` (`{{N}}` senior, `{{N}}` mid, `{{N}}` junior) |
| Cross-team influence | `{{e.g., 4 partner teams, 30 engineers}}` |
| Systems owned | `{{SYSTEMS}}` |
| Scale | `{{e.g., 10M MAU, 20K RPS, 5TB/day}}` |
| Budget / infra spend | `{{$ or N/A}}` |
| Reported to | `{{e.g., Director of Engineering}}` |

**Mission (1–2 sentences):** `{{WHAT_THE_TEAM_EXISTED_TO_DO}}`

**Key achievements**
- `[LEAD]` `{{BULLET}}`
- `[ARCH]` `{{BULLET}}`
- `[BIZ]` `{{BULLET}}`
- `[OPS]` `{{BULLET}}`
- `[XFN]` `{{BULLET}}`

**Promotions within role:** `{{e.g., SWE II → Senior (2022) → Tech Lead (2024)}}`

**Linked case studies:** `{{CASE_STUDY_SLUG_1}}`, `{{CASE_STUDY_SLUG_2}}`

**Technologies (secondary, collapsed by default):** `{{TECH_LIST}}`

**Recommendation quote (optional):**
> "`{{QUOTE}}`" — `{{NAME}}`, `{{TITLE}}` (with permission)

---

## Role 1 — `{{CURRENT_COMPANY}}`
_Use the template above._

## Role 2 — `{{PREVIOUS_COMPANY}}`
_Use the template above._

## Role 3 — `{{EARLIER_COMPANY}}`
_Use the template above._

## Earlier Roles (condensed)
| Years | Company | Title | One-line highlight |
|---|---|---|---|
| `{{YYYY–YYYY}}` | `{{COMPANY}}` | `{{TITLE}}` | `{{HIGHLIGHT}}` |

---

## Leadership Evidence Bank

> Reusable stories for interviews (Amazon LPs, Microsoft "growth mindset", behavioral rounds). Each should map to a case study or role bullet.

| Theme | Story title | Situation | Action | Result | Maps to |
|---|---|---|---|---|---|
| Hiring & team building | `{{TITLE}}` | `{{S}}` | `{{A}}` | `{{R}}` | `{{ROLE}}` |
| Mentoring & promotions | `{{TITLE}}` | | | | |
| Disagree & commit | `{{TITLE}}` | | | | |
| Handling a production crisis | `{{TITLE}}` | | | | |
| Influencing without authority | `{{TITLE}}` | | | | |
| Saying no / descoping | `{{TITLE}}` | | | | |
| Owning a failure | `{{TITLE}}` | | | | |
| Raising the engineering bar | `{{TITLE}}` | | | | |

---

## Education & Certifications

| Credential | Institution | Year | Notes |
|---|---|---|---|
| `{{DEGREE}}` | `{{UNIVERSITY}}` | `{{YYYY}}` | `{{HONORS / THESIS}}` |
| `{{CERTIFICATION e.g., AWS Solutions Architect Pro}}` | `{{ISSUER}}` | `{{YYYY}}` | `{{CREDENTIAL_URL}}` |

---

## Awards, Talks & Publications

| Type | Title | Venue / Org | Year | Link |
|---|---|---|---|---|
| Award | `{{TITLE}}` | `{{ORG}}` | `{{YYYY}}` | `{{URL}}` |
| Talk | `{{TITLE}}` | `{{CONFERENCE / MEETUP}}` | `{{YYYY}}` | `{{VIDEO_URL}}` |
| Article | `{{TITLE}}` | `{{BLOG / PUBLICATION}}` | `{{YYYY}}` | `{{URL}}` |
| Patent | `{{TITLE}}` | `{{PATENT_NO}}` | `{{YYYY}}` | `{{URL}}` |

---

## Display Notes (for the site)
- Default view: **Career Summary Strip** + expandable role cards.
- Filter chips by tag: `Leadership` · `Architecture` · `Business Impact` · `Reliability` · `Open Source`.
- Show scope metrics (team size, scale) as small badges on each card — this is what differentiates a lead from an IC at a glance.
- Tech stack is shown last and visually de-emphasized.
