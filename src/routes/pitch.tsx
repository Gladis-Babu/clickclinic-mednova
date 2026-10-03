import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  ArrowLeft, ArrowRight, BellRing, ClipboardCheck, Compass, Globe, HeartPulse, Hospital,
  ImageIcon, Lock, MessageSquareText, QrCode, ShieldCheck, UserCheck, FileText, FlaskConical,
} from "lucide-react";
import patientImg from "@/assets/patient-view-preview.webp";
import workerImg from "@/assets/worker-view-preview.webp";

// The pitch deck stays available in the editor preview (id-preview--* hosts and
// localhost) but returns a 404 once the site is published, so judges never see it.
const isAllowedHost = (host: string) => {
  const h = host.toLowerCase();
  return h.startsWith("id-preview--") || h.startsWith("localhost") || h.startsWith("127.");
};

const checkPitchHost = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { getRequest } = await import("@tanstack/react-start/server");
    const request = getRequest();
    if (request) return isAllowedHost(request.headers.get("host") ?? "");
  } catch {
    // No request scope (e.g. during build) — allow.
  }
  return true;
});

async function pitchAllowedHere(): Promise<boolean> {
  if (typeof window !== "undefined") return isAllowedHost(window.location.host);
  return checkPitchHost();
}

export const Route = createFileRoute("/pitch")({
  beforeLoad: async () => {
    if (!(await pitchAllowedHere())) throw notFound();
  },
  head: () => ({
    meta: [
      { title: "ClickClinic Pitch — Closing the gap after screening" },
      { name: "description", content: "10-slide hackathon pitch deck for ClickClinic, the UAE screening follow-through prototype." },
      { property: "og:title", content: "ClickClinic Pitch Deck" },
      { property: "og:description", content: "How ClickClinic turns a screening result into completed care in the UAE." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pitch,
});

// Locale-keyed copy (English only for now; other locales fall back to en).
const copy = {
  en: {
    back: "Back", next: "Next",
    title: "ClickClinic", titleSub: "Closing the gap after screening",
    team: "Team [YOUR TEAM NAME]", event: "[HACKATHON NAME] · Med Hack Prototype",
    problemK: "The problem", problemT: "Screening finds people at risk. Many never follow through.",
    problem: ["A result arrives — often with no clear meaning", "No one says what to do next, or where", "Without follow-up, risk quietly becomes disease"],
    uaeK: "UAE context", uaeT: "The risk is already here",
    uae: [["59.1%", "of adults insufficiently active"], ["22.4%", "living with obesity"], ["25.9%", "with high blood pressure"], ["12.5%", "with elevated glucose"]],
    uaeSrc: "Source: UAE National Health and Nutrition Survey 2024–2025, MOHAP",
    gapK: "The gap", gapT: "Detection isn't the problem — what happens after is.",
    gap: [["150,000+", "people screened by MOHAP's National Prediabetes and Diabetes Screening Campaign (2023)"], ["26.5%", "of high-risk participants found prediabetic"]],
    solK: "Our solution", solT: "Explain. Recommend. Follow through.",
    sol: [["Explain", "The HbA1c result in plain, simple language"], ["Recommend", "The right next step and the right place"], ["Follow through", "Reminders until care is actually completed"]],
    howK: "How it works", howT: "From result to completed care",
    how: ["Screening result", "Clear explanation", "Recommended step", "Human review if unclear", "Booked & completed"],
    demoK: "Live demo", demoT: "See it in action",
    demo: ["Patient view — result explained, next step chosen", "Healthcare worker view — review and follow-up", "Replace with your screenshot"],
    demoBtn: "Open the prototype",
    safeK: "Safety & trust", safeT: "Built to be trusted",
    safe: [["Human in the loop", "Unclear cases go to a clinician for review"], ["Synthetic data only", "No real patient records in this prototype"], ["Privacy-first", "Minimal data, no stored location"]],
    nextK: "Impact & next steps", nextT: "Where ClickClinic goes next",
    nextItems: [["Arabic & English", "Care that speaks the patient's language"], ["Care summaries", "Shared with clinics, not lost in paperwork"], ["Clinic integration & pilot", "Connect to providers, then test with real users"]],
    thanksT: "Thank you", thanksSub: "Let's close the gap — together.",
    members: ["[Member name 1]", "[Member name 2]", "[Member name 3]", "[Member name 4]"],
    qr: "QR code here",
  },
};

function Kicker({ children }: { children: ReactNode }) {
  return <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{children}</p>;
}
function H({ children }: { children: ReactNode }) {
  return <h2 className="mt-3 max-w-4xl font-display text-3xl font-semibold leading-tight sm:text-5xl">{children}</h2>;
}

function Pitch() {
  const t = copy.en;
  const [i, setI] = useState(0);
  const slides: ReactNode[] = [
    <div key="1" className="flex h-full flex-col justify-center rounded-3xl bg-primary px-8 py-12 text-primary-foreground sm:px-16">
      <HeartPulse className="size-12" aria-hidden />
      <h1 className="mt-6 font-display text-5xl font-semibold sm:text-7xl">{t.title}</h1>
      <p className="mt-4 text-2xl text-primary-foreground/90 sm:text-3xl">{t.titleSub}</p>
      <p className="mt-10 text-lg">{t.team}</p>
      <p className="text-primary-foreground/80">{t.event}</p>
    </div>,
    <div key="2"><Kicker>{t.problemK}</Kicker><H>{t.problemT}</H>
      <ul className="mt-10 space-y-5 text-xl">{t.problem.map(p => <li key={p} className="flex gap-4"><span className="mt-2.5 size-2.5 shrink-0 rounded-full bg-primary" />{p}</li>)}</ul></div>,
    <div key="3"><Kicker>{t.uaeK}</Kicker><H>{t.uaeT}</H>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{t.uae.map(([v, l]) => (
        <div key={v} className="rounded-2xl border border-border bg-card p-6"><p className="font-display text-5xl font-semibold text-primary">{v}</p><p className="mt-2 text-muted-foreground">{l}</p></div>))}</div>
      <p className="mt-6 text-sm text-muted-foreground">{t.uaeSrc}</p></div>,
    <div key="4"><Kicker>{t.gapK}</Kicker><H>{t.gapT}</H>
      <div className="mt-10 grid gap-5 md:grid-cols-2">{t.gap.map(([v, l]) => (
        <div key={v} className="rounded-3xl bg-primary p-8 text-primary-foreground"><p className="font-display text-6xl font-semibold">{v}</p><p className="mt-3 text-lg text-primary-foreground/90">{l}</p></div>))}</div></div>,
    <div key="5"><Kicker>{t.solK}</Kicker><H>{t.solT}</H>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{t.sol.map(([a, b], k) => { const I = [MessageSquareText, Compass, BellRing][k] ?? Compass; return (
        <div key={a} className="rounded-2xl border border-border bg-card p-7"><span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary"><I className="size-7" aria-hidden /></span><h3 className="mt-5 font-display text-2xl font-semibold">{a}</h3><p className="mt-2 text-muted-foreground">{b}</p></div>); })}</div></div>,
    <div key="6"><Kicker>{t.howK}</Kicker><H>{t.howT}</H>
      <ol className="mt-10 grid gap-3 md:grid-cols-5">{t.how.map((s, k) => { const I = [FlaskConical, FileText, Compass, UserCheck, ClipboardCheck][k] ?? Compass; return (
        <li key={s} className="relative rounded-2xl border border-border bg-card p-5"><span className="text-sm font-semibold text-primary">0{k + 1}</span><I className="mt-3 size-7 text-primary" aria-hidden /><p className="mt-3 font-medium">{s}</p></li>); })}</ol></div>,
    <div key="7"><Kicker>{t.demoK}</Kicker><H>{t.demoT}</H>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[patientImg, workerImg, null].map((src, k) => (
          <figure key={k} className="overflow-hidden rounded-2xl border border-border bg-card">
            {src ? <img src={src} alt={t.demo[k]} className="aspect-video w-full object-cover object-top" /> :
              <div className="grid aspect-video place-items-center bg-muted text-muted-foreground"><ImageIcon className="size-10" aria-hidden /></div>}
            <figcaption className="p-4 text-sm">{t.demo[k]}</figcaption>
          </figure>))}
      </div>
      <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90">{t.demoBtn} <ArrowRight className="size-4" /></Link></div>,
    <div key="8"><Kicker>{t.safeK}</Kicker><H>{t.safeT}</H>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{t.safe.map(([a, b], k) => { const I = [UserCheck, ShieldCheck, Lock][k] ?? Compass; return (
        <div key={a} className="rounded-2xl border border-border bg-card p-7"><I className="size-9 text-primary" aria-hidden /><h3 className="mt-5 font-display text-2xl font-semibold">{a}</h3><p className="mt-2 text-muted-foreground">{b}</p></div>); })}</div></div>,
    <div key="9"><Kicker>{t.nextK}</Kicker><H>{t.nextT}</H>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{t.nextItems.map(([a, b], k) => { const I = [Globe, FileText, Hospital][k] ?? Compass; return (
        <div key={a} className="rounded-2xl border border-border bg-card p-7"><I className="size-9 text-primary" aria-hidden /><h3 className="mt-5 font-display text-2xl font-semibold">{a}</h3><p className="mt-2 text-muted-foreground">{b}</p></div>); })}</div></div>,
    <div key="10" className="grid h-full items-center gap-10 rounded-3xl bg-primary px-8 py-12 text-primary-foreground sm:px-16 md:grid-cols-[1fr_auto]">
      <div><h2 className="font-display text-5xl font-semibold sm:text-7xl">{t.thanksT}</h2><p className="mt-4 text-2xl text-primary-foreground/90">{t.thanksSub}</p>
        <ul className="mt-8 grid gap-2 text-lg sm:grid-cols-2">{t.members.map(m => <li key={m}>{m}</li>)}</ul></div>
      <div className="grid size-48 place-items-center rounded-2xl border-2 border-dashed border-primary-foreground/60 text-center"><div><QrCode className="mx-auto size-12" aria-hidden /><p className="mt-2 text-sm">{t.qr}</p></div></div>
    </div>,
  ];
  const n = slides.length;
  const go = useCallback((d: number) => setI(x => Math.min(n - 1, Math.max(0, x + d))), [n]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [go]);
  const [sx, setSx] = useState<number | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background"
      onTouchStart={e => setSx(e.touches[0]?.clientX ?? null)}
      onTouchEnd={e => { if (sx !== null) { const d = (e.changedTouches[0]?.clientX ?? sx) - sx; if (Math.abs(d) > 50) go(d < 0 ? 1 : -1); setSx(null); } }}>
      <main className="print:hidden mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-8 sm:px-10">{slides[i]}</main>
      <footer className="print:hidden mx-auto flex w-full max-w-6xl items-center justify-between px-5 pb-6 sm:px-10">
        <button onClick={() => go(-1)} disabled={i === 0} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 font-medium disabled:opacity-40"><ArrowLeft className="size-4" />{t.back}</button>
        <span className="font-display font-semibold text-primary">{i + 1}/{n}</span>
        <button onClick={() => go(1)} disabled={i === n - 1} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground disabled:opacity-40">{t.next}<ArrowRight className="size-4" /></button>
      </footer>
      {/* Print-only: every slide stacked, one per landscape page */}
      <div className="pitch-print" aria-hidden="true">
        {slides.map((s, k) => <div className="pitch-page" key={`print-${k}`}>{s}</div>)}
      </div>
    </div>
  );
}
