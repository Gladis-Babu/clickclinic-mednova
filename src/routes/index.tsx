import { useVerify } from "@/lib/verify-copy";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Clock, Globe, LogIn, MapPin, Network, ScrollText, Search, ShieldCheck, Stethoscope, User, Workflow } from "lucide-react";
import { useHomeText } from "@/lib/home-copy";
import { LanguageSwitcher, useSite } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClickClinic — Catch Prediabetes Early, Follow Through" },
      { name: "description", content: "Why early diabetes screening matters, and how ClickClinic turns results into clear follow-up." },
      { property: "og:title", content: "ClickClinic — Catch Prediabetes Early" },
      { property: "og:description", content: "Diabetes facts and a prototype that turns screening results into clear follow-up." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Intro,
});


export function SiteNav() {
  const t = useSite();
  const v = useVerify();
  return (
    <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5">
      <Link to="/" className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded-md bg-primary font-display font-semibold text-primary-foreground">C</span><span className="font-display text-lg font-semibold">ClickClinic</span></Link>
      <div className="flex flex-wrap items-center justify-end gap-1 text-sm max-sm:w-full max-sm:justify-between">
        <LanguageSwitcher />
        <Link to="/engine" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 font-medium text-foreground/80 transition-all hover:bg-secondary hover:text-primary hover:shadow-sm"><Workflow className="size-4 text-primary" aria-hidden /> {t.navHow}</Link>
        <Link to="/verify" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 font-medium text-foreground/80 transition-all hover:bg-secondary hover:text-primary hover:shadow-sm"><ScrollText className="size-4 text-primary" aria-hidden /> {v.navVerify}</Link>
        <Link to="/login" className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-2 font-medium text-primary transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-sm"><LogIn className="size-4" aria-hidden /> {t.navLogin}</Link>
      </div>
    </nav>
  );
}

function Intro() {
  const t = useSite();
  const h = useHomeText();
  const statValues = ["59.1%", "22.4%", "25.9%", "12.5%"];
  const icons = [ClipboardList, Search, ShieldCheck, Clock, MapPin, Globe, Network];
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-5 pb-16">
        <section className="rounded-3xl border border-primary bg-primary px-6 py-14 text-primary-foreground shadow-sm sm:px-12">
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-6xl">“{t.quote}”</h1>
          <p className="mt-4 font-display text-lg font-medium text-primary-foreground/90 sm:text-xl">{t.quoteBy}</p>
          <p className="mt-6 max-w-2xl text-base text-primary-foreground/85 sm:text-lg">{h.heroLead}</p>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold">{h.whyTitle}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statValues.map((v, i) => (
              <div key={v} className="rounded-2xl border border-border bg-card p-5">
                <p className="font-display text-4xl font-semibold text-primary">{v}</p>
                <p className="mt-2 text-sm text-muted-foreground">{h.stats[i]}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{h.statSource}</p>
          <p className="mt-6 max-w-3xl rounded-2xl border-s-4 border-primary bg-card p-5 text-sm leading-relaxed">{h.campaign}</p>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold">{h.checkTitle}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {h.checks.map(([title, body], i) => {
              const Icon = icons[i] ?? ClipboardList;
              return (
                <div key={title} className="rounded-2xl border border-border bg-card p-5">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary"><Icon className="size-5" aria-hidden /></span>
                  <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold">{h.waysTitle}</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {([
              ["patient", h.patientTitle, h.patientDesc, h.patientBullets, h.patientBtn, User],
              ["doctor", h.workerTitle, h.workerDesc, h.workerBullets, h.workerBtn, Stethoscope],
            ] as const).map(([role, title, desc, bullets, btn, Icon]) => (
              <div key={role} className="flex flex-col rounded-3xl border border-border bg-card p-7">
                <Icon className="size-8 text-primary" aria-hidden />
                <h3 className="mt-4 font-display text-2xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {bullets.map(b => <li key={b} className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" />{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <p className="mt-12 text-xs text-muted-foreground">{t.disclaimer}</p>
      </main>
    </div>
  );
}
