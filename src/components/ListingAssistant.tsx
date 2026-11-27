"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

type Loc = "en" | "ar";
type Turn = { role: "user" | "assistant"; text: string };
type Pkg = {
  tier: "basic" | "standard" | "premium";
  name: string;
  description: string;
  price_jod: number;
  delivery_days: number;
  revisions: number;
  features?: string[];
};
export type AssistantDraft = {
  profile: { headline: string; bio: string; category: string };
  listing: {
    title: string;
    description: string;
    category: string;
    tags?: string[];
    requirements: string;
    packages: Pkg[];
    faq?: { question: string; answer: string }[];
  };
};

export const ASSISTANT_DRAFT_KEY = "mountaliq.assistantDraft";

const T = {
  title: { en: "Your Mountaliq assistant", ar: "مساعد منطلق" },
  intro: {
    en: "I'll ask you a few quick questions, then write your profile and your first service for you. You can change anything before it goes live.",
    ar: "سأطرح عليك بضعة أسئلة سريعة، ثم أكتب لك ملفك الشخصي وخدمتك الأولى. يمكنك تعديل أي شيء قبل النشر.",
  },
  start: { en: "Let's start", ar: "لنبدأ" },
  steps: {
    en: ["About you", "Your service", "Packages & prices", "Final details"],
    ar: ["عنك", "خدمتك", "الباقات والأسعار", "التفاصيل الأخيرة"],
  },
  placeholder: { en: "Type your answer…", ar: "اكتب إجابتك…" },
  send: { en: "Send", ar: "إرسال" },
  thinking: { en: "Thinking…", ar: "لحظة…" },
  ready: { en: "Your profile and first service are ready", ar: "ملفك وخدمتك الأولى جاهزان" },
  readyBody: {
    en: "Have a look. Next you'll add at least one photo of your work, check everything, and publish.",
    ar: "ألقِ نظرة. في الخطوة التالية ستضيف صورة واحدة على الأقل من أعمالك، تراجع كل شيء، ثم تنشر.",
  },
  headline: { en: "Profile headline", ar: "عنوان الملف" },
  bio: { en: "About you", ar: "نبذة عنك" },
  service: { en: "Your first service", ar: "خدمتك الأولى" },
  continue: { en: "Save to my profile and continue", ar: "احفظ في ملفي وتابع" },
  restart: { en: "Start over", ar: "ابدأ من جديد" },
  keepTalking: { en: "Change something", ar: "أريد تعديل شيء" },
  all: { en: "All of the above", ar: "كل ما سبق" },
  done: { en: "Done", ar: "تم" },
  pickHint: { en: "Tap all that apply", ar: "اختر كل ما ينطبق" },
  notConfigured: {
    en: "The assistant isn't switched on yet. You can still fill in the form yourself.",
    ar: "المساعد غير مفعّل بعد. يمكنك تعبئة النموذج بنفسك.",
  },
  error: { en: "Something went wrong. Please try again.", ar: "حدث خطأ. حاول مرة أخرى." },
  manual: { en: "Fill the form myself", ar: "أعبّئ النموذج بنفسي" },
  jod: { en: "JOD", ar: "د.أ" },
  days: { en: "days", ar: "أيام" },
};

export default function ListingAssistant({
  locale,
  userId,
  categories,
}: {
  locale: Loc;
  userId: string;
  categories: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [step, setStep] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<AssistantDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const [multiple, setMultiple] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const rtl = locale === "ar";

  // Scroll only inside the chat box, never the whole page.
  useEffect(() => {
    const box = boxRef.current;
    if (box) box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
  }, [turns, busy, draft]);

  async function send(next: Turn[]) {
    setTurns(next);
    setOptions([]);
    setPicked([]);
    setMultiple(false);
    setInput("");
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ turns: next, locale, categories }),
      });
      if (res.status === 503) {
        setError(T.notConfigured[locale]);
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      if (data.kind === "draft") {
        setDraft(data.draft as AssistantDraft);
        setStep(5);
      } else {
        setTurns([...next, { role: "assistant", text: data.question }]);
        setOptions(data.options ?? []);
        setMultiple(Boolean(data.multiple));
        setStep(data.step ?? 1);
      }
    } catch {
      setError(T.error[locale]);
    } finally {
      setBusy(false);
    }
  }

  function answer(text: string) {
    const v = text.trim();
    if (!v || busy) return;
    send([...turns, { role: "user", text: v }]);
  }

  async function saveAndContinue() {
    if (!draft) return;
    setSaving(true);
    const supabase = createClient();
    const validCategory = categories.some((c) => c.slug === draft.profile.category) ? draft.profile.category : undefined;
    // Create the profile row first if this (older) account doesn't have one yet.
    await supabase.from("profiles").upsert({ id: userId }, { onConflict: "id", ignoreDuplicates: true });
    await supabase
      .from("profiles")
      .update({
        headline: draft.profile.headline.slice(0, 120),
        bio: draft.profile.bio,
        ...(validCategory ? { category: validCategory } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
    try {
      sessionStorage.setItem(ASSISTANT_DRAFT_KEY, JSON.stringify(draft.listing));
    } catch {
      /* storage unavailable: the form simply opens empty */
    }
    router.push("/dashboard/listings/new?from=assistant");
  }

  const started = turns.length > 0 || busy || draft !== null;

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="overflow-hidden rounded-3xl border border-line bg-surface shadow-xl">
      {/* Header + progress */}
      <div className="relative overflow-hidden bg-ink px-6 py-6 text-white sm:px-8">
        <div aria-hidden className="pointer-events-none absolute -end-16 -top-20 h-56 w-56 rounded-full bg-violet opacity-40 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan/15 text-xl">✦</span>
          <h2 className="font-display text-xl font-bold">{T.title[locale]}</h2>
        </div>
        <ol className="relative mt-5 grid grid-cols-4 gap-2">
          {T.steps[locale].map((label, i) => {
            const n = i + 1;
            const done = step > n;
            const active = step === n;
            return (
              <li key={label}>
                <div className={`h-1.5 rounded-full ${done ? "bg-volt" : active ? "bg-cyan" : "bg-white/15"}`} />
                <p className={`mt-2 text-[11px] font-semibold sm:text-xs ${active ? "text-cyan" : done ? "text-volt" : "text-white/50"}`}>
                  {label}
                </p>
              </li>
            );
          })}
        </ol>
      </div>

      <div ref={boxRef} className="max-h-[60vh] min-h-[320px] space-y-4 overflow-y-auto overscroll-contain bg-paper px-5 py-6 sm:px-8">
        {!started && (
          <div className="py-6 text-center">
            <p className="mx-auto max-w-md text-[15px] leading-relaxed text-neutral-700">{T.intro[locale]}</p>
            <button
              onClick={() => send([])}
              className="mt-6 rounded-full bg-red px-8 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5"
            >
              {T.start[locale]}
            </button>
          </div>
        )}

        {turns.map((t, i) => (
          <div key={i} className={`flex ${t.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                t.role === "user" ? "bg-ink text-white" : "border border-line bg-surface text-fg"
              }`}
            >
              {t.text}
            </div>
          </div>
        ))}

        {busy && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-neutral-500">{T.thinking[locale]}</div>
          </div>
        )}

        {draft && (
          <div className="rounded-2xl border-2 border-volt bg-surface p-5">
            <p className="font-display text-lg font-bold text-fg">🎉 {T.ready[locale]}</p>
            <p className="mt-1 text-sm text-neutral-600">{T.readyBody[locale]}</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{T.headline[locale]}</dt>
                <dd className="mt-1 font-semibold text-fg">{draft.profile.headline}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{T.bio[locale]}</dt>
                <dd className="mt-1 text-neutral-700">{draft.profile.bio}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{T.service[locale]}</dt>
                <dd className="mt-1 font-semibold text-fg">{draft.listing.title}</dd>
                <dd className="mt-2 grid gap-2 sm:grid-cols-3">
                  {draft.listing.packages.map((p) => (
                    <div key={p.tier} className="rounded-xl bg-paper px-3 py-2">
                      <p className="font-semibold text-fg">{p.name}</p>
                      <p className="text-xs text-neutral-600">
                        {p.price_jod} {T.jod[locale]} · {p.delivery_days} {T.days[locale]}
                      </p>
                    </div>
                  ))}
                </dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={saveAndContinue}
                disabled={saving}
                className="rounded-full bg-red px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {T.continue[locale]}
              </button>
              <button
                onClick={() => {
                  setDraft(null);
                  setStep(4);
                }}
                className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-fg"
              >
                {T.keepTalking[locale]}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-dark/30 bg-red/5 px-4 py-3 text-sm text-red-dark">
            {error}{" "}
            <a href={`/${locale}/dashboard/listings/new`} className="font-semibold underline">
              {T.manual[locale]}
            </a>
          </div>
        )}
      </div>

      {started && !draft && (
        <div className="border-t border-line bg-surface px-5 py-4 sm:px-8">
          {options.length > 0 && !busy && !multiple && (
            <div className="mb-3 flex flex-wrap gap-2">
              {options.map((o) => (
                <button
                  key={o}
                  onClick={() => answer(o)}
                  className="rounded-full border-2 border-cyan bg-cyan/5 px-4 py-1.5 text-sm font-semibold text-cyan-deep transition-colors hover:bg-cyan hover:text-ink"
                >
                  {o}
                </button>
              ))}
            </div>
          )}
          {options.length > 0 && !busy && multiple && (
            <div className="mb-3">
              <p className="mb-2 text-xs font-semibold text-muted">{T.pickHint[locale]}</p>
              <div className="flex flex-wrap gap-2">
                {options.map((o) => {
                  const on = picked.includes(o);
                  return (
                    <button
                      key={o}
                      aria-pressed={on}
                      onClick={() => setPicked((p) => (on ? p.filter((x) => x !== o) : [...p, o]))}
                      className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition-colors ${
                        on ? "border-cyan bg-cyan text-ink" : "border-cyan bg-cyan/5 text-cyan-deep hover:bg-cyan/20"
                      }`}
                    >
                      {on ? "✓ " : ""}
                      {o}
                    </button>
                  );
                })}
                <button
                  aria-pressed={picked.length === options.length}
                  onClick={() => setPicked(picked.length === options.length ? [] : [...options])}
                  className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition-colors ${
                    picked.length === options.length
                      ? "border-violet bg-violet text-white"
                      : "border-violet bg-violet/5 text-violet-deep hover:bg-violet/15"
                  }`}
                >
                  {T.all[locale]}
                </button>
                <button
                  disabled={picked.length === 0}
                  onClick={() => {
                    const sep = rtl ? "، " : ", ";
                    answer(picked.length === options.length ? `${T.all[locale]}: ${picked.join(sep)}` : picked.join(sep));
                  }}
                  className="rounded-full bg-red px-5 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
                >
                  {T.done[locale]} {picked.length > 0 ? `(${picked.length})` : ""}
                </button>
              </div>
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              answer(input);
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={T.placeholder[locale]}
              disabled={busy}
              className="flex-1 rounded-full border border-line bg-paper px-5 py-3 text-[15px] text-fg focus:border-cyan-deep focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              {T.send[locale]}
            </button>
          </form>
          <button
            onClick={() => {
              setTurns([]);
              setStep(0);
              setOptions([]);
              setError(null);
            }}
            className="mt-3 text-xs font-semibold text-muted hover:text-fg"
          >
            {T.restart[locale]}
          </button>
        </div>
      )}
    </div>
  );
}
