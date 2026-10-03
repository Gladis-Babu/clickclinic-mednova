import { useState } from "react";
import { AlertTriangle, ArrowLeft, Check, ChevronDown, ClipboardList, SlidersHorizontal, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { sampleNames, type AppText } from "@/lib/app-copy";
import { useLang } from "@/lib/i18n";
import { useCaseText, type Decision, type PathwayId } from "@/lib/case-copy";
import { useDemoText } from "@/lib/demo-copy";
import { usePatientCaseText, samplePatients, rulesFor, unitFor, type SamplePatientId, type WorkReason } from "@/lib/patient-cases";

type Props = {
  text: AppText; id: SamplePatientId; reasonKey: WorkReason; reason: string; status: string; caseCode: string;
  onBack: () => void;
  onAction: (d: { decision: Decision; pathway?: PathwayId | undefined; note?: string | undefined; reviewer: string }) => void;
};

export function CaseDetail({ text, id, reasonKey, reason, status, caseCode, onBack, onAction }: Props) {
  const { lang } = useLang();
  const ct = useCaseText();
  const dm = useDemoText(); const pc = usePatientCaseText();
  const sc = samplePatients[id];
  const c = ct.cases[reasonKey === "noHistory" ? "noor" : reasonKey === "medication" ? "huda" : "sara"];
  const findings = [
    { label: dm.lblResult, value: `${pc[sc.test]} ${sc.value.toFixed(1)}${unitFor(sc.test)}` },
    { label: dm.lblHistory, value: sc.history ? dm.yes : dm.none },
    { label: dm.lblMedicine, value: sc.medicine ?? dm.none },
    { label: dm.lblRules, value: rulesFor(id).join(" + ") },
    ...(reasonKey === "day14" ? [{ label: dm.lblReminders, value: dm.remindersNoReply }] : []),
  ];
  const proposed = sc.rule === "RULE-002" ? ct.pathways.p2 : sc.rule === "RULE-000" ? ct.pathways.p4 : ct.pathways.p1;
  const reviewer = sampleNames[lang].layla;
  const [note, setNote] = useState("");
  const [last, setLast] = useState<{ decision: Decision; pathway?: PathwayId | undefined } | null>(null);

  const act = (decision: Decision, pathway?: PathwayId) => {
    const trimmed = note.trim().slice(0, 500);
    onAction({ decision, pathway, note: trimmed || undefined, reviewer });
    setLast({ decision, pathway });
    setNote("");
  };

  return <>
    <Button variant="ghost" size="sm" className="w-fit" onClick={onBack}><ArrowLeft className="rtl:rotate-180" />{ct.back}</Button>
    <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase text-brand">{ct.caseDetail}</p>
        <h2 className="mt-2 font-display text-3xl font-semibold">{sampleNames[lang][id]}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{text.syntheticCase} {caseCode}</p>
      </div>
      <span className="w-fit rounded-full bg-operational/10 px-3 py-1 text-xs text-operational">{status}</span>
    </section>

    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl bg-paper p-5 ring-1 ring-border">
        <h3 className="flex items-center gap-2 text-sm font-semibold"><AlertTriangle className="size-4 text-operational" />{ct.reasonTitle}</h3>
        <p className="mt-2 text-sm">{reason}</p>
        <h3 className="mt-5 flex items-center gap-2 text-sm font-semibold"><Stethoscope className="size-4 text-brand" />{ct.whyTitle}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.why}</p>
      </div>
      <div className="rounded-2xl bg-paper p-5 ring-1 ring-border">
        <h3 className="flex items-center gap-2 text-sm font-semibold"><ClipboardList className="size-4 text-brand" />{ct.foundTitle}</h3>
        <dl className="mt-3 divide-y divide-border">
          {findings.map(f => <div key={f.label} className="grid gap-1 py-2.5 sm:grid-cols-[11rem_1fr] sm:gap-4"><dt className="text-xs font-medium text-muted-foreground">{f.label}</dt><dd className="text-sm">{f.value}</dd></div>)}
        </dl>
        <p className="mt-3 rounded-xl bg-primary/5 p-3 text-xs"><strong>{ct.proposedTitle}:</strong> {proposed}</p>
      </div>
    </section>

    <section className="rounded-2xl bg-paper p-5 ring-1 ring-border">
      <Label htmlFor="clinical-note">{ct.noteLabel}</Label>
      <Textarea id="clinical-note" className="mt-2" maxLength={500} placeholder={ct.notePlaceholder} value={note} onChange={e => setNote(e.target.value)} />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => act("confirm")}><Check />{ct.confirm}</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="outline"><SlidersHorizontal />{ct.adjust}<ChevronDown /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>{ct.choosePathway}</DropdownMenuLabel>
            {(Object.keys(ct.pathways) as PathwayId[]).map(p => <DropdownMenuItem key={p} onSelect={() => act("adjust", p)}>{ct.pathways[p]}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="destructive" onClick={() => act("escalate")}><AlertTriangle />{ct.escalate}</Button>
      </div>
      {last && <p role="status" className="mt-4 text-sm text-success">{ct.saved}: {ct.decisions[last.decision]}{last.pathway ? ` → ${ct.pathways[last.pathway]}` : ""} · {ct.reviewer}: {reviewer}</p>}
    </section>
  </>;
}
