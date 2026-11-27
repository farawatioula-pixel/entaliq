"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import ListingAssistant from "@/components/ListingAssistant";
import RequestAssistant from "@/components/RequestAssistant";
import { doorPhotos, photo, photoFocus } from "@/lib/photos";

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
    en: "Tell us what you need in 4 quick questions. Mountaliq-trained freelancers who do this work send you their offers.",
    ar: "أخبرنا بما تحتاجه في ٤ أسئلة سريعة، ويرسل لك مستقلو منطلق المتخصصون عروضهم.",
  },
  go: { en: "Let's go", ar: "هيا بنا" },
  browse: { en: "Post a request", ar: "اطلب خدمة" },
  orBrowse: { en: "or browse ready-made services", ar: "أو تصفّح الخدمات الجاهزة" },
  back: { en: "← Back", ar: "→ رجوع" },
};

const SAVE_KEY = "mountaliq.assistant.v1";

export default function StartDoors(props: {
  locale: Loc;
  initialDoor: "sell" | "buy" | null;
  userId: string | null;
  knownName: string;
  knownAvatar: string;
  categories: { id: string; slug: string; name: string }[];
  oauthProviders: string[];
}) {
  const { locale } = props;
  const [door, setDoor] = useState<"sell" | "buy" | null>(props.initialDoor);

  // A conversation already in progress opens straight into the assistant.
  useEffect(() => {
    try {
      // Browser storage is only readable after mount.
      if (props.initialDoor) return;
      const saved = localStorage.getItem(SAVE_KEY)
        ? "sell"
        : localStorage.getItem("mountaliq.request.v1")
          ? "buy"
          : null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setDoor(saved);
    } catch {
      /* ignore */
    }
  }, [props.initialDoor]);

  if (door === "buy") {
    return (
      <div>
        <button onClick={() => setDoor(null)} className="mb-4 text-sm font-semibold text-muted hover:text-fg">
          {T.back[locale]}
        </button>
        <RequestAssistant locale={locale} userId={props.userId} categories={props.categories} />
        <p className="mt-4 text-center text-sm">
          <Link href="/marketplace" className="font-semibold text-cyan-deep hover:underline">
            {T.orBrowse[locale]}
          </Link>
        </p>
      </div>
    );
  }

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
            <img src={photo(doorPhotos.sell)} alt="" style={{ objectPosition: photoFocus(doorPhotos.sell) }} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <span className="font-display text-2xl font-bold">{T.sell[locale]}</span>
            <span className="mt-2 text-[15px] leading-relaxed text-white/85">{T.sellBody[locale]}</span>
            <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-volt px-5 py-2 text-sm font-bold text-ink">
              ✦ {T.go[locale]}
            </span>
          </div>
        </button>
        <button
          onClick={() => setDoor("buy")}
          className="group flex flex-col overflow-hidden rounded-3xl bg-ink text-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl"
        >
          <div className="aspect-[16/9] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo(doorPhotos.buy)} alt="" style={{ objectPosition: photoFocus(doorPhotos.buy) }} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <span className="font-display text-2xl font-bold">{T.buy[locale]}</span>
            <span className="mt-2 text-[15px] leading-relaxed text-white/80">{T.buyBody[locale]}</span>
            <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-cyan px-5 py-2 text-sm font-bold text-ink">
              {T.browse[locale]}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
