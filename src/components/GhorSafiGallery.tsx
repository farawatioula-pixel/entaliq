import { Link } from "@/i18n/navigation";

type Loc = "en" | "ar";
type L = { en: string; ar: string };

const BASE = "/photos/ghor-safi";

/** Ghor Al-Safi digital skills camp, the first Mountaliq training. */
export const ghorSafiPhotos: { src: string; alt: L }[] = [
  { src: `${BASE}/group.jpg`, alt: { en: "Ghor Al-Safi camp participants and trainers", ar: "المشاركون والمدربون في معسكر غور الصافي" } },
  { src: `${BASE}/ecommerce-session.jpg`, alt: { en: "E-commerce session at the whiteboard", ar: "جلسة التجارة الإلكترونية" } },
  { src: `${BASE}/phone-workshop.jpg`, alt: { en: "Trainees working on content with their phones", ar: "متدربون يصنعون المحتوى بهواتفهم" } },
  { src: `${BASE}/oula-opening.jpg`, alt: { en: "Opening of the Mountaliq digital skills camp", ar: "افتتاح معسكر منطلق للمهارات الرقمية" } },
  { src: `${BASE}/teamwork.jpg`, alt: { en: "Trainees working together on a task", ar: "متدربون يعملون معاً على مهمة" } },
  { src: `${BASE}/trainer-content.jpg`, alt: { en: "Trainer walking through a real social media post", ar: "مدرب يشرح منشوراً حقيقياً على وسائل التواصل" } },
  { src: `${BASE}/peer-coaching.jpg`, alt: { en: "One-to-one coaching between sessions", ar: "إرشاد فردي بين الجلسات" } },
  { src: `${BASE}/notes.jpg`, alt: { en: "A trainee planning his idea on paper", ar: "متدرب يخطط لفكرته على الورق" } },
  { src: `${BASE}/trainer-talk.jpg`, alt: { en: "Trainer leading a discussion", ar: "مدرب يدير النقاش" } },
];

const text = {
  eyebrow: { en: "From Ghor Al-Safi to Amman", ar: "من غور الصافي إلى عمّان" },
  title: { en: "Ghor Al-Safi digital skills camp", ar: "معسكر المهارات الرقمية في غور الصافي" },
  body: {
    en: "Mountaliq's first training ran in Ghor Al-Safi with Jordan Bromine: hands-on sessions in e-commerce, content and selling online, right where young people live.",
    ar: "انطلق أول تدريب لمنطلق في غور الصافي بالشراكة مع برومين الأردن: جلسات عملية في التجارة الإلكترونية وصناعة المحتوى والبيع عبر الإنترنت، في المكان الذي يعيش فيه الشباب.",
  },
  more: { en: "Our story", ar: "قصتنا" },
  ammanTitle: { en: "Then Amman: the Khalda training", ar: "ثم عمّان: تدريب خلدا" },
  ammanBody: {
    en: "In November 2026 the training came to Amman: two hands-on days in Khalda, with participants from across the capital.",
    ar: "في تشرين الثاني ٢٠٢٦ وصل التدريب إلى عمّان: يومان عمليان في خلدا بمشاركة شباب وشابات من مختلف مناطق العاصمة.",
  },
};

export const ammanPhotos: { src: string; alt: L }[] = [
  { src: "/photos/amman/participants.jpg", alt: { en: "Participants at the Amman training in Khalda", ar: "المشاركون في تدريب عمّان في خلدا" } },
  { src: "/photos/amman/training-room.jpg", alt: { en: "The training room in Khalda", ar: "قاعة التدريب في خلدا" } },
];

function Img({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03] ${className}`} />
  );
}

/** Full mosaic on a dark band: used on the summit page. */
export function GhorSafiGallery({ locale }: { locale: Loc }) {
  const p = ghorSafiPhotos;
  return (
    <section className="bg-ink py-16 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">{text.eyebrow[locale]}</p>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">{text.title[locale]}</h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-neutral-300">{text.body[locale]}</p>

        <div className="mt-10 grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[200px] lg:grid-cols-4">
          <div className="col-span-2 row-span-2 overflow-hidden rounded-sm"><Img src={p[0].src} alt={p[0].alt[locale]} /></div>
          <div className="overflow-hidden rounded-sm"><Img src={p[1].src} alt={p[1].alt[locale]} /></div>
          <div className="overflow-hidden rounded-sm"><Img src={p[2].src} alt={p[2].alt[locale]} /></div>
          <div className="col-span-2 overflow-hidden rounded-sm"><Img src={p[3].src} alt={p[3].alt[locale]} className="object-[50%_30%]" /></div>
          {p.slice(4, 8).map((ph) => (
            <div key={ph.src} className="overflow-hidden rounded-sm">
              <Img src={ph.src} alt={ph.alt[locale]} />
            </div>
          ))}
        </div>

        <div className="mt-16 grid items-center gap-8 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red">Amman · 2026</p>
            <h3 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">{text.ammanTitle[locale]}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-neutral-300">{text.ammanBody[locale]}</p>
          </div>
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-2 aspect-[4/5] overflow-hidden rounded-2xl ring-4 ring-red">
              <Img src={ammanPhotos[0].src} alt={ammanPhotos[0].alt[locale]} className="object-[50%_60%]" />
            </div>
            <div className="col-span-3 overflow-hidden rounded-2xl ring-4 ring-cyan">
              <Img src={ammanPhotos[1].src} alt={ammanPhotos[1].alt[locale]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Four-photo strip: used on the homepage. */
export function GhorSafiStrip({ locale }: { locale: Loc }) {
  const pick = [0, 2, 1, 4].map((i) => ghorSafiPhotos[i]);
  return (
    <section className="border-b border-line bg-ink py-14 text-white sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">{text.eyebrow[locale]}</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{text.title[locale]}</h2>
          </div>
          <Link href="/about" className="inline-flex items-center gap-1 text-[15px] font-semibold text-cyan hover:underline">
            {text.more[locale]}
            <span className="inline-block rtl:-scale-x-100">→</span>
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {pick.map((ph) => (
            <div key={ph.src} className="aspect-[4/3] overflow-hidden rounded-sm">
              <Img src={ph.src} alt={ph.alt[locale]} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Single wide group photo with caption: used on the about page. */
export function GhorSafiFeature({ locale }: { locale: Loc }) {
  const ph = ghorSafiPhotos[0];
  return (
    <section className="mx-auto max-w-7xl px-5 pt-4 sm:px-8">
      <figure className="overflow-hidden rounded-sm border border-line">
        <div className="aspect-[16/9] sm:aspect-[21/9]">
          <Img src={ph.src} alt={ph.alt[locale]} className="object-[50%_40%] hover:scale-100" />
        </div>
        <figcaption className="bg-surface px-6 py-4 text-sm text-neutral-600">
          <span className="font-semibold text-fg">{text.title[locale]}.</span> {text.body[locale]}
        </figcaption>
      </figure>
    </section>
  );
}
