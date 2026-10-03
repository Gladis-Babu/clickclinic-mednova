import { Button } from "@/components/ui/button";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";


export type Lang = "en" | "ar" | "hi" | "ur" | "tl" | "ml";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
  { code: "hi", label: "हिन्दी" },
  { code: "ur", label: "اردو" },
  { code: "tl", label: "Tagalog" },
  { code: "ml", label: "മലയാളം" },
];

export const isRtl = (l: Lang) => l === "ar" || l === "ur";

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "en", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = localStorage.getItem("almarja-lang") as Lang | null;
    if (saved && LANGS.some(l => l.code === saved)) setLangState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl(lang) ? "rtl" : "ltr";
  }, [lang]);
  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem("almarja-lang", l); };
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);

export function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div role="group" aria-label="Language" className="flex min-w-0 flex-wrap items-center gap-1">
      {LANGS.map(l => (
        <Button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          lang={l.code}
          dir={isRtl(l.code) ? "rtl" : "ltr"}
          variant="outline"
          className={
            "h-8 cursor-pointer rounded-md border px-2 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none " +
            (lang === l.code
              ? "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
              : "border-border bg-paper text-foreground hover:border-primary/50 hover:bg-secondary hover:text-foreground")
          }
        >
          {l.label}
        </Button>
      ))}
    </div>
  );
}

export const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));

const en = {
  navHome: "Home", navHow: "How it works", navLogin: "Log in", navOpen: "Open app",
  quote: "An ounce of prevention is worth a pound of cure.", quoteBy: "— Benjamin Franklin",
  lead: "ClickClinic helps people with a borderline sugar test act early: a clear result, a confirmed follow-up, and reminders so no one falls through the cracks.",
  getStarted: "Get started", seeEngine: "See the demo run", why: "Why this matters",
  s1: "adults worldwide live with diabetes — about 1 in 10", s2: "adults with diabetes don't know they have it",
  s3: "of UAE adults (20–79) live with diabetes", s4: "lower risk of type 2 diabetes with lifestyle change in prediabetes",
  atlasSource: "IDF Diabetes Atlas 2021", preventionSource: "Diabetes Prevention Program, NEJM 2002",
  upTo: "Up to 58%", oneIn2: "1 in 2", disclaimer: "Prototype with synthetic data only — not a diagnosis.",
  welcome: "Welcome back", loginSub: "Log in to see your results and reminders.", phone: "Phone number", email: "Email", password: "Password",
  errPhone: "Enter a valid phone number, e.g. +971 50 123 4567", errEmail: "Enter a valid email", errPass: "Password must be at least 8 characters",
  asPatient: "I am a patient", asDoctor: "I am a doctor", loginBtn: "Log in", demoNote: "Demo only — details are checked but not saved.", moreLangs: "More languages",
  engEyebrow: "Demo run", engTitle: "How our project works", engLead: "Pick a sample patient to see how a result travels from lab value to a follow-up plan. Press Demo run to run the actual engine test.",
  run: "Demo run", seeTest: "See engine test", hba1c: "HbA1c", fpg: "Fasting glucose",
  t1: "1. Receive result", d1: "{test} = {value} {unit} entered for {name}. Checked for valid range and units.",
  t2: "2. Apply UAE DoH rules", d2: "Thresholds: prediabetes ≥ {low}, referral ≥ {high}. Medication is shown as context only.",
  t3: "3. Decide pathway", bRef: "Refer for full diagnosis (RULE-002)", bPre: "Prediabetes pathway (RULE-001)", bNorm: "Normal — routine care (RULE-000)",
  t4: "4. Plan follow-up", d4a: "Clinical clock: consult & retest at 3, 6, 12 months.", d4b: "Rescreen at the next routine check.",
  t5: "5. Schedule reminders", d5: "Operational clock: nudges on day 3 and 7; escalate to a reviewer on day 14 if not confirmed.",
  t6: "6. Human review", d6: "Unclear or unanswered cases go to a nurse/doctor worklist. The engine never diagnoses.",
  finished: "Engine finished.", openTheApp: "Open the app", finishedTail: "to see this case from the patient's side.",
  engFooter: "Synthetic data only — not a diagnosis. Thresholds per UAE DoH DOH/ST/SDMDMT/V1/2024. In deployment, results and follow-up status would flow through Malaffi, Nabidh and Riayati — the UAE's health information exchanges.",
};
type Site = typeof en;

const ar: Site = {
  navHome: "الرئيسية", navHow: "كيف يعمل", navLogin: "تسجيل الدخول", navOpen: "افتح التطبيق",
  quote: "درهم وقاية خير من قنطار علاج.", quoteBy: "— بنجامين فرانكلين",
  lead: "يساعد ClickClinic من لديهم نتيجة سكر حدّية على التصرف مبكراً: نتيجة واضحة، ومتابعة مؤكدة، وتذكيرات حتى لا يُنسى أحد.",
  getStarted: "ابدأ الآن", seeEngine: "شاهد التشغيل التجريبي", why: "لماذا هذا مهم",
  s1: "بالغ حول العالم مصابون بالسكري — نحو 1 من كل 10", s2: "من البالغين المصابين بالسكري لا يعرفون ذلك",
  s3: "من البالغين في الإمارات (20–79) مصابون بالسكري", s4: "انخفاض في خطر السكري من النوع 2 بتغيير نمط الحياة",
  atlasSource: "أطلس السكري للاتحاد الدولي للسكري 2021", preventionSource: "برنامج الوقاية من السكري، مجلة نيو إنجلاند الطبية 2002",
  upTo: "حتى 58%", oneIn2: "1 من 2", disclaimer: "نموذج أولي ببيانات تجريبية فقط — ليس تشخيصاً.",
  welcome: "مرحباً بعودتك", loginSub: "سجّل الدخول لرؤية نتائجك وتذكيراتك.", phone: "رقم الهاتف", email: "البريد الإلكتروني", password: "كلمة المرور",
  errPhone: "أدخل رقم هاتف صحيحاً، مثل ‎+971 50 123 4567", errEmail: "أدخل بريداً إلكترونياً صحيحاً", errPass: "يجب ألا تقل كلمة المرور عن 8 أحرف",
  asPatient: "أنا مريض", asDoctor: "أنا طبيب", loginBtn: "تسجيل الدخول", demoNote: "عرض تجريبي فقط — يتم التحقق من البيانات دون حفظها.", moreLangs: "لغات أخرى",
  engEyebrow: "تشغيل تجريبي", engTitle: "كيف يعمل مشروعنا", engLead: "اختر مريضاً تجريبياً لترى كيف تنتقل النتيجة من قيمة المختبر إلى خطة متابعة. اضغط «تشغيل تجريبي» لتشغيل اختبار المحرك الفعلي.",
  run: "تشغيل تجريبي", seeTest: "شاهد اختبار المحرك", hba1c: "السكر التراكمي", fpg: "سكر الصيام",
  t1: "1. استلام النتيجة", d1: "{test} = {value} {unit} لـ {name}. تم التحقق من النطاق والوحدات.",
  t2: "2. تطبيق قواعد دائرة الصحة", d2: "الحدود: ما قبل السكري ≥ {low}، الإحالة ≥ {high}. الأدوية للسياق فقط.",
  t3: "3. تحديد المسار", bRef: "إحالة لتشخيص كامل (RULE-002)", bPre: "مسار ما قبل السكري (RULE-001)", bNorm: "طبيعي — رعاية روتينية (RULE-000)",
  t4: "4. خطة المتابعة", d4a: "الساعة السريرية: استشارة وإعادة فحص بعد 3 و6 و12 شهراً.", d4b: "إعادة الفحص في الفحص الروتيني القادم.",
  t5: "5. جدولة التذكيرات", d5: "الساعة التشغيلية: تذكير في اليوم 3 و7؛ تصعيد لمراجع في اليوم 14 إن لم يتم التأكيد.",
  t6: "6. مراجعة بشرية", d6: "الحالات غير الواضحة أو دون رد تذهب لقائمة الممرض/الطبيب. المحرك لا يشخّص أبداً.",
  finished: "انتهى المحرك.", openTheApp: "افتح التطبيق", finishedTail: "لرؤية الحالة من جهة المريض.",
  engFooter: "بيانات تجريبية فقط — ليس تشخيصاً. الحدود وفق دائرة الصحة DOH/ST/SDMDMT/V1/2024. في النشر الفعلي تتدفق النتائج وحالة المتابعة عبر ملفتي ونبض ورياضتي — منصات تبادل المعلومات الصحية في الإمارات.",
};

const hi: Site = {
  navHome: "होम", navHow: "यह कैसे काम करता है", navLogin: "लॉग इन", navOpen: "ऐप खोलें",
  quote: "रोकथाम का एक तोला, इलाज के एक सेर के बराबर है।", quoteBy: "— बेंजामिन फ्रैंकलिन",
  lead: "ClickClinic सीमा-रेखा शुगर जाँच वाले लोगों को जल्दी कदम उठाने में मदद करता है: साफ़ परिणाम, पक्का फ़ॉलो-अप और रिमाइंडर, ताकि कोई छूट न जाए।",
  getStarted: "शुरू करें", seeEngine: "डेमो रन देखें", why: "यह क्यों ज़रूरी है",
  s1: "वयस्क दुनिया भर में डायबिटीज़ के साथ जी रहे हैं — लगभग 10 में 1", s2: "डायबिटीज़ वाले वयस्कों को पता नहीं कि उन्हें यह है",
  s3: "यूएई के वयस्क (20–79) डायबिटीज़ के साथ जी रहे हैं", s4: "प्रीडायबिटीज़ में जीवनशैली बदलने से टाइप 2 डायबिटीज़ का कम जोखिम",
  atlasSource: "अंतर्राष्ट्रीय मधुमेह महासंघ का डायबिटीज़ एटलस 2021", preventionSource: "मधुमेह रोकथाम कार्यक्रम, न्यू इंग्लैंड जर्नल ऑफ़ मेडिसिन 2002",
  upTo: "58% तक", oneIn2: "2 में 1", disclaimer: "केवल नमूना डेटा वाला प्रोटोटाइप — यह निदान नहीं है।",
  welcome: "फिर से स्वागत है", loginSub: "अपने परिणाम और रिमाइंडर देखने के लिए लॉग इन करें।", phone: "फ़ोन नंबर", email: "ईमेल", password: "पासवर्ड",
  errPhone: "सही फ़ोन नंबर डालें, जैसे +971 50 123 4567", errEmail: "सही ईमेल डालें", errPass: "पासवर्ड कम से कम 8 अक्षरों का हो",
  asPatient: "मैं मरीज़ हूँ", asDoctor: "मैं डॉक्टर हूँ", loginBtn: "लॉग इन", demoNote: "केवल डेमो — जानकारी जाँची जाती है, सहेजी नहीं जाती।", moreLangs: "अन्य भाषाएँ",
  engEyebrow: "डेमो रन", engTitle: "हमारा प्रोजेक्ट कैसे काम करता है", engLead: "एक नमूना मरीज़ चुनें और देखें कि परिणाम लैब से फ़ॉलो-अप योजना तक कैसे जाता है। असली इंजन टेस्ट चलाने के लिए «डेमो रन» दबाएँ।",
  run: "डेमो रन", seeTest: "इंजन टेस्ट देखें", hba1c: "HbA1c", fpg: "फ़ास्टिंग शुगर",
  t1: "1. परिणाम प्राप्त करें", d1: "{name} के लिए {test} = {value} {unit}। सीमा और इकाई जाँची गई।",
  t2: "2. यूएई DoH नियम लागू करें", d2: "सीमाएँ: प्रीडायबिटीज़ ≥ {low}, रेफ़रल ≥ {high}। दवा केवल संदर्भ के लिए।",
  t3: "3. पाथवे तय करें", bRef: "पूरे निदान के लिए रेफ़र करें (RULE-002)", bPre: "प्रीडायबिटीज़ पाथवे (RULE-001)", bNorm: "सामान्य — नियमित देखभाल (RULE-000)",
  t4: "4. फ़ॉलो-अप योजना", d4a: "क्लिनिकल घड़ी: 3, 6, 12 महीने पर परामर्श और दोबारा जाँच।", d4b: "अगली नियमित जाँच में फिर से स्क्रीनिंग।",
  t5: "5. रिमाइंडर तय करें", d5: "ऑपरेशनल घड़ी: दिन 3 और 7 पर याद दिलाना; पक्का न होने पर दिन 14 को समीक्षक तक।",
  t6: "6. मानवीय समीक्षा", d6: "अस्पष्ट या बिना जवाब वाले केस नर्स/डॉक्टर की सूची में जाते हैं। इंजन कभी निदान नहीं करता।",
  finished: "इंजन पूरा हुआ।", openTheApp: "ऐप खोलें", finishedTail: "और यह केस मरीज़ की ओर से देखें।",
  engFooter: "केवल नमूना डेटा — निदान नहीं। सीमाएँ UAE DoH DOH/ST/SDMDMT/V1/2024 के अनुसार। वास्तविक तैनाती में परिणाम और फ़ॉलो-अप स्थिति Malaffi, Nabidh और Riayati — यूएई के हेल्थ इन्फॉर्मेशन एक्सचेंज — से होकर आएँगे।",
};

const ur: Site = {
  navHome: "ہوم", navHow: "یہ کیسے کام کرتا ہے", navLogin: "لاگ ان", navOpen: "ایپ کھولیں",
  quote: "احتیاط کا ایک تولہ علاج کے ایک سیر سے بہتر ہے۔", quoteBy: "— بینجمن فرینکلن",
  lead: "ClickClinic سرحدی شوگر ٹیسٹ والے لوگوں کو جلد قدم اٹھانے میں مدد دیتا ہے: واضح نتیجہ، کنفرم فالو اپ اور یاد دہانیاں تاکہ کوئی رہ نہ جائے۔",
  getStarted: "شروع کریں", seeEngine: "ڈیمو رن دیکھیں", why: "یہ کیوں اہم ہے",
  s1: "بالغ دنیا بھر میں ذیابیطس کے ساتھ جی رہے ہیں — تقریباً 10 میں 1", s2: "ذیابیطس والے بالغ نہیں جانتے کہ انہیں یہ ہے",
  s3: "یو اے ای کے بالغ (20–79) ذیابیطس کے ساتھ جی رہے ہیں", s4: "پری ذیابیطس میں طرزِ زندگی بدلنے سے ٹائپ 2 ذیابیطس کا کم خطرہ",
  atlasSource: "بین الاقوامی ذیابیطس فیڈریشن کا ذیابیطس اطلس 2021", preventionSource: "ذیابیطس سے بچاؤ کا پروگرام، نیو انگلینڈ جرنل آف میڈیسن 2002",
  upTo: "58% تک", oneIn2: "2 میں 1", disclaimer: "صرف نمونہ ڈیٹا والا پروٹوٹائپ — یہ تشخیص نہیں ہے۔",
  welcome: "دوبارہ خوش آمدید", loginSub: "اپنے نتائج اور یاد دہانیاں دیکھنے کے لیے لاگ ان کریں۔", phone: "فون نمبر", email: "ای میل", password: "پاس ورڈ",
  errPhone: "درست فون نمبر درج کریں، مثلاً ‎+971 50 123 4567", errEmail: "درست ای میل درج کریں", errPass: "پاس ورڈ کم از کم 8 حروف کا ہو",
  asPatient: "میں مریض ہوں", asDoctor: "میں ڈاکٹر ہوں", loginBtn: "لاگ ان", demoNote: "صرف ڈیمو — معلومات جانچی جاتی ہیں، محفوظ نہیں ہوتیں۔", moreLangs: "دوسری زبانیں",
  engEyebrow: "ڈیمو رن", engTitle: "ہمارا پروجیکٹ کیسے کام کرتا ہے", engLead: "ایک نمونہ مریض چنیں اور دیکھیں کہ نتیجہ لیب سے فالو اپ پلان تک کیسے جاتا ہے۔ اصل انجن ٹیسٹ چلانے کے لیے «ڈیمو رن» دبائیں۔",
  run: "ڈیمو رن", seeTest: "انجن ٹیسٹ دیکھیں", hba1c: "HbA1c", fpg: "فاسٹنگ شوگر",
  t1: "1. نتیجہ وصول کریں", d1: "{name} کے لیے {test} = {value} {unit}۔ حد اور اکائی جانچی گئی۔",
  t2: "2. یو اے ای DoH قواعد لاگو کریں", d2: "حدود: پری ذیابیطس ≥ {low}، ریفرل ≥ {high}۔ دوا صرف سیاق کے لیے۔",
  t3: "3. راستہ طے کریں", bRef: "مکمل تشخیص کے لیے ریفر کریں (RULE-002)", bPre: "پری ذیابیطس راستہ (RULE-001)", bNorm: "نارمل — معمول کی دیکھ بھال (RULE-000)",
  t4: "4. فالو اپ پلان", d4a: "کلینیکل گھڑی: 3، 6، 12 ماہ پر مشورہ اور دوبارہ ٹیسٹ۔", d4b: "اگلے معمول کے چیک اپ پر دوبارہ اسکریننگ۔",
  t5: "5. یاد دہانیاں طے کریں", d5: "آپریشنل گھڑی: دن 3 اور 7 پر یاد دہانی؛ کنفرم نہ ہو تو دن 14 کو جائزہ کار تک۔",
  t6: "6. انسانی جائزہ", d6: "غیر واضح یا بے جواب کیس نرس/ڈاکٹر کی فہرست میں جاتے ہیں۔ انجن کبھی تشخیص نہیں کرتا۔",
  finished: "انجن مکمل ہو گیا۔", openTheApp: "ایپ کھولیں", finishedTail: "اور یہ کیس مریض کی طرف سے دیکھیں۔",
  engFooter: "صرف نمونہ ڈیٹا — تشخیص نہیں۔ حدود UAE DoH DOH/ST/SDMDMT/V1/2024 کے مطابق۔ حقیقی نفاذ میں نتائج اور فالو اپ کی حیثیت Malaffi، Nabidh اور Riayati — امارات کے ہیلتھ انفارمیشن ایکسچینج — کے ذریعے آئے گی۔",
};

const tl: Site = {
  navHome: "Home", navHow: "Paano ito gumagana", navLogin: "Mag-log in", navOpen: "Buksan ang app",
  quote: "Ang isang onsa ng pag-iwas ay katumbas ng isang libra ng lunas.", quoteBy: "— Benjamin Franklin",
  lead: "Tinutulungan ng ClickClinic ang mga may borderline na sugar test na kumilos nang maaga: malinaw na resulta, kumpirmadong follow-up, at mga paalala para walang maiwan.",
  getStarted: "Magsimula", seeEngine: "Tingnan ang demo run", why: "Bakit ito mahalaga",
  s1: "na adulto sa buong mundo ang may diabetes — mga 1 sa 10", s2: "ng mga adultong may diabetes ang hindi alam na mayroon sila",
  s3: "ng mga adulto sa UAE (20–79) ang may diabetes", s4: "na mas mababang panganib ng type 2 diabetes sa pagbabago ng pamumuhay",
  atlasSource: "Atlas ng Diabetes ng Pandaigdigang Pederasyon ng Diabetes 2021", preventionSource: "Programa sa Pag-iwas sa Diabetes, New England Journal of Medicine 2002",
  upTo: "Hanggang 58%", oneIn2: "1 sa 2", disclaimer: "Prototype na may sample na datos lamang — hindi diyagnosis.",
  welcome: "Maligayang pagbabalik", loginSub: "Mag-log in para makita ang iyong resulta at mga paalala.", phone: "Numero ng telepono", email: "Email", password: "Password",
  errPhone: "Maglagay ng tamang numero, hal. +971 50 123 4567", errEmail: "Maglagay ng tamang email", errPass: "Dapat hindi bababa sa 8 character ang password",
  asPatient: "Pasyente ako", asDoctor: "Doktor ako", loginBtn: "Mag-log in", demoNote: "Demo lamang — sinusuri ang detalye pero hindi sine-save.", moreLangs: "Iba pang wika",
  engEyebrow: "Demo run", engTitle: "Paano gumagana ang aming proyekto", engLead: "Pumili ng sample na pasyente para makita kung paano nagiging follow-up plan ang resulta. Pindutin ang Demo run para patakbuhin ang tunay na engine test.",
  run: "Demo run", seeTest: "Tingnan ang engine test", hba1c: "HbA1c", fpg: "Fasting glucose",
  t1: "1. Tanggapin ang resulta", d1: "{test} = {value} {unit} para kay {name}. Sinuri ang saklaw at unit.",
  t2: "2. Ilapat ang UAE DoH rules", d2: "Mga threshold: prediabetes ≥ {low}, referral ≥ {high}. Konteksto lamang ang gamot.",
  t3: "3. Pagpasyahan ang pathway", bRef: "I-refer para sa buong diyagnosis (RULE-002)", bPre: "Prediabetes pathway (RULE-001)", bNorm: "Normal — karaniwang pangangalaga (RULE-000)",
  t4: "4. Planuhin ang follow-up", d4a: "Klinikal na orasan: konsulta at retest sa 3, 6, 12 buwan.", d4b: "Muling i-screen sa susunod na regular na check-up.",
  t5: "5. Iskedyul ng paalala", d5: "Operasyonal na orasan: paalala sa araw 3 at 7; i-escalate sa reviewer sa araw 14 kung hindi kumpirmado.",
  t6: "6. Pagsusuri ng tao", d6: "Ang malabo o walang sagot na kaso ay napupunta sa listahan ng nars/doktor. Hindi nagdidiyagnos ang engine.",
  finished: "Tapos na ang engine.", openTheApp: "Buksan ang app", finishedTail: "para makita ang kaso mula sa panig ng pasyente.",
  engFooter: "Sample na datos lamang — hindi diyagnosis. Mga threshold ayon sa UAE DoH DOH/ST/SDMDMT/V1/2024. Sa aktwal na deployment, dumadaloy sa Malaffi, Nabidh at Riayati — mga health information exchange ng UAE — ang mga resulta at status ng follow-up.",
};

const ml: Site = {
  navHome: "ഹോം", navHow: "ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു", navLogin: "ലോഗിൻ", navOpen: "ആപ്പ് തുറക്കുക",
  quote: "ഒരു ഔൺസ് പ്രതിരോധം ഒരു പൗണ്ട് ചികിത്സയ്ക്ക് തുല്യമാണ്.", quoteBy: "— ബെഞ്ചമിൻ ഫ്രാങ്ക്ലിൻ",
  lead: "അതിർത്തി നിലയിലുള്ള ഷുഗർ പരിശോധനാഫലമുള്ളവരെ നേരത്തെ പ്രവർത്തിക്കാൻ ClickClinic സഹായിക്കുന്നു: വ്യക്തമായ ഫലം, ഉറപ്പിച്ച ഫോളോ-അപ്പ്, ആരും വിട്ടുപോകാതിരിക്കാൻ ഓർമ്മപ്പെടുത്തലുകൾ.",
  getStarted: "തുടങ്ങുക", seeEngine: "ഡെമോ റൺ കാണുക", why: "ഇത് എന്തുകൊണ്ട് പ്രധാനം",
  s1: "മുതിർന്നവർ ലോകമെമ്പാടും പ്രമേഹബാധിതർ — ഏകദേശം 10-ൽ 1", s2: "പ്രമേഹമുള്ള മുതിർന്നവർക്ക് അത് ഉണ്ടെന്ന് അറിയില്ല",
  s3: "യുഎഇയിലെ മുതിർന്നവർ (20–79) പ്രമേഹബാധിതർ", s4: "പ്രീഡയബറ്റിസിൽ ജീവിതശൈലി മാറ്റം വഴി ടൈപ്പ് 2 പ്രമേഹ സാധ്യത കുറയുന്നു",
  atlasSource: "അന്താരാഷ്ട്ര പ്രമേഹ ഫെഡറേഷന്റെ പ്രമേഹ അറ്റ്ലസ് 2021", preventionSource: "പ്രമേഹ പ്രതിരോധ പരിപാടി, ന്യൂ ഇംഗ്ലണ്ട് ജേർണൽ ഓഫ് മെഡിസിൻ 2002",
  upTo: "58% വരെ", oneIn2: "2-ൽ 1", disclaimer: "സാമ്പിൾ ഡാറ്റ മാത്രമുള്ള പ്രോട്ടോടൈപ്പ് — ഇത് രോഗനിർണയമല്ല.",
  welcome: "വീണ്ടും സ്വാഗതം", loginSub: "നിങ്ങളുടെ ഫലങ്ങളും ഓർമ്മപ്പെടുത്തലുകളും കാണാൻ ലോഗിൻ ചെയ്യുക.", phone: "ഫോൺ നമ്പർ", email: "ഇമെയിൽ", password: "പാസ്‌വേഡ്",
  errPhone: "ശരിയായ ഫോൺ നമ്പർ നൽകുക, ഉദാ. +971 50 123 4567", errEmail: "ശരിയായ ഇമെയിൽ നൽകുക", errPass: "പാസ്‌വേഡിൽ കുറഞ്ഞത് 8 അക്ഷരങ്ങൾ വേണം",
  asPatient: "ഞാൻ രോഗിയാണ്", asDoctor: "ഞാൻ ഡോക്ടറാണ്", loginBtn: "ലോഗിൻ", demoNote: "ഡെമോ മാത്രം — വിവരങ്ങൾ പരിശോധിക്കുന്നു, സൂക്ഷിക്കുന്നില്ല.", moreLangs: "മറ്റു ഭാഷകൾ",
  engEyebrow: "ഡെമോ റൺ", engTitle: "ഞങ്ങളുടെ പ്രോജക്റ്റ് എങ്ങനെ പ്രവർത്തിക്കുന്നു", engLead: "ഒരു സാമ്പിൾ രോഗിയെ തിരഞ്ഞെടുത്ത് ലാബ് ഫലം ഫോളോ-അപ്പ് പ്ലാനായി മാറുന്നത് കാണുക. യഥാർത്ഥ എഞ്ചിൻ ടെസ്റ്റ് പ്രവർത്തിപ്പിക്കാൻ ഡെമോ റൺ അമർത്തുക.",
  run: "ഡെമോ റൺ", seeTest: "എഞ്ചിൻ ടെസ്റ്റ് കാണുക", hba1c: "HbA1c", fpg: "ഫാസ്റ്റിംഗ് ഷുഗർ",
  t1: "1. ഫലം സ്വീകരിക്കുക", d1: "{name}-നായി {test} = {value} {unit}. പരിധിയും യൂണിറ്റും പരിശോധിച്ചു.",
  t2: "2. യുഎഇ DoH നിയമങ്ങൾ പ്രയോഗിക്കുക", d2: "പരിധികൾ: പ്രീഡയബറ്റിസ് ≥ {low}, റഫറൽ ≥ {high}. മരുന്ന് സന്ദർഭത്തിന് മാത്രം.",
  t3: "3. പാത തീരുമാനിക്കുക", bRef: "പൂർണ്ണ രോഗനിർണയത്തിന് റഫർ ചെയ്യുക (RULE-002)", bPre: "പ്രീഡയബറ്റിസ് പാത (RULE-001)", bNorm: "സാധാരണം — പതിവ് പരിചരണം (RULE-000)",
  t4: "4. ഫോളോ-അപ്പ് പ്ലാൻ", d4a: "ക്ലിനിക്കൽ ക്ലോക്ക്: 3, 6, 12 മാസങ്ങളിൽ കൺസൾട്ടേഷനും വീണ്ടും പരിശോധനയും.", d4b: "അടുത്ത പതിവ് പരിശോധനയിൽ വീണ്ടും സ്ക്രീൻ ചെയ്യുക.",
  t5: "5. ഓർമ്മപ്പെടുത്തലുകൾ ക്രമീകരിക്കുക", d5: "ഓപ്പറേഷണൽ ക്ലോക്ക്: 3-ഉം 7-ഉം ദിവസം ഓർമ്മപ്പെടുത്തൽ; ഉറപ്പിച്ചില്ലെങ്കിൽ 14-ാം ദിവസം റിവ്യൂവറിലേക്ക്.",
  t6: "6. മനുഷ്യ അവലോകനം", d6: "വ്യക്തമല്ലാത്തതോ മറുപടിയില്ലാത്തതോ ആയ കേസുകൾ നഴ്സ്/ഡോക്ടർ പട്ടികയിലേക്ക്. എഞ്ചിൻ ഒരിക്കലും രോഗനിർണയം നടത്തുന്നില്ല.",
  finished: "എഞ്ചിൻ പൂർത്തിയായി.", openTheApp: "ആപ്പ് തുറക്കുക", finishedTail: "രോഗിയുടെ ഭാഗത്തുനിന്ന് ഈ കേസ് കാണാൻ.",
  engFooter: "സാമ്പിൾ ഡാറ്റ മാത്രം — രോഗനിർണയമല്ല. പരിധികൾ UAE DoH DOH/ST/SDMDMT/V1/2024 പ്രകാരം. യഥാർത്ഥ വിന്യാസത്തിൽ ഫലങ്ങളും ഫോളോ-അപ്പ് നിലയും Malaffi, Nabidh, Riayati — യുഎഇ ഹെൽത്ത് ഇൻഫർമേഷൻ എക്സ്ചേഞ്ചുകൾ — വഴി ഒഴുകും.",
};

export const site: Record<Lang, Site> = { en, ar, hi, ur, tl, ml };
export const useSite = () => site[useLang().lang];
