import type { ProfileCategory } from "@/lib/types";
import type { LocalizedText } from "@/lib/data";

export type Guide = {
  slug: string;
  category: ProfileCategory;
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText[];
};

export const guides: Guide[] = [
  {
    slug: "start-an-online-store-in-jordan",
    category: "ecommerce",
    title: {
      en: "How to Start an Online Store in Jordan",
      ar: "كيف تبدأ متجرًا إلكترونيًا في الأردن",
    },
    excerpt: {
      en: "The practical steps to launch a store, list products, and get your first cash-on-delivery order out the door.",
      ar: "الخطوات العملية لإطلاق متجر، وعرض المنتجات، وإخراج أول طلب دفع عند الاستلام.",
    },
    body: [
      {
        en: "Every online store starts with a narrow, specific product idea, not a general catalog. Pick one category you understand well, whether that's phone accessories, homemade skincare, or imported kitchenware, and build your first ten listings around it.",
        ar: "كل متجر إلكتروني ناجح يبدأ بفكرة منتج محددة وضيقة، لا بكتالوج عام. اختر فئة واحدة تفهمها جيدًا، سواء كانت إكسسوارات الهواتف أو منتجات العناية بالبشرة المنزلية أو أدوات المطبخ المستوردة، وابنِ أول عشرة منتجات حولها.",
      },
      {
        en: "Cash-on-delivery is still how most shoppers in Jordan pay, so your logistics plan has to account for it from day one. Line up a courier that supports COD collection and confirm their coverage area before you take your first order.",
        ar: "الدفع عند الاستلام لا يزال الطريقة التي يفضلها معظم المتسوقين في الأردن، لذا يجب أن تراعي خطتك اللوجستية ذلك من اليوم الأول. رتّب مع شركة توصيل تدعم تحصيل الدفع عند الاستلام وتأكد من تغطيتها الجغرافية قبل استلام أول طلب.",
      },
      {
        en: "Product photos sell more than product descriptions. A clean background, consistent lighting, and three angles per item will outperform a paragraph of marketing copy every time.",
        ar: "صور المنتج تبيع أكثر من الوصف المكتوب. خلفية نظيفة، إضاءة ثابتة، وثلاث زوايا لكل منتج ستتفوق دائمًا على فقرة تسويقية طويلة.",
      },
      {
        en: "Confirm every order by phone or WhatsApp before it ships. This single habit cuts return-to-sender rates dramatically and builds trust with first-time buyers who are still unsure about ordering online.",
        ar: "تأكد من كل طلب عبر الهاتف أو واتساب قبل شحنه. هذه العادة وحدها تقلل بشكل كبير من نسبة الطلبات المرتجعة، وتبني الثقة مع المشترين الجدد الذين ما زالوا مترددين تجاه الشراء عبر الإنترنت.",
      },
      {
        en: "Once you have 20-30 orders behind you, look at which products repeat and which sit unsold. Cut the slow movers and double down on what's already working before adding new categories.",
        ar: "بعد إتمام 20-30 طلبًا، راجع أي المنتجات تتكرر مبيعاتها وأيها لا يُباع. تخلَّ عن المنتجات البطيئة وركّز على ما يعمل بالفعل قبل إضافة فئات جديدة.",
      },
    ],
  },
  {
    slug: "affiliate-marketing-with-no-budget",
    category: "digital-marketing",
    title: {
      en: "Affiliate Marketing With Zero Starting Budget",
      ar: "التسويق بالعمولة بدون رأس مال",
    },
    excerpt: {
      en: "How to pick offers, build an audience, and track commissions without spending on ads first.",
      ar: "كيف تختار العروض، وتبني جمهورًا، وتتابع عمولاتك دون إنفاق على الإعلانات أولاً.",
    },
    body: [
      {
        en: "Affiliate marketing works by promoting products you don't own and earning a commission per sale. The appeal is real: no inventory, no shipping, no customer support. But it only pays once you have an audience that trusts your recommendations.",
        ar: "التسويق بالعمولة يعتمد على الترويج لمنتجات لا تملكها مقابل عمولة عن كل عملية بيع. الفكرة مغرية فعلاً: لا مخزون، لا شحن، لا خدمة عملاء. لكنه لا يُدرّ عائدًا إلا بعد أن يكون لديك جمهور يثق بتوصياتك.",
      },
      {
        en: "Start with one platform, not five. Whether it's Instagram Reels, TikTok, or a niche Facebook group, consistency on one channel beats a thin presence spread across all of them.",
        ar: "ابدأ بمنصة واحدة، لا بخمس منصات. سواء كانت إنستغرام ريلز أو تيك توك أو مجموعة فيسبوك متخصصة، الاستمرارية على قناة واحدة أفضل من حضور ضعيف موزّع على جميعها.",
      },
      {
        en: "Choose offers you'd actually recommend to a friend. Audiences can tell the difference between a genuine recommendation and a paid plug, and the former converts at a much higher rate over time.",
        ar: "اختر العروض التي كنت ستنصح بها صديقًا فعلاً. الجمهور يستطيع تمييز التوصية الصادقة من الترويج المدفوع، والأولى تحقق معدل تحويل أعلى بكثير على المدى الطويل.",
      },
      {
        en: "Use a link tracker from day one, even a free one, so you know exactly which post or platform drove each sale. Without this, you're guessing at what's actually working.",
        ar: "استخدم أداة تتبع للروابط منذ اليوم الأول، حتى لو كانت مجانية، لتعرف بالضبط أي منشور أو منصة حقق كل عملية بيع. دون ذلك، ستكون تخميناتك عشوائية حول ما ينجح فعلاً.",
      },
      {
        en: "Commissions from Jordan-facing platforms can take weeks to arrive and often require a minimum payout threshold. Plan around that delay so cash flow doesn't catch you off guard early on.",
        ar: "قد تستغرق العمولات من المنصات العاملة في الأردن أسابيع للوصول، وغالبًا ما تتطلب حدًا أدنى للسحب. خطط لهذا التأخير حتى لا تفاجئك مشكلة السيولة في البداية.",
      },
    ],
  },
  {
    slug: "build-your-first-website-with-no-code",
    category: "programming-tech",
    title: {
      en: "Build Your First Website Without Writing Code",
      ar: "أنشئ موقعك الإلكتروني الأول دون كتابة أي كود",
    },
    excerpt: {
      en: "A realistic path from zero to a live, working website using today's no-code tools.",
      ar: "مسار واقعي من الصفر إلى موقع إلكتروني فعلي باستخدام أدوات البناء بدون كود.",
    },
    body: [
      {
        en: "You don't need to learn to code to launch a working website today. No-code builders now handle hosting, design, and basic functionality, which means your time is better spent on content and structure than on syntax.",
        ar: "لا تحتاج إلى تعلّم البرمجة لإطلاق موقع إلكتروني فعّال اليوم. أدوات البناء بدون كود أصبحت تتكفل بالاستضافة والتصميم والوظائف الأساسية، ما يعني أن وقتك يُستثمر بشكل أفضل في المحتوى والتنظيم بدلاً من الأكواد.",
      },
      {
        en: "Before opening any builder, sketch your site on paper: how many pages, what each one needs to say, and what action you want a visitor to take on each. This saves hours of directionless clicking later.",
        ar: "قبل فتح أي أداة بناء، ارسم موقعك على ورقة: كم عدد الصفحات، وما الذي يجب أن تقوله كل صفحة، وما الإجراء الذي تريد أن يتخذه الزائر في كل واحدة. هذا يوفر ساعات من التنقل العشوائي لاحقًا.",
      },
      {
        en: "Mobile matters more than desktop for most Jordanian visitors. Preview every page on a phone-sized screen before you consider it finished.",
        ar: "الجوال أهم من سطح المكتب لمعظم الزوار في الأردن. راجع كل صفحة بحجم شاشة الهاتف قبل اعتبارها جاهزة.",
      },
      {
        en: "Connect a real domain as soon as the site is usable, even if it's not perfect. A live domain lets you start collecting feedback and search visibility earlier instead of polishing in isolation.",
        ar: "اربط نطاقًا حقيقيًا بمجرد أن يصبح الموقع قابلاً للاستخدام، حتى لو لم يكن مثاليًا. النطاق الفعلي يتيح لك جمع الملاحظات وبدء الظهور في محركات البحث مبكرًا بدلاً من التحسين في عزلة.",
      },
      {
        en: "Once the site is live, add basic analytics before you add anything else. You can't improve a page you're not measuring, and this is the single most skipped step by first-time builders.",
        ar: "بمجرد أن يصبح الموقع مباشرًا، أضف أدوات تحليل أساسية قبل أي إضافة أخرى. لا يمكنك تحسين صفحة لا تقيسها، وهذه الخطوة هي الأكثر إهمالاً من قبل من يبني موقعًا للمرة الأولى.",
      },
    ],
  },
  {
    slug: "freelance-writing-first-clients",
    category: "writing-translation",
    title: {
      en: "Landing Your First Freelance Writing Clients",
      ar: "كيف تحصل على أول عملاء لك في الكتابة الحرة",
    },
    excerpt: {
      en: "What actually gets a new freelance writer hired, before you have reviews or a long portfolio.",
      ar: "ما الذي يجعل عميلاً يوظف كاتبًا حرًا جديدًا فعلاً، قبل أن تملك تقييمات أو معرض أعمال طويل.",
    },
    body: [
      {
        en: "Clients hiring a writer for the first time care about one thing above all: can this person understand my business well enough to write like they work here. Your pitch should prove that, not just list your skills.",
        ar: "العميل الذي يوظف كاتبًا لأول مرة يهتم بشيء واحد قبل كل شيء: هل يفهم هذا الشخص عملي بما يكفي ليكتب وكأنه يعمل هنا فعلاً. عرضك يجب أن يثبت ذلك، لا أن يكتفي بسرد مهاراتك.",
      },
      {
        en: "Three strong writing samples beat ten mediocre ones. Choose samples that match the kind of work you want more of, not just whatever you have available.",
        ar: "ثلاث عينات كتابة قوية أفضل من عشر عينات متوسطة. اختر عينات تتوافق مع نوع العمل الذي تريد المزيد منه، لا فقط ما هو متاح لديك.",
      },
      {
        en: "When you don't have client work yet, write two or three sample pieces specifically for the niche you want to enter, a mock product description, a sample blog post, and use those as your portfolio starting point.",
        ar: "إذا لم يكن لديك أعمال سابقة مع عملاء بعد، اكتب قطعتين أو ثلاث مخصصة للمجال الذي تريد دخوله، مثل وصف منتج تجريبي أو مقالة مدونة نموذجية، واستخدمها كنقطة انطلاق لمعرض أعمالك.",
      },
      {
        en: "Price by project scope, not by the hour, when you're starting out. Hourly rates invite clients to question every minute; project rates let you work efficiently without justifying your pace.",
        ar: "سعّر عملك حسب نطاق المشروع لا بالساعة، خصوصًا في البداية. التسعير بالساعة يدفع العميل لمساءلة كل دقيقة، بينما تسعير المشروع يتيح لك العمل بكفاءة دون تبرير وتيرتك.",
      },
      {
        en: "Ask every satisfied client for a short written reference before the project officially closes. Waiting until later means the request often never gets sent, and reviews are what turn a first client into a second one.",
        ar: "اطلب من كل عميل راضٍ توصية مكتوبة قصيرة قبل إغلاق المشروع رسميًا. الانتظار لوقت لاحق يعني غالبًا أن الطلب لن يُرسل أبدًا، والتقييمات هي ما يحوّل العميل الأول إلى عميل ثانٍ.",
      },
    ],
  },
  {
    slug: "getting-started-with-paid-ai-services",
    category: "ai-services",
    title: {
      en: "Offering Paid AI Services as a New Freelancer",
      ar: "تقديم خدمات الذكاء الاصطناعي المدفوعة كمستقل جديد",
    },
    excerpt: {
      en: "How to package AI tools into a service businesses will actually pay for, rather than selling access to a chatbot.",
      ar: "كيف تحوّل أدوات الذكاء الاصطناعي إلى خدمة سيدفع العملاء ثمنها فعلاً، بدلاً من بيع مجرد الوصول لروبوت محادثة.",
    },
    body: [
      {
        en: "Nobody pays for 'access to AI' anymore, tools are free or nearly free. What businesses pay for is someone who knows how to turn AI output into a finished, usable result without the back-and-forth.",
        ar: "لم يعد أحد يدفع مقابل 'الوصول إلى الذكاء الاصطناعي'، فالأدوات مجانية أو شبه مجانية. ما يدفع العملاء مقابله هو شخص يعرف كيف يحوّل مخرجات الذكاء الاصطناعي إلى نتيجة نهائية جاهزة للاستخدام دون تكرار المحاولة.",
      },
      {
        en: "Package your offer around a specific business outcome: automated customer replies, product descriptions at scale, a chatbot trained on their FAQ, not around the tool itself.",
        ar: "بنِ عرضك حول نتيجة عمل محددة: ردود تلقائية على العملاء، أوصاف منتجات بكميات كبيرة، روبوت محادثة مدرّب على الأسئلة الشائعة الخاصة بهم، لا حول الأداة نفسها.",
      },
      {
        en: "Always review AI output before delivering it. Clients are paying for reliability, and a single obviously wrong or fabricated detail can end the relationship immediately.",
        ar: "راجع دائمًا مخرجات الذكاء الاصطناعي قبل تسليمها. العميل يدفع مقابل الموثوقية، وأي تفصيل خاطئ أو ملفّق بشكل واضح قد ينهي العلاقة فورًا.",
      },
      {
        en: "Be upfront that AI is part of your process. Most clients don't mind, what matters to them is the quality and speed of the final result, not how you got there.",
        ar: "كن واضحًا بأن الذكاء الاصطناعي جزء من طريقة عملك. معظم العملاء لا يمانعون ذلك، فما يهمهم هو جودة النتيجة النهائية وسرعتها، لا الطريقة التي وصلت بها إليها.",
      },
      {
        en: "Start with a narrow specialty, like AI-assisted product photography edits or automated WhatsApp responses, rather than offering 'general AI services.' Narrow offers are easier to price, market, and deliver consistently.",
        ar: "ابدأ بتخصص ضيق، مثل تعديل صور المنتجات بمساعدة الذكاء الاصطناعي أو الردود التلقائية عبر واتساب، بدلاً من تقديم 'خدمات ذكاء اصطناعي عامة'. العروض الضيقة أسهل في التسعير والتسويق والتسليم بجودة ثابتة.",
      },
    ],
  },
  {
    slug: "pricing-your-consulting-services",
    category: "business-consulting",
    title: {
      en: "How to Price Your Consulting Services With Confidence",
      ar: "كيف تسعّر خدماتك الاستشارية بثقة",
    },
    excerpt: {
      en: "A simple framework for setting rates you won't want to lower six months in.",
      ar: "إطار عمل بسيط لتحديد أسعار لن ترغب بخفضها بعد ستة أشهر.",
    },
    body: [
      {
        en: "Most new consultants underprice out of fear of losing the client, then spend the next year trying to raise rates on people who already anchored to the low number. Price correctly the first time.",
        ar: "معظم المستشارين الجدد يسعّرون بأقل من قيمتهم خوفًا من خسارة العميل، ثم يقضون العام التالي يحاولون رفع أسعارهم مع عملاء تعوّدوا بالفعل على الرقم المنخفض. سعّر بشكل صحيح من المرة الأولى.",
      },
      {
        en: "Price around the value of the outcome you deliver, not the hours you spend. A strategy that saves a client thousands is worth more than the two hours it took to write it.",
        ar: "سعّر حسب قيمة النتيجة التي تحققها، لا حسب الساعات التي تقضيها. استراتيجية توفر على العميل آلاف الدنانير تساوي أكثر بكثير من الساعتين اللتين استغرقتهما كتابتها.",
      },
      {
        en: "Have three package tiers ready before your first sales call: a lean version, a standard version, and a comprehensive one. Clients decide faster when comparing options than when facing a single yes/no price.",
        ar: "جهّز ثلاث باقات قبل أول مكالمة بيع: نسخة مبسطة، ونسخة قياسية، ونسخة شاملة. يتخذ العملاء قرارهم بشكل أسرع عند المقارنة بين خيارات بدلاً من مواجهة سعر واحد بنعم أو لا.",
      },
      {
        en: "Never quote a price on the spot in the first conversation. Take the details, follow up in writing within a day, and use that time to scope the work properly.",
        ar: "لا تُعلن السعر فورًا في أول محادثة. اجمع التفاصيل، وتابع كتابيًا خلال يوم واحد، واستخدم هذا الوقت لتحديد نطاق العمل بدقة.",
      },
      {
        en: "Revisit your rates every six months regardless of how business is going. Rates that never change quietly become underpriced as your experience and results improve.",
        ar: "راجع أسعارك كل ستة أشهر بغض النظر عن سير العمل. الأسعار التي لا تتغير أبدًا تصبح تدريجيًا أقل من قيمتك الحقيقية مع تحسّن خبرتك ونتائجك.",
      },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}
