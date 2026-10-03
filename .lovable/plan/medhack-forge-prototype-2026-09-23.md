# MedHack Forge prototype

## Build
- Replace the blank page with the selected “Playground trust” application shell.
- Add three usable views: patient case, reviewer worklist, and population funnel.
- Make manual HbA1c, fasting glucose, and OGTT entry drive a deterministic demo pathway, including explicit out-of-scope referral handling.
- Add English/Arabic switching, right-to-left layout, follow-up confirmation, reminders, reviewer decisions, and a visible case timeline.
- Keep clinical follow-up timing separate from operational reminder timing throughout.

## Safety and content
- Use synthetic cases only and keep the prototype/not-a-diagnosis statement visible.
- Treat medication as context only; never use it to select a pathway.
- Label all thresholds and pathway decisions with their rule/version and cited UAE DoH source from the brief.

## Technical details
- Keep the prototype frontend-only with in-memory interactions; no real patient storage, accounts, OCR, notifications, or live clinical integrations.
- Implement semantic design tokens, bilingual copy, accessible controls, reduced-motion support, responsive layouts, and route-specific social metadata.
- Validate the live preview at desktop and mobile sizes and resolve build/runtime issues.
