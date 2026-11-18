import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { agenda, speakers } from "@/lib/summitProgramme";
import type { Locale } from "@/lib/data";

export async function generateMetadata() {
  const t = await getTranslations("summitPage");
  return { title: `${t("eyebrow")} — ${t("title")}`, description: t("body") };
}

export default async function SummitPage() {
  const t = await getTranslations("summitPage");
  const registerHref = "/register";
  const locale = (await getLocale()) as Locale;

  return (
    <>
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

    <section className="bg-surface py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">{t("agendaEyebrow")}</p>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">{t("agendaTitle")}</h2>
        <ol className="mt-10 divide-y divide-line overflow-hidden rounded-sm border border-line bg-paper">
          {agenda.map((item) => (
            <li
              key={item.time.en}
              className={`grid grid-cols-1 gap-2 px-6 py-5 sm:grid-cols-[180px_1fr] sm:gap-8 sm:px-8 ${
                item.highlight ? "bg-ink text-white" : ""
              }`}
            >
              <p className={`font-display text-base font-bold ${item.highlight ? "text-cyan" : "text-red-dark"}`}>
                {item.time[locale]}
              </p>
              <div>
                {item.highlight && (
                  <p className="mb-2 inline-flex rounded-sm bg-[#D4F547] px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-ink">
                    {t("mainSession")}
                  </p>
                )}
                <p className={`font-display text-lg font-bold ${item.highlight ? "text-white" : "text-fg"}`}>
                  {item.title[locale]}
                </p>
                {item.who && (
                  <p className={`mt-1 text-[15px] ${item.highlight ? "text-neutral-300" : "text-neutral-600"}`}>
                    {item.who[locale]}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section className="border-t border-line bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">{t("speakersEyebrow")}</p>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">{t("speakersTitle")}</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {speakers.map((sp) => (
            <article key={sp.id} className="flex flex-col overflow-hidden rounded-sm border border-line bg-surface">
              {sp.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sp.photo} alt={sp.name[locale]} className="aspect-square w-full object-cover object-top" />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center bg-ink">
                  <span className="font-display text-6xl font-bold text-cyan">
                    {sp.name.en.split(" ").map((w) => w[0]).join("")}
                  </span>
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                {sp.role === "moderator" && (
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-red-dark">{t("moderator")}</p>
                )}
                <h3 className="font-display text-xl font-bold text-fg">{sp.name[locale]}</h3>
                <p className="mt-1 text-sm font-semibold text-cyan-deep">{sp.title[locale]}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{sp.bio[locale]}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12">
          <Link
            href={registerHref}
            className="inline-flex items-center rounded-sm bg-red px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-dark"
          >
            {t("registerCta")}
          </Link>
        </div>
      </div>
    </section>
    </>
  );
}
