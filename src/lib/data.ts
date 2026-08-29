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
      en: "Build and run an online store from scratch, products, logistics, and cash-on-delivery.",
      ar: "أنشئ وأدر متجرًا إلكترونيًا من الصفر, المنتجات، الخدمات اللوجستية، والدفع عند الاستلام.",
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
      en: "Earn commissions promoting products you don't own, no inventory, no upfront cost.",
      ar: "اربح عمولات من الترويج لمنتجات لا تملكها, دون مخزون ودون تكلفة مسبقة.",
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
      en: "Sell your skills to clients worldwide, design, writing, translation, and more.",
      ar: "بِع مهاراتك لعملاء حول العالم, تصميم، كتابة، ترجمة، وغيرها.",
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
      en: "Create once, sell forever, templates, guides, courses, and downloadable assets.",
      ar: "أنشئ مرة واحدة وبِع إلى الأبد, قوالب، أدلة، دورات، وملفات قابلة للتحميل.",
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
      en: "Build real apps and tools using AI, no coding background required.",
      ar: "ابنِ تطبيقات وأدوات حقيقية باستخدام الذكاء الاصطناعي, دون خلفية برمجية.",
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
      en: "Offer AI-powered services to local businesses, automation, content, and more.",
      ar: "قدّم خدمات مدعومة بالذكاء الاصطناعي للشركات المحلية, أتمتة، محتوى، وغيرها.",
    },
    detail: {
      en: "Trainees learn to package AI capabilities, automation, content generation, chat support, into services they can pitch and sell to local businesses.",
      ar: "يتعلم المتدربون تحويل إمكانات الذكاء الاصطناعي, الأتمتة، توليد المحتوى، دعم المحادثات, إلى خدمات يمكن عرضها وبيعها للشركات المحلية.",
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
    name: "Karam Judeh",
    focus: {
      en: "Vibe Coding & AI Business Automation",
      ar: "فايب كودينغ وأتمتة الأعمال بالذكاء الاصطناعي",
    },
    bio: {
      en: "Shows trainees how to use AI tools to build real software and automate business processes with no coding background.",
      ar: "يُري المتدربين كيفية استخدام أدوات الذكاء الاصطناعي لبناء برمجيات حقيقية وأتمتة العمليات دون خلفية برمجية.",
    },
  },
  {
    number: "04",
    name: "Diaa Abu Shamlah",
    focus: { en: "E-commerce, eBay & Amazon", ar: "التجارة الإلكترونية, إيباي وأمازون" },
    bio: {
      en: "Runs cross-border e-commerce operations and trains sellers on sourcing, listing, and logistics for global marketplaces.",
      ar: "يدير عمليات تجارة إلكترونية عابرة للحدود، ويدرّب البائعين على التوريد والعرض والخدمات اللوجستية للأسواق العالمية.",
    },
  },
];

export const partners = ["Bromine Jordan"];

export const stats: { value: string; label: LocalizedText }[] = [
  {
    value: "4",
    label: {
      en: "Live income tracks: Sell, Create, Build, and Market",
      ar: "مسارات دخل مباشرة: بيع، إنشاء، بناء، وتسويق",
    },
  },
  {
    value: "7",
    label: {
      en: "Digital economy sectors, from affiliate marketing to AI-powered services",
      ar: "قطاعات في الاقتصاد الرقمي، من التسويق بالعمولة إلى خدمات الذكاء الاصطناعي",
    },
  },
  {
    value: "100+",
    label: {
      en: "Participants trained per cohort",
      ar: "مشارك في كل دفعة",
    },
  },
];

export const gaps: { title: LocalizedText; body: LocalizedText }[] = [
  {
    title: { en: "The Internet Is the Employer", ar: "الإنترنت هو صاحب العمل" },
    body: {
      en: "The global digital economy, from freelancing to e-commerce, affiliate marketing, and AI-powered services, doesn't require a degree, connections, or significant capital. Just a skill, a phone, and an internet connection.",
      ar: "الاقتصاد الرقمي العالمي، من العمل الحر إلى التجارة الإلكترونية والتسويق بالعمولة وخدمات الذكاء الاصطناعي، لا يشترط شهادة أو علاقات أو رأس مال كبير. فقط مهارة، وهاتف، واتصال بالإنترنت.",
    },
  },
  {
    title: {
      en: "Free Content Is a Starting Point, Not a Plan",
      ar: "المحتوى المجاني نقطة بداية، لا خطة عمل",
    },
    body: {
      en: "What's available for free online is theoretical and scattered. Muntaliq takes participants from theoretical knowledge to a sellable skill, and a product or service ready for the market.",
      ar: "ما هو متاح مجاناً على الإنترنت نظري ومتناثر. منطلق يأخذ المشارك من المعرفة النظرية إلى مهارة قابلة للبيع، ومنتج أو خدمة جاهزة للسوق.",
    },
  },
];

export const promise: { title: LocalizedText; body: LocalizedText }[] = [
  {
    title: { en: "For the Trainee", ar: "للمتدرب" },
    body: {
      en: "A marketable skill within days, not months, and a real product or project ready to sell by the end of training. After training, every participant moves directly into the Muntaliq marketplace to start working and taking on their first clients.",
      ar: "مهارة قابلة للتسويق خلال أيام لا أشهر، ومنتج أو مشروع حقيقي جاهز للبيع بنهاية التدريب. بعد التدريب، ينتقل كل مشارك مباشرة إلى سوق منطلق ليبدأ العمل واستقبال أول عملائه.",
    },
  },
  {
    title: { en: "For Partners & Sponsors", ar: "للشركاء والرعاة" },
    body: {
      en: "An annual Arab platform that ties your name directly to a new generation of digital economy workers, with measurable impact: number of participants trained, income generated, projects actually launched.",
      ar: "منصة عربية سنوية تربط اسمك مباشرة بجيل جديد من العاملين في الاقتصاد الرقمي، بأثر قابل للقياس: عدد المتدربين، الدخل المُحقق، والمشاريع المُطلقة فعلياً.",
    },
  },
  {
    title: { en: "For the Sector", ar: "للقطاع" },
    body: {
      en: "A tested, repeatable model that can be expanded to other cities and governorates once proven.",
      ar: "نموذج مُختبَر وقابل للتكرار، يمكن توسيعه إلى مدن ومحافظات أخرى بعد إثبات نجاحه.",
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
