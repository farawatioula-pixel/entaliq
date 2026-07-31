export type Locale = "en" | "ar";
export type LocalizedText = { en: string; ar: string };

export type Track = {
  category: "SELL" | "CREATE" | "BUILD";
  title: LocalizedText;
  description: LocalizedText;
  detail: LocalizedText;
};

export const tracks: Track[] = [
  {
    category: "SELL",
    title: {
      en: "E-commerce & Online Selling",
      ar: "التجارة الإلكترونية والبيع عبر الإنترنت",
    },
    description: {
      en: "Build and run an online store from scratch — products, logistics, and cash-on-delivery.",
      ar: "أنشئ وأدر متجرًا إلكترونيًا من الصفر — المنتجات، الخدمات اللوجستية، والدفع عند الاستلام.",
    },
    detail: {
      en: "Trainees set up a real storefront, source or list products, and learn the cash-on-delivery logistics that make or break online selling in Jordan. By the end of the week, the store is live.",
      ar: "ينشئ المتدربون متجرًا حقيقيًا، ويوفّرون أو يعرضون المنتجات، ويتعلمون خدمات الدفع عند الاستلام التي تحدد نجاح البيع الإلكتروني في الأردن. بنهاية الأسبوع، يكون المتجر جاهزًا للعمل.",
    },
  },
  {
    category: "SELL",
    title: { en: "Affiliate Marketing", ar: "التسويق بالعمولة" },
    description: {
      en: "Earn commissions promoting products you don't own — no inventory, no upfront cost.",
      ar: "اربح عمولات من الترويج لمنتجات لا تملكها — دون مخزون ودون تكلفة مسبقة.",
    },
    detail: {
      en: "No inventory, no upfront capital. Trainees learn to pick offers, build an audience, and track commissions across platforms that pay out in Jordan.",
      ar: "دون مخزون ودون رأس مال مسبق. يتعلم المتدربون اختيار العروض، وبناء جمهور، وتتبع العمولات عبر منصات تدفع في الأردن.",
    },
  },
  {
    category: "CREATE",
    title: {
      en: "Content Creation & Monetization",
      ar: "صناعة المحتوى وتحقيق الدخل منه",
    },
    description: {
      en: "Turn your voice, camera, or keyboard into a revenue stream across platforms.",
      ar: "حوّل صوتك أو كاميرتك أو كتابتك إلى مصدر دخل عبر المنصات المختلفة.",
    },
    detail: {
      en: "From short-form video to written content, trainees learn the monetization mechanics of each platform and leave with a content system they can keep running after the week ends.",
      ar: "من الفيديوهات القصيرة إلى المحتوى المكتوب، يتعلم المتدربون آليات تحقيق الدخل في كل منصة، ويخرجون بنظام محتوى يمكنهم الاستمرار به بعد انتهاء الأسبوع.",
    },
  },
  {
    category: "CREATE",
    title: { en: "Freelancing & Remote Services", ar: "العمل الحر والخدمات عن بُعد" },
    description: {
      en: "Sell your skills to clients worldwide — design, writing, translation, and more.",
      ar: "بِع مهاراتك لعملاء حول العالم — تصميم، كتابة، ترجمة، وغيرها.",
    },
    detail: {
      en: "Trainees build a portfolio, set up a profile on global freelance platforms, and land their pricing and pitch for design, writing, translation, and other in-demand remote services.",
      ar: "يبني المتدربون معرض أعمال، وينشئون ملفًا شخصيًا على منصات العمل الحر العالمية، ويحددون تسعيرهم وعرضهم في التصميم والكتابة والترجمة وخدمات أخرى مطلوبة عن بُعد.",
    },
  },
  {
    category: "CREATE",
    title: { en: "Digital Products", ar: "المنتجات الرقمية" },
    description: {
      en: "Create once, sell forever — templates, guides, courses, and downloadable assets.",
      ar: "أنشئ مرة واحدة وبِع إلى الأبد — قوالب، أدلة، دورات، وملفات قابلة للتحميل.",
    },
    detail: {
      en: "One product, sold indefinitely. Trainees design and package a template, guide, or mini-course and set up the storefront to sell it without ongoing labor.",
      ar: "منتج واحد يُباع إلى ما لا نهاية. يصمم المتدربون ويجهزون قالبًا أو دليلاً أو دورة مصغّرة، وينشئون واجهة لبيعه دون جهد متكرر.",
    },
  },
  {
    category: "BUILD",
    title: {
      en: "AI-Powered Coding (Vibe Coding / No-Code)",
      ar: "البرمجة بالذكاء الاصطناعي (فايب كودينغ / بدون كود)",
    },
    description: {
      en: "Build real apps and tools using AI — no coding background required.",
      ar: "ابنِ تطبيقات وأدوات حقيقية باستخدام الذكاء الاصطناعي — دون خلفية برمجية.",
    },
    detail: {
      en: "No computer science degree required. Trainees use AI-assisted and no-code tools to ship a working app or automation by the end of the training.",
      ar: "دون الحاجة لشهادة في علوم الحاسوب. يستخدم المتدربون أدوات الذكاء الاصطناعي وأدوات بدون كود لإطلاق تطبيق أو أتمتة فعلية بنهاية التدريب.",
    },
  },
  {
    category: "BUILD",
    title: { en: "Paid AI Services", ar: "خدمات الذكاء الاصطناعي مدفوعة الأجر" },
    description: {
      en: "Offer AI-powered services to local businesses — automation, content, and more.",
      ar: "قدّم خدمات مدعومة بالذكاء الاصطناعي للشركات المحلية — أتمتة، محتوى، وغيرها.",
    },
    detail: {
      en: "Trainees learn to package AI capabilities — automation, content generation, chat support — into services they can pitch and sell to local businesses.",
      ar: "يتعلم المتدربون تحويل إمكانات الذكاء الاصطناعي — الأتمتة، توليد المحتوى، دعم المحادثات — إلى خدمات يمكن عرضها وبيعها للشركات المحلية.",
    },
  },
];

export type Trainer = {
  number: string;
  name: string;
  focus: LocalizedText;
  bio: LocalizedText;
};

export const trainers: Trainer[] = [
  {
    number: "01",
    name: "Abdallah Battah",
    focus: { en: "Marketing Strategy & Sales", ar: "استراتيجية التسويق والمبيعات" },
    bio: {
      en: "Leads trainees through positioning, pricing, and the sales conversations that turn a new digital skill into paying clients.",
      ar: "يقود المتدربين عبر التموضع والتسعير ومحادثات البيع التي تحوّل مهارة رقمية جديدة إلى عملاء فعليين.",
    },
  },
  {
    number: "02",
    name: "Othman Hato",
    focus: { en: "Affiliate Marketing", ar: "التسويق بالعمولة" },
    bio: {
      en: "Practitioner in commission-based marketing, teaching trainees how to choose offers and build an audience that converts.",
      ar: "ممارس في التسويق القائم على العمولة، يعلّم المتدربين كيفية اختيار العروض وبناء جمهور يتحول إلى مبيعات.",
    },
  },
  {
    number: "03",
    name: "Hala Abu Shalbak",
    focus: {
      en: "Vibe Coding & AI Business Automation",
      ar: "فايب كودينغ وأتمتة الأعمال بالذكاء الاصطناعي",
    },
    bio: {
      en: "Shows trainees how to use AI tools to build real software and automate business processes with no coding background.",
      ar: "تُري المتدربين كيفية استخدام أدوات الذكاء الاصطناعي لبناء برمجيات حقيقية وأتمتة العمليات دون خلفية برمجية.",
    },
  },
  {
    number: "04",
    name: "Diaa Abu Shamlah",
    focus: { en: "E-commerce — eBay & Amazon", ar: "التجارة الإلكترونية — إيباي وأمازون" },
    bio: {
      en: "Runs cross-border e-commerce operations and trains sellers on sourcing, listing, and logistics for global marketplaces.",
      ar: "يدير عمليات تجارة إلكترونية عابرة للحدود، ويدرّب البائعين على التوريد والعرض والخدمات اللوجستية للأسواق العالمية.",
    },
  },
];

export const partners = ["Orange Jordan", "Bromine", "JBC", "Talabat Jordan"];

export const stats: { value: string; label: LocalizedText }[] = [
  {
    value: "46%",
    label: {
      en: "Youth unemployment rate in Jordan — one of the highest in the region",
      ar: "معدل بطالة الشباب في الأردن — من أعلى المعدلات في المنطقة",
    },
  },
  {
    value: "7",
    label: {
      en: "Digital economy sectors requiring zero capital, no degree, no connections",
      ar: "قطاعات في الاقتصاد الرقمي لا تتطلب رأس مال أو شهادة أو علاقات",
    },
  },
  {
    value: "80%",
    label: {
      en: "Of Jordan's youth opportunities concentrated in Amman — leaving the governorates behind",
      ar: "من فرص الشباب في الأردن تتركز في عمّان — ما يترك المحافظات خلفها",
    },
  },
];

export const gaps: { title: LocalizedText; body: LocalizedText }[] = [
  {
    title: { en: "A Real Economic Gap", ar: "فجوة اقتصادية حقيقية" },
    body: {
      en: "The global digital economy — freelancing, e-commerce, affiliate marketing, AI services — requires no degree, no connections, and no large capital. Just a skill, a phone, and an internet connection.",
      ar: "الاقتصاد الرقمي العالمي — العمل الحر، التجارة الإلكترونية، التسويق بالعمولة، خدمات الذكاء الاصطناعي — لا يتطلب شهادة أو علاقات أو رأس مال كبير. فقط مهارة وهاتف واتصال بالإنترنت.",
    },
  },
  {
    title: { en: "Free Content Isn't Enough", ar: "المحتوى المجاني لا يكفي" },
    body: {
      en: "What's available online is theoretical and scattered, and doesn't address Jordan's market specifically: cash-on-delivery logistics, the difficulty of building complex websites, and a beginner's limited starting capital.",
      ar: "ما هو متاح على الإنترنت نظري ومتناثر، ولا يعالج خصوصية السوق الأردني: خدمات الدفع عند الاستلام، وصعوبة بناء مواقع معقدة، ورأس المال المحدود للمبتدئين.",
    },
  },
  {
    title: { en: "The Geographic Gap", ar: "الفجوة الجغرافية" },
    body: {
      en: "Training and job opportunities are concentrated in Amman; youth in the governorates and rural areas are geographically distant from them, even though digital work requires no relocation at all.",
      ar: "تتركز فرص التدريب والعمل في عمّان؛ فيما يبعد شباب المحافظات والمناطق الريفية جغرافيًا عنها، رغم أن العمل الرقمي لا يتطلب أي انتقال.",
    },
  },
  {
    title: {
      en: "A Model That Doesn't End With the Funding",
      ar: "نموذج لا ينتهي بانتهاء التمويل",
    },
    body: {
      en: "Traditional initiatives rely on a grant or temporary funding and stop once it runs out. Intaleq is designed as a self-sustaining event — modeled on ArabNet — so the platform continues beyond any initial support.",
      ar: "تعتمد المبادرات التقليدية على منحة أو تمويل مؤقت وتتوقف بمجرد نفاده. صُمم انطلق كفعالية ذاتية الاستدامة — على غرار ArabNet — لتستمر المنصة بعد أي دعم أولي.",
    },
  },
];

export const promise: { title: LocalizedText; body: LocalizedText }[] = [
  {
    title: { en: "For the Trainee", ar: "للمتدرب" },
    body: {
      en: "A marketable skill within days, not months — and a real product or project ready to sell by the end of training, not just a certificate of attendance.",
      ar: "مهارة قابلة للتسويق خلال أيام لا أشهر — ومنتج أو مشروع حقيقي جاهز للبيع بنهاية التدريب، لا مجرد شهادة حضور.",
    },
  },
  {
    title: { en: "For the Local Community", ar: "للمجتمع المحلي" },
    body: {
      en: "A new income source that grows from within it — its crafts, products, and services — instead of full dependence on aid or migrating elsewhere for work.",
      ar: "مصدر دخل جديد ينمو من داخل المجتمع نفسه — حرفه ومنتجاته وخدماته — بدلاً من الاعتماد الكامل على المساعدات أو الهجرة للعمل.",
    },
  },
  {
    title: { en: "For Partners & Sponsors", ar: "للشركاء والرعاة" },
    body: {
      en: "A national annual platform that directly ties your name to youth economic empowerment, with measurable impact: number of trainees, income generated, projects actually launched.",
      ar: "منصة وطنية سنوية تربط اسمك مباشرة بالتمكين الاقتصادي للشباب، بأثر قابل للقياس: عدد المتدربين، الدخل المُحقق، والمشاريع المُطلقة فعليًا.",
    },
  },
  {
    title: { en: "For the Sector", ar: "للقطاع" },
    body: {
      en: "A tested, replicable model that can be expanded to other governorates once its success is proven.",
      ar: "نموذج مُختبَر وقابل للتكرار يمكن توسيعه إلى محافظات أخرى بعد إثبات نجاحه.",
    },
  },
];

export const nextSteps: LocalizedText[] = [
  { en: "Lock in the 2026 partnership", ar: "تثبيت شراكة 2026" },
  { en: "Set the dates", ar: "تحديد المواعيد" },
  { en: "Close out the trainer team", ar: "استكمال فريق المدربين" },
  { en: "Open registration", ar: "فتح باب التسجيل" },
  { en: "Logistics", ar: "الخدمات اللوجستية" },
];
