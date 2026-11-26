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
    id: "oula-farawati",
    photo: "/speakers/oula-farawati.jpg",
    name: { en: "Dr. Oula Farawati", ar: "د. علا الفرواتي" },
    title: { en: "Mountaliq Director", ar: "مديرة منطلق" },
    role: "moderator",
    roleLabel: { en: "Host", ar: "المضيفة" },
  },
  {
    id: "sinan-kamal",
    photo: "/speakers/sinan-kamal.jpg",
    name: { en: "Mr. Sinan Kamal", ar: "الأستاذ سنان كمال" },
    title: {
      en: "Chief Technology and Digital Transformation Officer, Ministry of Digital Economy and Entrepreneurship",
      ar: "المدير التنفيذي للتكنولوجيا والتحول الرقمي، وزارة الاقتصاد الرقمي والريادة",
    },
    roleLabel: { en: "On behalf of H.E. the Minister", ar: "نيابةً عن معالي الوزير" },
    role: "moderator",
  },
  {
    id: "odeh-haddadin",
    name: { en: "Mr. Odeh Haddadin", ar: "الأستاذ عودة حدادين" },
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
    name: { en: "Mr. Shaker Amayreh", ar: "الأستاذ شاكر العمايرة" },
    title: { en: "Partnership Lead, MENA, Replit", ar: "مسؤول الشراكات في الشرق الأوسط وشمال أفريقيا، Replit" },
    bio: {
      en: "Nearly two decades in brand architecture, regional market expansion and startups. Leads Replit's partnerships across MENA, bringing AI-powered development tools to the next generation of builders, and has co-founded three startups.",
      ar: "خبرة تقارب العشرين عاماً في بناء العلامات التجارية والتوسع في الأسواق الإقليمية والشركات الناشئة. يقود شراكات Replit في المنطقة لإيصال أدوات التطوير بالذكاء الاصطناعي إلى الجيل القادم من المبتكرين، وشارك في تأسيس ثلاث شركات ناشئة.",
    },
    photo: "/speakers/shaker-amayreh.jpg",
  },
  {
    id: "faisal-hakki",
    name: { en: "Mr. Faisal Hakki", ar: "الأستاذ فيصل حقي" },
    title: { en: "Managing Director, AB Ventures LP", ar: "المدير العام، AB Ventures LP" },
    bio: {
      en: "Leads AB Ventures, Arab Bank's early-stage venture capital arm focused on financial technology. Former CEO of Oasis500, Jordan's leading seed-stage fund and accelerator, former board member of Intaj and TechWorks, former trustee of the Crown Prince Foundation, and a 2018 Innovation Eisenhower Fellow.",
      ar: "يدير AB Ventures، ذراع الاستثمار الجريء المبكر للبنك العربي والمتخصص في التكنولوجيا المالية. شغل سابقاً منصب الرئيس التنفيذي لـ Oasis500، صندوق الاستثمار التأسيسي والمسرّعة الرائدة في الأردن، وكان عضواً في مجالس إدارة «إنتاج» وTechWorks ومجلس أمناء مؤسسة ولي العهد، وهو زميل آيزنهاور للابتكار لعام ٢٠١٨.",
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
    name: { en: "Mr. Hamzeh Nasrallah", ar: "الأستاذ حمزة نصرالله" },
    title: { en: "Bridge, a Jordanian health-tech startup", ar: "Bridge، شركة أردنية ناشئة في التكنولوجيا الصحية" },
  },
  {
    id: "amaal-saadi",
    photo: "/speakers/amaal-saadi.jpg",
    name: { en: "Ms. Amal Al-Sadi", ar: "الأستاذة أمال السعدي" },
    title: { en: "Chief Technology Officer, Jo Academy | ULA Group", ar: "الرئيسة التنفيذية للتكنولوجيا، Jo Academy | ULA Group" },
    bio: {
      en: "Technology executive with over 25 years in software engineering, digital transformation and innovation. She leads technology strategy at Jo Academy, previously spent 14 years at ESKADENIA Software, founded VineTechs, and was named Visionary Woman of the Year in Technology at the 2025 Fluxx Middle East Awards.",
      ar: "قيادية في التكنولوجيا بخبرة تزيد على ٢٥ عاماً في هندسة البرمجيات والتحول الرقمي والابتكار. تقود الاستراتيجية التقنية في Jo Academy، وعملت ١٤ عاماً في ESKADENIA Software، وأسست شركة VineTechs، ونالت لقب المرأة الملهمة للعام في التكنولوجيا ضمن جوائز Fluxx Middle East لعام ٢٠٢٥.",
    },
  },
  {
    id: "abdul-fattah-darabseh",
    photo: "/speakers/abdul-fattah-darabseh.jpg",
    name: { en: "Mr. Abdul Fattah Darabseh", ar: "الأستاذ عبد الفتاح الدرابسة" },
    title: { en: "Moderator, second panel", ar: "مدير الجلسة الحوارية الثانية" },
    role: "moderator",
    roleLabel: { en: "Moderator", ar: "مدير الجلسة" },
  },
  {
    id: "farah-batarneh",
    photo: "/speakers/farah-batarneh.jpg",
    name: { en: "Ms. Farah Batarneh", ar: "الأستاذة فرح البطارنة" },
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
    who: { en: "Master of ceremonies: Ms. Farah Batarneh, Hamsa", ar: "عريفة الحفل: الأستاذة فرح البطارنة، Hamsa" },
  },
  {
    time: { en: "10:05 – 10:20", ar: "١٠:٠٥ – ١٠:٢٠" },
    title: { en: "Opening: Mountaliq, from Ghor Al-Safi to the region", ar: "العرض الافتتاحي: منطلق، من غور الصافي إلى المنطقة" },
    who: { en: "Dr. Oula Farawati, Mountaliq Director", ar: "د. علا الفرواتي، مديرة منطلق" },
  },
  {
    time: { en: "10:20 – 10:35", ar: "١٠:٢٠ – ١٠:٣٥" },
    title: { en: "Address by the Ministry of Digital Economy and Entrepreneurship", ar: "كلمة وزارة الاقتصاد الرقمي والريادة" },
    who: {
      en: "Mr. Sinan Kamal, Chief Technology and Digital Transformation Officer, on behalf of H.E. the Minister",
      ar: "الأستاذ سنان كمال، المدير التنفيذي للتكنولوجيا والتحول الرقمي، نيابةً عن معالي الوزير",
    },
  },
  {
    time: { en: "10:35 – 10:50", ar: "١٠:٣٥ – ١٠:٥٠" },
    title: { en: "Address by Jordan Bromine", ar: "كلمة شركة برومين الأردن" },
    who: { en: "Mr. Ayman Omoush, Managing Director, Jordan Bromine Company", ar: "الأستاذ أيمن العموش، المدير الإداري، شركة برومين الأردن" },
  },
  {
    time: { en: "10:50 – 11:30", ar: "١٠:٥٠ – ١١:٣٠" },
    title: { en: "First panel: Job creation in the AI economy", ar: "الجلسة الحوارية الأولى: خلق فرص العمل في اقتصاد الذكاء الاصطناعي" },
    who: {
      en: "Mr. Odeh Haddadin · Mr. Shaker Amayreh · Mr. Faisal Hakki. Moderated by Ms. Sinamis Bayouq",
      ar: "الأستاذ عودة حدادين · الأستاذ شاكر العمايرة · الأستاذ فيصل حقي. تدير الجلسة الأستاذة سناميس بيوق",
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
      en: "Dr. Abdullah Battah · Mr. Hamzeh Nasrallah · Ms. Amal Al-Sadi. Moderated by Mr. Abdul Fattah Darabseh",
      ar: "د. عبد الله بطاح · الأستاذ حمزة نصرالله · الأستاذة أمال السعدي. يدير الجلسة الأستاذ عبد الفتاح الدرابسة",
    },
    highlight: true,
  },
  {
    time: { en: "12:10 – 12:15", ar: "١٢:١٠ – ١٢:١٥" },
    title: { en: "A word from the graduates", ar: "كلمة الخريجين" },
    who: { en: "Mr. Saeed Al-Qaffaf", ar: "الأستاذ سعيد القفاف" },
  },
  {
    time: { en: "12:15 – 12:45", ar: "١٢:١٥ – ١٢:٤٥" },
    title: { en: "Certificate ceremony for the graduates", ar: "تسليم الشهادات للخريجين" },
    who: { en: "Ministry of Digital Economy and Entrepreneurship and Jordan Bromine Company", ar: "وزارة الاقتصاد الرقمي والريادة وشركة برومين الأردن" },
  },
  { time: { en: "12:45 – 12:55", ar: "١٢:٤٥ – ١٢:٥٥" }, title: { en: "Group photo", ar: "الصورة الجماعية" } },
  { time: { en: "12:55", ar: "١٢:٥٥" }, title: { en: "Closing and networking", ar: "الختام وبوفيه التواصل" } },
];
