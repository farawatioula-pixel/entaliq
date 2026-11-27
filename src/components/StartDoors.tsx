"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import ListingAssistant from "@/components/ListingAssistant";
import { pexels } from "@/lib/photos";

type Loc = "en" | "ar";

const T = {
  eyebrow: { en: "Welcome to Mountaliq", ar: "أهلاً بك في منطلق" },
  title: { en: "What brings you to Mountaliq?", ar: "ما الذي جاء بك إلى منطلق؟" },
  sell: { en: "I want to sell my skills", ar: "أريد أن أبيع مهاراتي" },
  sellBody: {
    en: "Our assistant asks you a few questions, writes your profile and first service, and helps you publish. About 5 minutes.",
    ar: "يسألك مساعدنا بضعة أسئلة، يكتب ملفك وخدمتك الأولى، ويساعدك على النشر. حوالي ٥ دقائق.",
  },
  buy: { en: "I need a service", ar: "أحتاج خدمة" },
  buyBody: {
    en: "Browse services from Mountaliq-trained freelancers: design, content, websites, e-commerce, AI and more.",
    ar: "تصفّح خدمات مستقلين دربهم منطلق: تصميم، محتوى، مواقع، تجارة إلكترونية، ذكاء اصطناعي والمزيد.",
  },
  go: { en: "Let's go", ar: "هيا بنا" },
  browse: { en: "Browse services", ar: "تصفّح الخدمات" },
  back: { en: "← Back", ar: "→ رجوع" },
};

const SAVE_KEY = "mountaliq.assistant.v1";

export default function StartDoors(props: {
  locale: Loc;
  initialDoor: "sell" | null;
  userId: string | null;
  knownName: string;
  knownAvatar: string;
  categories: { id: string; slug: string; name: string }[];
  oauthProviders: string[];
}) {
  const { locale } = props;
  const [door, setDoor] = useState<"sell" | null>(props.initialDoor);

  // A conversation already in progress opens straight into the assistant.
  useEffect(() => {
    try {
      // Browser storage is only readable after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (localStorage.getItem(SAVE_KEY)) setDoor("sell");
    } catch {
      /* ignore */
    }
  }, []);

  if (door === "sell") {
    return (
      <div>
        <button onClick={() => setDoor(null)} className="mb-4 text-sm font-semibold text-muted hover:text-fg">
          {T.back[locale]}
        </button>
        <ListingAssistant
          locale={locale}
          userId={props.userId}
          knownName={props.knownName}
          knownAvatar={props.knownAvatar}
          categories={props.categories}
          oauthProviders={props.oauthProviders}
        />
      </div>
    );
  }

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"}>
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">{T.eyebrow[locale]}</p>
      <h1 className="mt-3 text-center font-display text-3xl font-bold text-fg sm:text-5xl">{T.title[locale]}</h1>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <button
          onClick={() => setDoor("sell")}
          className="group flex flex-col overflow-hidden rounded-3xl bg-violet text-start text-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl"
        >
          <div className="aspect-[16/9] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pexels(16313504, 800)} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <span className="font-display text-2xl font-bold">{T.sell[locale]}</span>
            <span className="mt-2 text-[15px] leading-relaxed text-white/85">{T.sellBody[locale]}</span>
            <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-volt px-5 py-2 text-sm font-bold text-ink">
              ✦ {T.go[locale]}
            </span>
          </div>
        </button>
        <Link
          href="/marketplace"
          className="group flex flex-col overflow-hidden rounded-3xl bg-ink text-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl"
        >
          <div className="aspect-[16/9] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pexels(8133809, 800)} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <span className="font-display text-2xl font-bold">{T.buy[locale]}</span>
            <span className="mt-2 text-[15px] leading-relaxed text-white/80">{T.buyBody[locale]}</span>
            <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-cyan px-5 py-2 text-sm font-bold text-ink">
              {T.browse[locale]}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
