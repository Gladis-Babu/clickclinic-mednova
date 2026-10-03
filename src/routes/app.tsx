import { createFileRoute, Link } from "@tanstack/react-router";
import { RemindersView, DoctorsView } from "@/components/extra-views";
import { useDemoText, type DemoText } from "@/lib/demo-copy";
import { caseOrder, simulateDay, needsReviewTab, reviewedTab, allCasesTab, applyReview, reviewerReleased, largestLoss, type ReviewState, type EngineReason, type Progress, submitQuestion, questionAuditEvent, funnelCounts, attentionCounts, funnelStages, unitFor, rulesFor, type WorkReason } from "@/lib/patient-cases";
import {
  Activity,
  History,
  ArrowRight,
  BarChart3,
  BellRing,
  CalendarCheck,
  Check,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  FileCheck2,
  FlaskConical,
  Home,
  LayoutDashboard,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRoundCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CaseDetail } from "@/components/case-detail";
import { useCaseText, type Decision, type PathwayId } from "@/lib/case-copy";
import { NextStepCard } from "@/components/next-step-card";
import { DemoControlNote } from "@/components/demo-control-note";
import { nextStep, type FollowUpStatus } from "@/lib/next-step-rules";
import { useNextStepText } from "@/lib/next-step-copy";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/app")({
  validateSearch: (search: Record<string, unknown>) => ({
    ...(search["role"] === "doctor" ? { role: "doctor" as const } : {}),
  }),
  head: () => ({
    meta: [
      { title: "ClickClinic App — Patient, Reviewer & Doctor Views" },
      { name: "description", content: "A bilingual prototype that turns preventive screening results into clear, trackable follow-up actions." },
      { property: "og:title", content: "ClickClinic App — Patient, Reviewer & Doctor Views" },
      { property: "og:description", content: "A bilingual prototype for clear screening follow-through, human review, and population visibility." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

import { LanguageSwitcher, useLang, site, fill } from "@/lib/i18n";
import { appCopy, sampleNames, type AppText } from "@/lib/app-copy";
import { usePatientText, type patientCopy as _pc } from "@/lib/patient-copy";
import { samplePatients, usePatientCaseText, timelineFor, headerStatus, confirmButtonVisible, clinicalScheduleVisible, remindersScheduled, type PatientCaseText, type TimelineLabels } from "@/lib/patient-cases";
import { clinicalClockStart, validateEID, maskEID, patientNotifications } from "@/lib/next-step-rules";
type View = "case" | "review" | "population" | "reminders" | "doctors" | "audit";
type TestType = "hba1c" | "fpg" | "ogtt";
type PatientId = "fatima" | "noor" | "huda" | "rashid" | "sara";
type Result = { band: "normal" | "prediabetes" | "referral"; label: string; rule: string; explanation: string; action: string };
type AuditAction = "auditResult" | "auditConfirm" | "auditReview" | "auditReminderAdded" | "auditReminderRemoved" | "auditDoctorAdded" | "auditDoctorRemoved" | "auditQuestion" | "auditDetails" | "auditMedicine" | "auditLocation" | "auditBooked" | "auditCompleted" | "auditReminder" | "auditEscalated";
type AuditEvent = { id: number; action: AuditAction; actor: "auditActorSystem" | "auditActorPatient" | "auditActorReviewer" | "auditActorTeam"; at: Date; detail: string; result?: { test: TestType; value: number; band: Result["band"]; rule: string }; caseName?: PatientId; reason?: WorkReason; decision?: Decision | undefined; pathway?: PathwayId | undefined; note?: string | undefined; reviewer?: string | undefined };
function testName(test: TestType, text: AppText) { return test === "hba1c" ? "HbA1c" : test === "fpg" ? text.fasting : text.ogtt; }
function evaluate(test: TestType, value: number, text: AppText): Result {
  const ranges = { hba1c: { low: 5.7, high: 6.5, unit: "%" }, fpg: { low: 5.6, high: 7, unit: " mmol/L" }, ogtt: { low: 7.8, high: 11.1, unit: " mmol/L" } }[test];
  const vars = { test: testName(test, text), value: value.toFixed(1), unit: ranges.unit };
  if (value >= ranges.high) return { band: "referral", label: text.bandReferral, rule: "RULE-002 · v1.0", explanation: fill(text.explanationReferral, vars), action: text.actionReferral };
  if (value >= ranges.low) return { band: "prediabetes", label: text.bandPre, rule: "RULE-001 · v1.0", explanation: fill(text.explanationPre, vars), action: text.actionPre };
  return { band: "normal", label: text.bandNormal, rule: "RULE-000 · v1.0", explanation: fill(text.explanationNormal, vars), action: text.actionNormal };
}

function Index() {
  const { role } = Route.useSearch();
  const isDoctor = role === "doctor";
  const allowed: View[] = isDoctor ? ["review", "population", "doctors", "audit"] : ["case", "reminders", "audit"];
  const [rawView, setRawView] = useState<View>(isDoctor ? "population" : "case");
  const view: View = allowed.includes(rawView) ? rawView : allowed[0]!;
  const setView = (v: View) => { if (allowed.includes(v)) setRawView(v); };
  const { lang } = useLang();
  const [confirmedCases, setConfirmedCases] = useSessionList("almarja-confirmed");
  const [decisions, setDecisions] = useSessionRecord("almarja-decisions");
  const [escalatedCases, setEscalatedCases] = useSessionList("almarja-escalated");
  const [simDays, setSimDays] = useState<Partial<Record<PatientId, number[]>>>({});
  const [menu, setMenu] = useState(false);
  const [test, setTest] = useState<TestType>("hba1c");
  const [value, setValue] = useState("5.9");
  const [submitted, setSubmitted] = useState({ test: "hba1c" as TestType, value: 5.9 });
  const [patient, setPatient] = useState<PatientId>("fatima");
  const [doctorName, setDoctorName] = useState("");
  const reviewState: ReviewState = { reviewed: decisions, escalated: escalatedCases as PatientId[], confirmed: confirmedCases as PatientId[] };
  const released = caseOrder.filter(id => reviewerReleased(reviewState, id));
  const confirmed = confirmedCases.includes(patient);
  const noorReviewed = reviewerReleased(reviewState, patient);
  const setConfirmed = (v: boolean) => setConfirmedCases(c => v ? (c.includes(patient) ? c : [...c, patient]) : c.filter(x => x !== patient));
  const simulate = (day: number) => {
    if (day === 0) { setSimDays(d => ({ ...d, [patient]: [] })); return; }
    const r = simulateDay(patient, day, { confirmed, reviewerConfirmed: noorReviewed });
    setSimDays(d => ({ ...d, [patient]: [...(d[patient] ?? []).filter(x => x !== day), day] }));
    if (r.reminder) record("auditReminder", "auditActorSystem", String(day), { caseName: patient });
    if (r.escalated && !escalatedCases.includes(patient)) { setEscalatedCases(c => [...c, patient]); record("auditEscalated", "auditActorSystem", "", { caseName: patient, reason: "day14" }); }
  };
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const text = appCopy[lang];
  const result = useMemo(() => evaluate(submitted.test, submitted.value, text), [submitted, text]);
  const rtl = lang === "ar" || lang === "ur";
  const record = (action: AuditAction, actor: AuditEvent["actor"], detail = "", extra: Partial<Pick<AuditEvent, "result" | "caseName" | "reason" | "decision" | "pathway" | "note" | "reviewer">> = {}) => {
    setEvents(current => [{ id: Date.now() + Math.random(), action, actor, at: new Date(), detail, ...extra }, ...current]);
  };

  const submitResult = () => {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 0) {
      setSubmitted({ test, value: parsed });
      setConfirmed(false);
      const next = evaluate(test, parsed, text);
      record("auditResult", "auditActorSystem", "", { result: { test, value: parsed, band: next.band, rule: next.rule } });
    }
  };
  const selectPatient = (id: PatientId) => {
    const samples = samplePatients;
    setPatient(id); setSubmitted(samples[id]); setTest(samples[id].test); setValue(String(samples[id].value));
  };

  return (
    <div dir={rtl ? "rtl" : "ltr"} lang={lang} className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1380px]">
        <Sidebar view={view} setView={setView} text={text} rtl={rtl} isDoctor={isDoctor} />
        {menu && <MobileNav view={view} setView={setView} allowed={allowed} close={() => setMenu(false)} text={text} />}
        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex min-h-16 flex-col gap-3 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
             <div className="flex min-w-0 items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenu(true)} aria-label={text.openMenu}><Menu /></Button>
              <h1 className="truncate font-display text-lg font-semibold">{text[view]}</h1>
              {view === "case" && <StatusChip status={headerStatus(patient, { confirmed, reviewerConfirmed: noorReviewed })} text={text} />}
             </div>
             <div className="flex items-center gap-3">
               <Button variant={view === "audit" ? "secondary" : "outline"} size="sm" className="shrink-0 gap-2" onClick={() => setView("audit")} aria-current={view === "audit" ? "page" : undefined}><History className="size-4" />{text.audit}{events.length > 0 && <span className="grid min-w-5 place-items-center rounded-full bg-brand/10 px-1 text-[10px] text-brand">{events.length}</span>}</Button>
               <div className="hidden border-s border-border ps-3 text-end sm:block"><p className="text-xs font-medium">{isDoctor ? (doctorName || sampleNames[lang].layla) : sampleNames[lang][patient]}</p><p className="text-[11px] text-muted-foreground">{isDoctor ? text.team : `${text.caseId} #${samplePatients[patient].caseId}`}</p></div>
             </div>
            </div>
            <div className="min-w-0">
              <LanguageSwitcher />
            </div>
          </header>
          <div className="space-y-6 px-4 pb-12 pt-5 sm:px-6 lg:px-8">
             {view === "case" && <PatientView text={text} patient={patient} onPatient={selectPatient} noorReviewed={noorReviewed} result={result} submitted={submitted} confirmed={confirmed} setConfirmed={(v) => { setConfirmed(v); if (v && !confirmed) record("auditConfirm", "auditActorPatient"); }} test={test} setTest={setTest} value={value} setValue={setValue} submitResult={submitResult} onAsk={(q) => { const ev = questionAuditEvent(q); record(ev.action, "auditActorPatient", ev.detail, { caseName: patient }); }} simDays={simDays[patient] ?? []} onSimulate={simulate} escalated={escalatedCases.includes(patient)} onSaveDetails={() => record("auditDetails", "auditActorPatient")} onNextStep={(action, detail) => record(action, "auditActorPatient", detail)} />}
             {isDoctor && <div className={view === "review" ? "space-y-6" : "hidden"}><ReviewerView text={text} state={reviewState} onReview={(id, reason, d) => { setDecisions(c => applyReview({ ...reviewState, reviewed: c }, id, d.decision, doctorName || d.reviewer).reviewed); record("auditReview", "auditActorReviewer", "", { caseName: id, reason, ...d, ...(doctorName ? { reviewer: doctorName } : {}) }); }} /></div>}
            {view === "population" && <PopulationView text={text} />}
            {!isDoctor && <div className={view === "reminders" ? "space-y-6" : "hidden"}><RemindersView onActivity={(action, detail) => record(action, "auditActorPatient", detail)} /></div>}
            {isDoctor && <div className={view === "doctors" ? "space-y-6" : "hidden"}><DoctorsView onSelect={setDoctorName} /></div>}
            {view === "audit" && <AuditTrail text={text} events={events} patient={patient} reviewed={released} confirmedCases={confirmedCases as PatientId[]} />}
            <footer className="flex flex-col gap-2 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>{text.synthetic}</p><p>{text.standard}</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

function Sidebar({ view, setView, text, rtl, isDoctor }: { view: View; setView: (v: View) => void; text: AppText; rtl: boolean; isDoctor: boolean }) {
  return <aside className={`hidden w-64 shrink-0 flex-col border-border bg-paper p-4 lg:flex ${rtl ? "border-l" : "border-r"}`}>
    <div className="flex items-center gap-3 px-2 pb-5"><div className="grid size-10 place-items-center rounded-md bg-brand font-display text-lg font-semibold text-brand-foreground">C</div><div><p className="font-display font-semibold leading-none">ClickClinic</p><p className="mt-1 text-[11px] text-muted-foreground">{text.brandSub}</p></div></div>
    <p className="px-3 pt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{isDoctor ? text.team : text.patient}</p>
    {!isDoctor && <NavButton active={view === "case"} onClick={() => setView("case")} icon={<UserRoundCheck />} label={text.case} />}
    {!isDoctor && <NavButton active={view === "reminders"} onClick={() => setView("reminders")} icon={<BellRing />} label={text.reminders} />}
    {isDoctor && <NavButton active={view === "population"} onClick={() => setView("population")} icon={<BarChart3 />} label={text.population} />}
    {isDoctor && <NavButton active={view === "review"} onClick={() => setView("review")} icon={<ClipboardList />} label={text.review} />}
    {isDoctor && <NavButton active={view === "doctors"} onClick={() => setView("doctors")} icon={<Stethoscope />} label={text.doctors} />}
    <NavButton active={view === "audit"} onClick={() => setView("audit")} icon={<History />} label={text.audit} />
    <Link to="/" className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-mist"><Home className="size-4" />{site[useLang().lang].navHome}</Link>
    <Link to="/engine" className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-mist"><Activity className="size-4" />{text.engineTest}</Link>
    <div className="mt-auto rounded-xl bg-mist/60 p-3 ring-1 ring-border"><div className="mb-1 flex items-center gap-2 text-xs font-semibold"><ShieldCheck className="size-4 text-brand" /> {text.prototype}</div><p className="text-[11px] leading-relaxed text-muted-foreground">{text.synthetic}</p></div>
  </aside>;
}

function MobileNav({ view, setView, allowed, close, text }: { view: View; setView: (v: View) => void; allowed: View[]; close: () => void; text: AppText }) {
   return <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={close}><div className="h-full w-[min(82vw,320px)] bg-paper p-4 shadow-xl" onClick={(e) => e.stopPropagation()}><div className="mb-5 flex items-center justify-between"><span className="font-display text-lg font-semibold">ClickClinic</span><Button variant="ghost" size="icon" aria-label={text.closeMenu} onClick={close}><X /></Button></div>{allowed.map(v => <NavButton key={v} active={view === v} onClick={() => { setView(v); close(); }} icon={v === "case" ? <UserRoundCheck /> : v === "reminders" ? <BellRing /> : v === "review" ? <ClipboardList /> : v === "doctors" ? <Stethoscope /> : v === "audit" ? <History /> : <BarChart3 />} label={text[v]} />)}<Link to="/" onClick={close} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-mist"><Home className="size-4" />{site[useLang().lang].navHome}</Link></div></div>;
}

function NavButton({ active, onClick, icon, label }: { active?: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return <button onClick={onClick} className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${active ? "bg-brand/10 text-brand ring-1 ring-brand/20" : "text-muted-foreground hover:bg-mist/60 hover:text-foreground"}`}><span className="[&_svg]:size-4">{icon}</span>{label}</button>;
}

function useSessionRecord(key: string) {
  const [rec, setRec] = useState<ReviewState["reviewed"]>({});
  useEffect(() => { try { const v = JSON.parse(sessionStorage.getItem(key) ?? "{}"); if (v && typeof v === "object" && !Array.isArray(v)) setRec(v); } catch { /* ignore */ } }, [key]);
  const update = (fn: (c: ReviewState["reviewed"]) => ReviewState["reviewed"]) => setRec(c => { const n = fn(c); sessionStorage.setItem(key, JSON.stringify(n)); return n; });
  return [rec, update] as const;
}
function useSessionList(key: string) {
  const [list, setList] = useState<PatientId[]>([]);
  useEffect(() => { try { const v = JSON.parse(sessionStorage.getItem(key) ?? "[]"); if (Array.isArray(v)) setList(v); } catch { /* ignore */ } }, [key]);
  const update = (fn: (c: PatientId[]) => PatientId[]) => setList(c => { const n = fn(c); sessionStorage.setItem(key, JSON.stringify(n)); return n; });
  return [list, update] as const;
}

function StatusChip({ status, text }: { status: "confirmed" | "awaiting" | "under" | "none"; text: AppText }) {
  const pc = usePatientCaseText();
  const good = status === "confirmed" || status === "none";
  const label = status === "confirmed" ? text.confirmed : status === "awaiting" ? text.awaiting : status === "under" ? pc.statusUnder : pc.statusNone;
  return <span className={`hidden items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium ring-1 sm:inline-flex ${good ? "bg-success/10 text-success ring-success/20" : "bg-operational/10 text-operational ring-operational/20"}`}><span className={`size-1.5 rounded-full ${good ? "bg-success" : "bg-operational"}`} />{label}</span>;
}

function PatientView({ simDays, onSimulate, escalated, text, patient, onPatient, noorReviewed, result, submitted, confirmed, setConfirmed, test, setTest, value, setValue, submitResult, onAsk, onSaveDetails, onNextStep }: { simDays: number[]; onSimulate: (day: number) => void; escalated: boolean; patient: PatientId; onPatient: (id: PatientId) => void; noorReviewed: boolean; onAsk: (q: string) => void; onSaveDetails: () => void; onNextStep: (action: "auditLocation"|"auditBooked"|"auditCompleted", detail: string) => void; text: AppText; result: Result; submitted: { test: TestType; value: number }; confirmed: boolean; setConfirmed: (v: boolean) => void; test: TestType; setTest: (v: TestType) => void; value: string; setValue: (v: string) => void; submitResult: () => void }) {
  const unit = submitted.test === "hba1c" ? "%" : " mmol/L";
  const { lang } = useLang();
  const nextText = useNextStepText();
  const rule = result.band === "normal" ? "RULE-000" : result.band === "prediabetes" ? "RULE-001" : "RULE-002";
  const next = nextStep({ rule, needsReview: samplePatients[patient].needsReview, reviewerConfirmed: noorReviewed });
  const pt = usePatientText();
  const dm = useDemoText();
  const [followStatus, setFollowStatus] = useState<FollowUpStatus>("recommended");
  const [completedAt, setCompletedAt] = useState<Date | null>(null);
  useEffect(() => { setFollowStatus("recommended"); setCompletedAt(null); }, [patient]);
  const onStatus = (st: FollowUpStatus) => { setFollowStatus(st); if (st === "completed") setCompletedAt(new Date()); };
  const clockStart = clinicalClockStart({ status: followStatus, completedAt });
  const kinds = patientNotifications({ rule, needsReview: samplePatients[patient].needsReview, reviewerConfirmed: noorReviewed, status: followStatus });
  const pc = usePatientCaseText();
  const cOpts = { confirmed, reviewerConfirmed: noorReviewed };
  const showConfirm = confirmButtonVisible(patient, cOpts);
  const underReview = headerStatus(patient, cOpts) === "under";
  const showClinical = clinicalScheduleVisible(patient, cOpts);
  const heroLine = patient === "sara" ? pc.heroSara : patient === "rashid" ? pc.heroRashid : underReview ? pc.heroNoor : text.opportunity;
  const review = samplePatients[patient].reviewRule ? pt.reviewRequired.replace("RULE-003", samplePatients[patient].reviewRule ?? "RULE-003") : rule === "RULE-002" ? pt.reviewReferral : pt.reviewNotRequired;
  return <>
    <section className="space-y-3 rounded-xl bg-paper p-3 ring-1 ring-border"><div className="flex flex-wrap items-center gap-2"><span className="me-1 text-xs font-semibold text-muted-foreground">{nextText.patientSample}</span>{caseOrder.map(id=><Button key={id} size="sm" variant={patient===id?"default":"outline"} onClick={()=>onPatient(id)}>{sampleNames[lang][id]}</Button>)}</div><DemoControlNote demo={dm.demoPatient} actual={dm.livePatient} /></section>
    <section className="overflow-hidden rounded-3xl bg-brand p-6 text-brand-foreground ring-1 ring-brand/30 lg:p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[48ch]"><p className="text-[11px] font-medium uppercase tracking-widest text-brand-foreground/70">{text.screening}</p><h2 className="mt-3 font-display text-4xl font-semibold leading-tight lg:text-5xl">{text.resultTitle}</h2><p className="mt-4 text-lg leading-relaxed text-brand-foreground/85">{text.resultLead} <strong className="text-brand-foreground">{testName(submitted.test, text)} {submitted.value.toFixed(1)}{unit}</strong> — <strong className="text-brand-foreground">{result.label}</strong>. {heroLine}</p><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-brand-foreground/10 px-3 py-1 text-xs">{result.rule}</span><span className="rounded-full bg-brand-foreground/10 px-3 py-1 text-xs">{text.deterministic}</span></div></div>
        <div className="w-full shrink-0 rounded-2xl bg-paper p-5 text-foreground ring-1 ring-border lg:w-80">{!underReview && <><p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">{text.nextAction}</p><p className="mt-1 font-display text-2xl font-semibold leading-tight">{patient === "sara" ? pc.nextActionSara : result.action}</p>{patient !== "sara" && <p className="mt-2 text-sm text-muted-foreground">{showClinical ? text.clinicalFollowup : pc.clinicianSets}</p>}</>}{showConfirm && <Button variant="hero" size="action" className="mt-5 w-full" onClick={() => setConfirmed(true)}>{confirmed ? <><Check />{text.confirmed}</> : <>{text.confirm}<ArrowRight /></>}</Button>}<AskQuestion text={text} onSent={onAsk} /></div>
      </div>
    </section>
    <section className="rounded-2xl bg-paper p-5 ring-1 ring-border" aria-labelledby="how-decided"><h3 id="how-decided" className="font-display text-lg font-semibold">{pt.howDecided}</h3><dl className="mt-3 grid gap-3 text-sm sm:grid-cols-4">{[[pt.resultSource, pt.manualEntry], [pt.ai, pt.notUsed], [pt.decisionMaker, fill(pt.ruleEngine, { rule })], [pt.humanReview, review]].map(([k, v]) => <div key={k} className="rounded-xl bg-mist/50 p-3 ring-1 ring-border"><dt className="text-[11px] font-semibold uppercase text-muted-foreground">{k}</dt><dd className="mt-1 font-medium">{v}</dd></div>)}</dl></section>
    {next.available && <NextStepCard key={patient} type={next.type} fasting={submitted.test !== "hba1c"} onStatus={onStatus} onEvent={onNextStep} />}
    {samplePatients[patient].needsReview && !next.available && <section className="rounded-2xl border-s-4 border-operational bg-operational/5 p-5 text-sm text-muted-foreground">{nextText.waiting}</section>}
    <section className="grid items-start gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-2xl bg-paper p-6 ring-1 ring-border"><div className="flex items-center justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{text.manual}</p><h3 className="mt-1 font-display text-xl font-semibold">{text.enter}</h3></div><FlaskConical className="text-brand" /></div><div className="mt-5 grid gap-4 sm:grid-cols-[1.2fr_1fr]"><label className="text-xs font-medium">{text.test}<Select value={test} onValueChange={(v) => setTest(v as TestType)}><SelectTrigger className="mt-2 h-11 rounded-xl bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="hba1c">HbA1c (%)</SelectItem><SelectItem value="fpg">{text.fasting} (mmol/L)</SelectItem><SelectItem value="ogtt">{text.ogtt} (mmol/L)</SelectItem></SelectContent></Select></label><label className="text-xs font-medium">{text.value}<Input value={value} onChange={(e) => setValue(e.target.value)} type="number" step="0.1" className="mt-2 h-11 rounded-xl bg-background" /></label></div><Button className="mt-4 w-full rounded-xl" onClick={submitResult}><Activity />{text.evaluate}</Button><DemoControlNote demo={dm.demoResult} actual={dm.liveResult} className="mt-4" /><div className={`mt-4 rounded-xl p-4 ring-1 ${result.band === "referral" ? "bg-destructive/5 ring-destructive/20" : result.band === "prediabetes" ? "bg-operational/5 ring-operational/20" : "bg-success/5 ring-success/20"}`}><p className="text-sm font-semibold">{result.label}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{result.explanation}</p></div></div>
      <div className="rounded-2xl bg-paper p-6 ring-1 ring-border"><div className="flex items-center justify-between"><h3 className="font-display text-xl font-semibold">{text.why}</h3><span className="text-[11px] text-muted-foreground">{text.ruleExplained}</span></div><Thresholds value={submitted.value} test={submitted.test} text={text} /><div className="mt-5 rounded-xl bg-mist/50 p-4 text-sm leading-relaxed text-muted-foreground">{result.explanation} {text.safety}</div></div>
    </section>
    <section className="grid items-start gap-6 lg:grid-cols-2"><Timeline patient={patient} confirmed={confirmed} reviewerConfirmed={noorReviewed} text={text} clockStart={clockStart} />{remindersScheduled(patient, cOpts) && <Timing text={text} clockStart={clockStart} clinical={showClinical} />}</section>
    <section className="grid items-start gap-6 lg:grid-cols-2"><Notifications key={patient} text={text} kinds={kinds} reminderDays={confirmed ? [] : simDays.filter(d => d === 3 || d === 7).filter(() => remindersScheduled(patient, cOpts))} /><MedicinesOnRecord medicine={samplePatients[patient].medicine} /></section>
    <SimulateDays days={simDays} confirmed={confirmed} escalated={escalated && !confirmed} active={remindersScheduled(patient, cOpts)} onSimulate={onSimulate} />
    <PatientDetails text={text} onSaved={onSaveDetails} />
  </>;
}

function Notifications({ text, kinds, reminderDays }: { text: AppText; kinds: ("review" | "appointment" | "generic")[]; reminderDays: number[] }) {
  const pt = usePatientText(); const dm = useDemoText();
  const [read, setRead] = useState(false);
  const all = {
    review: { icon: <FileCheck2 className="size-4 text-clinical" />, title: pt.notifReview, desc: pt.notifReviewDesc },
    appointment: { icon: <CalendarCheck className="size-4 text-brand" />, title: pt.notifAppt, desc: pt.notifApptDesc },
    generic: { icon: <BellRing className="size-4 text-operational" />, title: pt.notifGeneric, desc: pt.notifGenericDesc },
  };
  const items = [...reminderDays.map(n => ({ icon: <BellRing className="size-4 text-operational" />, title: dm.notifReminder, desc: fill(dm.notifReminderDesc, { n }) })), ...kinds.map(k => all[k])];
  return <div className="rounded-2xl bg-paper p-6 ring-1 ring-border">
    <div className="flex items-center justify-between"><div><h3 className="font-display text-xl font-semibold">{text.notifications}</h3><p className="mt-1 text-xs text-muted-foreground">{text.notificationsDesc}</p></div>{items.length > 0 && !read && <Button variant="ghost" size="sm" onClick={() => setRead(true)}>{text.markRead}</Button>}</div>
    {items.length === 0 ? <p className="mt-5 text-sm text-muted-foreground">{pt.noNotifications}</p> : <ul className="mt-5 space-y-3">{items.map((n, i) => <li key={i} className="flex items-start gap-3 rounded-xl bg-mist/50 p-4 ring-1 ring-border"><span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-paper ring-1 ring-border">{n.icon}</span><div className="min-w-0"><p className="flex items-center gap-2 text-sm font-medium">{n.title}{!read && <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">{text.newBadge}</span>}</p><p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{n.desc}</p></div></li>)}</ul>}
  </div>;
}

// Patient samples on My case carry no medication; medication context lives only on Huda N. (reviewer case).
function MedicinesOnRecord({ medicine }: { medicine: string | null }) {
  const pt = usePatientText();
  return <div className="rounded-2xl bg-paper p-6 ring-1 ring-border">
    <h3 className="font-display text-xl font-semibold">{pt.medsOnRecord}</h3>
    <p className="mt-1 text-xs text-muted-foreground">{pt.medsNote}</p>
    {medicine ? <ul className="mt-4"><li className="rounded-xl bg-mist/50 px-4 py-3 text-sm font-medium ring-1 ring-border" dir="ltr">{medicine}</li></ul> : <p className="mt-4 rounded-xl bg-mist/50 px-4 py-3 text-sm text-muted-foreground ring-1 ring-border">{pt.noMedsOnRecord}</p>}
  </div>;
}

function SimulateDays({ days, confirmed, escalated, active, onSimulate }: { days: number[]; confirmed: boolean; escalated: boolean; active: boolean; onSimulate: (d: number) => void }) {
  const dm = useDemoText();
  const last = days.length ? Math.max(...days) : 0;
  return <section className="rounded-2xl border border-dashed border-operational/40 bg-operational/5 p-5">
    <h3 className="font-display text-lg font-semibold">{dm.simTitle}</h3>
    <p className="mt-1 text-xs text-muted-foreground">{dm.simDesc}</p>
    <div className="mt-3 flex flex-wrap items-center gap-2">{[3, 7, 14].map(d => <Button key={d} size="sm" variant={days.includes(d) ? "default" : "outline"} disabled={!active} onClick={() => onSimulate(d)}>{fill(dm.simDay, { n: d })}</Button>)}<Button size="sm" variant="ghost" onClick={() => onSimulate(0)}>{dm.simReset}</Button><span className="text-xs text-muted-foreground">{fill(dm.simCurrent, { n: last })}</span></div>
    <DemoControlNote demo={dm.demoTime} actual={dm.liveTime} className="mt-4" />
    {confirmed && active && <p className="mt-3 text-sm text-success">{dm.simStopped}</p>}
    {escalated && <p className="mt-3 text-sm text-operational">{dm.simEscalated}</p>}
  </section>;
}

function PatientDetails({ text, onSaved }: { text: AppText; onSaved: () => void }) {
  const pt = usePatientText();
  const empty = { name: "", age: "", eid: "", email: "", phone: "", hospitalId: "" };
  const [remind, setRemind] = useState(true);
  const [form, setForm] = useState(empty);
  const [noId, setNoId] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<typeof empty | null>(null);
  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setForm(f => ({ ...f, [k]: e.target.value })); setError(""); };
  const save = () => {
    if (!form.name.trim()) return setError(text.errPatientName);
    const ageNum = Number(form.age);
    if (!form.age.trim() || !Number.isInteger(ageNum) || ageNum < 1 || ageNum > 120) return setError(text.errAgePatient);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError(text.errEmail);
    if (!/^\+?[0-9\s-]{7,15}$/.test(form.phone.trim())) return setError(text.errPhone);
    if (form.eid.trim() && !validateEID(form.eid)) return setError(pt.errEid);
    setSaved({ ...form, eid: form.eid.trim() ? maskEID(form.eid) : "", hospitalId: noId ? "" : form.hospitalId });
    setForm(f => ({ ...f, eid: f.eid.trim() ? maskEID(f.eid) : "" }));
    onSaved();
  };
  const field = "mt-2 h-11 rounded-xl bg-background";
  return <section className="rounded-2xl bg-paper p-6 ring-1 ring-border">
    <div className="flex items-center justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{text.patient}</p><h3 className="mt-1 font-display text-xl font-semibold">{text.patientDetails}</h3><p className="mt-1 text-sm text-muted-foreground">{text.patientDetailsDesc}</p></div><UserRoundCheck className="text-brand" /></div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <label className="text-xs font-medium">{text.fullName}<Input className={field} value={form.name} onChange={set("name")} maxLength={100} /></label>
      <label className="text-xs font-medium">{text.patientAge}<Input className={field} type="number" min={1} max={120} value={form.age} onChange={set("age")} /></label>
      <div className="text-xs font-medium"><label>{text.emiratesId} <span className="font-normal text-muted-foreground">({pt.optional})</span><Input className={field} dir="ltr" value={form.eid} onChange={set("eid")} onFocus={() => { if (form.eid.includes("*")) setForm(f => ({ ...f, eid: "" })); }} maxLength={18} placeholder={pt.eidPlaceholder} autoComplete="off" /></label><p className="mt-1 font-normal text-operational">{pt.eidNote}</p></div>
      <label className="text-xs font-medium">{text.email}<Input className={field} type="email" value={form.email} onChange={set("email")} maxLength={255} /></label>
      <label className="text-xs font-medium">{text.phone}<Input className={field} type="tel" value={form.phone} onChange={set("phone")} maxLength={20} /></label>
      <div className="text-xs font-medium">
        <label>{text.hospitalIdPatient}<Input className={field} value={form.hospitalId} onChange={set("hospitalId")} maxLength={50} disabled={noId} /></label>
        <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" className="size-4 accent-[var(--brand)]" checked={noId} onChange={(e) => setNoId(e.target.checked)} />{text.noHospitalId}</label>
      </div>
      <div className="flex items-start justify-between gap-3 rounded-xl bg-mist/50 p-4 ring-1 ring-border sm:col-span-2"><div><p className="text-sm font-medium">{pt.reminderPref}</p><p className="mt-0.5 text-xs text-muted-foreground">{pt.reminderPrefNote}</p></div><Button type="button" size="sm" variant={remind ? "default" : "outline"} aria-pressed={remind} onClick={() => setRemind(r => !r)}>{remind ? pt.on : pt.off}</Button></div>
    </div>
    {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    <Button className="mt-4 rounded-xl" onClick={save}><Check />{text.saveDetails}</Button>
    {saved && <div className="mt-4 rounded-xl bg-success/5 p-4 text-sm ring-1 ring-success/20">
      <p className="font-semibold text-success">{text.detailsSaved}</p>
      <p className="mt-2 font-medium">{saved.name} · {text.patientAge}: {saved.age}</p>
      {saved.eid && <p className="text-muted-foreground">{text.emiratesId}: {saved.eid}</p>}
      <p className="text-muted-foreground">{saved.email} · {saved.phone}</p>
      <p className="text-muted-foreground">{pt.reminderPref}: {remind ? pt.on : pt.off}</p>
      {saved.hospitalId ? <p className="text-muted-foreground">{text.hospitalIdPatient}: {saved.hospitalId}</p> : <p className="mt-1 text-operational">{text.consultNote}</p>}
    </div>}
  </section>;
}

function Thresholds({ value, test, text }: { value: number; test: TestType; text: AppText }) {
  const bounds = test === "hba1c" ? ["5.7", "6.5"] : test === "fpg" ? ["5.6", "7.0"] : ["7.8", "11.1"];
  const rows = [[bounds[0], text.lowThreshold], [String(value), text.submittedResult], [bounds[1], text.referralThreshold]];
  return <div className="mt-5 space-y-3">{rows.map(([num, label], i) => <div key={i} className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${i === 1 ? "bg-brand/10 ring-brand/25" : "ring-border"}`}><div className={`grid size-11 shrink-0 place-items-center rounded-xl font-display font-semibold ${i === 1 ? "bg-brand text-brand-foreground" : "bg-mist"}`}>{num}</div><div className="min-w-0 flex-1"><p className={`text-sm font-medium ${i === 1 ? "text-brand" : ""}`}>{label}</p><p className="text-xs text-muted-foreground">{text.screeningRange}</p></div><span className={`size-2 rounded-full ${i === 1 ? "bg-operational" : "bg-border"}`} /></div>)}</div>;
}

export function timelineLabels(text: AppText, pt: (typeof _pc)["en"], pc: PatientCaseText, dm: DemoText): TimelineLabels {
  return { pc, dm, recorded: text.recorded, validated: text.validated, generated: text.generated, tlValidatedD: text.tlValidatedD, day: pt.day, tlReminder: pt.tlReminder, tlReminderD: text.tlReminderD, confirmed: text.confirmed, awaiting: text.awaiting, today: text.today, pending: text.pending, remindersStopped: pt.remindersStopped, tlAwaitingD: pt.tlAwaitingD, tlNextAppt: text.tlNextAppt, tlNextApptD: pt.tlNextApptD, clockStarted: pt.clockStarted, clockNotStarted: pt.clockNotStarted };
}
function Timeline({ patient, confirmed, reviewerConfirmed, text, clockStart }: { patient: PatientId; confirmed: boolean; reviewerConfirmed: boolean; text: AppText; clockStart: Date | null }) {
  const pt = usePatientText();
  const pc = usePatientCaseText();
  const dm = useDemoText();
  const items = timelineFor(patient, timelineLabels(text, pt, pc, dm), { confirmed, reviewerConfirmed, clockStart });
  const dot = (color: string) => color === "brand" ? "bg-brand ring-brand/15" : color === "accent" ? "bg-accent ring-accent/20" : color === "success" ? "bg-success ring-success/15" : "bg-operational ring-operational/15";
  return <div className="rounded-2xl bg-paper p-6 ring-1 ring-border"><div className="flex items-center justify-between"><h3 className="font-display text-xl font-semibold">{text.timelineTitle}</h3><span className="text-xs text-muted-foreground">{text.fullTimeline}</span></div><ol className="mt-5 space-y-1">{items.map(([title, meta, color, detail], i) => <li key={i} className="flex gap-4"><div className="flex flex-col items-center"><span className={`mt-1 size-3 rounded-full ring-4 ${dot(color)}`} />{i < items.length - 1 && <span className="w-px flex-1 bg-border" />}</div><div className={i < items.length - 1 ? "pb-5" : ""}><p className="text-sm font-medium">{title}</p><p className="text-xs text-muted-foreground">{meta}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p></div></li>)}</ol></div>;
}
function Timing({ text, clockStart, clinical }: { text: AppText; clockStart: Date | null; clinical: boolean }) { const pt = usePatientText(); const pc = usePatientCaseText(); return <div className="rounded-2xl bg-paper p-6 ring-1 ring-border"><h3 className="font-display text-xl font-semibold">{text.twoClocks}</h3><div className="mt-5 grid gap-4 sm:grid-cols-2"><div className="rounded-xl border-l-4 border-clinical bg-clinical/5 p-4"><Stethoscope className="size-5 text-clinical" /><p className="mt-3 text-xs font-semibold uppercase text-clinical">{text.clinicalTiming}</p>{clinical ? <><p className="mt-1 font-display text-lg font-semibold">{text.months}</p><p className="mt-1 text-xs text-muted-foreground">{text.clinicalDesc}</p><p className="mt-2 text-xs text-clinical">{pt.clockAnchor}</p><p className="mt-1 text-xs font-medium">{clockStart ? fill(pt.clockStarted, { date: clockStart.toLocaleDateString() }) : pt.clockNotStarted}</p></> : <><p className="mt-1 font-display text-lg font-semibold">{pc.clinicianSetsShort}</p><p className="mt-1 text-xs text-muted-foreground">{pc.clinicianSets}</p></>}</div><div className="rounded-xl border-l-4 border-operational bg-operational/5 p-4"><BellRing className="size-5 text-operational" /><p className="mt-3 text-xs font-semibold uppercase text-operational">{text.operationalTiming}</p><p className="mt-1 font-display text-lg font-semibold">{text.days}</p><p className="mt-1 text-xs text-muted-foreground">{text.operationalDesc}</p></div></div></div> }
function ReviewerView({ text, state, onReview }: { text: AppText; state: ReviewState; onReview: (id: PatientId, reason: WorkReason, d: { decision: Decision; pathway?: PathwayId | undefined; note?: string | undefined; reviewer: string }) => void }) {
  const { lang } = useLang();
  const dm = useDemoText();
  const ct = useCaseText();
  const [tab, setTab] = useState<"needs" | "all" | "reviewed">("needs");
  const [query, setQuery] = useState("");
  const [openCase, setOpenCase] = useState<PatientId | null>(null);
  const worklist = needsReviewTab(state); const reviewedRows = reviewedTab(state); const allRows = allCasesTab(state);
  const locale = { en: "en-AE", ar: "ar-AE", hi: "hi-IN", ur: "ur-PK", tl: "fil-PH", ml: "ml-IN" }[lang];
  const reasonText = (r: EngineReason) => r === "noHistory" ? dm.reasonNoHistory : r === "medication" ? dm.reasonMedication : r === "day14" ? dm.reasonDay14 : r === "referral" ? dm.erReferral : r === "normal" ? dm.erNormal : dm.erPre;
  const progText = (p: Progress) => ({ awaitingReviewer: dm.progAwaiting, reviewerConfirmed: dm.progConfirmed, reviewerAdjusted: dm.progAdjusted, escalated: dm.progEscalated, notEscalated: dm.progNotEscalated })[p];
  const current = worklist.find(c => c.id === openCase);
  if (openCase && current) return <><DemoControlNote demo={dm.demoReview} actual={dm.liveReview} /><CaseDetail text={text} id={current.id} reasonKey={current.reason} reason={reasonText(current.reason)} status={text.contextReview} caseCode={samplePatients[current.id].caseId} onBack={() => setOpenCase(null)} onAction={d => { onReview(current.id, current.reason, d); setOpenCase(null); setTab("reviewed"); }} /></>;
  const q = query.toLocaleLowerCase();
  const hit = (id: PatientId, extra: string) => `${sampleNames[lang][id]} ${samplePatients[id].caseId} ${extra}`.toLocaleLowerCase().includes(q);
  const nameCell = (id: PatientId) => <div><p className="font-medium">{sampleNames[lang][id]}</p><p className="text-xs text-muted-foreground">{text.syntheticCase} {samplePatients[id].caseId}</p></div>;
  const chip = (label: string, warn: boolean) => <span className={`w-fit rounded-full px-2.5 py-1 text-xs ${warn ? "bg-operational/10 text-operational" : "bg-success/10 text-success"}`}>{label}</span>;
  const head = (cols: string, labels: string[]) => <div className={`hidden gap-4 border-b border-border px-5 py-3 text-xs font-semibold uppercase text-muted-foreground md:grid ${cols}`}>{labels.map(l => <span key={l}>{l}</span>)}</div>;
  const tabs = [["needs", dm.tabNeeds, worklist.length], ["all", dm.tabAll, allRows.length], ["reviewed", dm.tabReviewed, reviewedRows.length]] as const;
  return <><section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase text-brand">{text.humanReview}</p><h2 className="mt-2 font-display text-3xl font-semibold">{text.judgmentTitle}</h2><p className="mt-2 max-w-2xl text-sm text-muted-foreground">{text.judgmentDesc}</p></div><div className="relative w-full sm:w-72"><Search className="absolute start-3 top-3 size-4 text-muted-foreground" /><Input className="h-10 rounded-xl bg-paper ps-9" placeholder={text.searchCases} value={query} onChange={e => setQuery(e.target.value)} /></div></section>
  <div role="tablist" className="flex flex-wrap gap-2">{tabs.map(([k, label, n]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ring-1 transition-colors ${tab === k ? "bg-brand text-brand-foreground ring-brand" : "bg-paper text-muted-foreground ring-border hover:text-foreground"}`}>{label}<span className={`rounded-full px-1.5 text-[11px] ${tab === k ? "bg-brand-foreground/20" : "bg-mist"}`}>{n}</span></button>)}</div>
  <DemoControlNote demo={dm.demoReview} actual={dm.liveReview} />
  <section className="overflow-hidden rounded-2xl bg-paper ring-1 ring-border">
  {tab === "needs" && <>{head("grid-cols-[1fr_1.2fr_0.7fr_1fr_0.7fr]", [text.caseHeader, text.reasonHeader, text.statusHeader, dm.nextStepHeader, text.actionHeader])}
    {worklist.filter(c => hit(c.id, reasonText(c.reason))).length === 0 && <p className="p-5 text-sm text-muted-foreground">{worklist.length === 0 ? dm.worklistEmpty : text.noCases}</p>}
    {worklist.filter(c => hit(c.id, reasonText(c.reason))).map(c => <div key={c.id} className="grid gap-3 border-b border-border p-5 last:border-0 md:grid-cols-[1fr_1.2fr_0.7fr_1fr_0.7fr] md:items-center">{nameCell(c.id)}<p className="text-sm text-muted-foreground">{reasonText(c.reason)}</p>{chip(c.reason === "day14" ? text.unresponsive : text.contextReview, true)}<span className="text-sm">{progText("awaitingReviewer")}</span><Button variant="ink" size="sm" onClick={() => setOpenCase(c.id)}><FileCheck2 />{text.reviewBtn}</Button></div>)}</>}
  {tab === "all" && <>{head("grid-cols-[1fr_0.6fr_1.6fr_0.8fr]", [text.caseHeader, dm.colReviewNeeded, dm.colEngineReason, dm.nextStepHeader])}
    {allRows.filter(r => hit(r.id, reasonText(r.reason))).map(r => <div key={r.id} className="grid gap-3 border-b border-border p-5 last:border-0 md:grid-cols-[1fr_0.6fr_1.6fr_0.8fr] md:items-center">{nameCell(r.id)}{chip(r.reviewNeeded ? dm.yes : dm.no, r.reviewNeeded)}<p className="text-sm text-muted-foreground">{reasonText(r.reason)}</p><span className="text-sm">{progText(r.progress)}</span></div>)}</>}
  {tab === "reviewed" && <>{head("grid-cols-[1fr_0.9fr_0.9fr_0.9fr_0.8fr]", [text.caseHeader, dm.colDecision, dm.colTime, dm.colReviewer, dm.nextStepHeader])}
    {reviewedRows.length === 0 && <p className="p-5 text-sm text-muted-foreground">{dm.reviewedEmpty}</p>}
    {reviewedRows.filter(r => hit(r.id, r.reviewer)).map(r => <div key={r.id} className="grid gap-3 border-b border-border p-5 last:border-0 md:grid-cols-[1fr_0.9fr_0.9fr_0.9fr_0.8fr] md:items-center">{nameCell(r.id)}<span className="text-sm font-medium">{ct.decisions[r.decision]}</span><time className="text-sm text-muted-foreground" dateTime={r.at}>{new Date(r.at).toLocaleString(locale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</time><span className="text-sm">{r.reviewer}</span>{chip(progText(r.decision === "confirm" ? "reviewerConfirmed" : r.decision === "adjust" ? "reviewerAdjusted" : "escalated"), r.decision === "escalate")}</div>)}</>}
  </section>
  <p className="text-xs text-muted-foreground">{dm.sampleNote}</p>
  <div className="rounded-xl bg-mist/50 p-4 text-xs text-muted-foreground"><strong className="text-foreground">{text.medicationContext}</strong> {text.medicationCaution}</div></>;
}
function AuditTrail({ text, events, patient: initial, reviewed, confirmedCases }: { text: AppText; events: AuditEvent[]; patient: PatientId; reviewed: PatientId[]; confirmedCases: PatientId[] }) {
  const pt = usePatientText(); const pc = usePatientCaseText(); const dm = useDemoText();
  const [patient, setPatient] = useState<PatientId>(initial);
  const { lang } = useLang();
  const locale = { en: "en-AE", ar: "ar-AE", hi: "hi-IN", ur: "ur-PK", tl: "fil-PH", ml: "ml-IN" }[lang];
  const caseLabel = `${sampleNames[lang][patient]} · ${text.caseId} #${samplePatients[patient].caseId}`;
  const baseLabels = timelineLabels(text, pt, pc, dm);
  const sample = timelineFor(patient, { ...baseLabels, pc: { ...baseLabels.pc, tlRecordedD: dm.auditRecordedD } }, { confirmed: confirmedCases.includes(patient), reviewerConfirmed: reviewed.includes(patient) }).map(([title, meta, , detail]) => ({ time: meta, title, detail: `${caseLabel} — ${detail}`, actor: text.auditActorSystem }));
  const ct = useCaseText();
  const nt = useNextStepText();
  const actionTitle = (action: AuditAction) => action === "auditLocation" ? nt.auditLocation : action === "auditBooked" ? nt.auditBooked : action === "auditCompleted" ? nt.auditCompleted : action === "auditEscalated" ? dm.auditEscalated : action === "auditReminder" ? dm.auditReminder : action === "auditQuestion" ? dm.auditQuestionSent : text[action as Exclude<AuditAction,"auditLocation"|"auditBooked"|"auditCompleted"|"auditReminder"|"auditEscalated">];
  const detailFor = (e: AuditEvent) => e.result
    ? fill(text.auditDetailResult, { test: testName(e.result.test, text), value: e.result.value.toFixed(1), unit: e.result.test === "hba1c" ? "%" : " mmol/L", band: e.result.band === "referral" ? text.bandReferral : e.result.band === "prediabetes" ? text.bandPre : text.bandNormal }) + ` · ${e.result.rule}`
    : e.action === "auditReminder" ? `${fill(dm.auditReminder, { n: e.detail })} · ${e.caseName ? `${sampleNames[lang][e.caseName]} #${samplePatients[e.caseName].caseId}` : ""}`
    : e.caseName && e.reason ? fill(text.auditDetailReview, { name: sampleNames[lang][e.caseName], reason: e.reason === "noHistory" ? dm.reasonNoHistory : e.reason === "medication" ? dm.reasonMedication : dm.reasonDay14 }) + ` · #${samplePatients[e.caseName].caseId}` + (e.decision ? ` · ${ct.decisions[e.decision]}` : "") + (e.pathway ? ` → ${ct.pathways[e.pathway]}` : "") + (e.note ? ` · ${ct.noteLine}: "${e.note}"` : "")
    : e.detail ? fill(text.auditDetailItem, { name: e.detail }) : e.caseName ? `${sampleNames[lang][e.caseName]} · ${text.caseId} #${samplePatients[e.caseName].caseId}` : `${text.caseId} #${samplePatients[initial].caseId}`;
  return <>
    <section><p className="text-xs font-semibold uppercase text-brand">{text.audit}</p><h2 className="mt-2 font-display text-3xl font-semibold">{text.auditTitle}</h2><p className="mt-2 max-w-2xl text-sm text-muted-foreground">{text.auditDesc}</p></section>
    <section className="max-w-3xl space-y-7">
      <div><h3 className="mb-3 text-sm font-semibold">{text.auditSession}</h3><div className="divide-y divide-border border-y border-border">{events.length === 0 ? <p className="py-6 text-sm text-muted-foreground">{text.auditEmpty}</p> : events.map(e => <div key={e.id} className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr] sm:gap-5"><time className="text-xs text-muted-foreground" dateTime={e.at.toISOString()}>{e.at.toLocaleString(locale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" })}</time><div><p className="text-sm font-semibold">{(e.action === "auditReminder" ? dm.notifReminder : actionTitle(e.action))}</p><p className="mt-1 text-sm text-muted-foreground">{detailFor(e)}</p><p className="mt-2 text-xs text-brand">{text[e.actor]}{e.reviewer ? ` · ${e.reviewer}` : ""}</p></div></div>)}</div></div>
       <div><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-semibold">{dm.caseEvents}</h3><label className="flex items-center gap-2 text-xs font-medium">{dm.caseSelect}<Select value={patient} onValueChange={v => setPatient(v as PatientId)}><SelectTrigger className="h-9 w-48 rounded-xl bg-paper"><SelectValue /></SelectTrigger><SelectContent>{caseOrder.map(id => <SelectItem key={id} value={id}>{sampleNames[lang][id]} · {samplePatients[id].caseId}</SelectItem>)}</SelectContent></Select></label></div><DemoControlNote demo={dm.demoAudit} actual={dm.liveAudit} className="mb-4" /><div className="divide-y divide-border border-y border-border">{sample.map((entry, i) => <div key={i} className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr] sm:gap-5"><span className="text-xs text-muted-foreground">{entry.time}</span><div><p className="text-sm font-semibold">{entry.title}</p><p className="mt-1 text-sm text-muted-foreground">{entry.detail}</p><p className="mt-2 text-xs text-brand">{entry.actor}</p></div></div>)}</div></div>
      <p className="border-s-2 border-operational ps-4 text-xs leading-relaxed text-muted-foreground">{text.auditNoStorage}</p>
      <section aria-labelledby="sec-title" className="rounded-2xl bg-paper p-6 ring-1 ring-border"><h3 id="sec-title" className="font-display text-xl font-semibold">{dm.secTitle}</h3><div className="mt-4 grid gap-6 sm:grid-cols-2"><div><h4 className="text-sm font-semibold text-success">{dm.secTrue}</h4><ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-muted-foreground">{[dm.secT1, dm.secT2, dm.secT3, dm.secT4].map(x => <li key={x}>{x}</li>)}</ul></div><div><h4 className="text-sm font-semibold text-operational">{dm.secReq}</h4><ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-muted-foreground">{[dm.secR1, dm.secR2, dm.secR3, dm.secR4, dm.secR5, dm.secR6, dm.secR7].map(x => <li key={x}>{x}</li>)}</ul></div></div><p className="mt-4 rounded-xl bg-mist/50 p-3 text-sm">{dm.secModel}</p></section>
    </section>
  </>;
}
function PopulationView({ text }: { text: AppText }) {
  const dm = useDemoText();
  const f = funnelCounts(); const a = attentionCounts(); const loss = largestLoss(f);
  const label = { screened: dm.fScreened, resulted: dm.fResulted, flagged: dm.fFlagged, confirmed: dm.fConfirmed, location: dm.fLocation, booked: dm.fBooked, completed: dm.fCompleted };
  const pct = (n: number, d: number) => d ? Math.round(n / d * 100) : 0;
  const screening = funnelStages.slice(0, 3); const follow = funnelStages.slice(3);
  const bar = (k: (typeof funnelStages)[number], base: number, sub: string, color: string) => <div key={k}><div className="flex items-baseline justify-between text-sm"><span className="font-medium">{label[k]}</span><span className="font-display text-lg font-semibold">{f[k].toLocaleString()} <span className="text-xs font-normal text-muted-foreground">{sub}</span></span></div><div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-mist"><div className={`h-full rounded-full ${color}`} style={{ width: `${pct(f[k], base)}%` }} /></div></div>;
  return <>
    <section><p className="text-xs font-semibold uppercase text-brand">{text.cohort}</p><h2 className="mt-2 font-display text-3xl font-semibold">{text.dropTitle}</h2><p className="mt-2 max-w-2xl text-sm text-muted-foreground">{dm.funnelDef}</p><p className="mt-1 max-w-2xl text-sm text-muted-foreground">{dm.cohortLabel} {dm.sampleNote}</p></section>
    <section className="rounded-2xl border-s-4 border-operational bg-operational/5 p-5"><p className="font-display text-lg font-semibold">{fill(dm.largestLoss, { from: label[loss.from], to: label[loss.to], n: loss.n.toLocaleString(), p: loss.p, why: loss.from === "resulted" ? dm.lossNotFlagged : dm.lossGeneric })}</p></section>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{funnelStages.map((k, i) => <div key={k} className="rounded-2xl bg-paper p-5 ring-1 ring-border"><div className="flex items-center justify-between"><span className={`grid size-9 place-items-center rounded-xl ${i >= 3 ? "bg-clinical/10 text-clinical" : "bg-brand/10 text-brand"}`}>{i === 0 ? <Users /> : i === 1 ? <FlaskConical /> : i === 2 ? <LayoutDashboard /> : i === 4 ? <MapPin /> : <CalendarCheck />}</span><span className="text-xs text-muted-foreground">{i < 3 ? fill(dm.ofScreened, { p: pct(f[k], f.screened) }) : fill(dm.ofFlagged, { p: pct(f[k], f.flagged) })}</span></div><p className="mt-5 font-display text-3xl font-semibold">{f[k].toLocaleString()}</p><p className="mt-1 text-sm text-muted-foreground">{label[k]}</p></div>)}</section>
    <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]"><div className="space-y-6 rounded-2xl bg-paper p-6 ring-1 ring-border"><div><h3 className="font-display text-xl font-semibold">{dm.screeningFunnel}</h3><div className="mt-4 space-y-4">{screening.map(k => bar(k, f.screened, fill(dm.ofScreened, { p: pct(f[k], f.screened) }), "bg-brand"))}</div></div><div><h3 className="font-display text-xl font-semibold">{dm.followFunnel}</h3><div className="mt-4 space-y-4">{follow.map(k => bar(k, f.flagged, fill(dm.ofFlagged, { p: pct(f[k], f.flagged) }), "bg-clinical"))}</div></div><p className="text-[11px] text-muted-foreground">{dm.cohortLabel}</p></div>
    <div className="rounded-2xl bg-paper p-6 ring-1 ring-border"><h3 className="font-display text-xl font-semibold">{dm.attention}</h3><div className="mt-5 space-y-4"><Metric label={dm.aNotConfirmed} value={String(a.notConfirmed)} tone="operational" /><Metric label={dm.aNotBooked} value={String(a.notBooked)} tone="destructive" /><Metric label={dm.aNotCompleted} value={String(a.notCompleted)} tone="operational" /></div><div className="mt-6 rounded-xl bg-mist/50 p-4 text-xs leading-relaxed text-muted-foreground">{dm.cohortLabel}</div></div></section>
    <p className="max-w-3xl border-s-2 border-clinical ps-4 text-sm leading-relaxed text-muted-foreground">{dm.mohap}</p>
  </>;
}
function Metric({ label, value, tone }: { label: string; value: string; tone: string }) { return <div className="flex items-center justify-between border-b border-border pb-3 last:border-0"><span className="text-sm text-muted-foreground">{label}</span><span className={`font-display text-xl font-semibold ${tone === "success" ? "text-success" : tone === "destructive" ? "text-destructive" : "text-operational"}`}>{value}</span></div> }

function AskQuestion({ text, onSent }: { text: AppText; onSent: (q: string) => void }) {
  const pt = usePatientText(); const dm = useDemoText();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const send = () => {
    const r = submitQuestion(q);
    if (!r.ok) return setErr(r.reason === "empty" ? text.askEmpty : dm.askEid);
    onSent(r.text); setSent(true); setQ(""); setErr("");
  };
  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setSent(false); setErr(""); } }}>
      <DialogTrigger asChild><Button variant="ghost" className="mt-2 w-full"><CircleHelp />{text.question}</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{pt.askTitle}</DialogTitle><DialogDescription>{pt.askDesc}</DialogDescription></DialogHeader>
        <p role="note" className="flex items-start gap-2 rounded-xl border-s-4 border-operational bg-operational/5 p-3 text-sm font-medium"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-operational" />{pt.askBoundary}</p>
        {sent ? <p className="flex items-start gap-2 rounded-xl bg-secondary p-3 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-brand" />{text.askSent}</p> : <>
          <Textarea value={q} maxLength={500} rows={4} onChange={(e) => setQ(e.target.value)} placeholder={text.askPlaceholder} aria-label={pt.askTitle} />
          {err && <p className="text-sm text-destructive">{err}</p>}
        </>}
        <DialogFooter>
          {!sent && <><Button variant="outline" onClick={() => setOpen(false)}>{text.cancel}</Button><Button onClick={send}>{text.askSend}</Button></>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
