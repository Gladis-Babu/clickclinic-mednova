<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep all user-facing prototype text in language dictionaries keyed by locale, including derived clinical explanations; this prevents partial translation across views.
- Keep synthetic person names in one locale-keyed map and refer to them by stable identifiers; this keeps sample cases consistent across views and language switches.
- Keep audit activity in app-session state with explicit sample entries rather than implying a durable medical record; this prototype has no authenticated audit storage.

- Keep consultation status transitions sequential (recommended → location chosen → booked → completed), and never persist browser coordinates; this protects workflow integrity and privacy.
- Sample cases (values, rules, case IDs, cohort) live only in src/lib/patient-cases.ts; every page reads from it so values never drift between views.
- Render presentation-only explanations through the shared DemoControlNote component; this keeps demo and deployment behavior visibly consistent.
- Use the original light white-and-blue semantic color system for every view, with distinct status colours; this preserves the approved pre-redesign visual identity.
