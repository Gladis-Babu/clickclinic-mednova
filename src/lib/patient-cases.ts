import { useLang, fill, type Lang } from "@/lib/i18n";
import type { DemoText } from "@/lib/demo-copy";

// Single source of truth for the four sample patients. Every page (My case, Demo Run,
// Audit trail, Engine test) reads values and case IDs from here.
export type SamplePatientId = "fatima" | "rashid" | "noor" | "huda" | "sara";
export type SampleTest = "hba1c" | "fpg";
export type SampleRule = "RULE-000" | "RULE-001" | "RULE-002";

export type SampleCase = { caseId: string; test: SampleTest; value: number; rule: SampleRule; reviewRule: "RULE-003" | "RULE-004" | null; needsReview: boolean; history: boolean; medicine: string | null };
export const samplePatients: Record<SamplePatientId, SampleCase> = {
  fatima: { caseId: "PH-2481", test: "hba1c", value: 5.9, rule: "RULE-001", reviewRule: null, needsReview: false, history: true, medicine: null },
  noor: { caseId: "N-204", test: "hba1c", value: 5.9, rule: "RULE-001", reviewRule: "RULE-003", needsReview: true, history: false, medicine: null },
  huda: { caseId: "H-204", test: "hba1c", value: 6.0, rule: "RULE-001", reviewRule: "RULE-004", needsReview: true, history: true, medicine: "Metformin" },
  rashid: { caseId: "R-204", test: "fpg", value: 7.4, rule: "RULE-002", reviewRule: null, needsReview: false, history: true, medicine: null },
  sara: { caseId: "S-204", test: "hba1c", value: 5.2, rule: "RULE-000", reviewRule: null, needsReview: false, history: true, medicine: null },
};
export const caseOrder: SamplePatientId[] = ["fatima", "noor", "huda", "rashid", "sara"];
export const unitFor = (t: SampleTest) => t === "hba1c" ? "%" : " mmol/L";
export const rulesFor = (id: SamplePatientId) => { const c = samplePatients[id]; return c.reviewRule ? [c.rule, c.reviewRule] : [c.rule]; };

const en = {
  statusUnder: "Under review",
  statusNone: "No follow-up needed",
  heroRashid: "Your result needs a full assessment by a clinician.",
  heroNoor: "Your result is being reviewed by your care team. Consultation options will appear after review.",
  heroSara: "Your result is below the prediabetes range.",
  nextActionSara: "Continue routine preventive care.",
  clinicianSets: "Follow-up after your assessment is set by your clinician.",
  clinicianSetsShort: "Set by your clinician",
  hba1c: "HbA1c",
  fpg: "Fasting glucose",
  tlRecordedD: "{test} {value} received from the screening lab and attached to your case.",
  tlGen001: "Compared with UAE DoH thresholds: inside the prediabetes range (HbA1c 5.7–6.4% / fasting glucose 5.6–6.9 mmol/L), so the prediabetes pathway was proposed.",
  tlGen002: "Compared with UAE DoH thresholds: at or above the referral threshold (HbA1c 6.5% / fasting glucose 7.0 mmol/L), so a full diagnostic assessment was proposed.",
  tlGen000: "Compared with UAE DoH thresholds: below the prediabetes range, no pathway needed.",
  historyCheck: "History check",
  historyCheckD: "No prior screening record.",
  routed: "Routed to a human reviewer (RULE-003)",
  routedD: "Because there is no screening history, a person must check the pathway before anything is sent.",
  waitingReviewer: "Waiting for reviewer",
  waitingReviewerD: "No reminders are scheduled until a reviewer confirms.",
  reviewerConfirmed: "Reviewer confirmed the pathway",
  reviewerConfirmedD: "A reviewer checked the case. Reminders and consultation options are now active.",
  noFollowUp: "No follow-up scheduled",
  noFollowUpD: "Repeat screening as advised by your clinician.",
};
type C = typeof en;
const ar: C = {
  statusUnder: "قيد المراجعة",
  statusNone: "لا حاجة للمتابعة",
  heroRashid: "تحتاج نتيجتك إلى تقييم كامل من طبيب.",
  heroNoor: "يراجع فريق الرعاية نتيجتك. ستظهر خيارات الاستشارة بعد المراجعة.",
  heroSara: "نتيجتك أقل من نطاق ما قبل السكري.",
  nextActionSara: "استمر في الرعاية الوقائية المعتادة.",
  clinicianSets: "يحدد طبيبك المتابعة بعد التقييم.",
  clinicianSetsShort: "يحددها طبيبك",
  hba1c: "HbA1c",
  fpg: "سكر الصيام",
  tlRecordedD: "تم استلام {test} {value} من مختبر الفحص وإرفاقه بحالتك.",
  tlGen001: "مقارنة بحدود دائرة الصحة: ضمن نطاق ما قبل السكري (HbA1c 5.7–6.4% / سكر الصيام 5.6–6.9 mmol/L)، لذا اقتُرح مسار ما قبل السكري.",
  tlGen002: "مقارنة بحدود دائرة الصحة: عند حد الإحالة أو أعلى (HbA1c 6.5% / سكر الصيام 7.0 mmol/L)، لذا اقتُرح تقييم تشخيصي كامل.",
  tlGen000: "مقارنة بحدود دائرة الصحة: أقل من نطاق ما قبل السكري، لا حاجة لمسار.",
  historyCheck: "فحص السجل",
  historyCheckD: "لا يوجد سجل فحص سابق.",
  routed: "أُحيلت إلى مراجع بشري (RULE-003)",
  routedD: "لعدم وجود سجل فحص، يجب أن يتحقق شخص من المسار قبل إرسال أي شيء.",
  waitingReviewer: "بانتظار المراجع",
  waitingReviewerD: "لا تُجدول أي تذكيرات حتى يؤكد المراجع.",
  reviewerConfirmed: "أكد المراجع المسار",
  reviewerConfirmedD: "راجع أحد المراجعين الحالة. التذكيرات وخيارات الاستشارة مفعّلة الآن.",
  noFollowUp: "لا توجد متابعة مجدولة",
  noFollowUpD: "كرر الفحص حسب نصيحة طبيبك.",
};
const hi: C = {
  statusUnder: "समीक्षा में",
  statusNone: "फ़ॉलो-अप की ज़रूरत नहीं",
  heroRashid: "आपके परिणाम के लिए डॉक्टर द्वारा पूरा मूल्यांकन ज़रूरी है।",
  heroNoor: "आपकी देखभाल टीम आपके परिणाम की समीक्षा कर रही है। समीक्षा के बाद परामर्श विकल्प दिखेंगे।",
  heroSara: "आपका परिणाम प्रीडायबिटीज़ सीमा से नीचे है।",
  nextActionSara: "नियमित निवारक देखभाल जारी रखें।",
  clinicianSets: "मूल्यांकन के बाद फ़ॉलो-अप आपके डॉक्टर तय करेंगे।",
  clinicianSetsShort: "आपके डॉक्टर तय करेंगे",
  hba1c: "HbA1c",
  fpg: "फ़ास्टिंग ग्लूकोज़",
  tlRecordedD: "{test} {value} स्क्रीनिंग लैब से मिला और आपके केस में जोड़ा गया।",
  tlGen001: "UAE DoH सीमाओं से तुलना: प्रीडायबिटीज़ सीमा के भीतर (HbA1c 5.7–6.4% / फ़ास्टिंग ग्लूकोज़ 5.6–6.9 mmol/L), इसलिए प्रीडायबिटीज़ पाथवे प्रस्तावित हुआ।",
  tlGen002: "UAE DoH सीमाओं से तुलना: रेफ़रल सीमा पर या उससे ऊपर (HbA1c 6.5% / फ़ास्टिंग ग्लूकोज़ 7.0 mmol/L), इसलिए पूरा नैदानिक मूल्यांकन प्रस्तावित हुआ।",
  tlGen000: "UAE DoH सीमाओं से तुलना: प्रीडायबिटीज़ सीमा से नीचे, किसी पाथवे की ज़रूरत नहीं।",
  historyCheck: "इतिहास जाँच",
  historyCheckD: "कोई पिछला स्क्रीनिंग रिकॉर्ड नहीं।",
  routed: "मानव समीक्षक को भेजा गया (RULE-003)",
  routedD: "स्क्रीनिंग इतिहास न होने से, कुछ भी भेजने से पहले एक व्यक्ति को पाथवे जाँचना होगा।",
  waitingReviewer: "समीक्षक की प्रतीक्षा",
  waitingReviewerD: "समीक्षक की पुष्टि तक कोई रिमाइंडर निर्धारित नहीं होता।",
  reviewerConfirmed: "समीक्षक ने पाथवे की पुष्टि की",
  reviewerConfirmedD: "एक समीक्षक ने केस जाँचा। रिमाइंडर और परामर्श विकल्प अब सक्रिय हैं।",
  noFollowUp: "कोई फ़ॉलो-अप निर्धारित नहीं",
  noFollowUpD: "अपने डॉक्टर की सलाह के अनुसार दोबारा स्क्रीनिंग कराएँ।",
};
const ur: C = {
  statusUnder: "زیرِ جائزہ",
  statusNone: "فالو اپ کی ضرورت نہیں",
  heroRashid: "آپ کے نتیجے کے لیے ڈاکٹر کا مکمل جائزہ ضروری ہے۔",
  heroNoor: "آپ کی نگہداشت ٹیم آپ کے نتیجے کا جائزہ لے رہی ہے۔ جائزے کے بعد مشاورت کے اختیارات ظاہر ہوں گے۔",
  heroSara: "آپ کا نتیجہ پری ذیابیطس کی حد سے کم ہے۔",
  nextActionSara: "معمول کی احتیاطی نگہداشت جاری رکھیں۔",
  clinicianSets: "جائزے کے بعد فالو اپ آپ کا ڈاکٹر طے کرے گا۔",
  clinicianSetsShort: "آپ کا ڈاکٹر طے کرے گا",
  hba1c: "HbA1c",
  fpg: "فاسٹنگ گلوکوز",
  tlRecordedD: "{test} {value} اسکریننگ لیب سے موصول ہوا اور آپ کے کیس میں شامل کیا گیا۔",
  tlGen001: "UAE DoH حدود سے موازنہ: پری ذیابیطس کی حد کے اندر (HbA1c 5.7–6.4% / فاسٹنگ گلوکوز 5.6–6.9 mmol/L)، اس لیے پری ذیابیطس راستہ تجویز ہوا۔",
  tlGen002: "UAE DoH حدود سے موازنہ: ریفرل حد پر یا اس سے اوپر (HbA1c 6.5% / فاسٹنگ گلوکوز 7.0 mmol/L)، اس لیے مکمل تشخیصی جائزہ تجویز ہوا۔",
  tlGen000: "UAE DoH حدود سے موازنہ: پری ذیابیطس کی حد سے کم، کسی راستے کی ضرورت نہیں۔",
  historyCheck: "تاریخ کی جانچ",
  historyCheckD: "کوئی سابقہ اسکریننگ ریکارڈ نہیں۔",
  routed: "انسانی جائزہ کار کو بھیجا گیا (RULE-003)",
  routedD: "اسکریننگ کی تاریخ نہ ہونے کی وجہ سے، کچھ بھی بھیجنے سے پہلے ایک شخص کو راستہ جانچنا ہوگا۔",
  waitingReviewer: "جائزہ کار کا انتظار",
  waitingReviewerD: "جائزہ کار کی تصدیق تک کوئی یاد دہانی طے نہیں ہوتی۔",
  reviewerConfirmed: "جائزہ کار نے راستے کی تصدیق کی",
  reviewerConfirmedD: "ایک جائزہ کار نے کیس دیکھا۔ یاد دہانیاں اور مشاورت کے اختیارات اب فعال ہیں۔",
  noFollowUp: "کوئی فالو اپ طے نہیں",
  noFollowUpD: "اپنے ڈاکٹر کے مشورے کے مطابق دوبارہ اسکریننگ کروائیں۔",
};
const tl: C = {
  statusUnder: "Sinusuri",
  statusNone: "Walang kailangang follow-up",
  heroRashid: "Kailangan ng buong pagsusuri ng isang clinician ang resulta mo.",
  heroNoor: "Sinusuri ng iyong care team ang resulta mo. Lalabas ang mga opsyon sa konsultasyon pagkatapos ng pagsusuri.",
  heroSara: "Mas mababa ang resulta mo sa saklaw ng prediabetes.",
  nextActionSara: "Ipagpatuloy ang karaniwang pangangalagang pang-iwas.",
  clinicianSets: "Ang follow-up pagkatapos ng pagsusuri ay itatakda ng iyong clinician.",
  clinicianSetsShort: "Itatakda ng iyong clinician",
  hba1c: "HbA1c",
  fpg: "Fasting glucose",
  tlRecordedD: "Natanggap ang {test} {value} mula sa screening lab at idinagdag sa iyong kaso.",
  tlGen001: "Kumpara sa mga threshold ng UAE DoH: nasa saklaw ng prediabetes (HbA1c 5.7–6.4% / fasting glucose 5.6–6.9 mmol/L), kaya iminungkahi ang prediabetes pathway.",
  tlGen002: "Kumpara sa mga threshold ng UAE DoH: nasa o lampas sa referral threshold (HbA1c 6.5% / fasting glucose 7.0 mmol/L), kaya iminungkahi ang buong diagnostic na pagsusuri.",
  tlGen000: "Kumpara sa mga threshold ng UAE DoH: mas mababa sa saklaw ng prediabetes, walang kailangang pathway.",
  historyCheck: "Pagsuri ng kasaysayan",
  historyCheckD: "Walang naunang screening record.",
  routed: "Ipinasa sa isang taong reviewer (RULE-003)",
  routedD: "Dahil walang screening history, kailangang suriin ng isang tao ang pathway bago magpadala ng anuman.",
  waitingReviewer: "Naghihintay sa reviewer",
  waitingReviewerD: "Walang naka-iskedyul na paalala hangga't hindi kinukumpirma ng reviewer.",
  reviewerConfirmed: "Kinumpirma ng reviewer ang pathway",
  reviewerConfirmedD: "Sinuri ng reviewer ang kaso. Aktibo na ang mga paalala at opsyon sa konsultasyon.",
  noFollowUp: "Walang naka-iskedyul na follow-up",
  noFollowUpD: "Ulitin ang screening ayon sa payo ng iyong clinician.",
};
const ml: C = {
  statusUnder: "അവലോകനത്തിൽ",
  statusNone: "ഫോളോ-അപ്പ് ആവശ്യമില്ല",
  heroRashid: "നിങ്ങളുടെ ഫലത്തിന് ഒരു ഡോക്ടറുടെ പൂർണ്ണ വിലയിരുത്തൽ ആവശ്യമാണ്.",
  heroNoor: "നിങ്ങളുടെ കെയർ ടീം ഫലം അവലോകനം ചെയ്യുന്നു. അവലോകനത്തിന് ശേഷം കൺസൾട്ടേഷൻ ഓപ്ഷനുകൾ ദൃശ്യമാകും.",
  heroSara: "നിങ്ങളുടെ ഫലം പ്രീഡയബറ്റിസ് പരിധിക്ക് താഴെയാണ്.",
  nextActionSara: "പതിവ് പ്രതിരോധ പരിചരണം തുടരുക.",
  clinicianSets: "വിലയിരുത്തലിന് ശേഷമുള്ള ഫോളോ-അപ്പ് നിങ്ങളുടെ ഡോക്ടർ നിശ്ചയിക്കും.",
  clinicianSetsShort: "നിങ്ങളുടെ ഡോക്ടർ നിശ്ചയിക്കും",
  hba1c: "HbA1c",
  fpg: "ഫാസ്റ്റിംഗ് ഗ്ലൂക്കോസ്",
  tlRecordedD: "{test} {value} സ്ക്രീനിംഗ് ലാബിൽ നിന്ന് ലഭിച്ച് നിങ്ങളുടെ കേസിൽ ചേർത്തു.",
  tlGen001: "UAE DoH പരിധികളുമായി താരതമ്യം: പ്രീഡയബറ്റിസ് പരിധിക്കുള്ളിൽ (HbA1c 5.7–6.4% / ഫാസ്റ്റിംഗ് ഗ്ലൂക്കോസ് 5.6–6.9 mmol/L), അതിനാൽ പ്രീഡയബറ്റിസ് പാത്ത്‌വേ നിർദ്ദേശിച്ചു.",
  tlGen002: "UAE DoH പരിധികളുമായി താരതമ്യം: റഫറൽ പരിധിയിലോ അതിനു മുകളിലോ (HbA1c 6.5% / ഫാസ്റ്റിംഗ് ഗ്ലൂക്കോസ് 7.0 mmol/L), അതിനാൽ പൂർണ്ണ രോഗനിർണയ വിലയിരുത്തൽ നിർദ്ദേശിച്ചു.",
  tlGen000: "UAE DoH പരിധികളുമായി താരതമ്യം: പ്രീഡയബറ്റിസ് പരിധിക്ക് താഴെ, പാത്ത്‌വേ ആവശ്യമില്ല.",
  historyCheck: "ചരിത്ര പരിശോധന",
  historyCheckD: "മുൻ സ്ക്രീനിംഗ് രേഖയില്ല.",
  routed: "ഒരു മനുഷ്യ റിവ്യൂവറിലേക്ക് അയച്ചു (RULE-003)",
  routedD: "സ്ക്രീനിംഗ് ചരിത്രം ഇല്ലാത്തതിനാൽ, എന്തെങ്കിലും അയക്കുന്നതിന് മുമ്പ് ഒരാൾ പാത്ത്‌വേ പരിശോധിക്കണം.",
  waitingReviewer: "റിവ്യൂവറെ കാത്തിരിക്കുന്നു",
  waitingReviewerD: "റിവ്യൂവർ സ്ഥിരീകരിക്കും വരെ ഓർമ്മപ്പെടുത്തലുകൾ ഷെഡ്യൂൾ ചെയ്യില്ല.",
  reviewerConfirmed: "റിവ്യൂവർ പാത്ത്‌വേ സ്ഥിരീകരിച്ചു",
  reviewerConfirmedD: "ഒരു റിവ്യൂവർ കേസ് പരിശോധിച്ചു. ഓർമ്മപ്പെടുത്തലുകളും കൺസൾട്ടേഷൻ ഓപ്ഷനുകളും ഇപ്പോൾ സജീവമാണ്.",
  noFollowUp: "ഫോളോ-അപ്പ് ഷെഡ്യൂൾ ചെയ്തിട്ടില്ല",
  noFollowUpD: "നിങ്ങളുടെ ഡോക്ടറുടെ ഉപദേശപ്രകാരം സ്ക്രീനിംഗ് ആവർത്തിക്കുക.",
};
export const patientCaseCopy: Record<Lang, C> = { en, ar, hi, ur, tl, ml };
export type PatientCaseText = C;
export const usePatientCaseText = () => patientCaseCopy[useLang().lang];

type Opts = { reviewerConfirmed?: boolean; confirmed?: boolean };
const underReview = (id: SamplePatientId, o: Opts) => samplePatients[id].needsReview && !o.reviewerConfirmed;

export function remindersScheduled(id: SamplePatientId, o: Opts = {}) {
  return samplePatients[id].rule !== "RULE-000" && !underReview(id, o);
}
export function confirmButtonVisible(id: SamplePatientId, o: Opts = {}) { return remindersScheduled(id, o); }
export function clinicalScheduleVisible(id: SamplePatientId, o: Opts = {}) {
  return samplePatients[id].rule === "RULE-001" && !underReview(id, o);
}
export function headerStatus(id: SamplePatientId, o: Opts = {}): "confirmed" | "awaiting" | "under" | "none" {
  if (samplePatients[id].rule === "RULE-000") return "none";
  if (underReview(id, o)) return "under";
  return o.confirmed ? "confirmed" : "awaiting";
}

// Labels the timeline needs from the shared copy dictionaries (passed in to keep this pure).
export type TimelineLabels = {
  pc: C; dm: DemoText; recorded: string; validated: string; generated: string; tlValidatedD: string; day: string;
  tlReminder: string; tlReminderD: string; confirmed: string; awaiting: string; today: string; pending: string;
  remindersStopped: string; tlAwaitingD: string; tlNextAppt: string; tlNextApptD: string; clockStarted: string; clockNotStarted: string;
};
export type TimelineStep = [title: string, meta: string, color: "brand" | "accent" | "success" | "operational", detail: string];

export function timelineFor(id: SamplePatientId, L: TimelineLabels, o: Opts & { clockStart?: Date | null } = {}): TimelineStep[] {
  const p = samplePatients[id];
  const d = (n: number) => fill(L.day, { n });
  const unit = p.test === "hba1c" ? "%" : " mmol/L";
  const steps: TimelineStep[] = [
    [L.recorded, `${d(0)} · 09:00 · ${p.caseId}`, "brand", fill(L.pc.tlRecordedD, { test: L.pc[p.test], value: `${p.value.toFixed(1)}${unit}` })],
    [L.validated, `${d(0)} · 09:01`, "brand", L.tlValidatedD],
  ];
  if (!p.history) steps.push([L.pc.historyCheck, `${d(0)} · 09:01`, "operational", L.pc.historyCheckD]);
  if (p.medicine) steps.push([L.dm.medCheck, `${d(0)} · 09:01`, "operational", L.dm.medCheckD]);
  steps.push([L.generated, `${p.rule} · v1.0`, "accent", p.rule === "RULE-000" ? L.pc.tlGen000 : p.rule === "RULE-002" ? L.pc.tlGen002 : L.pc.tlGen001]);
  if (p.needsReview) {
    const rr = p.reviewRule ?? "RULE-003";
    steps.push(rr === "RULE-004" ? [L.dm.routedMed, rr, "operational", L.dm.routedMedD] : [L.pc.routed, rr, "operational", L.pc.routedD]);
    steps.push(o.reviewerConfirmed ? [L.pc.reviewerConfirmed, rr, "success", L.pc.reviewerConfirmedD] : [L.pc.waitingReviewer, L.pending, "operational", L.pc.waitingReviewerD]);
  }
  if (p.rule === "RULE-000") { steps.push([L.pc.noFollowUp, "—", "success", L.pc.noFollowUpD]); return steps; }
  if (!remindersScheduled(id, o)) return steps;
  steps.push([L.tlReminder, `${d(3)} · ${d(7)} · ${d(14)}`, "operational", L.tlReminderD]);
  steps.push([o.confirmed ? L.confirmed : L.awaiting, o.confirmed ? L.today : L.pending, o.confirmed ? "success" : "operational", o.confirmed ? L.remindersStopped : L.tlAwaitingD]);
  steps.push(clinicalScheduleVisible(id, o)
    ? [L.tlNextAppt, o.clockStart ? fill(L.clockStarted, { date: o.clockStart.toLocaleDateString() }) : L.clockNotStarted, o.clockStart ? "success" : "brand", L.tlNextApptD]
    : [L.tlNextAppt, L.pc.clinicianSetsShort, "brand", L.pc.clinicianSets]);
  return steps;
}

// Escalation to a human reviewer. Conflicting values, a missing value, or medication context
// on a prediabetes result all need a person; the engine never resolves them itself.
export function escalateCase(input: { conflictingValues?: boolean; missingValue?: boolean; onMedication?: boolean; rule?: SampleRule }): "reviewer" | "none" {
  if (input.conflictingValues || input.missingValue) return "reviewer";
  if (input.onMedication && input.rule === "RULE-001") return "reviewer";
  return "none";
}

// Demo clock: day 3 and 7 add a generic reminder when unconfirmed; day 14 unconfirmed escalates.
export function simulateDay(id: SamplePatientId, day: number, o: Opts = {}) {
  const active = remindersScheduled(id, o) && !o.confirmed;
  return { reminder: active && (day === 3 || day === 7), escalated: active && day >= 14 };
}

export type WorkReason = "noHistory" | "medication" | "day14";
export function worklistFor(state: { reviewed: SamplePatientId[]; escalated: SamplePatientId[]; confirmed: SamplePatientId[] }): { id: SamplePatientId; reason: WorkReason }[] {
  return caseOrder.flatMap((id): { id: SamplePatientId; reason: WorkReason }[] => {
    const c = samplePatients[id];
    if (state.reviewed.includes(id)) return [];
    if (c.needsReview) return [{ id, reason: c.reviewRule === "RULE-004" ? "medication" as const : "noHistory" as const }];
    if (state.escalated.includes(id) && !state.confirmed.includes(id)) return [{ id, reason: "day14" as const }];
    return [];
  });
}

const EID_RE = /784-?\d{4}-?\d{7}-?\d/;
export function submitQuestion(text: string): { ok: true; text: string } | { ok: false; reason: "empty" | "eid" } {
  const v = text.trim().slice(0, 500);
  if (!v) return { ok: false, reason: "empty" };
  if (EID_RE.test(v)) return { ok: false, reason: "eid" };
  return { ok: true, text: v };
}
// The audit trail records only that a question was routed, never its content.
export function questionAuditEvent(_question: string) { return { action: "auditQuestion" as const, detail: "" }; }

// Synthetic cohort: deterministic rows, all funnel counts are computed from these.
export type CohortRow = { resulted: boolean; flagged: boolean; confirmed: boolean; location: boolean; booked: boolean; completed: boolean };
export const cohort: CohortRow[] = (() => {
  let seed = 20260928;
  const r = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  return Array.from({ length: 1200 }, () => {
    const resulted = r() < 0.9; const flagged = resulted && r() < 0.27;
    const confirmed = flagged && r() < 0.68; const location = confirmed && r() < 0.82;
    const booked = location && r() < 0.85; const completed = booked && r() < 0.8;
    return { resulted, flagged, confirmed, location, booked, completed };
  });
})();
export const funnelStages = ["screened", "resulted", "flagged", "confirmed", "location", "booked", "completed"] as const;
export type FunnelStage = (typeof funnelStages)[number];
export function funnelCounts(rows: CohortRow[] = cohort): Record<FunnelStage, number> {
  const n = (k: keyof CohortRow) => rows.filter(x => x[k]).length;
  return { screened: rows.length, resulted: n("resulted"), flagged: n("flagged"), confirmed: n("confirmed"), location: n("location"), booked: n("booked"), completed: n("completed") };
}
export function attentionCounts(rows: CohortRow[] = cohort) {
  return { notConfirmed: rows.filter(x => x.flagged && !x.confirmed).length, notBooked: rows.filter(x => x.confirmed && !x.booked).length, notCompleted: rows.filter(x => x.booked && !x.completed).length };
}

// Reviewer worklist tabs. Reviewer decisions are appended; a reviewed case leaves "Needs review".
export type ReviewDecision = "confirm" | "adjust" | "escalate";
export type ReviewRecord = { decision: ReviewDecision; at: string; reviewer: string };
export type ReviewState = { reviewed: Partial<Record<SamplePatientId, ReviewRecord>>; escalated: SamplePatientId[]; confirmed: SamplePatientId[] };
export type EngineReason = "noHistory" | "medication" | "day14" | "prediabetes" | "referral" | "normal";
export type Progress = "awaitingReviewer" | "reviewerConfirmed" | "reviewerAdjusted" | "escalated" | "notEscalated";
export const emptyReviewState: ReviewState = { reviewed: {}, escalated: [], confirmed: [] };
const reviewedIds = (s: ReviewState) => caseOrder.filter(id => s.reviewed[id]);
export function needsReviewTab(s: ReviewState) { return worklistFor({ reviewed: reviewedIds(s), escalated: s.escalated, confirmed: s.confirmed }); }
export function reviewedTab(s: ReviewState) { return reviewedIds(s).map(id => ({ id, ...s.reviewed[id]! })); }
export function engineReason(id: SamplePatientId, s: ReviewState = emptyReviewState): EngineReason {
  const c = samplePatients[id];
  if (c.needsReview) return c.reviewRule === "RULE-004" ? "medication" : "noHistory";
  if (s.escalated.includes(id) && !s.confirmed.includes(id)) return "day14";
  return c.rule === "RULE-002" ? "referral" : c.rule === "RULE-000" ? "normal" : "prediabetes";
}
export function progressFor(id: SamplePatientId, s: ReviewState): Progress {
  const r = s.reviewed[id];
  if (r) return r.decision === "confirm" ? "reviewerConfirmed" : r.decision === "adjust" ? "reviewerAdjusted" : "escalated";
  return needsReviewTab(s).some(x => x.id === id) ? "awaitingReviewer" : "notEscalated";
}
export function allCasesTab(s: ReviewState) {
  return caseOrder.map(id => { const reason = engineReason(id, s); return { id, reviewNeeded: reason === "noHistory" || reason === "medication" || reason === "day14", reason, progress: progressFor(id, s) }; });
}
export function applyReview(s: ReviewState, id: SamplePatientId, decision: ReviewDecision, reviewer: string, at: Date = new Date()): ReviewState {
  return { ...s, reviewed: { ...s.reviewed, [id]: { decision, reviewer, at: at.toISOString() } } };
}
// Confirm or Adjust releases the pathway to the patient; Escalate keeps it with the care team.
export const reviewerReleased = (s: ReviewState, id: SamplePatientId) => { const r = s.reviewed[id]; return !!r && r.decision !== "escalate"; };

// Largest step-to-step loss in the synthetic funnel, computed from the counts.
export function largestLoss(f: Record<FunnelStage, number> = funnelCounts()) {
  let best = { from: funnelStages[0] as FunnelStage, to: funnelStages[1] as FunnelStage, n: -1, p: 0 };
  for (let i = 1; i < funnelStages.length; i++) {
    const from = funnelStages[i - 1]!, to = funnelStages[i]!; const n = f[from] - f[to];
    if (n > best.n) best = { from, to, n, p: f[from] ? Math.round(n / f[from] * 100) : 0 };
  }
  return best;
}
