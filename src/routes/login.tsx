import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteNav } from "./index";
import { useDemoText } from "@/lib/demo-copy";
import { DemoControlNote } from "@/components/demo-control-note";
import { useHomeText } from "@/lib/home-copy";
import { ArrowRight, Stethoscope, User } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Choose a View — ClickClinic" },
      { name: "description", content: "Choose the ClickClinic patient or healthcare-worker prototype view." },
      { property: "og:title", content: "Choose a View — ClickClinic" },
      { property: "og:description", content: "Sign in to follow your screening results and reminders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});


function Login() {
  const dm = useDemoText();
  const h = useHomeText();
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-4xl px-5 py-10">
        <section>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{h.loginWelcome}</h1>
          <p className="mt-2 text-muted-foreground">{h.loginChoose}</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {([
              ["patient", h.boxPatient, h.boxPatientDesc, h.boxPatientBtn, User],
              ["doctor", h.boxWorker, h.boxWorkerDesc, h.boxWorkerBtn, Stethoscope],
            ] as const).map(([role, title, desc, label, Icon]) => (
              <div key={role} className="flex flex-col rounded-2xl border border-border bg-card p-7">
                <Icon className="size-8 text-primary" aria-hidden />
                <h2 className="mt-4 font-display text-2xl font-semibold">{title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{desc}</p>
                <Button asChild className="mt-6 w-full" size="lg">
                  <Link to="/app" search={role === "doctor" ? { role: "doctor" as const } : {}}>{label}<ArrowRight className="size-4 rtl:rotate-180" /></Link>
                </Button>
              </div>
            ))}
          </div>
          <DemoControlNote demo={dm.demoLogin} actual={dm.liveLogin} className="mt-6" />
          <p className="mt-4 text-sm text-muted-foreground">{h.loginReal}</p>
        </section>
      </main>
    </div>
  );
}
