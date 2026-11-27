"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

/**
 * "أحتاج خدمة" — a short guided chat for buyers. Four quick questions, then the
 * request is posted and sent to every matching Mountaliq freelancer
 * (chat message + bell notification + email). Works logged out: the draft is
 * kept in the browser and posted after sign-in.
 */

type Loc = "en" | "ar";
type Cat = { id: string; slug: string; name: string };
type Draft = { need: string; category: string; budget: string; deadline: string; details: string; title: string };
type Step = "need" | "category" | "budget" | "deadline" | "details" | "review" | "done";

const SAVE_KEY = "mountaliq.request.v1";

const T = {
  header: { en: "Tell us what you need", ar: "أخبرنا ماذا تحتاج" },
  sub: {
    en: "4 quick questions. We send your request to the Mountaliq freelancers who do this work, and their offers come to your messages.",
    ar: "٤ أسئلة سريعة. نرسل طلبك إلى مستقلي منطلق المتخصصين، وتصلك عروضهم في رسائلك.",
  },
  qNeed: { en: "Hi! What do you need done? Describe it in a sentence or two.", ar: "أهلاً! ما الخدمة التي تحتاجها؟ صِفها في جملة أو جملتين." },
  needPh: { en: "e.g. A logo and Instagram posts for my bakery", ar: "مثلاً: شعار ومنشورات إنستغرام لمخبزي" },
  ideas: {
    en: ["A logo for my business", "Social media posts for a month", "A simple website", "An online store", "A short promo video"],
    ar: ["شعار لمشروعي", "منشورات سوشال ميديا لمدة شهر", "موقع إلكتروني بسيط", "متجر إلكتروني", "فيديو ترويجي قصير"],
  },
  qCategory: { en: "Which field is closest?", ar: "أي مجال هو الأقرب؟" },
  qBudget: { en: "Roughly what's your budget?", ar: "كم ميزانيتك تقريباً؟" },
  budgets: {
    en: ["Under 50 JOD", "50 – 150 JOD", "150 – 500 JOD", "Over 500 JOD", "Not sure yet"],
    ar: ["أقل من ٥٠ دينار", "٥٠ – ١٥٠ دينار", "١٥٠ – ٥٠٠ دينار", "أكثر من ٥٠٠ دينار", "لست متأكداً بعد"],
  },
  qDeadline: { en: "When do you need it?", ar: "متى تحتاجها؟" },
  deadlines: {
    en: ["Within a week", "Within 2 weeks", "Within a month", "Flexible"],
    ar: ["خلال أسبوع", "خلال أسبوعين", "خلال شهر", "مرن"],
  },
  qDetails: {
    en: "Anything else the freelancer should know? (style, links, quantities…)",
    ar: "هل هناك تفاصيل أخرى يجب أن يعرفها المستقل؟ (الأسلوب، روابط، الكمية…)",
  },
  detailsPh: { en: "Optional", ar: "اختياري" },
  skip: { en: "Skip", ar: "تخطّ" },
  send: { en: "Send", ar: "إرسال" },
  review: { en: "Here's your request. Edit anything, then post it.", ar: "هذا طلبك. عدّل ما تريد ثم انشره." },
  titleLabel: { en: "Title", ar: "العنوان" },
  descLabel: { en: "Description", ar: "الوصف" },
  post: { en: "Post my request", ar: "انشر طلبي" },
  posting: { en: "Sending to freelancers…", ar: "جارٍ الإرسال إلى المستقلين…" },
  loginToPost: { en: "Sign in to post (your answers are saved)", ar: "سجّل الدخول لنشر طلبك (إجاباتك محفوظة)" },
  signup: { en: "New here? Create an account", ar: "جديد؟ أنشئ حساباً" },
  restart: { en: "Start over", ar: "ابدأ من جديد" },
  doneTitle: { en: "Your request is out!", ar: "تم إرسال طلبك!" },
  doneBody: {
    en: "We sent it to {n} Mountaliq freelancers. Their replies and offers will arrive in your messages, and you'll get a notification.",
    ar: "أرسلناه إلى {n} من مستقلي منطلق. ستصلك ردودهم وعروضهم في رسائلك مع إشعار.",
  },
  doneNone: {
    en: "Your request is saved, but no freelancer offers this kind of service yet. Try a closer field, or browse the marketplace.",
    ar: "تم حفظ طلبك، لكن لا يوجد بعد مستقل يقدّم هذا النوع من الخدمات. جرّب مجالاً أقرب، أو تصفّح المتجر.",
  },
  toMessages: { en: "Go to my messages", ar: "اذهب إلى رسائلي" },
  browse: { en: "Browse services instead", ar: "أو تصفّح الخدمات" },
  errLimit: { en: "You've posted 5 requests today. Try again tomorrow.", ar: "نشرت ٥ طلبات اليوم. حاول مجدداً غداً." },
  errShort: { en: "Please add a bit more detail.", ar: "أضف تفاصيل أكثر قليلاً من فضلك." },
  errGeneric: { en: "Something went wrong. Please try again.", ar: "حدث خطأ. حاول مرة أخرى." },
};

// Used only if the category list could not be loaded.
const FALLBACK_CATS: { slug: string; en: string; ar: string }[] = [
  { slug: "graphics-design", en: "Graphics & Design", ar: "الجرافيك والتصميم" },
  { slug: "digital-marketing", en: "Digital Marketing", ar: "التسويق الرقمي" },
  { slug: "writing-translation", en: "Writing & Translation", ar: "الكتابة والترجمة" },
  { slug: "video-animation", en: "Video & Animation", ar: "الفيديو والرسوم المتحركة" },
  { slug: "programming-tech", en: "Programming & Tech", ar: "البرمجة والتقنية" },
  { slug: "ai-services", en: "AI Services", ar: "خدمات الذكاء الاصطناعي" },
  { slug: "business-consulting", en: "Business & Consulting", ar: "الأعمال والاستشارات" },
  { slug: "ecommerce", en: "E-commerce", ar: "التجارة الإلكترونية" },
];

const empty: Draft = { need: "", category: "", budget: "", deadline: "", details: "", title: "" };

function makeTitle(need: string) {
  const first = need.split(/\n|[.!؟?]/)[0].trim();
  return (first.length > 80 ? first.slice(0, 78) + "…" : first) || need.slice(0, 80);
}

export default function RequestAssistant({
  locale,
  userId,
  categories: loaded,
}: {
  locale: Loc;
  userId: string | null;
  categories: Cat[];
}) {
  const categories: Cat[] = loaded.length
    ? loaded
    : FALLBACK_CATS.map((c) => ({ id: c.slug, slug: c.slug, name: c[locale] }));
  const [draft, setDraft] = useState<Draft>(empty);
  const [step, setStep] = useState<Step>("need");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [matched, setMatched] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);
  const rtl = locale === "ar";

  // Resume a saved draft (e.g. after signing in).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { draft: Draft; step: Step };
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDraft(saved.draft);
        setStep(saved.step === "done" ? "need" : saved.step);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      if (step === "done" || !draft.need) localStorage.removeItem(SAVE_KEY);
      else localStorage.setItem(SAVE_KEY, JSON.stringify({ draft, step }));
    } catch {
      /* ignore */
    }
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [draft, step]);

  const order: Step[] = ["need", "category", "budget", "deadline", "details", "review"];
  const stepIndex = order.indexOf(step);

  function answer(value: string) {
    const v = value.trim();
    setInput("");
    setError("");
    if (step === "need") {
      if (v.length < 6) return setError(T.errShort[locale]);
      setDraft((d) => ({ ...d, need: v, title: d.title || makeTitle(v) }));
      setStep("category");
    } else if (step === "category") {
      setDraft((d) => ({ ...d, category: v }));
      setStep("budget");
    } else if (step === "budget") {
      setDraft((d) => ({ ...d, budget: v }));
      setStep("deadline");
    } else if (step === "deadline") {
      setDraft((d) => ({ ...d, deadline: v }));
      setStep("details");
    } else if (step === "details") {
      setDraft((d) => ({ ...d, details: v }));
      setStep("review");
    }
  }

  const description = [draft.need, draft.details].filter(Boolean).join("\n\n");

  async function post() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title || makeTitle(draft.need),
          description,
          category: draft.category,
          budget: draft.budget,
          deadline: draft.deadline,
          locale,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          json.error === "daily_limit" ? T.errLimit[locale] : json.error === "too_short" ? T.errShort[locale] : T.errGeneric[locale]
        );
        return;
      }
      setMatched(json.matched ?? 0);
      setStep("done");
    } catch {
      setError(T.errGeneric[locale]);
    } finally {
      setBusy(false);
    }
  }

  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

  // The conversation so far, rebuilt from the draft.
  const turns: { role: "bot" | "me"; text: string }[] = [{ role: "bot", text: T.qNeed[locale] }];
  if (stepIndex > 0 || step === "done") turns.push({ role: "me", text: draft.need });
  if (stepIndex >= 1) turns.push({ role: "bot", text: T.qCategory[locale] });
  if (stepIndex > 1) turns.push({ role: "me", text: catName(draft.category) });
  if (stepIndex >= 2) turns.push({ role: "bot", text: T.qBudget[locale] });
  if (stepIndex > 2) turns.push({ role: "me", text: draft.budget });
  if (stepIndex >= 3) turns.push({ role: "bot", text: T.qDeadline[locale] });
  if (stepIndex > 3) turns.push({ role: "me", text: draft.deadline });
  if (stepIndex >= 4) turns.push({ role: "bot", text: T.qDetails[locale] });
  if (stepIndex > 4 && draft.details) turns.push({ role: "me", text: draft.details });
  if (step === "review") turns.push({ role: "bot", text: T.review[locale] });

  const chip =
    "rounded-full border-2 border-cyan bg-cyan/5 px-4 py-1.5 text-sm font-semibold text-cyan-deep transition-colors hover:bg-cyan hover:text-ink";
  const field =
    "w-full rounded-xl border border-line bg-paper px-4 py-3 text-[15px] text-fg focus:border-cyan-deep focus:outline-none";

  const chips: string[] | null =
    step === "need"
      ? T.ideas[locale]
      : step === "budget"
        ? T.budgets[locale]
        : step === "deadline"
          ? T.deadlines[locale]
          : null;

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="overflow-hidden rounded-3xl border border-line bg-surface shadow-xl">
      <div className="relative overflow-hidden bg-ink px-6 py-6 text-white sm:px-8">
        <div aria-hidden className="pointer-events-none absolute -end-16 -top-20 h-56 w-56 rounded-full bg-cyan opacity-30 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan/15 text-xl">📣</span>
          <div>
            <p className="font-display text-xl font-bold">{T.header[locale]}</p>
            <p className="mt-1 text-sm text-white/70">{T.sub[locale]}</p>
          </div>
        </div>
        {step !== "done" && (
          <div className="relative mt-5 flex gap-1.5">
            {order.map((s, i) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full ${i < stepIndex ? "bg-volt" : i === stepIndex ? "bg-cyan" : "bg-white/15"}`} />
            ))}
          </div>
        )}
      </div>

      {step === "done" ? (
        <div className="bg-paper px-5 py-10 text-center sm:px-8">
          <p className="text-4xl">{matched > 0 ? "🎉" : "📝"}</p>
          <p className="mt-3 font-display text-2xl font-bold text-fg">{T.doneTitle[locale]}</p>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-neutral-600">
            {matched > 0 ? T.doneBody[locale].replace("{n}", String(matched)) : T.doneNone[locale]}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/messages" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">
              {T.toMessages[locale]}
            </Link>
            <Link href="/marketplace" className="rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold text-fg">
              {T.browse[locale]}
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="max-h-[60vh] min-h-[300px] space-y-4 overflow-y-auto overscroll-contain bg-paper px-5 py-6 sm:px-8">
            {turns.map((t, i) => (
              <div key={i} className={`flex ${t.role === "me" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                    t.role === "me" ? "bg-ink text-white" : "border border-line bg-surface text-fg"
                  }`}
                >
                  {t.text}
                </div>
              </div>
            ))}

            {step === "review" && (
              <div className="rounded-2xl border-2 border-cyan bg-surface p-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">{T.titleLabel[locale]}</label>
                <input
                  value={draft.title}
                  maxLength={120}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                  className={`mt-1 ${field}`}
                />
                <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-neutral-500">{T.descLabel[locale]}</label>
                <textarea
                  value={description}
                  rows={5}
                  maxLength={4000}
                  onChange={(e) => setDraft((d) => ({ ...d, need: e.target.value, details: "" }))}
                  className={`mt-1 ${field}`}
                />
                <div className="mt-3 flex flex-wrap gap-2 text-sm text-neutral-600">
                  <span className="rounded-full bg-paper px-3 py-1">{catName(draft.category)}</span>
                  {draft.budget && <span className="rounded-full bg-paper px-3 py-1">💰 {draft.budget}</span>}
                  {draft.deadline && <span className="rounded-full bg-paper px-3 py-1">⏱ {draft.deadline}</span>}
                </div>

                {userId ? (
                  <button
                    onClick={post}
                    disabled={busy}
                    className="mt-5 w-full rounded-full bg-red px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {busy ? T.posting[locale] : T.post[locale]}
                  </button>
                ) : (
                  <div className="mt-5 flex flex-col gap-2">
                    <Link
                      href={`/login?next=${encodeURIComponent("/start?door=buy")}`}
                      className="w-full rounded-full bg-red px-6 py-3 text-center text-sm font-bold text-white"
                    >
                      {T.loginToPost[locale]}
                    </Link>
                    <Link
                      href={`/signup?next=${encodeURIComponent("/start?door=buy")}`}
                      className="text-center text-sm font-semibold text-cyan-deep"
                    >
                      {T.signup[locale]}
                    </Link>
                  </div>
                )}
                <button
                  onClick={() => {
                    setDraft(empty);
                    setStep("need");
                  }}
                  className="mt-3 w-full text-center text-xs font-semibold text-neutral-500 hover:text-fg"
                >
                  {T.restart[locale]}
                </button>
              </div>
            )}

            {error && (
              <p className="rounded-xl border border-red-dark/30 bg-red/5 px-4 py-3 text-sm text-red-dark">{error}</p>
            )}
            <div ref={endRef} />
          </div>

          {step !== "review" && (
            <div className="border-t border-line bg-surface px-5 py-4 sm:px-8">
              {step === "category" ? (
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button key={c.slug} onClick={() => answer(c.slug)} className={chip}>
                      {c.name}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  {chips && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {chips.map((o) => (
                        <button key={o} onClick={() => answer(o)} className={chip}>
                          {o}
                        </button>
                      ))}
                    </div>
                  )}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (step === "details" || input.trim()) answer(input);
                    }}
                    className="flex gap-2"
                  >
                    {step === "need" || step === "details" ? (
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            if (step === "details" || input.trim()) answer(input);
                          }
                        }}
                        rows={2}
                        placeholder={step === "need" ? T.needPh[locale] : T.detailsPh[locale]}
                        className={`flex-1 resize-none ${field}`}
                      />
                    ) : (
                      <input value={input} onChange={(e) => setInput(e.target.value)} className={`flex-1 ${field}`} />
                    )}
                    <div className="flex flex-col gap-2">
                      <button type="submit" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
                        {T.send[locale]}
                      </button>
                      {step === "details" && (
                        <button
                          type="button"
                          onClick={() => answer("")}
                          className="rounded-full border border-line px-5 py-2 text-xs font-semibold text-neutral-600"
                        >
                          {T.skip[locale]}
                        </button>
                      )}
                    </div>
                  </form>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
