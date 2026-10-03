export type NextStepRule = "RULE-000" | "RULE-001" | "RULE-002";
export type FollowUpStatus = "recommended" | "location_chosen" | "booked" | "completed";
export type NextStepType = "prediabetes_consultation" | "diagnostic_consultation";

export type CareLocation = {
  id: string;
  name_en: string;
  name_ar: string;
  address: string;
  lat: number;
  lng: number;
  service_type: "consultation" | "lab";
  is_demo: boolean;
};

export const demoCareLocations: CareLocation[] = [
  { id: "11111111-1111-4111-8111-111111111111", name_en: "Demo Family Health Centre", name_ar: "مركز صحة الأسرة التجريبي", address: "Jumeirah, Dubai", lat: 25.2285, lng: 55.2648, service_type: "consultation", is_demo: true },
  { id: "22222222-2222-4222-8222-222222222222", name_en: "Demo Primary Care Clinic", name_ar: "عيادة الرعاية الأولية التجريبية", address: "Deira, Dubai", lat: 25.2697, lng: 55.3095, service_type: "consultation", is_demo: true },
  { id: "33333333-3333-4333-8333-333333333333", name_en: "Demo Lab & Diagnostics", name_ar: "مختبر ومركز تشخيص تجريبي", address: "Al Barsha, Dubai", lat: 25.1124, lng: 55.199, service_type: "lab", is_demo: true },
  { id: "44444444-4444-4444-8444-444444444444", name_en: "Demo Community Clinic", name_ar: "العيادة المجتمعية التجريبية", address: "Abu Dhabi", lat: 24.47, lng: 54.35, service_type: "consultation", is_demo: true },
];

export function nextStep(input: { rule: NextStepRule; needsReview?: boolean; reviewerConfirmed?: boolean }) {
  if (input.rule === "RULE-000") return { available: false as const };
  if (input.rule === "RULE-001" && input.needsReview && !input.reviewerConfirmed) return { available: false as const };
  return {
    available: true as const,
    type: input.rule === "RULE-002" ? "diagnostic_consultation" as const : "prediabetes_consultation" as const,
  };
}

const order: FollowUpStatus[] = ["recommended", "location_chosen", "booked", "completed"];
export function transition(from: FollowUpStatus, to: FollowUpStatus) {
  return order.indexOf(to) === order.indexOf(from) + 1 ? "allowed" as const : "rejected" as const;
}

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = (n: number) => n * Math.PI / 180;
  const dLat = rad(b.lat - a.lat); const dLng = rad(b.lng - a.lng);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

// Clinical 3/6/12-month clock is anchored to the completed consultation, never to "Follow-up confirmed".
export function clinicalClockStart(input: { status: FollowUpStatus; completedAt?: Date | null }): Date | null {
  return input.status === "completed" ? (input.completedAt ?? new Date()) : null;
}

// Emirates ID: format-only check (784-YYYY-NNNNNNN-C, 15 digits). No checksum, never stored.
export function validateEID(v: string) { return /^784-\d{4}-\d{7}-\d$/.test(v.trim()); }
export function maskEID(v: string) { const t = v.trim(); return t.length < 4 ? t : `784-****-*******-${t.slice(-1)}`; }

export type NotificationKind = "review" | "appointment" | "generic";
export function patientNotifications(input: { rule: NextStepRule; needsReview: boolean; reviewerConfirmed: boolean; status: FollowUpStatus }): NotificationKind[] {
  if (input.rule === "RULE-000") return [];
  const out: NotificationKind[] = [];
  if (input.needsReview && !input.reviewerConfirmed) out.push("review");
  if (input.status === "booked") out.push("appointment");
  if (out.length === 0) out.push("generic");
  return out;
}

// Notifications must never leak drug names, doses, result values or Emirates ID.
export function containsSensitive(text: string) {
  return /metformin|insulin|\d+(\.\d+)?\s?(mg|ml|%|mmol)|784-?\d{4}|\b\d\.\d\b/i.test(text);
}

// Operational day 3/7/14 reminders stop as soon as the patient confirms follow-up.
export function remindersActive(input: { confirmed: boolean }) { return !input.confirmed; }

// Medication context on a prediabetes (RULE-001) result routes the case to a human reviewer.
export function escalateMedication(input: { onMedication: boolean; rule: NextStepRule }): "reviewer" | "none" {
  return input.onMedication && input.rule === "RULE-001" ? "reviewer" : "none";
}

export const EID_PATTERN = /784-?\d{4}-?\d{7}-?\d/;
