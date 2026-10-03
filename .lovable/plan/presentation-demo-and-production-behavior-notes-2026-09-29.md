# Presentation demo and production-behavior notes

## Build
- Add a compact, reusable two-part notice: **Presentation demo** explains the current clickable simulation; **Actual deployment** explains the corresponding live workflow.
- Place the notice beside each presentation-only control:
  - patient sample selector
  - day 3 / 7 / 14 simulation
  - reviewer case tabs and Confirm / Adjust / Escalate actions
  - doctor selector, Add Doctor, credential submission, and reviewer credential actions
  - audit case selector
  - Engine Test sample selector and Run control
  - demo location choice and booking/completion controls
- Keep existing safety, synthetic-data, and credential disclaimers; avoid duplicating notes where the current message already fully covers the same control.

## Production wording
- Explain that real deployment uses authenticated patient and clinician identities, live case records, scheduled notification delivery, real facility/booking integrations, role-authorized review, verified credential sources, and durable tamper-evident audit storage.
- Make clear that presentation clicks do not contact patients, clinicians, facilities, licensing authorities, or clinical record systems.

## Language and verification
- Add every new phrase to the six locale dictionaries (English, Arabic, Hindi, Urdu, Tagalog, Malayalam), preserving Arabic and Urdu right-to-left presentation.
- Add only necessary System Verification coverage for the new notices, counted live rather than hardcoded.
- Check the affected patient, doctor, reviewer, location, audit, and Engine Test screens at desktop and mobile sizes; confirm the project builds without errors.
