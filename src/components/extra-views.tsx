import React, { useState } from "react";
import { BellRing, Pill, Stethoscope, Trash2, GraduationCap, Briefcase, FileCheck2, Upload, Building2, IdCard, Mail, Phone, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sampleNames, useAppText } from "@/lib/app-copy";
import { useLang } from "@/lib/i18n";
import { useDemoText } from "@/lib/demo-copy";
import { useCredText, type CredText } from "@/lib/credential-copy";
import { checklist, reviewAction, statusAfterUpload, submitForVerification, type CredAction, type CredStatus } from "@/lib/credentials";
import { fill } from "@/lib/i18n";
import { DemoControlNote } from "@/components/demo-control-note";

type Reminder = { id: number; title: string; date: string; time: string; kind: "medication" | "visit" };

export function RemindersView({ onActivity }: { onActivity?: (action: "auditReminderAdded" | "auditReminderRemoved", detail: string) => void }) {
  const t = useAppText();
  const dm = useDemoText();
  const { lang } = useLang();
  const [items, setItems] = useState<Reminder[]>([
    { id: 1, title: "", date: "2026-09-26", time: "20:00", kind: "medication" },
    { id: 2, title: "", date: "2026-12-22", time: "10:30", kind: "visit" },
  ]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [kind, setKind] = useState<Reminder["kind"]>("medication");
  const add = () => {
    if (!title.trim() || !date) return;
    setItems([...items, { id: Date.now(), title: title.trim().slice(0, 120), date, time, kind }].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)));
    onActivity?.("auditReminderAdded", title.trim().slice(0, 120));
    setTitle(""); setDate("");
  };
  return (
    <>
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-brand">{t.reminderEyebrow}</p>
        <h2 className="mt-2 font-display text-3xl font-semibold">{t.reminderTitle}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t.reminderDesc}</p>
      </section>
      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl bg-paper p-6 ring-1 ring-border">
          <h3 className="font-display text-xl font-semibold">{t.addReminder}</h3>
          <div className="mt-4 space-y-3">
            <div className="flex gap-2">
              {(["medication", "visit"] as const).map(k => (
                <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium ring-1 transition-colors ${kind === k ? "bg-primary text-primary-foreground ring-primary" : "bg-secondary text-foreground ring-border hover:bg-secondary/80"}`}>{k === "medication" ? t.medication : t.nextVisit}</button>
              ))}
            </div>
            <div><Label htmlFor="rt">{t.what}</Label><Input id="rt" maxLength={120} value={title} onChange={e => setTitle(e.target.value)} placeholder={t.whatExample} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label htmlFor="rd">{t.date}</Label><Input id="rd" type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
              <div><Label htmlFor="rtm">{t.time}</Label><Input id="rtm" type="time" value={time} onChange={e => setTime(e.target.value)} /></div>
            </div>
            <Button className="w-full" onClick={add}><BellRing /> {t.addReminder}</Button>
            <DemoControlNote demo={dm.demoReminder} actual={dm.liveReminder} />
          </div>
        </div>
        <div className="rounded-2xl bg-paper p-6 ring-1 ring-border">
          <h3 className="font-display text-xl font-semibold">{t.upcoming}</h3>
          <div className="mt-4 divide-y divide-border">
            {items.length === 0 && <p className="py-4 text-sm text-muted-foreground">{t.noReminders}</p>}
            {items.map(r => (
              <div key={r.id} className="flex items-center gap-3 py-3">
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${r.kind === "medication" ? "bg-operational/10 text-operational" : "bg-clinical/10 text-clinical"}`}>{r.kind === "medication" ? <Pill className="size-5" /> : <Stethoscope className="size-5" />}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{r.title || (r.id === 1 ? t.sampleMedicine : t.sampleVisit)}</p><p className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString(lang === "tl" ? "fil-PH" : lang === "ml" ? "ml-IN" : lang === "hi" ? "hi-IN" : lang === "ur" ? "ur-PK" : lang === "ar" ? "ar-AE" : "en-AE", { dateStyle: "medium" })} · {r.time}</p></div>
                 <Button variant="ghost" size="icon" aria-label={t.deleteReminder} onClick={() => { setItems(items.filter(i => i.id !== r.id)); onActivity?.("auditReminderRemoved", r.title || (r.id === 1 ? t.sampleMedicine : t.sampleVisit)); }}><Trash2 /></Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}


// Fictional care team with a human-in-the-loop credential review workflow.
// Nothing here contacts a licensing authority; only a reviewer action changes status. Session-only.
type HistKind = "created" | "added" | "submitted" | "uploaded" | "edited" | CredAction;
type CareDoctor = {
  key: string; nameKey?: "layla" | "omar"; name: string; specialty: string; hospital: string; role: string;
  license: string; authority: string; licenseExpiry: string;
  certName: string; certId: string; certOrg: string; certIssue: string; certExpiry: string;
  status: CredStatus; file?: { name: string; url: string; type: string } | undefined;
  history: { at: string; kind: HistKind; detail?: string | undefined }[]; verifiedAt?: string; reviewer?: string; demo: boolean;
};
const emptyDoctor = { name: "", specialty: "", hospital: "", role: "", license: "", authority: "", licenseExpiry: "", certName: "", certId: "", certOrg: "", certIssue: "", certExpiry: "" };
type DocForm = typeof emptyDoctor;
const optionalFields: (keyof DocForm)[] = [];
const now = () => new Date().toISOString();

function seedDoctors(): CareDoctor[] {
  const base = { role: "", authority: "", licenseExpiry: "2027-12-31", certIssue: "2024-01-15", certExpiry: "2027-12-31", status: "not_verified" as CredStatus, demo: true };
  return [
    { ...base, key: "layla", nameKey: "layla", name: "", specialty: "", hospital: "", license: "DEMO-LIC-001", certName: "", certId: "DEMO-CERT-FM-0001", certOrg: "", history: [{ at: "2026-09-01T09:00:00", kind: "created" }] },
    { ...base, key: "omar", nameKey: "omar", name: "", specialty: "", hospital: "", license: "DEMO-LIC-002", certName: "", certId: "DEMO-CERT-EN-0002", certOrg: "", history: [{ at: "2026-09-01T09:00:00", kind: "created" }] },
  ];
}

export function DoctorsView({ onSelect }: { onSelect?: (name: string) => void } = {}) {
  const { lang } = useLang();
  const dm = useDemoText();
  const ct = useCredText();
  const [docs, setDocs] = useState<CareDoctor[]>(seedDoctors);
  const [sel, setSel] = useState<string>("layla");
  const [open, setOpen] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<DocForm>(emptyDoctor);
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState("");
  const locale = { en: "en-AE", ar: "ar-AE", hi: "hi-IN", ur: "ur-PK", tl: "fil-PH", ml: "ml-IN" }[lang];
  const date = (d: string) => d ? new Date(d.length === 10 ? `${d}T00:00:00` : d).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" }) : "—";
  const dateTime = (d: string) => new Date(d).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });
  // Localize synthetic demo values at render time.
  const view = (d: CareDoctor): CareDoctor => !d.nameKey ? d : {
    ...d, name: sampleNames[lang][d.nameKey], role: dm.roleValue, authority: dm.authorityDoH,
    specialty: d.nameKey === "layla" ? dm.specFamily : dm.specEndo, hospital: d.nameKey === "layla" ? dm.hospA : dm.hospB,
    certName: d.certName || (d.nameKey === "layla" ? dm.certFamily : dm.certEndo), certOrg: d.certOrg || (d.nameKey === "layla" ? ct.orgFamily : ct.orgEndo),
  };
  const update = (key: string, fn: (d: CareDoctor) => CareDoctor) => setDocs(ds => ds.map(d => d.key === key ? fn(d) : d));
  const log = (d: CareDoctor, kind: HistKind, detail?: string): CareDoctor => ({ ...d, history: [...d.history, { at: now(), kind, detail }] });
  const statusLabel = (s: CredStatus) => ct[`st_${s}`];
  const statusCls = (s: CredStatus) => s === "verified" ? "bg-clinical/10 text-clinical" : s === "rejected" ? "bg-destructive/10 text-destructive" : s === "pending" ? "bg-brand/10 text-brand" : "bg-operational/10 text-operational";
  const Status = ({ s }: { s: CredStatus }) => <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCls(s)}`}>{statusLabel(s)}</span>;
  const fields: [keyof DocForm, string, string?][] = [["name", dm.lblFullName], ["specialty", dm.lblSpecialty], ["hospital", dm.lblHospital], ["role", dm.lblRole], ["license", dm.lblLicense], ["authority", dm.lblAuthority], ["licenseExpiry", dm.lblLicenseExpiry, "date"], ["certName", ct.lblCertName], ["certId", ct.lblCertId], ["certOrg", ct.lblCertOrg], ["certIssue", ct.lblCertIssue, "date"], ["certExpiry", ct.lblCertExpiry, "date"]];
  const toFile = (f: File | null) => f ? { name: f.name.slice(0, 120), url: URL.createObjectURL(f), type: f.type } : undefined;
  const submitNew = () => {
    if ((Object.keys(form) as (keyof DocForm)[]).some(k => !optionalFields.includes(k) && !form[k].trim())) return setErr(dm.errRequired);
    const f = toFile(file);
    let d: CareDoctor = { ...form, key: `new-${Date.now()}`, status: "not_verified", demo: false, file: f, history: [{ at: now(), kind: "added" }] };
    if (f) d = log({ ...d, status: statusAfterUpload(d.status) }, "uploaded", f.name);
    d = log({ ...d, status: submitForVerification(d.status) }, "submitted");
    setDocs(ds => [...ds, d]); setSel(d.key); setForm(emptyDoctor); setFile(null); setErr(""); setAdding(false);
  };
  const row = (label: string, value: React.ReactNode) => <div className="grid grid-cols-[10rem_1fr] gap-2 py-1.5"><dt className="text-muted-foreground">{label}</dt><dd>{value}</dd></div>;
  const selName = (() => { const r = docs.find(x => x.key === sel); return r ? view(r).name : ""; })();
  React.useEffect(() => { if (selName) onSelect?.(selName); }, [selName]);
  const credExpiry = (d: CareDoctor) => [d.licenseExpiry, d.certExpiry].filter(Boolean).sort()[0] ?? "";

  return <>
    <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="font-display text-3xl font-semibold">{dm.careTeamTitle}</h2><p className="mt-2 text-sm text-muted-foreground">{dm.careTeamDesc}</p></div>{!adding && <Button onClick={() => setAdding(true)}>{dm.addDoctor}</Button>}</section>
    <p className="rounded-xl border-s-4 border-operational bg-operational/5 p-4 text-sm">{ct.disclaimer}</p>
    {adding && <section className="rounded-2xl bg-paper p-5 ring-1 ring-border">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(([k, label, type]) => <div key={k} className="space-y-1.5"><Label htmlFor={`doc-${k}`}>{label}</Label><Input id={`doc-${k}`} type={type ?? "text"} maxLength={120} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} /></div>)}
        <div className="space-y-1.5"><Label htmlFor="doc-upload">{ct.lblUpload}</Label><Input id="doc-upload" type="file" accept="image/*,application/pdf" onChange={e => setFile(e.target.files?.[0] ?? null)} /></div>
        <div className="space-y-1.5"><Label>{dm.lblVerification}</Label><p className="flex h-10 items-center rounded-md bg-mist px-3 text-sm">{ct.st_not_verified} → {ct.st_pending}</p></div>
      </div>
      {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
      <div className="mt-4 flex gap-2"><Button onClick={submitNew}>{ct.submit}</Button><Button variant="outline" onClick={() => { setAdding(false); setErr(""); setFile(null); }}>{dm.cancelDoctor}</Button></div>
    </section>}
    <section className="space-y-3 rounded-xl bg-paper p-3 ring-1 ring-border"><div className="flex flex-wrap items-center gap-2">{docs.map(raw => { const d = view(raw); return <Button key={d.key} size="sm" variant={sel === d.key ? "default" : "outline"} aria-pressed={sel === d.key} onClick={() => setSel(d.key)}>{d.name}</Button>; })}</div><DemoControlNote demo={dm.demoDoctor} actual={dm.liveDoctor} /></section>
    <ul className="grid gap-4">{docs.filter(raw => raw.key === sel).map(raw => { const d = view(raw); return <li key={d.key} className="rounded-2xl bg-paper p-5 ring-1 ring-border">
      <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-brand/10 text-brand"><Stethoscope className="size-5" /></span><p className="font-display text-lg font-semibold">{d.name}</p></div>
        <div className="flex shrink-0 flex-col items-end gap-1">{d.demo && <span className="rounded-full bg-mist px-2 py-0.5 text-[11px] text-muted-foreground">{dm.demoBadge}</span>}{d.status === "verified" && <span className="rounded-full bg-mist px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">{ct.demoVerif}</span>}</div></div>
      <dl className="mt-4 text-sm">{row(dm.lblSpecialty, d.specialty)}{row(dm.lblHospital, d.hospital)}{row(dm.lblRole, d.role)}{row(dm.lblVerification, <Status s={d.status} />)}
        {d.status === "verified" && <>{row(ct.verifiedOn, d.verifiedAt ? dateTime(d.verifiedAt) : "—")}{row(ct.reviewer, d.reviewer ?? ct.reviewerName)}{row(ct.credExpiry, date(credExpiry(d)))}</>}</dl>
      {d.status === "verified" && <p className="mt-2 text-xs text-muted-foreground">{ct.verifiedNote}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" aria-expanded={open === d.key} onClick={() => setOpen(o => o === d.key ? null : d.key)}>{open === d.key ? dm.hideCreds : dm.viewCreds}</Button>
        <Button variant="outline" size="sm" aria-expanded={reviewing === d.key} onClick={() => setReviewing(o => o === d.key ? null : d.key)}>{reviewing === d.key ? ct.closeReview : ct.openReview}</Button>
        {(d.status === "not_verified" || d.status === "rejected") && <Button size="sm" onClick={() => update(d.key, x => log({ ...x, status: submitForVerification(x.status) }, "submitted"))}>{ct.submit}</Button>}
      </div>
      <DemoControlNote demo={dm.demoCredential} actual={dm.liveCredential} className="mt-4" />
      {open === d.key && <dl className="mt-3 border-t border-border pt-3 text-sm">{row(dm.lblLicense, d.license)}{row(dm.lblAuthority, d.authority)}{row(dm.lblLicenseExpiry, date(d.licenseExpiry))}{row(ct.lblCertName, d.certName)}{row(ct.lblCertId, d.certId)}{row(ct.lblCertOrg, d.certOrg)}{row(ct.lblCertIssue, date(d.certIssue))}{row(ct.lblCertExpiry, date(d.certExpiry))}{row(dm.lblVerification, <Status s={d.status} />)}</dl>}
      {reviewing === d.key && <CertReview d={d} ct={ct} date={date} dateTime={dateTime}
        onUpload={f => update(d.key, x => { const nf = toFile(f); if (!nf) return x; return log({ ...x, file: nf, status: statusAfterUpload(x.status) }, "uploaded", nf.name); })}
        onSave={vals => update(d.key, x => log({ ...x, ...vals }, "edited"))}
        onAction={a => update(d.key, x => { const s = reviewAction(x.status, a); return log({ ...x, status: s, ...(s === "verified" ? { verifiedAt: now(), reviewer: ct.reviewerName } : {}) }, a); })} />}
    </li>; })}</ul>
  </>;
}

export function CertReview({ d, ct, date, dateTime, onUpload, onSave, onAction }: { d: CareDoctor; ct: CredText; date: (s: string) => string; dateTime: (s: string) => string; onUpload: (f: File) => void; onSave: (v: Pick<CareDoctor, "certId" | "certName" | "certOrg" | "certIssue" | "certExpiry">) => void; onAction: (a: CredAction) => void }) {
  const [v, setV] = useState({ certId: d.certId, certName: d.certName, certOrg: d.certOrg, certIssue: d.certIssue, certExpiry: d.certExpiry });
  const items = checklist({ ...d, hasFile: !!d.file });
  const f: [keyof typeof v, string, string?][] = [["certId", ct.lblCertId], ["certName", ct.lblCertName], ["certOrg", ct.lblCertOrg], ["certIssue", ct.lblCertIssue, "date"], ["certExpiry", ct.lblCertExpiry, "date"]];
  const histText = (h: CareDoctor["history"][number]) => h.kind === "uploaded" ? fill(ct.ev_uploaded, { f: h.detail ?? "" }) : ct[`ev_${h.kind}`];
  return <div className="mt-4 space-y-4 border-t border-border pt-4 text-sm">
    <h4 className="font-display text-base font-semibold">{ct.reviewTitle}</h4>
    <div className="rounded-xl bg-mist p-3">
      {d.file ? (d.file.type.startsWith("image/") ? <img src={d.file.url} alt={d.file.name} className="max-h-56 rounded-lg object-contain" /> : <a href={d.file.url} target="_blank" rel="noreferrer" className="underline">{ct.openDoc}: {d.file.name}</a>) : <p className="text-muted-foreground">{ct.noDoc}</p>}
      <div className="mt-2"><Label htmlFor={`up-${d.key}`}>{ct.lblUpload}</Label><Input id={`up-${d.key}`} type="file" accept="image/*,application/pdf" onChange={e => { const x = e.target.files?.[0]; if (x) onUpload(x); }} /></div>
    </div>
    <p className="text-xs text-muted-foreground">{ct.manualNote}</p>
    <div className="grid gap-3 sm:grid-cols-2">{f.map(([k, label, type]) => <div key={k} className="space-y-1"><Label htmlFor={`rv-${d.key}-${k}`}>{label}</Label><Input id={`rv-${d.key}-${k}`} type={type ?? "text"} maxLength={120} value={v[k]} onChange={e => setV(s => ({ ...s, [k]: e.target.value }))} /></div>)}</div>
    <Button variant="outline" size="sm" onClick={() => onSave(v)}>{ct.saveDetails}</Button>
    <div><h5 className="font-semibold">{ct.checklistTitle}</h5><ul className="mt-2 space-y-1">{items.map(i => <li key={i.key} className="flex gap-2"><span aria-hidden className={i.ok ? "text-clinical" : "text-muted-foreground"}>{i.ok ? "✓" : "○"}</span><span>{ct[`ck_${i.key}`]}{i.key === "external" && <span className="block text-xs font-medium text-destructive">{ct.ckExternalNote}</span>}</span></li>)}</ul></div>
    <p className="text-xs text-muted-foreground">{ct.onlyReviewer}</p>
    <div className="flex flex-wrap gap-2">
      <Button size="sm" disabled={d.status !== "pending"} onClick={() => onAction("verify")}>{ct.markVerified}</Button>
      <Button size="sm" variant="outline" disabled={d.status !== "pending"} onClick={() => onAction("request")}>{ct.requestReview}</Button>
      <Button size="sm" variant="outline" disabled={d.status !== "pending"} onClick={() => onAction("reject")}>{ct.reject}</Button>
    </div>
    <div><h5 className="font-semibold">{ct.historyTitle}</h5><ol className="mt-2 space-y-1">{d.history.map((h, i) => <li key={i} className="flex gap-3"><span className="shrink-0 text-xs text-muted-foreground">{h.at.startsWith("2026-09-01T09") ? date(h.at) : dateTime(h.at)}</span><span>{histText(h)}</span></li>)}</ol></div>
  </div>;
}
