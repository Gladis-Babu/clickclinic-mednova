// Pure, deterministic screening rules shared by the engine test and system verification pages.
export type Test = "hba1c" | "fpg" | "ogtt";
export type Rule = "RULE-000" | "RULE-001" | "RULE-002";

export const THRESHOLDS: Record<Test, { low: number; high: number; min: number; max: number; unit: string }> = {
  hba1c: { low: 5.7, high: 6.5, min: 3, max: 20, unit: "%" },
  fpg: { low: 5.6, high: 7.0, min: 1, max: 40, unit: "mmol/L" },
  ogtt: { low: 7.8, high: 11.1, min: 1, max: 50, unit: "mmol/L" },
};

export type EngineInput = { test: Test; value: number; priorHistory: boolean; onMedication?: boolean };
export type EngineOutput =
  | { valid: false }
  | { valid: true; rule: Rule; version: "v1.0"; needsReview: boolean; reviewRule?: "RULE-003"; clinicalMonths: number[]; reminderDays: number[]; escalateDay: number };

export function runEngine(i: EngineInput): EngineOutput {
  const t = THRESHOLDS[i.test];
  if (!Number.isFinite(i.value) || i.value < t.min || i.value > t.max) return { valid: false };
  const rule: Rule = i.value >= t.high ? "RULE-002" : i.value >= t.low ? "RULE-001" : "RULE-000";
  // Missing prior screening history: result can't be compared to a baseline, so a human must review it.
  const needsReview = !i.priorHistory;
  return {
    valid: true, rule, version: "v1.0", needsReview,
    ...(needsReview ? { reviewRule: "RULE-003" as const } : {}),
    clinicalMonths: rule === "RULE-001" ? [3, 6, 12] : [],
    reminderDays: rule === "RULE-000" ? [] : [3, 7],
    escalateDay: 14,
  };
}

// Operational escalation: reminders on day 3 and 7, reviewer escalation from day 14 if unconfirmed.
export type Escalation = "none" | "reminder" | "reviewer";
export function escalate(day: number, confirmed: boolean): Escalation {
  if (confirmed) return "none";
  if (day >= 14) return "reviewer";
  if (day === 3 || day === 7) return "reminder";
  return "none";
}
