import { Presentation, ShieldCheck } from "lucide-react";
import { useDemoText } from "@/lib/demo-copy";

export function DemoControlNote({ demo, actual, className = "" }: { demo: string; actual: string; className?: string }) {
  const text = useDemoText();
  return (
    <aside role="note" className={`grid gap-3 rounded-xl border border-dashed border-brand/30 bg-brand/5 p-3 text-xs sm:grid-cols-2 ${className}`}>
      <p className="flex items-start gap-2 leading-relaxed text-muted-foreground">
        <Presentation className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
        <span><strong className="text-foreground">{text.demoNoticeLabel}:</strong> {demo}</span>
      </p>
      <p className="flex items-start gap-2 leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-clinical" aria-hidden />
        <span><strong className="text-foreground">{text.liveNoticeLabel}:</strong> {actual}</span>
      </p>
    </aside>
  );
}