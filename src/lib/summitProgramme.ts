import type { LocalizedText } from "@/lib/data";

export type Speaker = {
  id: string;
  name: LocalizedText;
  title: LocalizedText;
  bio?: LocalizedText;
  photo?: string;
  role?: "moderator";
  /** Overrides the default moderator label, e.g. for a male moderator or the MC. */
  roleLabel?: LocalizedText;
};

export const speakers: Speaker[] = [
  {
    id: "odeh-haddadin",
    name: { en: "Mr. Odeh Haddadin", ar: "السيد عودة حدادين" },
    title: {
      en: "Digital Business Sector Development Manager, Youth, Technology and Jobs Project, Ministry of Digital Economy and Entrepreneurship",
      ar: "مدير تطوير قطاع الأعمال الرقمية، مشروع الشباب والتكنولوجيا والوظائف، وزارة الاقتصاد الرقمي والريادة",
    },
    bio: {
      en: "An ecosystem and community builder at the meeting point of government, entrepreneurship and innovation, supporting startups, SMEs and the growth of Jordan's digital economy. Founder of Open Circles.",
      ar: "يعمل على بناء المنظومات والمجتمعات عند تقاطع الحكومة والريادة والابتكار، ويسهم في الجهود الوطنية لدعم الشركات الناشئة والصغيرة والمتوسطة ونمو الاقتصاد الرقمي في الأردن. مؤسس مجتمع Open Circles.",
    },
    photo: "/speakers/odeh-haddadin.jpg",
  },
  {
    id: "shaker-amayreh",
    name: { en: "Mr. Shaker Amayreh", ar: "السيد شاكر العمايرة" },
    title: { en: "Partnership Lead, MENA, Replit", ar: "مسؤول الشراكات في الشرق الأوسط وشمال أفريقيا، Replit" },
    bio: {
      en: "Nearly two decades in brand architecture, regional market expansion and startups. Leads Replit's partnerships across MENA, bringing AI-powered development tools to the next generation of builders, and has co-founded three startups.",
      ar: "خبرة تقارب العشرين عاماً في بناء العلامات التجارية والتوسع في الأسواق الإقليمية والشركات الناشئة. يقود شراكات Replit في المنطقة لإيصال أدوات التطوير بالذكاء الاصطناعي إلى الجيل القادم من المبتكرين، وشارك في تأسيس ثلاث شركات ناشئة.",
    },
    photo: "/speakers/shaker-amayreh.jpg",
  },
  {
    id: "faisal-hakki",
    name: { en: "Mr. Faisal Hakki", ar: "السيد فيصل حقي" },
    title: { en: "Managing Director, AB Ventures LP", ar: "المدير العام، AB Ventures LP" },
    bio: {
      en: "Investor and board observer at HyperPay. Former CEO of Oasis500, the Middle East's go-to tech startup accelerator, and former trustee of the Crown Prince Foundation.",
      ar: "مستثمر ومراقب في مجلس إدارة HyperPay. شغل سابقاً منصب الرئيس التنفيذي لشركة Oasis500، أبرز مسرّعات الشركات التقنية الناشئة في المنطقة، وعضوية مجلس أمناء مؤسسة ولي العهد.",
    },
    photo: "/speakers/faisal-hakki.jpg",
  },
  {
    id: "sinamis-bayouq",
    name: { en: "Ms. Sinamis Bayouq, PCC", ar: "الأستاذة سناميس بيوق" },
    title: {
      en: "Executive Leadership & Transition Coach; Head of Coaching, Learning & Development, Teapot Consultancy",
      ar: "مدرّبة قيادة تنفيذية معتمدة (PCC)، رئيسة التدريب والتعلّم والتطوير، Teapot Consultancy",
    },
    bio: {
      en: "An ICF Professional Certified Coach with over 21 years of experience across technology, education, entrepreneurship and organisational development. She has supported more than 2,000 people through coaching and training programmes across the Middle East, and moderates the panel.",
      ar: "مدرّبة معتمدة من الاتحاد الدولي للكوتشينغ (PCC) بخبرة تزيد على ٢١ عاماً في التكنولوجيا والتعليم والريادة والتطوير المؤسسي. دعمت أكثر من ٢٠٠٠ شخص عبر برامج تدريب وكوتشينغ في الشرق الأوسط، وتدير الجلسة الحوارية.",
    },
    photo: "/speakers/sinamis-bayouq.jpg",
    role: "moderator",
  },
  {
    id: "abdullah-battah",
    photo: "/speakers/abdullah-battah.jpg",
    name: { en: "Dr. Abdullah Battah", ar: "د. عبد الله بطاح" },
    title: { en: "Independent expert in marketing and AI content creation", ar: "خبير مستقل في التسويق وصناعة المحتوى بالذكاء الاصطناعي" },
  },
  {
    id: "hamzeh-nasrallah",
    photo: "/speakers/hamzeh-nasrallah.jpg",
    name: { en: "Mr. Hamzeh Nasrallah", ar: "السيد حمزة نصرالله" },
    title: { en: "Bridge, a Jordanian health-tech startup", ar: "Bridge، شركة أردنية ناشئة في التكنولوجيا الصحية" },
  },
  {
    id: "amaal-saadi",
    photo: "/speakers/amaal-saadi.jpg",
    name: { en: "Ms. Amaal Saadi", ar: "السيدة آمال السعدي" },
    title: { en: "JoAcademy, a Jordanian e-learning platform", ar: "JoAcademy، منصة تعليم إلكتروني أردنية" },
  },
  {
    id: "abdul-fattah-darabseh",
    photo: "/speakers/abdul-fattah-darabseh.jpg",
    name: { en: "Mr. Abdul Fattah Darabseh", ar: "السيد عبد الفتاح الدرابسة" },
    title: { en: "Moderator, second panel", ar: "مدير الجلسة الحوارية الثانية" },
    role: "moderator",
    roleLabel: { en: "Moderator", ar: "مدير الجلسة" },
  },
  {
    id: "farah-batarneh",
    photo: "/speakers/farah-batarneh.jpg",
    name: { en: "Ms. Farah Batarneh", ar: "السيدة فرح البطارنة" },
    title: { en: "Master of ceremonies, Hamsa", ar: "عريفة الحفل، Hamsa" },
    role: "moderator",
    roleLabel: { en: "Master of ceremonies", ar: "عريفة الحفل" },
  },
];

export type AgendaItem = {
  time: LocalizedText;
  title: LocalizedText;
  who?: LocalizedText;
  highlight?: boolean;
};

export const agenda: AgendaItem[] = [
  { time: { en: "09:30 – 10:00", ar: "٠٩:٣٠ – ١٠:٠٠" }, title: { en: "Registration and welcome coffee", ar: "التسجيل واستقبال الضيوف" } },
  {
    time: { en: "10:00 – 10:05", ar: "١٠:٠٠ – ١٠:٠٥" },
    title: { en: "Royal anthem and opening", ar: "السلام الملكي وافتتاح الحفل" },
    who: { en: "Master of ceremonies: Ms. Farah Batarneh, Hamsa", ar: "عريفة الحفل: السيدة فرح البطارنة، Hamsa" },
  },
  {
    time: { en: "10:05 – 10:20", ar: "١٠:٠٥ – ١٠:٢٠" },
    title: { en: "Opening: Mountaliq, from Ghor Al-Safi to the region", ar: "العرض الافتتاحي: منطلق، من غور الصافي إلى المنطقة" },
    who: { en: "Dr. Oula Farawati, Mountaliq Founder", ar: "د. علا الفرواتي، مؤسِّسة منطلق" },
  },
  {
    time: { en: "10:20 – 10:35", ar: "١٠:٢٠ – ١٠:٣٥" },
    title: { en: "Address by the Ministry of Digital Economy and Entrepreneurship", ar: "كلمة وزارة الاقتصاد الرقمي والريادة" },
    who: { en: "Ministry of Digital Economy and Entrepreneurship", ar: "وزارة الاقتصاد الرقمي والريادة" },
  },
  {
    time: { en: "10:35 – 10:50", ar: "١٠:٣٥ – ١٠:٥٠" },
    title: { en: "Address by Jordan Bromine", ar: "كلمة شركة برومين الأردن" },
    who: { en: "Jordan Bromine Company", ar: "شركة برومين الأردن" },
  },
  {
    time: { en: "10:50 – 11:30", ar: "١٠:٥٠ – ١١:٣٠" },
    title: { en: "First panel: Job creation in the AI economy", ar: "الجلسة الحوارية الأولى: خلق فرص العمل في اقتصاد الذكاء الاصطناعي" },
    who: {
      en: "Mr. Odeh Haddadin · Mr. Shaker Amayreh · Mr. Faisal Hakki. Moderated by Ms. Sinamis Bayouq",
      ar: "السيد عودة حدادين · السيد شاكر العمايرة · السيد فيصل حقي. تدير الجلسة الأستاذة سناميس بيوق",
    },
    highlight: true,
  },
  {
    time: { en: "11:30 – 12:10", ar: "١١:٣٠ – ١٢:١٠" },
    title: {
      en: "Second panel: Entrepreneurial stories in the AI economy: the art of making opportunities",
      ar: "الجلسة الحوارية الثانية: قصص ريادية في اقتصاد الذكاء الاصطناعي: فن صناعة الفرص",
    },
    who: {
      en: "Dr. Abdullah Battah · Mr. Hamzeh Nasrallah · Ms. Amaal Saadi. Moderated by Mr. Abdul Fattah Darabseh",
      ar: "د. عبد الله بطاح · السيد حمزة نصرالله · السيدة آمال السعدي. يدير الجلسة السيد عبد الفتاح الدرابسة",
    },
    highlight: true,
  },
  { time: { en: "12:10 – 12:15", ar: "١٢:١٠ – ١٢:١٥" }, title: { en: "A word from a graduate", ar: "كلمة أحد الخريجين" } },
  {
    time: { en: "12:15 – 12:45", ar: "١٢:١٥ – ١٢:٤٥" },
    title: { en: "Certificate ceremony for the graduates", ar: "تسليم الشهادات للخريجين" },
    who: { en: "Ministry of Digital Economy and Entrepreneurship and Jordan Bromine Company", ar: "وزارة الاقتصاد الرقمي والريادة وشركة برومين الأردن" },
  },
  { time: { en: "12:45 – 12:55", ar: "١٢:٤٥ – ١٢:٥٥" }, title: { en: "Group photo", ar: "الصورة الجماعية" } },
  { time: { en: "12:55", ar: "١٢:٥٥" }, title: { en: "Closing and networking", ar: "الختام وبوفيه التواصل" } },
];
