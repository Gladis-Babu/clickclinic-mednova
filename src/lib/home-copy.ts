import { useLang, type Lang } from "@/lib/i18n";

export type HomeText = {
  heroTitle: string; heroLead: string; ctaPatient: string; ctaWorker: string;
  whyTitle: string; stats: [string, string, string, string]; statSource: string; campaign: string;
  checkTitle: string; checks: [string, string][];
  waysTitle: string;
  patientTitle: string; patientDesc: string; patientBullets: [string, string, string]; patientBtn: string;
  workerTitle: string; workerDesc: string; workerBullets: [string, string, string]; workerBtn: string;
  loginWelcome: string; loginChoose: string;
  boxPatient: string; boxPatientDesc: string; boxPatientBtn: string;
  boxWorker: string; boxWorkerDesc: string; boxWorkerBtn: string;
  loginReal: string; changeRole: string; previewIncludes: string; closePreview: string;
};

const en: HomeText = {
  heroTitle: "Closing the gap after screening.",
  heroLead: "In the UAE, preventive health campaigns already find people at risk. This prototype tracks what happens next — explains the result, recommends the right step, and follows through until it's done.",
  ctaPatient: "See it as a patient", ctaWorker: "See it as a healthcare worker",
  whyTitle: "Why this exists",
  stats: ["of UAE adults insufficiently active", "of UAE adults living with obesity", "of UAE adults with high blood pressure", "of UAE adults with elevated glucose"],
  statSource: "Source: UAE National Health and Nutrition Survey 2024–2025, MOHAP",
  campaign: "MOHAP's National Prediabetes and Diabetes Screening Campaign (launched 2023) has already screened over 150,000 people, finding 26.5% of high-risk participants prediabetic. Among those who followed guidance after being flagged, 8.1% returned to a normal result within six months. The gap isn't detection — it's what happens after.",
  checkTitle: "What we check",
  checks: [
    ["Screening classification", "Every result is checked against the UAE DoH standard, not an invented threshold."],
    ["Why this result", "Every finding shows the exact rule and threshold behind it — never a bare \"high risk\" label."],
    ["Human review, when it matters", "Unclear or conflicting cases go to a reviewer. The system never diagnoses or prescribes."],
    ["Two separate clocks", "Clinical follow-up and operational reminders are always shown apart, never mixed."],
    ["Where to go next", "A confirmed pathway comes with a map to the recommended next step."],
    ["Six languages", "English, Arabic, Hindi, Urdu, Tagalog, Malayalam — built in from the start, not bolted on after."],
    ["UAE health records", "Built for the UAE's three health information exchanges — Malaffi (Abu Dhabi), Nabidh (Dubai) and Riayati (Northern Emirates, MoHAP). In deployment, results and follow-up status flow through them."],
  ],
  waysTitle: "Two ways to see it",
  patientTitle: "Patient view", patientDesc: "See your result explained in plain language, your next step, and a map to get there.",
  patientBullets: ["Result & explanation", "Next step & location", "Case timeline"], patientBtn: "Explore patient view",
  workerTitle: "Healthcare worker view", workerDesc: "Review only the cases that genuinely need a person — nothing else competes for your attention.",
  workerBullets: ["Reviewer worklist", "Population funnel", "Audit trail"], workerBtn: "Explore healthcare worker view",
  loginWelcome: "Welcome to ClickClinic", loginChoose: "Choose how you'd like to continue.",
  boxPatient: "I am a patient", boxPatientDesc: "See your screening result, what it means, and your next step.", boxPatientBtn: "Continue as patient",
  boxWorker: "I am a healthcare worker", boxWorkerDesc: "Review flagged cases, confirm or adjust pathways, and see the population funnel.", boxWorkerBtn: "Continue as healthcare worker",
  loginReal: "In a real deployment, a patient would sign in with their Emirates ID or UAE Pass, and a healthcare worker would be verified against their hospital's licensing authority. This prototype uses a demo login only — no real identity is checked.",
  changeRole: "Change", previewIncludes: "This preview includes", closePreview: "Close preview",
};

const ar: HomeText = {
  heroTitle: "سدّ الفجوة بعد الفحص.",
  heroLead: "في الإمارات، تكشف حملات الصحة الوقائية بالفعل الأشخاص المعرّضين للخطر. يتابع هذا النموذج ما يحدث بعد ذلك — يشرح النتيجة، ويوصي بالخطوة المناسبة، ويتابع حتى إتمامها.",
  ctaPatient: "شاهده كمريض", ctaWorker: "شاهده كعامل رعاية صحية",
  whyTitle: "لماذا يوجد هذا",
  stats: ["من البالغين في الإمارات غير نشطين بدنيًا بما يكفي", "من البالغين في الإمارات يعانون من السمنة", "من البالغين في الإمارات لديهم ارتفاع ضغط الدم", "من البالغين في الإمارات لديهم ارتفاع الجلوكوز"],
  statSource: "المصدر: المسح الوطني للصحة والتغذية في الإمارات 2024–2025، وزارة الصحة ووقاية المجتمع",
  campaign: "فحصت الحملة الوطنية للكشف عن مقدمات السكري والسكري التابعة لوزارة الصحة ووقاية المجتمع (أُطلقت عام 2023) أكثر من 150,000 شخص، ووجدت أن 26.5% من المشاركين المعرّضين لخطر مرتفع لديهم مقدمات السكري. ومن بين من اتبعوا الإرشادات بعد تنبيههم، عاد 8.1% إلى نتيجة طبيعية خلال ستة أشهر. الفجوة ليست في الاكتشاف — بل فيما يحدث بعده.",
  checkTitle: "ما الذي نتحقق منه",
  checks: [
    ["تصنيف الفحص", "تُقارن كل نتيجة بمعيار دائرة الصحة في الإمارات، لا بعتبة مخترعة."],
    ["لماذا هذه النتيجة", "كل نتيجة تُظهر القاعدة والعتبة الدقيقة وراءها — لا مجرد وسم \"خطر مرتفع\"."],
    ["مراجعة بشرية عند الحاجة", "تذهب الحالات غير الواضحة أو المتعارضة إلى مراجع. النظام لا يشخّص ولا يصف علاجًا أبدًا."],
    ["ساعتان منفصلتان", "المتابعة السريرية والتذكيرات التشغيلية تُعرض دائمًا منفصلة، ولا تُخلط أبدًا."],
    ["إلى أين بعد ذلك", "يأتي المسار المؤكَّد مع خريطة إلى الخطوة التالية الموصى بها."],
    ["ست لغات", "الإنجليزية والعربية والهندية والأردية والتاغالوغية والماليالامية — مدمجة منذ البداية، لا مضافة لاحقًا."],
    ["سجلات الصحة الإماراتية", "مُهيّأ لمنصات تبادل المعلومات الصحية الثلاث في الإمارات — ملفتي (أبوظبي) ونبض (دبي) ورياضتي (الإمارات الشمالية، وزارة الصحة ووقاية المجتمع). في النشر الفعلي تتدفق النتائج وحالة المتابعة عبرها."],
  ],
  waysTitle: "طريقتان لرؤيته",
  patientTitle: "واجهة المريض", patientDesc: "شاهد نتيجتك مشروحة بلغة بسيطة، وخطوتك التالية، وخريطة للوصول إليها.",
  patientBullets: ["النتيجة والشرح", "الخطوة التالية والموقع", "الجدول الزمني للحالة"], patientBtn: "استكشف واجهة المريض",
  workerTitle: "واجهة عامل الرعاية الصحية", workerDesc: "راجع فقط الحالات التي تحتاج فعلًا إلى شخص — لا شيء آخر ينافس على انتباهك.",
  workerBullets: ["قائمة المراجعة", "مسار السكان", "سجل التدقيق"], workerBtn: "استكشف واجهة عامل الرعاية الصحية",
  loginWelcome: "مرحبًا بك في ClickClinic", loginChoose: "اختر كيف تريد المتابعة.",
  boxPatient: "أنا مريض", boxPatientDesc: "شاهد نتيجة فحصك، ومعناها، وخطوتك التالية.", boxPatientBtn: "المتابعة كمريض",
  boxWorker: "أنا عامل رعاية صحية", boxWorkerDesc: "راجع الحالات المنبَّه عليها، وأكّد المسارات أو عدّلها، وشاهد مسار السكان.", boxWorkerBtn: "المتابعة كعامل رعاية صحية",
  loginReal: "في النشر الفعلي، يسجّل المريض الدخول بالهوية الإماراتية أو الهوية الرقمية (UAE Pass)، ويُتحقق من عامل الرعاية الصحية لدى جهة الترخيص التابعة لمستشفاه. يستخدم هذا النموذج تسجيل دخول تجريبيًا فقط — لا يتم التحقق من أي هوية حقيقية.",
  changeRole: "تغيير", previewIncludes: "تتضمن هذه المعاينة", closePreview: "إغلاق المعاينة",
};

const hi: HomeText = {
  heroTitle: "स्क्रीनिंग के बाद की कमी को पूरा करना।",
  heroLead: "यूएई में निवारक स्वास्थ्य अभियान पहले से ही जोखिम वाले लोगों को ढूँढते हैं। यह प्रोटोटाइप आगे क्या होता है उसे ट्रैक करता है — परिणाम समझाता है, सही कदम सुझाता है, और पूरा होने तक साथ देता है।",
  ctaPatient: "मरीज़ के रूप में देखें", ctaWorker: "स्वास्थ्यकर्मी के रूप में देखें",
  whyTitle: "यह क्यों है",
  stats: ["यूएई के वयस्क पर्याप्त सक्रिय नहीं", "यूएई के वयस्क मोटापे से ग्रस्त", "यूएई के वयस्कों में उच्च रक्तचाप", "यूएई के वयस्कों में बढ़ा हुआ ग्लूकोज़"],
  statSource: "स्रोत: यूएई राष्ट्रीय स्वास्थ्य और पोषण सर्वेक्षण 2024–2025, MOHAP",
  campaign: "MOHAP के राष्ट्रीय प्रीडायबिटीज़ और डायबिटीज़ स्क्रीनिंग अभियान (2023 में शुरू) ने 1,50,000 से अधिक लोगों की जाँच की है, और उच्च-जोखिम प्रतिभागियों में 26.5% को प्रीडायबिटिक पाया। चिह्नित होने के बाद मार्गदर्शन का पालन करने वालों में 8.1% छह महीने में सामान्य परिणाम पर लौट आए। कमी पहचान में नहीं — उसके बाद में है।",
  checkTitle: "हम क्या जाँचते हैं",
  checks: [
    ["स्क्रीनिंग वर्गीकरण", "हर परिणाम यूएई DoH मानक से जाँचा जाता है, किसी गढ़ी हुई सीमा से नहीं।"],
    ["यह परिणाम क्यों", "हर निष्कर्ष उसके पीछे का सटीक नियम और सीमा दिखाता है — कभी सिर्फ़ \"उच्च जोखिम\" लेबल नहीं।"],
    ["ज़रूरत पर मानवीय समीक्षा", "अस्पष्ट या विरोधाभासी मामले समीक्षक के पास जाते हैं। सिस्टम कभी निदान या दवा नहीं लिखता।"],
    ["दो अलग घड़ियाँ", "क्लिनिकल फ़ॉलो-अप और परिचालन रिमाइंडर हमेशा अलग दिखाए जाते हैं, कभी मिलाए नहीं जाते।"],
    ["आगे कहाँ जाएँ", "पुष्टि किए गए मार्ग के साथ अनुशंसित अगले कदम का नक्शा मिलता है।"],
    ["छह भाषाएँ", "अंग्रेज़ी, अरबी, हिंदी, उर्दू, तागालोग, मलयालम — शुरुआत से ही शामिल, बाद में जोड़ी नहीं गईं।"],
    ["यूएई स्वास्थ्य रिकॉर्ड", "यूएई के तीन हेल्थ इन्फॉर्मेशन एक्सचेंज के लिए तैयार — Malaffi (अबू धाबी), Nabidh (दुबई) और Riayati (उत्तरी अमीरात, MOHAP)। वास्तविक तैनाती में परिणाम और फ़ॉलो-अप स्थिति इनसे होकर आती है।"],
  ],
  waysTitle: "देखने के दो तरीके",
  patientTitle: "मरीज़ दृश्य", patientDesc: "अपना परिणाम सरल भाषा में, अपना अगला कदम, और वहाँ पहुँचने का नक्शा देखें।",
  patientBullets: ["परिणाम और व्याख्या", "अगला कदम और स्थान", "केस टाइमलाइन"], patientBtn: "मरीज़ दृश्य देखें",
  workerTitle: "स्वास्थ्यकर्मी दृश्य", workerDesc: "सिर्फ़ उन मामलों की समीक्षा करें जिन्हें सच में किसी व्यक्ति की ज़रूरत है — और कुछ ध्यान नहीं बँटाता।",
  workerBullets: ["समीक्षक वर्कलिस्ट", "जनसंख्या फ़नल", "ऑडिट ट्रेल"], workerBtn: "स्वास्थ्यकर्मी दृश्य देखें",
  loginWelcome: "ClickClinic में आपका स्वागत है", loginChoose: "चुनें कि आप कैसे आगे बढ़ना चाहते हैं।",
  boxPatient: "मैं मरीज़ हूँ", boxPatientDesc: "अपना स्क्रीनिंग परिणाम, उसका अर्थ और अपना अगला कदम देखें।", boxPatientBtn: "मरीज़ के रूप में जारी रखें",
  boxWorker: "मैं स्वास्थ्यकर्मी हूँ", boxWorkerDesc: "चिह्नित मामलों की समीक्षा करें, मार्ग की पुष्टि या बदलाव करें, और जनसंख्या फ़नल देखें।", boxWorkerBtn: "स्वास्थ्यकर्मी के रूप में जारी रखें",
  loginReal: "वास्तविक तैनाती में, मरीज़ अपनी Emirates ID या UAE Pass से साइन इन करेगा, और स्वास्थ्यकर्मी का सत्यापन उसके अस्पताल के लाइसेंसिंग प्राधिकरण से होगा। यह प्रोटोटाइप केवल डेमो लॉगिन का उपयोग करता है — कोई वास्तविक पहचान नहीं जाँची जाती।",
  changeRole: "बदलें", previewIncludes: "इस प्रीव्यू में शामिल है", closePreview: "प्रीव्यू बंद करें",
};

const ur: HomeText = {
  heroTitle: "اسکریننگ کے بعد کا خلا پُر کرنا۔",
  heroLead: "متحدہ عرب امارات میں احتیاطی صحت کی مہمات پہلے ہی خطرے سے دوچار لوگوں کو تلاش کرتی ہیں۔ یہ پروٹوٹائپ بعد میں ہونے والی چیزوں کو ٹریک کرتا ہے — نتیجہ سمجھاتا ہے، درست قدم تجویز کرتا ہے، اور مکمل ہونے تک ساتھ رہتا ہے۔",
  ctaPatient: "مریض کے طور پر دیکھیں", ctaWorker: "ہیلتھ کیئر ورکر کے طور پر دیکھیں",
  whyTitle: "یہ کیوں موجود ہے",
  stats: ["امارات کے بالغ ناکافی طور پر متحرک", "امارات کے بالغ موٹاپے کا شکار", "امارات کے بالغوں میں ہائی بلڈ پریشر", "امارات کے بالغوں میں بڑھا ہوا گلوکوز"],
  statSource: "ماخذ: امارات قومی صحت و غذائیت سروے 2024–2025، MOHAP",
  campaign: "MOHAP کی قومی پری ذیابیطس اور ذیابیطس اسکریننگ مہم (2023 میں شروع) اب تک 150,000 سے زیادہ افراد کی جانچ کر چکی ہے، اور زیادہ خطرے والے شرکاء میں سے 26.5% کو پری ذیابیطس پایا۔ نشاندہی کے بعد رہنمائی پر عمل کرنے والوں میں سے 8.1% چھ ماہ میں نارمل نتیجے پر لوٹ آئے۔ خلا تشخیص میں نہیں — اس کے بعد میں ہے۔",
  checkTitle: "ہم کیا جانچتے ہیں",
  checks: [
    ["اسکریننگ کی درجہ بندی", "ہر نتیجہ امارات DoH معیار سے جانچا جاتا ہے، کسی من گھڑت حد سے نہیں۔"],
    ["یہ نتیجہ کیوں", "ہر نتیجہ اس کے پیچھے کا عین اصول اور حد دکھاتا ہے — کبھی صرف \"زیادہ خطرہ\" کا لیبل نہیں۔"],
    ["ضرورت پر انسانی جائزہ", "غیر واضح یا متضاد کیس جائزہ کار کے پاس جاتے ہیں۔ نظام کبھی تشخیص یا نسخہ نہیں دیتا۔"],
    ["دو الگ گھڑیاں", "کلینیکل فالو اپ اور آپریشنل یاد دہانیاں ہمیشہ الگ دکھائی جاتی ہیں، کبھی ملائی نہیں جاتیں۔"],
    ["آگے کہاں جائیں", "تصدیق شدہ راستے کے ساتھ تجویز کردہ اگلے قدم کا نقشہ ملتا ہے۔"],
    ["چھ زبانیں", "انگریزی، عربی، ہندی، اردو، تگالوگ، ملیالم — شروع سے شامل، بعد میں نہیں جوڑی گئیں۔"],
    ["امارات کے صحت ریکارڈ", "امارات کے تین ہیلتھ انفارمیشن ایکسچینج کے لیے تیار — Malaffi (ابوظہبی)، Nabidh (دبئی) اور Riayati (شمالی امارات، MOHAP)۔ حقیقی نفاذ میں نتائج اور فالو اپ کی حیثیت ان کے ذریعے آتی ہے۔"],
  ],
  waysTitle: "دیکھنے کے دو طریقے",
  patientTitle: "مریض کا منظر", patientDesc: "اپنا نتیجہ آسان زبان میں، اپنا اگلا قدم، اور وہاں پہنچنے کا نقشہ دیکھیں۔",
  patientBullets: ["نتیجہ اور وضاحت", "اگلا قدم اور مقام", "کیس کی ٹائم لائن"], patientBtn: "مریض کا منظر دیکھیں",
  workerTitle: "ہیلتھ کیئر ورکر کا منظر", workerDesc: "صرف ان کیسز کا جائزہ لیں جنہیں واقعی کسی شخص کی ضرورت ہے — اور کچھ آپ کی توجہ نہیں بٹاتا۔",
  workerBullets: ["جائزہ کار کی فہرست", "آبادی کا فنل", "آڈٹ ٹریل"], workerBtn: "ہیلتھ کیئر ورکر کا منظر دیکھیں",
  loginWelcome: "ClickClinic میں خوش آمدید", loginChoose: "منتخب کریں کہ آپ کیسے جاری رکھنا چاہتے ہیں۔",
  boxPatient: "میں مریض ہوں", boxPatientDesc: "اپنا اسکریننگ نتیجہ، اس کا مطلب اور اپنا اگلا قدم دیکھیں۔", boxPatientBtn: "مریض کے طور پر جاری رکھیں",
  boxWorker: "میں ہیلتھ کیئر ورکر ہوں", boxWorkerDesc: "نشان زد کیسز کا جائزہ لیں، راستوں کی تصدیق یا ترمیم کریں، اور آبادی کا فنل دیکھیں۔", boxWorkerBtn: "ہیلتھ کیئر ورکر کے طور پر جاری رکھیں",
  loginReal: "حقیقی نفاذ میں، مریض اپنی Emirates ID یا UAE Pass سے سائن ان کرے گا، اور ہیلتھ کیئر ورکر کی تصدیق اس کے ہسپتال کی لائسنسنگ اتھارٹی سے ہوگی۔ یہ پروٹوٹائپ صرف ڈیمو لاگ ان استعمال کرتا ہے — کوئی حقیقی شناخت نہیں جانچی جاتی۔",
  changeRole: "تبدیل کریں", previewIncludes: "اس پیش منظر میں شامل ہے", closePreview: "پیش منظر بند کریں",
};

const tl: HomeText = {
  heroTitle: "Pagsasara ng puwang pagkatapos ng screening.",
  heroLead: "Sa UAE, nakakahanap na ang mga kampanya sa preventive health ng mga taong nasa panganib. Sinusubaybayan ng prototype na ito ang susunod na mangyayari — ipinapaliwanag ang resulta, inirerekomenda ang tamang hakbang, at sinusundan hanggang matapos.",
  ctaPatient: "Tingnan bilang pasyente", ctaWorker: "Tingnan bilang healthcare worker",
  whyTitle: "Bakit ito umiiral",
  stats: ["ng mga adulto sa UAE ang kulang sa aktibidad", "ng mga adulto sa UAE ang may obesity", "ng mga adulto sa UAE ang may mataas na presyon", "ng mga adulto sa UAE ang may mataas na glucose"],
  statSource: "Pinagmulan: UAE National Health and Nutrition Survey 2024–2025, MOHAP",
  campaign: "Ang National Prediabetes and Diabetes Screening Campaign ng MOHAP (inilunsad noong 2023) ay nakapag-screen na ng mahigit 150,000 katao, at 26.5% ng mga high-risk na kalahok ang natagpuang prediabetic. Sa mga sumunod sa gabay matapos ma-flag, 8.1% ang bumalik sa normal na resulta sa loob ng anim na buwan. Ang puwang ay hindi sa pagtuklas — kundi sa kasunod nito.",
  checkTitle: "Ano ang sinusuri namin",
  checks: [
    ["Klasipikasyon ng screening", "Bawat resulta ay sinusuri laban sa pamantayan ng UAE DoH, hindi sa gawa-gawang threshold."],
    ["Bakit ang resultang ito", "Ipinapakita ng bawat natuklasan ang eksaktong patakaran at threshold — hindi lang basta \"high risk\" na label."],
    ["Pagsusuri ng tao, kapag mahalaga", "Ang mga hindi malinaw o salungat na kaso ay napupunta sa reviewer. Hindi kailanman nagdi-diagnose o nagrereseta ang sistema."],
    ["Dalawang magkahiwalay na orasan", "Ang klinikal na follow-up at operational na paalala ay laging magkahiwalay, hindi pinaghahalo."],
    ["Saan susunod pupunta", "Ang kumpirmadong pathway ay may kasamang mapa papunta sa inirerekomendang susunod na hakbang."],
    ["Anim na wika", "English, Arabic, Hindi, Urdu, Tagalog, Malayalam — kasama na mula simula, hindi idinagdag lang."],
    ["Mga health record sa UAE", "Handa para sa tatlong health information exchange ng UAE — Malaffi (Abu Dhabi), Nabidh (Dubai) at Riayati (Northern Emirates, MOHAP). Sa aktwal na deployment, dumadaloy dito ang mga resulta at status ng follow-up."],
  ],
  waysTitle: "Dalawang paraan para makita ito",
  patientTitle: "View ng pasyente", patientDesc: "Makita ang resulta mo sa simpleng salita, ang susunod mong hakbang, at mapa papunta roon.",
  patientBullets: ["Resulta at paliwanag", "Susunod na hakbang at lokasyon", "Timeline ng kaso"], patientBtn: "Tuklasin ang view ng pasyente",
  workerTitle: "View ng healthcare worker", workerDesc: "Suriin lang ang mga kasong talagang nangangailangan ng tao — walang ibang umaagaw ng pansin mo.",
  workerBullets: ["Worklist ng reviewer", "Population funnel", "Audit trail"], workerBtn: "Tuklasin ang view ng healthcare worker",
  loginWelcome: "Maligayang pagdating sa ClickClinic", loginChoose: "Piliin kung paano mo gustong magpatuloy.",
  boxPatient: "Ako ay pasyente", boxPatientDesc: "Makita ang resulta ng screening mo, ang ibig sabihin nito, at ang susunod mong hakbang.", boxPatientBtn: "Magpatuloy bilang pasyente",
  boxWorker: "Ako ay healthcare worker", boxWorkerDesc: "Suriin ang mga na-flag na kaso, kumpirmahin o ayusin ang pathway, at tingnan ang population funnel.", boxWorkerBtn: "Magpatuloy bilang healthcare worker",
  loginReal: "Sa totoong deployment, magsa-sign in ang pasyente gamit ang Emirates ID o UAE Pass, at ive-verify ang healthcare worker sa licensing authority ng kanilang ospital. Demo login lang ang gamit ng prototype na ito — walang totoong pagkakakilanlan ang sinusuri.",
  changeRole: "Palitan", previewIncludes: "Kasama sa preview na ito", closePreview: "Isara ang preview",
};

const ml: HomeText = {
  heroTitle: "സ്ക്രീനിംഗിന് ശേഷമുള്ള വിടവ് നികത്തുന്നു.",
  heroLead: "യുഎഇയിൽ പ്രതിരോധ ആരോഗ്യ കാമ്പെയ്നുകൾ ഇതിനകം അപകടസാധ്യതയുള്ളവരെ കണ്ടെത്തുന്നു. അടുത്തതായി എന്ത് സംഭവിക്കുന്നു എന്ന് ഈ പ്രോട്ടോടൈപ്പ് പിന്തുടരുന്നു — ഫലം വിശദീകരിക്കുന്നു, ശരിയായ ഘട്ടം ശുപാർശ ചെയ്യുന്നു, അത് പൂർത്തിയാകും വരെ പിന്തുടരുന്നു.",
  ctaPatient: "രോഗിയായി കാണുക", ctaWorker: "ആരോഗ്യപ്രവർത്തകനായി കാണുക",
  whyTitle: "ഇത് എന്തിന്",
  stats: ["യുഎഇ മുതിർന്നവർ വേണ്ടത്ര സജീവരല്ല", "യുഎഇ മുതിർന്നവർക്ക് പൊണ്ണത്തടി", "യുഎഇ മുതിർന്നവർക്ക് ഉയർന്ന രക്തസമ്മർദ്ദം", "യുഎഇ മുതിർന്നവർക്ക് ഉയർന്ന ഗ്ലൂക്കോസ്"],
  statSource: "ഉറവിടം: യുഎഇ ദേശീയ ആരോഗ്യ-പോഷകാഹാര സർവേ 2024–2025, MOHAP",
  campaign: "MOHAP-ന്റെ ദേശീയ പ്രീഡയബറ്റിസ്, ഡയബറ്റിസ് സ്ക്രീനിംഗ് കാമ്പെയ്ൻ (2023-ൽ ആരംഭിച്ചു) 1,50,000-ലധികം പേരെ പരിശോധിച്ചു, ഉയർന്ന അപകടസാധ്യതയുള്ളവരിൽ 26.5% പേർക്ക് പ്രീഡയബറ്റിസ് കണ്ടെത്തി. അടയാളപ്പെടുത്തിയ ശേഷം മാർഗ്ഗനിർദ്ദേശം പാലിച്ചവരിൽ 8.1% പേർ ആറ് മാസത്തിനുള്ളിൽ സാധാരണ ഫലത്തിലേക്ക് മടങ്ങി. വിടവ് കണ്ടെത്തലിലല്ല — അതിനു ശേഷമാണ്.",
  checkTitle: "ഞങ്ങൾ എന്ത് പരിശോധിക്കുന്നു",
  checks: [
    ["സ്ക്രീനിംഗ് വർഗ്ഗീകരണം", "ഓരോ ഫലവും യുഎഇ DoH മാനദണ്ഡവുമായി പരിശോധിക്കുന്നു, കെട്ടിച്ചമച്ച പരിധിയുമായല്ല."],
    ["എന്തുകൊണ്ട് ഈ ഫലം", "ഓരോ കണ്ടെത്തലും അതിന് പിന്നിലെ കൃത്യമായ നിയമവും പരിധിയും കാണിക്കുന്നു — വെറും \"ഉയർന്ന അപകടം\" ലേബൽ ഒരിക്കലുമില്ല."],
    ["ആവശ്യമുള്ളപ്പോൾ മനുഷ്യ അവലോകനം", "വ്യക്തമല്ലാത്തതോ വൈരുദ്ധ്യമുള്ളതോ ആയ കേസുകൾ അവലോകകന്റെ അടുത്തേക്ക് പോകുന്നു. സിസ്റ്റം ഒരിക്കലും രോഗനിർണയമോ കുറിപ്പടിയോ നൽകുന്നില്ല."],
    ["രണ്ട് വ്യത്യസ്ത ക്ലോക്കുകൾ", "ക്ലിനിക്കൽ ഫോളോ-അപ്പും പ്രവർത്തന ഓർമ്മപ്പെടുത്തലുകളും എപ്പോഴും വേറിട്ട് കാണിക്കുന്നു, ഒരിക്കലും കൂട്ടിക്കലർത്തില്ല."],
    ["അടുത്തത് എവിടെ", "സ്ഥിരീകരിച്ച പാതയ്ക്കൊപ്പം ശുപാർശ ചെയ്ത അടുത്ത ഘട്ടത്തിലേക്കുള്ള മാപ്പ് ലഭിക്കും."],
    ["ആറ് ഭാഷകൾ", "ഇംഗ്ലീഷ്, അറബിക്, ഹിന്ദി, ഉർദു, തഗാലോഗ്, മലയാളം — തുടക്കം മുതൽ ഉൾപ്പെടുത്തി, പിന്നീട് ചേർത്തതല്ല."],
    ["യുഎഇ ആരോഗ്യ രേഖകൾ", "യുഎഇയിലെ മൂന്ന് ഹെൽത്ത് ഇൻഫർമേഷൻ എക്സ്ചേഞ്ചുകൾക്കായി തയ്യാർ — Malaffi (അബുദാബി), Nabidh (ദുബായ്), Riayati (വടക്കൻ എമിറേറ്റുകൾ, MOHAP). യഥാർത്ഥ വിന്യാസത്തിൽ ഫലങ്ങളും ഫോളോ-അപ്പ് നിലയും ഇവയിലൂടെ ഒഴുകുന്നു."],
  ],
  waysTitle: "കാണാൻ രണ്ട് വഴികൾ",
  patientTitle: "രോഗിയുടെ കാഴ്ച", patientDesc: "നിങ്ങളുടെ ഫലം ലളിതമായ ഭാഷയിൽ, അടുത്ത ഘട്ടം, അവിടെയെത്താനുള്ള മാപ്പ് എന്നിവ കാണുക.",
  patientBullets: ["ഫലവും വിശദീകരണവും", "അടുത്ത ഘട്ടവും സ്ഥലവും", "കേസ് ടൈംലൈൻ"], patientBtn: "രോഗിയുടെ കാഴ്ച കാണുക",
  workerTitle: "ആരോഗ്യപ്രവർത്തകന്റെ കാഴ്ച", workerDesc: "ശരിക്കും ഒരു വ്യക്തി ആവശ്യമുള്ള കേസുകൾ മാത്രം അവലോകനം ചെയ്യുക — മറ്റൊന്നും നിങ്ങളുടെ ശ്രദ്ധ തിരിക്കുന്നില്ല.",
  workerBullets: ["അവലോകക വർക്ക്‌ലിസ്റ്റ്", "ജനസംഖ്യാ ഫണൽ", "ഓഡിറ്റ് ട്രയൽ"], workerBtn: "ആരോഗ്യപ്രവർത്തകന്റെ കാഴ്ച കാണുക",
  loginWelcome: "ClickClinic-യിലേക്ക് സ്വാഗതം", loginChoose: "എങ്ങനെ തുടരണമെന്ന് തിരഞ്ഞെടുക്കുക.",
  boxPatient: "ഞാൻ ഒരു രോഗിയാണ്", boxPatientDesc: "നിങ്ങളുടെ സ്ക്രീനിംഗ് ഫലം, അതിന്റെ അർത്ഥം, അടുത്ത ഘട്ടം എന്നിവ കാണുക.", boxPatientBtn: "രോഗിയായി തുടരുക",
  boxWorker: "ഞാൻ ഒരു ആരോഗ്യപ്രവർത്തകനാണ്", boxWorkerDesc: "അടയാളപ്പെടുത്തിയ കേസുകൾ അവലോകനം ചെയ്യുക, പാതകൾ സ്ഥിരീകരിക്കുക അല്ലെങ്കിൽ ക്രമീകരിക്കുക, ജനസംഖ്യാ ഫണൽ കാണുക.", boxWorkerBtn: "ആരോഗ്യപ്രവർത്തകനായി തുടരുക",
  loginReal: "യഥാർത്ഥ വിന്യാസത്തിൽ, രോഗി Emirates ID അല്ലെങ്കിൽ UAE Pass ഉപയോഗിച്ച് സൈൻ ഇൻ ചെയ്യും, ആരോഗ്യപ്രവർത്തകനെ അവരുടെ ആശുപത്രിയുടെ ലൈസൻസിംഗ് അതോറിറ്റി വഴി പരിശോധിക്കും. ഈ പ്രോട്ടോടൈപ്പ് ഡെമോ ലോഗിൻ മാത്രം ഉപയോഗിക്കുന്നു — യഥാർത്ഥ വ്യക്തിത്വം പരിശോധിക്കുന്നില്ല.",
  changeRole: "മാറ്റുക", previewIncludes: "ഈ പ്രിവ്യൂവിൽ ഉൾപ്പെടുന്നത്", closePreview: "പ്രിവ്യൂ അടയ്ക്കുക",
};

export const homeCopy: Record<Lang, HomeText> = { en, ar, hi, ur, tl, ml };
export const useHomeText = () => homeCopy[useLang().lang];
