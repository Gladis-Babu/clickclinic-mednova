# Patient consultation next step

## Build
- Add patient-specific sample context for Fatima, Noor, Rashid, and Sara so the next-step card follows each case’s rule and review state.
- Show no consultation card for normal results or while Noor awaits human review; reveal Noor’s card only after a reviewer confirms her pathway.
- Add a bilingual “Your Next Step” experience with the correct prediabetes or diagnostic wording, suggested timeframe, four clearly marked demo locations, map/list presentation, location selection, and optional nearest sorting.
- Add the enforced status sequence: Recommended → Location chosen → Booked → Completed, with booking and completion controls that cannot skip steps.
- Append location, booking, and completion actions to the existing session audit trail and patient timeline.
- Add a next-step status column to the reviewer worklist and location/booked stages to the population funnel.

## Data and safety
- Add a read-only care locations table with English and Arabic names, approximate coordinates, service type, and demo flag.
- Add protected follow-up status and append-only event tables; enforce valid status transitions in the database.
- Never store browser location coordinates; only store a selected location identifier.
- Keep the location list usable if map tiles fail, and show OpenStreetMap attribution plus the no-live-booking warning.

## Verification
- Add the requested next-step routing, transition, privacy, and location-integrity checks to System Verification.
- Keep all surrounding interface text translated across English, Arabic, Hindi, Urdu, Tagalog, and Malayalam.
- Verify patient and reviewer flows on desktop and phone, including Noor’s reviewer-confirmation gate and status progression.
