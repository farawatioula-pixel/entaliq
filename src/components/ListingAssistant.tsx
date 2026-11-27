"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { AvatarUpload } from "@/components/AvatarUpload";
import { ListingImagesUpload } from "@/components/ListingImagesUpload";

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
  profile: { name?: string; location?: string; headline: string; bio: string; category: string };
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

type Phase = "chat" | "review" | "photos" | "done";

const T = {
  title: { en: "Your Mountaliq assistant", ar: "مساعد منطلق" },
  intro: {
    en: "I'll ask you a few quick questions, write your profile and your first service, then help you add photos and publish. It takes about 5 minutes.",
    ar: "سأطرح عليك بضعة أسئلة سريعة، وأكتب ملفك الشخصي وخدمتك الأولى، ثم أساعدك في إضافة الصور والنشر. يستغرق الأمر حوالي ٥ دقائق.",
  },
  start: { en: "Let's start", ar: "لنبدأ" },
  steps: {
    en: ["About you", "Your service", "Prices", "Photos", "Publish"],
    ar: ["عنك", "خدمتك", "الأسعار", "الصور", "النشر"],
  },
  placeholder: { en: "Type your answer…", ar: "اكتب إجابتك…" },
  send: { en: "Send", ar: "إرسال" },
  thinking: { en: "Thinking…", ar: "لحظة…" },
  ready: { en: "Here's your profile and first service", ar: "هذا ملفك وخدمتك الأولى" },
  readyBody: {
    en: "Check it over. If something isn't right, tell me and I'll fix it. Next we add photos and publish.",
    ar: "راجعها. إن كان هناك ما يحتاج تعديلاً أخبرني وسأعدّله. بعدها نضيف الصور وننشر.",
  },
  name: { en: "Name", ar: "الاسم" },
  location: { en: "City", ar: "المدينة" },
  headline: { en: "Profile headline", ar: "عنوان الملف" },
  bio: { en: "About you", ar: "نبذة عنك" },
  service: { en: "Your first service", ar: "خدمتك الأولى" },
  next: { en: "Looks good, next: photos →", ar: "ممتاز، التالي: الصور ←" },
  keepTalking: { en: "Change something", ar: "أريد تعديل شيء" },
  photosTitle: { en: "Add your photos", ar: "أضف صورك" },
  avatarTitle: { en: "1. Your profile photo (recommended)", ar: "١. صورتك الشخصية (يُنصح بها)" },
  avatarHint: { en: "A clear, friendly photo of your face. Buyers trust sellers they can see.", ar: "صورة واضحة لوجهك. المشترون يثقون أكثر بمن يرون صورته." },
  workTitle: { en: "2. Photos of your work (at least one)", ar: "٢. صور من أعمالك (صورة واحدة على الأقل)" },
  workHint: {
    en: "A design you made, a screenshot of a page you built, a product you sold. No work yet? A photo of your training project is fine.",
    ar: "تصميم صنعته، لقطة شاشة لصفحة بنيتها، منتج بعته. لا أعمال بعد؟ صورة من مشروعك في التدريب تكفي.",
  },
  publish: { en: "Publish my service 🚀", ar: "انشر خدمتي 🚀" },
  publishing: { en: "Publishing…", ar: "جارٍ النشر…" },
  needPhoto: { en: "Add at least one photo of your work to publish.", ar: "أضف صورة واحدة على الأقل من أعمالك لتنشر." },
  back: { en: "← Back", ar: "→ رجوع" },
  doneTitle: { en: "You're live! 🎉", ar: "خدمتك منشورة! 🎉" },
  doneBody: {
    en: "Your service is now on the Mountaliq marketplace. Share it with friends, family and on your social media to get your first order.",
    ar: "خدمتك الآن على سوق منطلق. شاركها مع أصدقائك وعائلتك وعلى حساباتك لتحصل على أول طلب.",
  },
  view: { en: "View my service", ar: "شاهد خدمتي" },
  whatsapp: { en: "Share on WhatsApp", ar: "شارك على واتساب" },
  copy: { en: "Copy link", ar: "انسخ الرابط" },
  copied: { en: "Copied ✓", ar: "تم النسخ ✓" },
  editAll: { en: "Edit all details", ar: "تعديل كل التفاصيل" },
  shareText: { en: "My new service on Mountaliq:", ar: "خدمتي الجديدة على منطلق:" },
  restart: { en: "Start over", ar: "ابدأ من جديد" },
  notConfigured: {
    en: "The assistant isn't switched on yet. You can still fill in the form yourself.",
    ar: "المساعد غير مفعّل بعد. يمكنك تعبئة النموذج بنفسك.",
  },
  error: { en: "Something went wrong. Please try again.", ar: "حدث خطأ. حاول مرة أخرى." },
  manual: { en: "Fill the form myself", ar: "أعبّئ النموذج بنفسي" },
  jod: { en: "JOD", ar: "د.أ" },
  days: { en: "days", ar: "أيام" },
  all: { en: "All of the above", ar: "كل ما سبق" },
  done: { en: "Done", ar: "تم" },
  pickHint: { en: "Tap all that apply", ar: "اختر كل ما ينطبق" },
};

export default function ListingAssistant({
  locale,
  userId,
  knownName,
  knownAvatar,
  categories,
}: {
  locale: Loc;
  userId: string;
  knownName: string;
  knownAvatar: string;
  categories: { id: string; slug: string; name: string }[];
}) {
  const rtl = locale === "ar";
  const [phase, setPhase] = useState<Phase>("chat");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [step, setStep] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [multiple, setMultiple] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<AssistantDraft | null>(null);
  const [avatar, setAvatar] = useState(knownAvatar);
  const [images, setImages] = useState<string[]>([]);
  const [listingId, setListingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Scroll only inside the chat box, never the whole page.
  useEffect(() => {
    const box = boxRef.current;
    if (box) box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
  }, [turns, busy, draft, phase]);

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
        body: JSON.stringify({
          turns: next,
          locale,
          knownName,
          categories: categories.map(({ slug, name }) => ({ slug, name })),
        }),
      });
      if (res.status === 503) {
        setError(T.notConfigured[locale]);
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      if (data.kind === "draft") {
        setDraft(data.draft as AssistantDraft);
        setPhase("review");
      } else {
        setTurns([...next, { role: "assistant", text: data.question }]);
        setOptions(data.options ?? []);
        setMultiple(Boolean(data.multiple));
        setStep(Math.min(3, data.step ?? 1));
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

  async function publish() {
    if (!draft) return;
    const pics = images.map((i) => i.trim()).filter(Boolean);
    if (pics.length === 0) {
      setError(T.needPhoto[locale]);
      return;
    }
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { profile, listing } = draft;
    const cat =
      categories.find((c) => c.slug === listing.category) ?? categories.find((c) => c.slug === profile.category);

    try {
      // Profile (create the row first if this older account has none).
      await supabase.from("profiles").upsert({ id: userId }, { onConflict: "id", ignoreDuplicates: true });
      const { error: pErr } = await supabase
        .from("profiles")
        .update({
          ...(profile.name?.trim() ? { name: profile.name.trim().slice(0, 120) } : {}),
          ...(profile.location?.trim() ? { location: profile.location.trim().slice(0, 120) } : {}),
          headline: profile.headline.slice(0, 120),
          bio: profile.bio,
          ...(categories.some((c) => c.slug === profile.category) ? { category: profile.category } : {}),
          ...(avatar ? { avatar_url: avatar } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
      if (pErr) throw pErr;

      const pkgs = (["basic", "standard", "premium"] as const).map((tier, i) => {
        const p = listing.packages.find((x) => x.tier === tier) ?? listing.packages[i];
        return {
          tier,
          name: p?.name || tier,
          description: p?.description || "",
          price: Math.max(1, Number(p?.price_jod) || 1),
          delivery_days: Math.max(1, Number(p?.delivery_days) || 1),
          revisions: Math.max(0, Number(p?.revisions) || 0),
          features: p?.features ?? [],
        };
      });

      const { data: inserted, error: lErr } = await supabase
        .from("listings")
        .insert({
          seller_id: userId,
          title: listing.title.trim(),
          description: listing.description.trim(),
          category_id: cat?.id ?? null,
          subcategory_id: null,
          tags: (listing.tags ?? []).slice(0, 5),
          images: pics,
          starting_price: Math.min(...pkgs.map((p) => p.price)),
          delivery_days: Math.min(...pkgs.map((p) => p.delivery_days)),
          revisions: Math.max(...pkgs.map((p) => p.revisions)),
          requirements: listing.requirements?.trim() ?? "",
          faq: (listing.faq ?? []).filter((f) => f.question && f.answer),
          status: "published",
          updated_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (lErr || !inserted) throw lErr ?? new Error("insert");

      const { error: kErr } = await supabase
        .from("listing_packages")
        .insert(pkgs.map((p) => ({ ...p, listing_id: inserted.id })));
      if (kErr) throw kErr;

      setListingId(inserted.id);
      setPhase("done");
    } catch (e) {
      setError(`${T.error[locale]} ${e instanceof Error ? e.message : ""}`.trim());
    } finally {
      setBusy(false);
    }
  }

  function openFullForm() {
    if (!draft) return;
    try {
      sessionStorage.setItem(ASSISTANT_DRAFT_KEY, JSON.stringify(draft.listing));
    } catch {
      /* ignore */
    }
  }

  const started = turns.length > 0 || busy || phase !== "chat";
  const current = phase === "photos" ? 4 : phase === "done" ? 6 : phase === "review" ? 3 : step;
  const listingUrl = listingId ? `https://www.mountaliq.com/${locale}/marketplace/${listingId}` : "";
  const chip =
    "rounded-full border-2 border-cyan bg-cyan/5 px-4 py-1.5 text-sm font-semibold text-cyan-deep transition-colors hover:bg-cyan hover:text-ink";

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="overflow-hidden rounded-3xl border border-line bg-surface shadow-xl">
      {/* Header + progress */}
      <div className="relative overflow-hidden bg-ink px-6 py-6 text-white sm:px-8">
        <div aria-hidden className="pointer-events-none absolute -end-16 -top-20 h-56 w-56 rounded-full bg-violet opacity-40 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan/15 text-xl">✦</span>
          <h2 className="font-display text-xl font-bold">{T.title[locale]}</h2>
        </div>
        <ol className="relative mt-5 grid grid-cols-5 gap-2">
          {T.steps[locale].map((label, i) => {
            const n = i + 1;
            const done = current > n;
            const active = current === n;
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

      {/* PHOTOS */}
      {phase === "photos" && draft && (
        <div className="space-y-8 bg-paper px-5 py-7 sm:px-8">
          <h3 className="font-display text-xl font-bold text-fg">{T.photosTitle[locale]}</h3>
          <section>
            <p className="font-semibold text-fg">{T.avatarTitle[locale]}</p>
            <p className="mb-3 mt-1 text-sm text-neutral-600">{T.avatarHint[locale]}</p>
            <AvatarUpload userId={userId} value={avatar} onChange={setAvatar} />
          </section>
          <section>
            <p className="font-semibold text-fg">{T.workTitle[locale]}</p>
            <p className="mb-3 mt-1 text-sm text-neutral-600">{T.workHint[locale]}</p>
            <ListingImagesUpload sellerId={userId} images={images} onChange={setImages} />
          </section>
          {error && <p className="rounded-xl border border-red-dark/30 bg-red/5 px-4 py-3 text-sm text-red-dark">{error}</p>}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={publish}
              disabled={busy || images.filter(Boolean).length === 0}
              className="rounded-full bg-red px-8 py-3 text-base font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 disabled:opacity-40"
            >
              {busy ? T.publishing[locale] : T.publish[locale]}
            </button>
            <button
              onClick={() => {
                setPhase("review");
                setError(null);
              }}
              className="text-sm font-semibold text-muted hover:text-fg"
            >
              {T.back[locale]}
            </button>
          </div>
        </div>
      )}

      {/* DONE */}
      {phase === "done" && listingId && (
        <div className="bg-paper px-5 py-10 text-center sm:px-8">
          <p className="text-5xl">🚀</p>
          <h3 className="mt-3 font-display text-2xl font-bold text-fg">{T.doneTitle[locale]}</h3>
          <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-neutral-600">{T.doneBody[locale]}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href={`/marketplace/${listingId}`} className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">
              {T.view[locale]}
            </Link>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${T.shareText[locale]} ${listingUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white"
            >
              {T.whatsapp[locale]}
            </a>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(listingUrl).then(() => setCopied(true)).catch(() => {});
              }}
              className="rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold text-fg"
            >
              {copied ? T.copied[locale] : T.copy[locale]}
            </button>
          </div>
          <Link
            href={`/dashboard/listings/${listingId}`}
            className="mt-6 inline-block text-sm font-semibold text-cyan-deep hover:underline"
          >
            {T.editAll[locale]}
          </Link>
        </div>
      )}

      {/* CHAT + REVIEW */}
      {(phase === "chat" || phase === "review") && (
        <>
          <div
            ref={boxRef}
            className="max-h-[60vh] min-h-[320px] space-y-4 overflow-y-auto overscroll-contain bg-paper px-5 py-6 sm:px-8"
          >
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
                <div className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-neutral-500">
                  {T.thinking[locale]}
                </div>
              </div>
            )}

            {phase === "review" && draft && (
              <div className="rounded-2xl border-2 border-volt bg-surface p-5">
                <p className="font-display text-lg font-bold text-fg">✨ {T.ready[locale]}</p>
                <p className="mt-1 text-sm text-neutral-600">{T.readyBody[locale]}</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{T.name[locale]}</dt>
                      <dd className="mt-1 font-semibold text-fg">{draft.profile.name || knownName}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{T.location[locale]}</dt>
                      <dd className="mt-1 font-semibold text-fg">{draft.profile.location}</dd>
                    </div>
                  </div>
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
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setPhase("photos");
                      setError(null);
                    }}
                    className="rounded-full bg-red px-6 py-2.5 text-sm font-semibold text-white"
                  >
                    {T.next[locale]}
                  </button>
                  <button
                    onClick={() => {
                      setPhase("chat");
                      setDraft(null);
                      setStep(3);
                    }}
                    className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-fg"
                  >
                    {T.keepTalking[locale]}
                  </button>
                  <Link
                    href="/dashboard/listings/new?from=assistant"
                    onClick={openFullForm}
                    className="px-2 text-xs font-semibold text-muted hover:text-fg"
                  >
                    {T.editAll[locale]}
                  </Link>
                </div>
              </div>
            )}

            {error && phase === "chat" && (
              <div className="rounded-xl border border-red-dark/30 bg-red/5 px-4 py-3 text-sm text-red-dark">
                {error}{" "}
                <Link href="/dashboard/listings/new" className="font-semibold underline">
                  {T.manual[locale]}
                </Link>
              </div>
            )}
          </div>

          {started && phase === "chat" && (
            <div className="border-t border-line bg-surface px-5 py-4 sm:px-8">
              {options.length > 0 && !busy && !multiple && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {options.map((o) => (
                    <button key={o} onClick={() => answer(o)} className={chip}>
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
                        answer(
                          picked.length === options.length ? `${T.all[locale]}: ${picked.join(sep)}` : picked.join(sep)
                        );
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
        </>
      )}
    </div>
  );
}
