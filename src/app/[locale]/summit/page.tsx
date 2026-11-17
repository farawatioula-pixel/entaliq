import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata() {
  const t = await getTranslations("summitPage");
  return { title: `${t("eyebrow")} — ${t("title")}`, description: t("body") };
}

export default async function SummitPage() {
  const t = await getTranslations("summitPage");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const registerHref = user ? "/register" : "/signup?next=/register";

  return (
    <section className="border-b-4 border-red bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
          {t("eyebrow")}
        </p>
        <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-fg sm:text-5xl sm:leading-[0.98] lg:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-2xl font-display text-2xl font-bold text-fg">
          {t("subtitle")}
        </p>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-neutral-600">
          {t("body")}
        </p>

        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-4">
          <div className="bg-surface px-6 py-6">
            <p className="font-display text-2xl font-bold text-fg">{t("dates")}</p>
            <p className="mt-1 text-sm text-neutral-600">{t("datesSub")}</p>
          </div>
          <div className="bg-surface px-6 py-6">
            <p className="font-display text-2xl font-bold text-fg">{t("participantsValue")}</p>
            <p className="mt-1 text-sm text-neutral-600">{t("participantsSub")}</p>
          </div>
          <div className="bg-surface px-6 py-6">
            <p className="font-display text-2xl font-bold text-fg">{t("rooms")}</p>
            <p className="mt-1 text-sm text-neutral-600">{t("roomsSub")}</p>
          </div>
          <div className="bg-surface px-6 py-6">
            <p className="font-display text-2xl font-bold text-fg">{t("timeValue")}</p>
            <p className="mt-1 text-sm text-neutral-600">{t("timeSub")}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {[
            {
              key: "programme1",
              date: t("programme1Date"),
              accent: "text-neutral-600",
              status: t("registrationClosed"),
              statusClass: "border-line bg-paper text-neutral-600",
            },
            {
              key: "programme2",
              date: t("programme2Date"),
              accent: "text-neutral-600",
              status: t("registrationClosed"),
              statusClass: "border-line bg-paper text-neutral-600",
            },
            {
              key: "programme3",
              date: t("programme3Date"),
              accent: "text-red-dark",
              status: t("registrationOpen"),
              statusClass: "border-red bg-red/5 text-red-dark",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex flex-col rounded-sm border border-line bg-surface px-8 py-8"
            >
              <p className={`text-xs font-semibold uppercase tracking-widest ${item.accent}`}>
                {item.date}
              </p>
              <p className="mt-3 font-display text-xl font-bold text-fg">{t(item.key)}</p>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-neutral-600">
                {t(`${item.key}Body`)}
              </p>
              <p
                className={`mt-5 inline-flex self-start rounded-sm border px-3 py-1 text-xs font-semibold ${item.statusClass}`}
              >
                {item.status}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href={registerHref}
            className="inline-flex items-center rounded-sm bg-red px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-dark"
          >
            {t("registerCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
