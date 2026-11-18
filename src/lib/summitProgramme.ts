import type { LocalizedText } from "@/lib/data";

export type Speaker = {
  id: string;
  name: LocalizedText;
  title: LocalizedText;
  bio: LocalizedText;
  photo?: string;
  role?: "moderator";
};

export const speakers: Speaker[] = [
  {
    id: "sami-smeirat",
    name: { en: "H.E. Eng. Sami Smeirat", ar: "معالي المهندس سامي سميرات" },
    title: { en: "Minister of Digital Economy and Entrepreneurship", ar: "وزير الاقتصاد الرقمي والريادة" },
    bio: {
      en: "Decades of leadership in telecoms, IT and digital services, including Deputy CEO of Orange Jordan, CEO of Orange Internet and Chairman of Orange Money, with board roles across leading Jordanian and regional institutions.",
      ar: "يتمتع بخبرة قيادية تمتد لعقود في قطاعات الاتصالات وتكنولوجيا المعلومات والخدمات الرقمية، من أبرزها نائب الرئيس التنفيذي لمجموعة الاتصالات الأردنية – أورنج الأردن، والرئيس التنفيذي لأورنج إنترنت، ورئاسة مجلس إدارة Orange Money، إلى جانب عضوية مجالس إدارة عدد من المؤسسات داخل الأردن وخارجه.",
    },
    photo: "/speakers/sami-smeirat.jpg",
  },
  {
    id: "samer-asfour",
    name: { en: "Mr. Samer Asfour", ar: "السيد سامر عصفور" },
    title: { en: "General Manager, Jordan Bromine", ar: "المدير العام، شركة برومين الأردن" },
    bio: {
      en: "Former Regional Director of Tesla Middle East and Director General of the Jordan Investment Board, with several senior roles at the Royal Hashemite Court. Member of YPO and the Forum of Young Global Leaders.",
      ar: "شغل سابقاً منصب المدير الإقليمي لتسلا الشرق الأوسط، ومدير عام مؤسسة تشجيع الاستثمار، وعدة مواقع في الديوان الملكي الهاشمي. عضو في منظمة الرؤساء التنفيذيين الشباب (YPO) ومجلس القيادات العالمية الشابة.",
    },
    photo: "/speakers/samer-asfour.jpg",
  },
  {
    id: "odeh-haddadin",
    name: { en: "Mr. Odeh Haddadin", ar: "السيد عودة حدادين" },
    title: {
      en: "Digital Business Sector Manager, Ministry of Digital Economy and Entrepreneurship",
      ar: "مدير تطوير القطاع الرقمي، مشروع الشباب والتكنولوجيا والوظائف، وزارة الاقتصاد الرقمي والريادة",
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
    id: "shorouq-hilal",
    name: { en: "Ms. Shorouq Hilal", ar: "الأستاذة شروق هلال" },
    title: {
      en: "Spokesperson and Head of Communication, Outreach and Social Media, Ministry of Digital Economy and Entrepreneurship",
      ar: "الناطق الإعلامي ورئيسة قسم الاتصال والتواصل والإعلام الاجتماعي، وزارة الاقتصاد الرقمي والريادة",
    },
    bio: {
      en: "Nearly two decades at the Ministry, leading strategic communications for national digital transformation programmes such as Sanad, Jordan Source and Youth, Technology and Jobs. She developed Jordan's Government Social Media Guidelines and moderates the panel.",
      ar: "تمتد خبرتها في الوزارة قرابة عقدين، تقود خلالها الاتصال الاستراتيجي لبرامج التحول الرقمي الوطنية مثل «سند» و«Jordan Source» ومشروع الشباب والتكنولوجيا والوظائف. أعدّت الدليل الحكومي لاستخدام وسائل التواصل الاجتماعي، وتدير الجلسة الحوارية.",
    },
    photo: "/speakers/shorouq-hilal.jpg",
    role: "moderator",
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
  { time: { en: "10:00 – 10:05", ar: "١٠:٠٠ – ١٠:٠٥" }, title: { en: "Royal anthem and opening", ar: "السلام الملكي وافتتاح الحفل" } },
  {
    time: { en: "10:05 – 10:20", ar: "١٠:٠٥ – ١٠:٢٠" },
    title: { en: "Opening: Mountaliq, from Ghor Al-Safi to the region", ar: "العرض الافتتاحي: منطلق، من غور الصافي إلى المنطقة" },
    who: { en: "Dr. Oula Farawati, Mountaliq Founder", ar: "د. علا الفرواتي، مؤسِّسة منطلق" },
  },
  {
    time: { en: "10:20 – 10:30", ar: "١٠:٢٠ – ١٠:٣٠" },
    title: { en: "Address by Jordan Bromine", ar: "كلمة شركة برومين الأردن" },
    who: { en: "Mr. Samer Asfour, General Manager", ar: "السيد سامر عصفور، المدير العام" },
  },
  {
    time: { en: "10:30 – 10:40", ar: "١٠:٣٠ – ١٠:٤٠" },
    title: { en: "Address by the Ministry of Digital Economy and Entrepreneurship", ar: "كلمة وزارة الاقتصاد الرقمي والريادة" },
    who: { en: "H.E. Eng. Sami Smeirat, Minister", ar: "معالي المهندس سامي سميرات، الوزير" },
  },
  {
    time: { en: "10:40 – 11:40", ar: "١٠:٤٠ – ١١:٤٠" },
    title: { en: "National dialogue: Job creation in the AI economy", ar: "الجلسة الحوارية: خلق فرص العمل في اقتصاد الذكاء الاصطناعي" },
    who: {
      en: "Mr. Odeh Haddadin · Mr. Shaker Amayreh · Mr. Faisal Hakki. Moderated by Ms. Shorouq Hilal",
      ar: "السيد عودة حدادين · السيد شاكر العمايرة · السيد فيصل حقي. تدير الجلسة الأستاذة شروق هلال",
    },
    highlight: true,
  },
  { time: { en: "11:40 – 11:45", ar: "١١:٤٠ – ١١:٤٥" }, title: { en: "A word from a graduate", ar: "كلمة أحد الخريجين" } },
  {
    time: { en: "11:45 – 12:15", ar: "١١:٤٥ – ١٢:١٥" },
    title: { en: "Certificate ceremony for the 100 graduates", ar: "تسليم الشهادات للخريجين المئة" },
    who: { en: "H.E. the Minister and Mr. Samer Asfour", ar: "معالي الوزير والسيد سامر عصفور" },
  },
  { time: { en: "12:15 – 12:25", ar: "١٢:١٥ – ١٢:٢٥" }, title: { en: "Group photo", ar: "الصورة الجماعية" } },
  { time: { en: "12:25", ar: "١٢:٢٥" }, title: { en: "Closing and networking", ar: "الختام وبوفيه التواصل" } },
];
