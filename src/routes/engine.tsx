import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, RotateCcw, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "./index";
import { fill, useLang, useSite } from "@/lib/i18n";
import { sampleNames } from "@/lib/app-copy";
import { useVerify } from "@/lib/verify-copy";

export const Route = createFileRoute("/engine")({
  head: () => ({
    meta: [
      { title: "Demo Run — How ClickClinic Works" },
      { name: "description", content: "See how a sample test result travels from lab value to a follow-up plan, then run the actual engine test." },
      { property: "og:title", content: "Demo Run — How ClickClinic Works" },
      { property: "og:description", content: "A step-by-step demo of how a sugar test becomes a follow-up plan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Engine,
});

import { samplePatients, caseOrder } from "@/lib/patient-cases";
import { useDemoText, type DemoText } from "@/lib/demo-copy";
import { DemoControlNote } from "@/components/demo-control-note";
// Demo Run reads every sample from the shared case source.
export const samples = caseOrder.map(name => { const c = samplePatients[name]; const hb = c.test === "hba1c"; return { name, test: c.test, value: c.value, unit: hb ? "%" : "mmol/L", low: hb ? 5.7 : 5.6, high: hb ? 6.5 : 7.0, history: c.history, rule: c.rule, reviewRule: c.reviewRule, medicine: c.medicine }; });

function stepsFor(s: typeof samples[number], t: ReturnType<typeof useSite>, name: string, v2: ReturnType<typeof useVerify>, dm: DemoText) {
  const band0 = s.value >= s.high ? t.bRef : s.value >= s.low ? t.bPre : t.bNorm;
  const band = band0.replace(/\s*\(RULE-\d+\)/, "");
  const v = { test: t[s.test], value: s.value.toFixed(1), unit: s.unit, name: name.replace(/\.$/, ""), low: s.low, high: s.high };
  return [
    { t: t.t1, d: fill(t.d1, v) },
    { t: v2.histMissingT, d: s.history ? v2.histOkD : v2.histMissingD },
    { t: t.t2, d: fill(t.d2, v) },
    { t: t.t3, d: s.reviewRule ? `${band} · ${s.rule} + ${s.reviewRule}${s.medicine ? ` · ${dm.medCheck}` : ""}` : `${band} · ${s.rule}` },
    { t: t.t4, d: s.rule === "RULE-002" ? dm.engReferralD4 : s.rule === "RULE-001" ? t.d4a : t.d4b },
    { t: t.t5, d: s.reviewRule ? dm.engWaitD5 : t.d5 },
    { t: t.t6, d: s.reviewRule ? fill(dm.engWaitD6, { rule: s.reviewRule }) : t.d6 },
  ];
}

function Engine() {
  const t = useSite();
  const v2 = useVerify();
  const dm = useDemoText();
  const { lang } = useLang();
  const [pick, setPick] = useState(0);
  const [runId, setRunId] = useState(0);
  const [shown, setShown] = useState(0);
  const selected = samples[pick] ?? samples[0];
  const running = runId > 0;
  const steps = selected ? stepsFor(selected, t, sampleNames[lang][selected.name], v2, dm).map((x, i) => ({ ...x, t: x.t.replace(/^\d+\.\s*/, "") ? `${i + 1}. ${x.t.replace(/^\d+\.\s*/, "")}` : x.t })) : [];
  useEffect(() => {
    if (!running || shown >= steps.length) return;
    const id = setTimeout(() => setShown(s => s + 1), shown === 0 ? 300 : 900);
    return () => clearTimeout(id);
  }, [running, shown, steps.length]);
  if (!selected) return null;
  const startRun = () => { setShown(0); setRunId(r => r + 1); };
  const done = running && shown >= steps.length;
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-4xl px-5 pb-20">
        {/* Hero */}
        <section className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-brand p-8 text-primary-foreground shadow-lg shadow-primary/20 sm:p-10">
          <div aria-hidden className="pointer-events-none absolute -end-16 -top-16 size-56 rounded-full bg-primary-foreground/10" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 end-24 size-40 rounded-full bg-primary-foreground/5" />
          <div className="relative">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground/80">
              <Stethoscope className="size-4" aria-hidden /> {t.engEyebrow}
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">{t.engTitle}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-foreground/85 sm:text-base">{t.engLead}</p>
          </div>
        </section>

        {/* Patient picker + run */}
        <section className="mt-8">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {samples.map((s, i) => {
              const active = pick === i;
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => { setPick(i); setRunId(0); setShown(0); }}
                  className={`rounded-2xl border p-4 text-start transition-all ${active
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10 ring-1 ring-primary"
                    : "border-border bg-card hover:border-primary/40 hover:shadow-sm"}`}
                >
                  <p className={`font-display text-sm font-semibold ${active ? "text-primary" : "text-foreground"}`}>{sampleNames[lang][s.name]}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t[s.test]} {s.value.toFixed(1)}{s.unit === "%" ? "%" : ` ${s.unit}`}</p>{s.medicine && <p className="text-[11px] text-muted-foreground">{s.medicine}</p>}
                  {!s.history && <span className="mt-2 inline-block rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">{v2.noHistory}</span>}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
            <Button asChild size="lg" variant="outline" className="rounded-xl px-6">
              <Link to="/verify">{t.seeTest}</Link>
            </Button>
            <Button size="lg" onClick={startRun} className="rounded-xl px-6 shadow-md shadow-primary/20">
              {done ? <RotateCcw /> : <Play />} {t.run}
            </Button>
          </div>
          <DemoControlNote demo={dm.demoEngine} actual={dm.liveEngine} className="mt-4" />
        </section>

        {/* Step walkthrough */}
        <section className="relative mt-8">
          <ol className="space-y-3">
            {steps.slice(0, shown).map((s, i) => (
              <li key={s.t} className="relative flex items-start gap-4">
                <span
                  className={`z-10 grid size-10 shrink-0 place-items-center rounded-xl border font-display text-sm font-semibold ${i === shown - 1 && !done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}
                >
                  {i + 1}
                </span>
                <div className={`flex-1 rounded-2xl border p-4 sm:p-5 ${i === shown - 1 && !done ? "border-primary/50 bg-primary/5" : "border-border bg-card"}`}>
                  <p className="font-display font-semibold text-foreground">{s.t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <p className="mt-10 rounded-xl border border-border/60 bg-card/60 px-4 py-3 text-xs text-muted-foreground">{t.engFooter}</p>
      </main>
    </div>
  );
}
