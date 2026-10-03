import { useLang, type Lang } from "@/lib/i18n";

export type CaseId = "rashid" | "sara" | "huda" | "noor";
export type Decision = "confirm" | "adjust" | "escalate";
export type PathwayId = "p1" | "p2" | "p3" | "p4";

type CaseText = { why: string; proposed: string };
type CaseCopy = {
  back: string; caseDetail: string; reasonTitle: string; foundTitle: string; whyTitle: string; proposedTitle: string;
  confirm: string; adjust: string; escalate: string; choosePathway: string; noteLabel: string; notePlaceholder: string;
  saved: string; reviewer: string; decisions: Record<Decision, string>; pathways: Record<PathwayId, string>;
  noteLine: string; cases: Record<CaseId, CaseText>;
};

const en: CaseCopy = {
  back: "Back to worklist", caseDetail: "Case detail", reasonTitle: "Reason for review", foundTitle: "What the engine found", whyTitle: "Why this needs review", proposedTitle: "Proposed pathway",
  confirm: "Confirm", adjust: "Adjust", escalate: "Escalate", choosePathway: "Choose an alternative pathway", noteLabel: "Clinical note", notePlaceholder: "Add a short note for the audit log (optional)",
  saved: "Saved to the audit trail", reviewer: "Reviewer",
  decisions: { confirm: "Pathway confirmed", adjust: "Pathway adjusted", escalate: "Escalated" },
  pathways: { p1: "Prediabetes follow-up in 3 months (RULE-001)", p2: "Refer to a doctor (RULE-002)", p3: "Repeat the test in 2 weeks", p4: "Routine rescreen in 12 months (RULE-000)" },
  noteLine: "Note",
  cases: {
    rashid: { why: "Two tests taken days apart point to different bands. The engine will not pick one over the other; a clinician decides which pathway fits.", proposed: "Refer to a doctor (RULE-002)" },
    sara: { why: "The follow-up was never confirmed after two reminders. A person needs to decide whether to call, re-invite or close the loop another way.", proposed: "Prediabetes follow-up in 3 months (RULE-001)" },
    huda: { why: "Glucose-lowering medicine can make a reading look lower than it would otherwise be. The engine never changes the band for this; a clinician checks the context.", proposed: "Prediabetes follow-up in 3 months (RULE-001)" },
    noor: { why: "Without earlier results the engine cannot tell whether this is new or a long-standing trend. The band is computed, but a person must confirm the pathway.", proposed: "Prediabetes follow-up in 3 months (RULE-001)" },
  },
};

const ar: CaseCopy = {
  back: "العودة إلى قائمة العمل", caseDetail: "تفاصيل الحالة", reasonTitle: "سبب المراجعة", foundTitle: "ما وجده المحرك", whyTitle: "لماذا تحتاج هذه الحالة إلى مراجعة", proposedTitle: "المسار المقترح",
  confirm: "تأكيد", adjust: "تعديل", escalate: "تصعيد", choosePathway: "اختر مسارًا بديلًا", noteLabel: "ملاحظة سريرية", notePlaceholder: "أضف ملاحظة قصيرة لسجل التدقيق (اختياري)",
  saved: "تم الحفظ في سجل التدقيق", reviewer: "المراجِع",
  decisions: { confirm: "تم تأكيد المسار", adjust: "تم تعديل المسار", escalate: "تم التصعيد" },
  pathways: { p1: "متابعة ما قبل السكري بعد 3 أشهر (RULE-001)", p2: "الإحالة إلى طبيب (RULE-002)", p3: "إعادة الفحص بعد أسبوعين", p4: "فحص روتيني بعد 12 شهرًا (RULE-000)" },
  noteLine: "ملاحظة",
  cases: {
    rashid: { why: "فحصان بفارق أيام يشيران إلى فئتين مختلفتين. لا يختار المحرك أحدهما؛ يقرر الطبيب المسار المناسب.", proposed: "الإحالة إلى طبيب (RULE-002)" },
    sara: { why: "لم تُؤكَّد المتابعة بعد تذكيرين. يجب أن يقرر شخص ما إذا كان سيتصل أو يعيد الدعوة أو يغلق الحالة بطريقة أخرى.", proposed: "متابعة ما قبل السكري بعد 3 أشهر (RULE-001)" },
    huda: { why: "قد تجعل أدوية خفض السكر القراءة أقل مما كانت ستكون. لا يغيّر المحرك الفئة لهذا السبب أبدًا؛ يتحقق الطبيب من السياق.", proposed: "متابعة ما قبل السكري بعد 3 أشهر (RULE-001)" },
    noor: { why: "دون نتائج سابقة لا يستطيع المحرك معرفة إن كانت هذه نتيجة جديدة أو نمطًا قديمًا. تُحسب الفئة، لكن يجب أن يؤكد شخص المسار.", proposed: "متابعة ما قبل السكري بعد 3 أشهر (RULE-001)" },
  },
};

const hi: CaseCopy = {
  back: "वर्कलिस्ट पर वापस", caseDetail: "केस विवरण", reasonTitle: "समीक्षा का कारण", foundTitle: "इंजन ने क्या पाया", whyTitle: "इसकी समीक्षा क्यों ज़रूरी है", proposedTitle: "प्रस्तावित मार्ग",
  confirm: "पुष्टि करें", adjust: "बदलें", escalate: "आगे बढ़ाएँ", choosePathway: "वैकल्पिक मार्ग चुनें", noteLabel: "क्लिनिकल नोट", notePlaceholder: "ऑडिट लॉग के लिए छोटा नोट जोड़ें (वैकल्पिक)",
  saved: "ऑडिट ट्रेल में सहेजा गया", reviewer: "समीक्षक",
  decisions: { confirm: "मार्ग की पुष्टि हुई", adjust: "मार्ग बदला गया", escalate: "आगे बढ़ाया गया" },
  pathways: { p1: "3 महीने में प्रीडायबिटीज़ फ़ॉलो-अप (RULE-001)", p2: "डॉक्टर के पास भेजें (RULE-002)", p3: "2 हफ़्ते में टेस्ट दोहराएँ", p4: "12 महीने में नियमित जाँच (RULE-000)" },
  noteLine: "नोट",
  cases: {
    rashid: { why: "कुछ दिनों के अंतर पर हुए दो टेस्ट अलग-अलग श्रेणियाँ दिखाते हैं। इंजन एक को नहीं चुनता; डॉक्टर तय करते हैं कौन-सा मार्ग सही है।", proposed: "डॉक्टर के पास भेजें (RULE-002)" },
    sara: { why: "दो रिमाइंडर के बाद भी फ़ॉलो-अप की पुष्टि नहीं हुई। किसी व्यक्ति को तय करना होगा कि कॉल करें, फिर से बुलाएँ या कोई और तरीका अपनाएँ।", proposed: "3 महीने में प्रीडायबिटीज़ फ़ॉलो-अप (RULE-001)" },
    huda: { why: "शुगर कम करने वाली दवा रीडिंग को कम दिखा सकती है। इंजन इसके कारण श्रेणी कभी नहीं बदलता; डॉक्टर संदर्भ जाँचते हैं।", proposed: "3 महीने में प्रीडायबिटीज़ फ़ॉलो-अप (RULE-001)" },
    noor: { why: "पुराने परिणामों के बिना इंजन नहीं बता सकता कि यह नया है या पुराना रुझान। श्रेणी निकाली गई है, पर मार्ग की पुष्टि किसी व्यक्ति को करनी होगी।", proposed: "3 महीने में प्रीडायबिटीज़ फ़ॉलो-अप (RULE-001)" },
  },
};

const ur: CaseCopy = {
  back: "ورک لسٹ پر واپس", caseDetail: "کیس کی تفصیل", reasonTitle: "جائزے کی وجہ", foundTitle: "انجن نے کیا پایا", whyTitle: "اس کا جائزہ کیوں ضروری ہے", proposedTitle: "مجوزہ راستہ",
  confirm: "تصدیق کریں", adjust: "تبدیل کریں", escalate: "آگے بڑھائیں", choosePathway: "متبادل راستہ منتخب کریں", noteLabel: "کلینیکل نوٹ", notePlaceholder: "آڈٹ لاگ کے لیے مختصر نوٹ لکھیں (اختیاری)",
  saved: "آڈٹ ٹریل میں محفوظ ہو گیا", reviewer: "جائزہ کار",
  decisions: { confirm: "راستے کی تصدیق ہو گئی", adjust: "راستہ تبدیل کیا گیا", escalate: "آگے بڑھایا گیا" },
  pathways: { p1: "3 ماہ میں پری ذیابیطس فالو اپ (RULE-001)", p2: "ڈاکٹر کے پاس بھیجیں (RULE-002)", p3: "2 ہفتوں میں ٹیسٹ دوبارہ کریں", p4: "12 ماہ میں معمول کی جانچ (RULE-000)" },
  noteLine: "نوٹ",
  cases: {
    rashid: { why: "چند دن کے فرق سے ہونے والے دو ٹیسٹ مختلف زمرے دکھاتے ہیں۔ انجن کسی ایک کو نہیں چنتا؛ ڈاکٹر مناسب راستہ طے کرتا ہے۔", proposed: "ڈاکٹر کے پاس بھیجیں (RULE-002)" },
    sara: { why: "دو یاد دہانیوں کے بعد بھی فالو اپ کی تصدیق نہیں ہوئی۔ کسی شخص کو فیصلہ کرنا ہے کہ فون کرے، دوبارہ بلائے یا کوئی اور طریقہ اپنائے۔", proposed: "3 ماہ میں پری ذیابیطس فالو اپ (RULE-001)" },
    huda: { why: "شوگر کم کرنے والی دوا ریڈنگ کو کم دکھا سکتی ہے۔ انجن اس وجہ سے کبھی زمرہ نہیں بدلتا؛ ڈاکٹر سیاق دیکھتا ہے۔", proposed: "3 ماہ میں پری ذیابیطس فالو اپ (RULE-001)" },
    noor: { why: "پرانے نتائج کے بغیر انجن نہیں جان سکتا کہ یہ نیا ہے یا پرانا رجحان۔ زمرہ نکالا گیا ہے، مگر راستے کی تصدیق کسی شخص کو کرنی ہے۔", proposed: "3 ماہ میں پری ذیابیطس فالو اپ (RULE-001)" },
  },
};

const tl: CaseCopy = {
  back: "Bumalik sa worklist", caseDetail: "Detalye ng kaso", reasonTitle: "Dahilan ng pagsusuri", foundTitle: "Ang nakita ng engine", whyTitle: "Bakit ito kailangang suriin", proposedTitle: "Iminungkahing pathway",
  confirm: "Kumpirmahin", adjust: "Baguhin", escalate: "I-escalate", choosePathway: "Pumili ng alternatibong pathway", noteLabel: "Klinikal na tala", notePlaceholder: "Magdagdag ng maikling tala para sa audit log (opsyonal)",
  saved: "Na-save sa audit trail", reviewer: "Tagasuri",
  decisions: { confirm: "Nakumpirma ang pathway", adjust: "Binago ang pathway", escalate: "Na-escalate" },
  pathways: { p1: "Prediabetes follow-up sa loob ng 3 buwan (RULE-001)", p2: "I-refer sa doktor (RULE-002)", p3: "Ulitin ang test sa loob ng 2 linggo", p4: "Karaniwang rescreen sa 12 buwan (RULE-000)" },
  noteLine: "Tala",
  cases: {
    rashid: { why: "Dalawang test na ilang araw lang ang pagitan ay tumuturo sa magkaibang band. Hindi pumipili ang engine; ang clinician ang magpapasya.", proposed: "I-refer sa doktor (RULE-002)" },
    sara: { why: "Hindi nakumpirma ang follow-up kahit dalawang paalala. Kailangang magpasya ang isang tao kung tatawag, mag-iimbita muli o iba pang paraan.", proposed: "Prediabetes follow-up sa loob ng 3 buwan (RULE-001)" },
    huda: { why: "Maaaring pababain ng gamot sa asukal ang resulta. Hindi kailanman binabago ng engine ang band dahil dito; sinusuri ng clinician ang konteksto.", proposed: "Prediabetes follow-up sa loob ng 3 buwan (RULE-001)" },
    noor: { why: "Kung walang naunang resulta, hindi matukoy ng engine kung bago ito o matagal na. Nakalkula ang band, pero kailangang kumpirmahin ng tao ang pathway.", proposed: "Prediabetes follow-up sa loob ng 3 buwan (RULE-001)" },
  },
};

const ml: CaseCopy = {
  back: "വർക്ക്‌ലിസ്റ്റിലേക്ക് മടങ്ങുക", caseDetail: "കേസ് വിവരങ്ങൾ", reasonTitle: "പരിശോധനയുടെ കാരണം", foundTitle: "എഞ്ചിൻ കണ്ടെത്തിയത്", whyTitle: "എന്തുകൊണ്ട് ഇത് പരിശോധിക്കണം", proposedTitle: "നിർദ്ദേശിച്ച പാത",
  confirm: "സ്ഥിരീകരിക്കുക", adjust: "മാറ്റുക", escalate: "എസ്കലേറ്റ് ചെയ്യുക", choosePathway: "മറ്റൊരു പാത തിരഞ്ഞെടുക്കുക", noteLabel: "ക്ലിനിക്കൽ കുറിപ്പ്", notePlaceholder: "ഓഡിറ്റ് ലോഗിനായി ചെറിയ കുറിപ്പ് (ഐച്ഛികം)",
  saved: "ഓഡിറ്റ് ട്രെയിലിൽ സേവ് ചെയ്തു", reviewer: "പരിശോധകൻ",
  decisions: { confirm: "പാത സ്ഥിരീകരിച്ചു", adjust: "പാത മാറ്റി", escalate: "എസ്കലേറ്റ് ചെയ്തു" },
  pathways: { p1: "3 മാസത്തിൽ പ്രീഡയബറ്റിസ് ഫോളോ-അപ്പ് (RULE-001)", p2: "ഡോക്ടറിലേക്ക് റഫർ ചെയ്യുക (RULE-002)", p3: "2 ആഴ്ചയിൽ ടെസ്റ്റ് ആവർത്തിക്കുക", p4: "12 മാസത്തിൽ പതിവ് പരിശോധന (RULE-000)" },
  noteLine: "കുറിപ്പ്",
  cases: {
    rashid: { why: "ദിവസങ്ങളുടെ ഇടവേളയിലെ രണ്ട് ടെസ്റ്റുകൾ വ്യത്യസ്ത വിഭാഗങ്ങൾ കാണിക്കുന്നു. എഞ്ചിൻ ഒന്ന് തിരഞ്ഞെടുക്കില്ല; ഡോക്ടർ തീരുമാനിക്കുന്നു.", proposed: "ഡോക്ടറിലേക്ക് റഫർ ചെയ്യുക (RULE-002)" },
    sara: { why: "രണ്ട് ഓർമ്മപ്പെടുത്തലുകൾക്ക് ശേഷവും ഫോളോ-അപ്പ് സ്ഥിരീകരിച്ചില്ല. വിളിക്കണോ വീണ്ടും ക്ഷണിക്കണോ എന്ന് ഒരാൾ തീരുമാനിക്കണം.", proposed: "3 മാസത്തിൽ പ്രീഡയബറ്റിസ് ഫോളോ-അപ്പ് (RULE-001)" },
    huda: { why: "പഞ്ചസാര കുറയ്ക്കുന്ന മരുന്ന് ഫലം കുറച്ച് കാണിച്ചേക്കാം. എഞ്ചിൻ ഇതിനാൽ വിഭാഗം ഒരിക്കലും മാറ്റില്ല; ഡോക്ടർ സന്ദർഭം പരിശോധിക്കുന്നു.", proposed: "3 മാസത്തിൽ പ്രീഡയബറ്റിസ് ഫോളോ-അപ്പ് (RULE-001)" },
    noor: { why: "മുൻ ഫലങ്ങളില്ലാതെ ഇത് പുതിയതാണോ പഴയ പ്രവണതയാണോ എന്ന് എഞ്ചിന് അറിയാനാവില്ല. വിഭാഗം കണക്കാക്കി, പക്ഷേ ഒരാൾ പാത സ്ഥിരീകരിക്കണം.", proposed: "3 മാസത്തിൽ പ്രീഡയബറ്റിസ് ഫോളോ-അപ്പ് (RULE-001)" },
  },
};

export const caseCopy: Record<Lang, CaseCopy> = { en, ar, hi, ur, tl, ml };
export const useCaseText = () => caseCopy[useLang().lang];
