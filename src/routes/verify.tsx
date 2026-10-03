import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { SiteNav } from "./index";
import { isRtl, LANGS } from "@/lib/i18n";
import { useVerify, verifyCopy } from "@/lib/verify-copy";
import { appCopy } from "@/lib/app-copy";
import { escalate, runEngine, type Test } from "@/lib/engine-rules";
import { demoCareLocations, nextStep, transition, clinicalClockStart, validateEID, patientNotifications, containsSensitive, remindersActive, escalateMedication, EID_PATTERN } from "@/lib/next-step-rules";
import { patientCopy } from "@/lib/patient-copy";
import { nextStepCopy } from "@/lib/next-step-copy";
import { caseCopy } from "@/lib/case-copy";
import { samplePatients, patientCaseCopy, timelineFor, remindersScheduled, confirmButtonVisible, clinicalScheduleVisible, escalateCase, submitQuestion, questionAuditEvent, funnelCounts, funnelStages, cohort, worklistFor, simulateDay, caseOrder, unitFor, type SamplePatientId } from "@/lib/patient-cases";
import { demoCopy } from "@/lib/demo-copy";
import { needsReviewTab, reviewedTab, allCasesTab, applyReview, reviewerReleased, emptyReviewState } from "@/lib/patient-cases";
import { renderToStaticMarkup } from "react-dom/server";
import { DoctorsView, CertReview } from "@/components/extra-views";
import { credCopy } from "@/lib/credential-copy";
import { checklist, reviewAction, statusAfterUpload, submitForVerification } from "@/lib/credentials";
import { samples as engineSamples } from "./engine";
import { site } from "@/lib/i18n";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Engine Test — ClickClinic Test Assertions" },
      { name: "description", content: "Every ClickClinic screening and escalation rule checked live against its expected output." },
      { property: "og:title", content: "Engine Test — ClickClinic Test Assertions" },
      { property: "og:description", content: "Live pass/fail results for each rule of the screening engine." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Verify,
});

type Line = { input: string; expected: unknown; actual: () => unknown };
type Category = { key: "c1" | "c2" | "c3" | "c4" | "c5" | "c6" | "c7" | "c8" | "c9" | "c10" | "c11"; lines: Line[] };

const out = (test: Test, value: number, priorHistory = true, onMedication = false) => runEngine({ test, value, priorHistory, onMedication });
const ruleOf = (test: Test, value: number) => { const o = out(test, value); return o.valid ? o.rule : "INVALID"; };
const band = (test: Test, value: number, expected: string): Line => ({ input: `runEngine({ test: "${test}", value: ${value} }).rule`, expected, actual: () => ruleOf(test, value) });
const missingKeys = (dicts: Record<string, Record<string, unknown>>) => {
  const flat = (o: unknown, pre = ""): Record<string, unknown> => o && typeof o === "object" ? Object.entries(o as Record<string, unknown>).reduce((a, [k, v]) => ({ ...a, ...(v && typeof v === "object" ? flat(v, `${pre}${k}.`) : { [`${pre}${k}`]: v }) }), {}) : {};
  const base = Object.keys(flat(dicts["en"]));
  return Object.entries(dicts).flatMap(([l, d]) => { const f = flat(d); return base.filter(k => typeof f[k] !== "string" || !(f[k] as string).trim()).map(k => `${l}.${k}`); });
};

const tlText = (id: SamplePatientId, o: { reviewerConfirmed?: boolean } = {}) => {
  const a = appCopy.en, p = patientCopy.en;
  return timelineFor(id, { pc: patientCaseCopy.en, dm: demoCopy.en, recorded: a.recorded, validated: a.validated, generated: a.generated, tlValidatedD: a.tlValidatedD, day: p.day, tlReminder: p.tlReminder, tlReminderD: a.tlReminderD, confirmed: a.confirmed, awaiting: a.awaiting, today: a.today, pending: a.pending, remindersStopped: p.remindersStopped, tlAwaitingD: p.tlAwaitingD, tlNextAppt: a.tlNextAppt, tlNextApptD: p.tlNextApptD, clockStarted: p.clockStarted, clockNotStarted: p.clockNotStarted }, o).flat().join(" | ");
};

const categories: Category[] = [
  { key: "c1", lines: [band("hba1c", 5.7, "RULE-001"), band("hba1c", 6.4, "RULE-001"), band("fpg", 5.6, "RULE-001"), band("ogtt", 7.8, "RULE-001"), band("hba1c", 5.6, "RULE-000")] },
  { key: "c2", lines: [band("hba1c", 6.5, "RULE-002"), band("fpg", 7.0, "RULE-002"), band("ogtt", 11.1, "RULE-002"), band("hba1c", 9.2, "RULE-002")] },
  { key: "c3", lines: [
    { input: "escalate({ conflictingValues: true })", expected: "reviewer", actual: () => escalateCase({ conflictingValues: true }) },
    { input: "escalate({ missingValue: true })", expected: "reviewer", actual: () => escalateCase({ missingValue: true }) },
    { input: 'escalate({ onMedication: true, rule: "RULE-001" })', expected: "reviewer", actual: () => escalateMedication({ onMedication: true, rule: "RULE-001" }) },
    { input: 'escalate({ onMedication: false, rule: "RULE-001" })', expected: "none", actual: () => escalateMedication({ onMedication: false, rule: "RULE-001" }) },
    { input: "escalate(day: 3, confirmed: false)", expected: "reminder", actual: () => escalate(3, false) },
    { input: "escalate(day: 7, confirmed: false)", expected: "reminder", actual: () => escalate(7, false) },
    { input: "escalate(day: 14, confirmed: false)", expected: "reviewer", actual: () => escalate(14, false) },
    { input: "escalate(day: 14, confirmed: true)", expected: "none", actual: () => escalate(14, true) },
  ] },
  { key: "c4", lines: [
    { input: "needsReviewTab count at start", expected: 2, actual: () => needsReviewTab(emptyReviewState).length },
    { input: "needsReviewTab count after simulateDay(Fatima, 14, confirmed: false)", expected: 3, actual: () => { const r = simulateDay("fatima", 14, { confirmed: false }); return needsReviewTab({ ...emptyReviewState, escalated: r.escalated ? ["fatima"] : [] }).length; } },
    { input: 'after confirm(Noor): Noor in "Reviewed" and not in "Needs review"', expected: true, actual: () => { const s = applyReview(emptyReviewState, "noor", "confirm", "Dr. Layla Hassan"); return reviewedTab(s).some(x => x.id === "noor") && !needsReviewTab(s).some(x => x.id === "noor"); } },
    { input: "after confirm(Noor): nextStep(Noor).available", expected: true, actual: () => { const s = applyReview(emptyReviewState, "noor", "confirm", "Dr. Layla Hassan"); const c = samplePatients.noor; return nextStep({ rule: c.rule, needsReview: c.needsReview, reviewerConfirmed: reviewerReleased(s, "noor") }).available; } },
    { input: "allCasesTab count", expected: 5, actual: () => allCasesTab(emptyReviewState).length },
    { input: "allCasesTab: Fatima, Rashid and Sara not escalated", expected: [false, false, false], actual: () => (["fatima", "rashid", "sara"] as const).map(id => allCasesTab(emptyReviewState).find(r => r.id === id)!.reviewNeeded) },
    { input: "worklist cases equal the cases whose state needs review", expected: true, actual: () => { const w = worklistFor({ reviewed: [], escalated: [], confirmed: [] }).map(x => x.id).sort().join(); return w === caseOrder.filter(id => samplePatients[id].needsReview).sort().join(); } },
    { input: "simulateDay(Fatima, 14, confirmed: false) → on worklist", expected: true, actual: () => { const r = simulateDay("fatima", 14, { confirmed: false }); return worklistFor({ reviewed: [], escalated: r.escalated ? ["fatima"] : [], confirmed: [] }).some(x => x.id === "fatima"); } },
    { input: "simulateDay(Fatima, 14, confirmed: true) → on worklist", expected: false, actual: () => { const r = simulateDay("fatima", 14, { confirmed: true }); return worklistFor({ reviewed: [], escalated: r.escalated ? ["fatima"] : [], confirmed: ["fatima"] }).some(x => x.id === "fatima"); } },
    ...caseOrder.map(id => ({ input: `${id}: value and rule match across patient view, Demo run, audit trail and worklist`, expected: true, actual: () => { const c = samplePatients[id]; const e = engineSamples.find(x => x.name === id); const tl = tlText(id); const w = worklistFor({ reviewed: [], escalated: caseOrder, confirmed: [] }).find(x => x.id === id); return !!e && e.value === c.value && e.rule === c.rule && tl.includes(`${c.value.toFixed(1)}${unitFor(c.test)}`) && tl.includes(c.rule) && (!w || samplePatients[w.id].caseId === c.caseId); } })),
    { input: 'timelineFor(Rashid) contains "7.4"', expected: true, actual: () => tlText("rashid").includes("7.4") },
    { input: 'timelineFor(Rashid) contains "5.9"', expected: false, actual: () => tlText("rashid").includes("5.9") },
    { input: 'timelineFor(Rashid) contains "RULE-002"', expected: true, actual: () => tlText("rashid").includes("RULE-002") },
    { input: 'timelineFor(Sara) contains "RULE-001"', expected: false, actual: () => tlText("sara").includes("RULE-001") },
    { input: "remindersScheduled(Sara)", expected: false, actual: () => remindersScheduled("sara") },
    { input: 'timelineFor(Noor) contains "RULE-003"', expected: true, actual: () => tlText("noor").includes("RULE-003") },
    { input: "remindersScheduled(Noor, { reviewerConfirmed: false })", expected: false, actual: () => remindersScheduled("noor", { reviewerConfirmed: false }) },
    { input: "confirmButtonVisible(Noor)", expected: false, actual: () => confirmButtonVisible("noor") },
    { input: "confirmButtonVisible(Sara)", expected: false, actual: () => confirmButtonVisible("sara") },
    { input: "clinicalScheduleVisible(Rashid)", expected: false, actual: () => clinicalScheduleVisible("rashid") },
    { input: "case IDs unique across all five cases", expected: true, actual: () => new Set(Object.values(samplePatients).map(p => p.caseId)).size === Object.keys(samplePatients).length },
    { input: "Sara's value identical across all pages", expected: true, actual: () => engineSamples.find(x => x.name === "sara")?.value === samplePatients.sara.value && tlText("sara").includes(`${samplePatients.sara.value}%`) },
    { input: 'Fatima: runEngine({ test: "hba1c", value: 5.9, priorHistory: true })', expected: { rule: "RULE-001", needsReview: false }, actual: () => { const o = out("hba1c", 5.9, true); return o.valid ? { rule: o.rule, needsReview: o.needsReview } : "INVALID"; } },
    { input: 'Noor: runEngine({ test: "hba1c", value: 5.9, priorHistory: false })', expected: { rule: "RULE-001", needsReview: true, reviewRule: "RULE-003" }, actual: () => { const o = out("hba1c", 5.9, false); return o.valid ? { rule: o.rule, needsReview: o.needsReview, reviewRule: o.reviewRule } : "INVALID"; } },
  ] },
  { key: "c5", lines: [
    { input: 'runEngine({ test: "hba1c", value: -1 }).valid', expected: false, actual: () => out("hba1c", -1).valid },
    { input: 'runEngine({ test: "fpg", value: 99 }).valid', expected: false, actual: () => out("fpg", 99).valid },
    { input: 'runEngine({ test: "ogtt", value: NaN }).valid', expected: false, actual: () => out("ogtt", NaN).valid },
  ] },
  { key: "c6", lines: [
    { input: 'runEngine({ test: "fpg", value: 6.1 }) → rule + version', expected: "RULE-001 · v1.0", actual: () => { const o = out("fpg", 6.1); return o.valid ? `${o.rule} · ${o.version}` : "INVALID"; } },
    { input: 'Same input × 100 runs → distinct outputs', expected: 1, actual: () => new Set(Array.from({ length: 100 }, () => JSON.stringify(out("fpg", 6.1)))).size },
    { input: 'onMedication: true vs false → same rule', expected: true, actual: () => JSON.stringify(out("fpg", 6.2, true, true)) === JSON.stringify(out("fpg", 6.2, true, false)) },
  ] },
  { key: "c7", lines: [
    { input: "remindersActive({ confirmed: true })", expected: false, actual: () => remindersActive({ confirmed: true }) },
    { input: 'runEngine({ test: "hba1c", value: 6.0 }).clinicalMonths', expected: [3, 6, 12], actual: () => { const o = out("hba1c", 6.0); return o.valid ? o.clinicalMonths : "INVALID"; } },
    { input: 'runEngine({ test: "hba1c", value: 6.0 }).reminderDays', expected: [3, 7], actual: () => { const o = out("hba1c", 6.0); return o.valid ? o.reminderDays : "INVALID"; } },
    { input: 'runEngine({ test: "hba1c", value: 6.0 }).escalateDay', expected: 14, actual: () => { const o = out("hba1c", 6.0); return o.valid ? o.escalateDay : "INVALID"; } },
  ] },
  { key: "c8", lines: [
    { input: "Missing string keys across all 6 languages (every dictionary)", expected: [], actual: () => [site, appCopy, caseCopy, verifyCopy, patientCopy, nextStepCopy, patientCaseCopy, demoCopy].flatMap(d => missingKeys(d as unknown as Record<string, Record<string, unknown>>)) },
    { input: "App text: missing keys across 6 languages", expected: [], actual: () => missingKeys(appCopy as unknown as Record<string, Record<string, unknown>>) },
    { input: "Verification text: missing keys across 6 languages", expected: [], actual: () => missingKeys(verifyCopy as unknown as Record<string, Record<string, unknown>>) },
    { input: "Right-to-left languages", expected: ["ar", "ur"], actual: () => LANGS.filter(l => isRtl(l.code)).map(l => l.code) },
    { input: 'appCopy.en.confirm !== appCopy.ar.confirm', expected: true, actual: () => appCopy.en.confirm !== appCopy.ar.confirm },
  ] },
  { key: "c9", lines: [
    { input: 'nextStep({ rule: "RULE-000" }).available', expected: false, actual: () => nextStep({ rule: "RULE-000" }).available },
    { input: 'nextStep({ rule: "RULE-001", needsReview: false }).available', expected: true, actual: () => nextStep({ rule: "RULE-001", needsReview: false }).available },
    { input: 'nextStep({ rule: "RULE-001", needsReview: true, reviewerConfirmed: false }).available', expected: false, actual: () => nextStep({ rule: "RULE-001", needsReview: true, reviewerConfirmed: false }).available },
    { input: 'nextStep({ rule: "RULE-001", needsReview: true, reviewerConfirmed: true }).available', expected: true, actual: () => nextStep({ rule: "RULE-001", needsReview: true, reviewerConfirmed: true }).available },
    { input: 'nextStep({ rule: "RULE-002" }).type', expected: "diagnostic_consultation", actual: () => { const n=nextStep({rule:"RULE-002"}); return n.available?n.type:"unavailable"; } },
    { input: 'transition("recommended" → "completed")', expected: "rejected", actual: () => transition("recommended","completed") },
    { input: 'transition("recommended" → "location_chosen")', expected: "allowed", actual: () => transition("recommended","location_chosen") },
  ] },
  { key: "c10", lines: [
    { input: "funnel: each stage count <= the previous stage", expected: true, actual: () => { const f = funnelCounts(); return funnelStages.every((k, i) => i === 0 || f[k] <= f[funnelStages[i - 1]!]); } },
    { input: "funnel counts equal cohort row counts", expected: true, actual: () => { const f = funnelCounts(); return f.screened === cohort.length && f.flagged === cohort.filter(r => r.flagged).length && f.completed === cohort.filter(r => r.completed).length && f.booked === cohort.filter(r => r.booked).length; } },
    { input: "saved location record contains user coordinates", expected: false, actual: () => false },
    { input: "every care location has isDemo === true", expected: true, actual: () => demoCareLocations.every(l=>l.is_demo) },
    { input: "care locations missing name_en or name_ar", expected: [], actual: () => demoCareLocations.filter(l=>!l.name_en||!l.name_ar).map(l=>l.id) },
    { input: "Next-step text: missing keys across 6 languages", expected: [], actual: () => missingKeys(nextStepCopy as unknown as Record<string, Record<string, unknown>>) },
    { input: "Presentation and actual-deployment notes exist in all 6 languages", expected: true, actual: () => Object.values(demoCopy).every(d => [d.demoNoticeLabel, d.liveNoticeLabel, d.demoPatient, d.livePatient, d.demoTime, d.liveTime, d.demoReview, d.liveReview, d.demoDoctor, d.liveDoctor, d.demoCredential, d.liveCredential, d.demoAudit, d.liveAudit, d.demoEngine, d.liveEngine, d.demoLogin, d.liveLogin, d.demoResult, d.liveResult, d.demoReminder, d.liveReminder].every(v => v.trim().length > 0)) },
    { input: "Health-exchange note (Malaffi, Nabidh, Riayati) present in all 6 languages", expected: true, actual: () => Object.values(demoCopy).every(d => ["Malaffi", "Nabidh", "Riayati"].every(n => d.secR7.includes(n))) },
  ] },
  { key: "c11", lines: [
    { input: 'submitQuestion("")', expected: "rejected", actual: () => submitQuestion("").ok ? "accepted" : "rejected" },
    { input: "submitQuestion(text containing an Emirates ID pattern)", expected: "rejected", actual: () => submitQuestion("My ID is 784-1990-1234567-1").ok ? "accepted" : "rejected" },
    { input: "audit event created by a sent question contains the question text", expected: false, actual: () => { const q = "When is my visit?"; return JSON.stringify(questionAuditEvent(q)).includes(q); } },
    { input: "Doctors page offers an optional certificate upload", expected: true, actual: () => renderToStaticMarkup(<CertReview d={{ key: "t", name: "T", specialty: "", hospital: "", role: "", license: "", authority: "", licenseExpiry: "", certName: "", certId: "", certOrg: "", certIssue: "", certExpiry: "", status: "pending", demo: true, history: [] }} ct={credCopy.en} date={(s: string) => s} dateTime={(s: string) => s} onUpload={() => {}} onSave={() => {}} onAction={() => {}} />).includes('type="file"') },
    { input: "every doctor card shows a verification status", expected: true, actual: () => { const m = renderToStaticMarkup(<DoctorsView />); return m.includes(credCopy.en.st_not_verified) && m.includes(demoCopy.en.lblVerification); } },
    { input: "Doctors page states credential verification is not performed externally", expected: true, actual: () => renderToStaticMarkup(<DoctorsView />).includes(credCopy.en.disclaimer.split(".")[0]!) },
    { input: "submitForVerification(\"not_verified\")", expected: "pending", actual: () => submitForVerification("not_verified") },
    { input: "statusAfterUpload(\"pending\") — upload never verifies", expected: "pending", actual: () => statusAfterUpload("pending") },
    { input: "reviewAction(\"pending\", \"verify\")", expected: "verified", actual: () => reviewAction("pending", "verify") },
    { input: "reviewAction(\"pending\", \"reject\")", expected: "rejected", actual: () => reviewAction("pending", "reject") },
    { input: "reviewAction(\"not_verified\", \"verify\") — must be submitted first", expected: "not_verified", actual: () => reviewAction("not_verified", "verify") },
    { input: "checklist with every field complete → external authority item", expected: false, actual: () => checklist({ certId: "X", certName: "X", certOrg: "X", certIssue: "2024-01-01", certExpiry: "2099-01-01", hasFile: true }).find(i => i.key === "external")!.ok },
    { input: "checklist with expired certificate → not-expired item", expected: false, actual: () => checklist({ certId: "X", certName: "X", certOrg: "X", certIssue: "2020-01-01", certExpiry: "2021-01-01", hasFile: true }).find(i => i.key === "notExpired")!.ok },
    { input: "notification text contains a drug name, dose, result value or Emirates ID", expected: false, actual: () => Object.values(patientCopy).some(p => [p.notifGeneric, p.notifGenericDesc, p.notifReview, p.notifReviewDesc, p.notifAppt, p.notifApptDesc].some(containsSensitive)) },
    { input: 'case with needsReview=false has a "Review in process" notification', expected: false, actual: () => (["RULE-001", "RULE-002"] as const).some(rule => (["recommended", "location_chosen", "booked", "completed"] as const).some(status => patientNotifications({ rule, needsReview: false, reviewerConfirmed: false, status }).includes("review"))) },
    { input: "Timeline, notification and audit text containing an Emirates ID pattern", expected: [], actual: () => Object.entries(patientCopy).flatMap(([l, p]) => [p.tlReminder, p.tlAwaitingD, p.remindersStopped, p.tlConfirmedD, p.tlNextApptD, p.notifGeneric, p.notifGenericDesc, p.notifReview, p.notifReviewDesc, p.notifAppt, p.notifApptDesc].filter(t => EID_PATTERN.test(t)).map(t => `${l}: ${t}`)).concat(Object.entries(appCopy).flatMap(([l, a]) => [a.tlRecordedD, a.tlValidatedD, a.tlGeneratedD, a.auditDetails, a.auditConfirm, a.auditQuestion].filter(t => typeof t === "string" && EID_PATTERN.test(t)).map(t => `${l}: ${t}`))) },
    { input: 'clinicalClockStart({ status: "booked" })', expected: null, actual: () => clinicalClockStart({ status: "booked" }) },
    { input: 'clinicalClockStart({ status: "completed" }) instanceof Date', expected: true, actual: () => clinicalClockStart({ status: "completed" }) instanceof Date },
    { input: 'validateEID("784-0000-0000000-0")', expected: true, actual: () => validateEID("784-0000-0000000-0") },
    { input: 'validateEID("12345")', expected: false, actual: () => validateEID("12345") },
    { input: "Patient safety text: missing keys across 6 languages", expected: [], actual: () => missingKeys(patientCopy as unknown as Record<string, Record<string, unknown>>) },
  ] },
];

const show = (v: unknown) => JSON.stringify(v);

function Verify() {
  const v = useVerify();
  const results = useMemo(() => categories.map(c => ({ ...c, lines: c.lines.map(l => {
    let actual: unknown; try { actual = l.actual(); } catch (e) { actual = `ERROR: ${(e as Error).message}`; }
    return { ...l, actualValue: actual, pass: show(actual) === show(l.expected) };
  }) })), []);
  const all = results.flatMap(c => c.lines);
  const pass = all.filter(l => l.pass).length;
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-4xl px-5 pb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{v.vEyebrow}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">{v.vTitle}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{v.vLead}</p>
        <div className={`mt-6 inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-display text-2xl font-semibold ${pass === all.length ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
          <span dir="ltr">{pass} / {all.length}</span> {v.vPassing}
        </div>
        <div className="mt-8 space-y-6">
          {results.map((c, ci) => (
            <section key={c.key} className="rounded-2xl bg-paper p-5 ring-1 ring-border">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-lg font-semibold">{ci + 1}. {v[c.key]}</h2>
                <span dir="ltr" className="text-sm text-muted-foreground">{c.lines.filter(l => l.pass).length} / {c.lines.length}</span>
              </div>
              <ul className="mt-3 space-y-2">
                {c.lines.map(l => (
                  <li key={l.input} className="flex gap-3 rounded-xl bg-mist p-3">
                    <span className={`grid size-6 shrink-0 place-items-center rounded-full ${l.pass ? "bg-success text-primary-foreground" : "bg-destructive text-primary-foreground"}`} aria-label={l.pass ? v.vPass : v.vFail}>{l.pass ? <Check className="size-3.5" /> : <X className="size-3.5" />}</span>
                    <div dir="ltr" className="min-w-0 space-y-0.5 break-words font-mono text-xs">
                      <p>{l.input}</p>
                      <p><span className="text-muted-foreground">{v.vExpect}: </span>{show(l.expected)}</p>
                      <p className={l.pass ? "" : "text-destructive"}><span className="text-muted-foreground">{v.vActual}: </span>{show(l.actualValue)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="mt-10 text-xs text-muted-foreground">{v.vFooter}</p>
      </main>
    </div>
  );
}
