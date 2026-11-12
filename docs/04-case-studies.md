# 04 — Case Studies

> **Purpose:** The heart of the portfolio. Case studies prove *judgment* — how you frame problems, make trade-offs, lead people, and deliver business outcomes. A hiring manager for a Lead role should be able to run a system-design or behavioral interview off any one of these.
>
> **Target:** 3–4 flagship case studies. Quality over quantity.

---

## Case Study Portfolio Plan

Choose studies so that, together, they cover all five pillars:

| # | Working title | Leadership | Business impact | Domain | Architecture | Open source | Status |
|---|---|:-:|:-:|:-:|:-:|:-:|---|
| 1 | `{{FLAGSHIP_TITLE}}` — biggest scope/impact | ● | ● | ● | ● | | `{{Draft / Review / Ready}}` |
| 2 | `{{TITLE}}` — architecture-heavy migration or re-platform | ◐ | ● | ◐ | ● | | |
| 3 | `{{TITLE}}` — people/org leadership (turnaround, scaling a team) | ● | ◐ | | ◐ | | |
| 4 | `{{TITLE}}` — open-source or platform with external adoption | ◐ | ◐ | | ● | ● | |

● primary · ◐ secondary

**Ideas for strong case-study topics (pick what's true for you):**
- Migrating a monolith → services (or services → consolidated platform) without downtime
- Rescuing a failing project / delivery turnaround
- Building a team from 0 → N engineers
- Cutting cloud cost by X% while improving performance
- Designing a system for 10× scale ahead of a launch
- Leading a major incident and the reliability program after it
- Creating an internal platform adopted by many teams
- Launching an open-source project or major upstream contribution

---

## Confidentiality Guardrails
- [ ] No proprietary code, internal URLs, or customer names without permission
- [ ] Metrics shown as **percentages / ratios** if absolute numbers are confidential
- [ ] Architecture diagrams redrawn and genericized
- [ ] Reviewed against employer's public-disclosure policy: `{{POLICY_NOTE}}`

---

## Case Study Template (copy per study)

### `{{CASE_STUDY_TITLE}}`
**Slug:** `{{kebab-case-slug}}`
**Subtitle (outcome in one line):** `{{e.g., How we cut checkout latency 70% and lifted conversion 3% during peak season}}`

#### Snapshot (top card)
| | |
|---|---|
| Company | `{{COMPANY / "Fortune 500 retailer" if anonymized}}` |
| My role | `{{e.g., Technical Lead — architecture owner, team of 7}}` |
| Timeline | `{{e.g., 9 months, Q1–Q3 2024}}` |
| Team | `{{e.g., 5 backend, 2 frontend, 1 SRE, PM, designer}}` |
| Stakeholders | `{{e.g., VP Eng, Product, Finance, 3 partner teams}}` |
| Domain | `{{DOMAIN}}` |
| Key outcome | `{{HEADLINE_METRIC}}` |

#### 1. TL;DR (3 bullets — for skimmers)
- **Problem:** `{{ONE_LINE}}`
- **What I did:** `{{ONE_LINE}}`
- **Result:** `{{ONE_LINE_WITH_METRIC}}`

#### 2. Context & Business Problem
- What was the business situation? `{{CONTEXT}}`
- Why did it matter *now*? (cost, revenue, risk, customer pain) `{{URGENCY}}`
- What was the cost of doing nothing? `{{COST_OF_INACTION}}`

#### 3. Constraints
| Constraint | Detail |
|---|---|
| Time | `{{e.g., must ship before holiday freeze}}` |
| People | `{{e.g., 2 engineers new to the codebase}}` |
| Technical | `{{e.g., zero downtime, legacy DB, 50K RPS}}` |
| Organizational | `{{e.g., 3 teams with conflicting priorities}}` |
| Compliance | `{{e.g., PCI scope}}` |

#### 4. My Role & Leadership
- What I owned vs. delegated: `{{OWNERSHIP_SPLIT}}`
- How I aligned stakeholders: `{{e.g., wrote the 6-pager / RFC, ran design reviews}}`
- How I organized the team: `{{e.g., split into 2 workstreams, weekly risk review}}`
- People growth: `{{e.g., gave a mid-level engineer ownership of the data migration; promoted to Senior}}`

#### 5. Options Considered (trade-off analysis)
| Option | Pros | Cons | Cost / effort | Decision |
|---|---|---|---|---|
| A: `{{OPTION}}` | | | | ❌ Rejected — `{{WHY}}` |
| B: `{{OPTION}}` | | | | ❌ Rejected — `{{WHY}}` |
| C: `{{OPTION}}` | | | | ✅ Chosen — `{{WHY}}` |

**Decision record / RFC link (sanitized):** `{{LINK_OR_NA}}`

#### 6. Architecture
- **Before:** `{{BEFORE_DIAGRAM_PATH}}` — `{{ONE_PARAGRAPH}}`
- **After:** `{{AFTER_DIAGRAM_PATH}}` — `{{ONE_PARAGRAPH}}`
- Key design decisions:
  1. `{{DECISION}}` — because `{{RATIONALE}}`
  2. `{{DECISION}}` — because `{{RATIONALE}}`
  3. `{{DECISION}}` — because `{{RATIONALE}}`
- Non-functional requirements met: `{{latency / availability / cost / security targets}}`

#### 7. Execution
- Rollout strategy: `{{e.g., shadow traffic → 1% canary → region-by-region}}`
- Risk mitigation: `{{e.g., feature flags, dual-writes, automated rollback}}`
- Milestones:
  | Milestone | Date | Notes |
  |---|---|---|
  | `{{M1}}` | `{{DATE}}` | |
  | `{{M2}}` | `{{DATE}}` | |
  | `{{M3}}` | `{{DATE}}` | |

#### 8. Challenges & What Went Wrong
> Honesty here is a strong senior signal.
- `{{CHALLENGE}}` → how we recovered: `{{RECOVERY}}`
- `{{CHALLENGE}}` → `{{RECOVERY}}`

#### 9. Results
| Metric | Before | After | Change |
|---|---|---|---|
| Business: `{{e.g., conversion}}` | `{{X}}` | `{{Y}}` | `{{Δ}}` |
| Business: `{{e.g., $ saved / earned}}` | | | |
| Technical: `{{e.g., p99 latency}}` | | | |
| Technical: `{{e.g., availability}}` | | | |
| Team: `{{e.g., deploy frequency, on-call pages}}` | | | |
| People: `{{e.g., promotions, retention}}` | | | |

**Recognition:** `{{e.g., company award, adopted as reference architecture}}`

#### 10. Reflection
- What I'd do differently: `{{LESSON}}`
- What I learned about leading: `{{LESSON}}`
- How this shaped my approach today: `{{LESSON}}`

#### 11. Testimonial (optional)
> "`{{QUOTE}}`" — `{{NAME}}`, `{{ROLE}}`

#### 12. Tech used (collapsed)
`{{TECH_LIST}}`

---

## Case Study 1 — `{{FLAGSHIP_TITLE}}`
_Use template above._

## Case Study 2 — `{{TITLE}}`
_Use template above._

## Case Study 3 — `{{TITLE}}`
_Use template above._

## Case Study 4 — `{{TITLE}}`
_Use template above._

---

## Display Notes
- Card on index: title, outcome subtitle, 1 hero metric, role badge, 2–3 pillar tags.
- Detail page: sticky table of contents; Snapshot card above the fold; TL;DR before the long read.
- Target reading time: **5–8 min**; show estimate.
- Diagrams: consistent visual language (see `08-design.md` → Diagrams).
- End every case study with "Next case study →" and a contact CTA.
