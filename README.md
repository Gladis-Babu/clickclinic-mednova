# ClickClinic

**Catch prediabetes early. Follow through.**

ClickClinic is a multilingual (English / Arabic, plus Hindi, Urdu, Tagalog and Malayalam) healthcare prototype that closes the gap between a diabetes screening result and a completed clinical follow-up — turning "your result is ready" into a booked, attended, and traceable consultation.

> ⚠️ **Prototype notice** — This is a hackathon/demo build. All patient cases are **synthetic**, no real patient data is stored, and nothing here diagnoses, prescribes, or claims live clinical integration.

**Live app:** https://clickclinic-mednova.lovable.app

---

## Why it exists

Across the UAE, more than half of screened adults show elevated diabetes risk, yet a large share of positive screens never complete a follow-up consultation. Results sit unactioned, patients miss confirmation calls, medication context is lost between handoffs, and nobody sees the full pathway end-to-end.

ClickClinic makes that pathway **visible, safe and accountable** for everyone in it.

## What the prototype includes

- **Patient view** — lab result explained in plain language, next-step card, follow-up and reminder scheduling, care-location map, and a full case timeline.
- **Clinician workflow** — doctor profiles, credential submission, and consultation booking/completion controls.
- **Reviewer worklist** — role-gated review tabs with Confirm / Adjust / Escalate decisions on pathway recommendations.
- **Population funnel** — cohort view showing where patients flow (and drop off) between screening and completed follow-up.
- **Rules engine & engine test page** — deterministic HbA1c / fasting glucose / OGTT pathway logic with explicit out-of-scope referral handling, labelled with rule versions and DoH sources.
- **Verification & audit trail** — system checks and per-case activity for traceability.
- **Six-language support** — English, العربية, हिन्दी, اردو, Filipino, മലയാളം, with full right-to-left layout for Arabic and Urdu.

All five sample cases (Fatima, Noor, Huda, Rashid, Sara) are synthetic demonstration profiles that share one source of truth, so values never drift between views.

## Safety posture

- Synthetic cases only; no real patient data.
- Medication is treated as context only — never used to select a pathway.
- Every threshold and pathway decision is labelled with its rule/version and cited UAE DoH source.
- Follow-up timing (clinical) is kept strictly separate from reminder timing (operational).
- Presentation-only controls are explicitly marked as demo vs. actual deployment behavior.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | TanStack Start v1 (React 19, SSR) |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 with semantic design tokens |
| Backend | Lovable Cloud (Supabase — Postgres, Auth, RLS) |
| Maps | Leaflet |
| Forms / validation | react-hook-form + zod |

## Getting started

```sh
git clone <this-repository-url>
cd clickclinic
npm i
npm run dev
```

The app runs at `http://localhost:8080`.

Database migrations live in `drizzle/migrations/` and are applied through the Lovable Cloud migration flow — no manual SQL needed.

## Project structure

```
src/
├── routes/          # /, /app, /engine, /verify, /login, /pitch
├── components/      # case detail, next-step card, care-location map, demo notes
├── lib/             # shared case data, i18n dictionaries, rules engine
└── integrations/    # backend client
```

## Roadmap

- [ ] Real authentication for patient and clinician identities
- [ ] Live facility/booking integrations
- [ ] Scheduled notification delivery
- [ ] Verified credential sources and licensing checks
- [ ] Arabic clinical copy review
- [ ] Outcome measurement for pilot deployments

## Licence

All rights reserved. Built for demonstration and judging purposes.
