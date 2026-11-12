# 07 — Contact & Calls to Action

> **Purpose:** Make it effortless for a recruiter or hiring manager to take the next step — and give them everything they need to forward you internally.

---

## 1. Contact Details

| Channel | Value | Show publicly? |
|---|---|---|
| Email | `{{EMAIL}}` (use a domain email, e.g., hello@`{{DOMAIN}}`) | ✅ (obfuscated against scrapers) |
| LinkedIn | `{{LINKEDIN_URL}}` | ✅ |
| GitHub | `{{GITHUB_URL}}` | ✅ |
| Calendar booking | `{{CAL_LINK}}` (e.g., Cal.com / Calendly — 20-min intro) | ✅ |
| Blog / writing | `{{BLOG_URL}}` | ✅ |
| X / Bluesky / Mastodon | `{{SOCIAL_URL}}` | Optional |
| Stack Overflow / dev.to | `{{URL}}` | Optional |
| Phone | `{{PHONE}}` | ❌ (résumé only) |
| Location | Seattle, WA (`{{NEIGHBORHOOD_OR_METRO}}`) | ✅ city only |

---

## 2. Availability & Preferences

| Field | Value |
|---|---|
| Status | `{{Actively looking / Open to the right role / Not looking}}` |
| Available from | `{{DATE}}` |
| Roles of interest | `{{e.g., Technical Lead, Senior / Staff SWE}}` |
| Focus areas | `{{e.g., distributed systems, platform, payments}}` |
| Work mode | `{{On-site / Hybrid / Remote}}` — Seattle / Bellevue / Redmond / Kirkland |
| Work authorization | `{{STATUS — decide whether public}}` |
| Not interested in | `{{e.g., contract roles, agencies}}` (optional) |

---

## 3. Primary CTA Copy

| Placement | Copy |
|---|---|
| Hero | `View case studies` · `Download résumé` |
| End of case study | `{{e.g., "Building something similar in Seattle? Let's talk."}}` |
| Contact page headline | `{{e.g., "Let's build something that matters."}}` |
| Contact page sub | `{{e.g., "I'm exploring Technical Lead and Senior Engineer roles in Seattle. I usually reply within 24 hours."}}` |
| Footer | `{{e.g., "Open to Lead roles in Seattle — say hello →"}}` |

---

## 4. Contact Form Spec (content only)

| Field | Type | Required | Notes |
|---|---|---|---|
| Name | text | ✅ | |
| Email | email | ✅ | |
| Company | text | ❌ | |
| Reason | select | ✅ | Hiring / role opportunity · Open-source collaboration · Speaking / writing · Mentorship · Other |
| Role link / JD | url | ❌ | |
| Message | textarea | ✅ | Placeholder: "Tell me about the team and the problem you're solving." |

- Confirmation message: `{{e.g., "Thanks — I'll reply within 1–2 business days."}}`
- Spam protection: honeypot + rate limit (no CAPTCHA wall if avoidable)
- Delivery: `{{FORM_BACKEND}}` → `{{EMAIL}}`

---

## 5. Recruiter Kit (downloadable / copyable)

> Makes it trivial for a recruiter to submit you internally.

- [ ] **Résumé PDF** — `{{RESUME_PATH}}` (1–2 pages, ATS-friendly, last updated `{{DATE}}`)
- [ ] **One-paragraph summary** (copy button): `{{RECRUITER_SUMMARY}}`
- [ ] **Top 3 highlights** (copy button):
  1. `{{HIGHLIGHT_1}}`
  2. `{{HIGHLIGHT_2}}`
  3. `{{HIGHLIGHT_3}}`
- [ ] **Links bundle:** LinkedIn · GitHub · top case study
- [ ] **References available on request** — `{{N}}` references ready (former managers, peers, reports)

---

## 6. Testimonials / Recommendations

| Quote | Name | Relationship | Permission |
|---|---|---|---|
| `{{QUOTE}}` | `{{NAME}}` | `{{e.g., Former Director of Engineering}}` | `{{✅ / pending}}` |
| `{{QUOTE}}` | `{{NAME}}` | `{{e.g., Engineer I mentored}}` | |
| `{{QUOTE}}` | `{{NAME}}` | `{{e.g., Product partner}}` | |

> Aim for one each from a **manager**, **peer**, and **report/mentee** — a 360° view is a strong lead signal.

---

## 7. Privacy & Legal
- Email obfuscation method: `{{METHOD}}`
- Analytics: `{{privacy-friendly analytics, e.g., Plausible}}`; no cookie banner needed if cookie-less
- Privacy note: `{{PRIVACY_NOTE}}`
- Employer disclaimer: "Views and work shown are my own; confidential details have been omitted or generalized."

---

## Display Notes
- Contact is reachable in **one click** from every page (sticky header CTA).
- Mobile: tap-to-email and tap-to-book buttons, large targets.
- Show reply-time expectation to set trust.
