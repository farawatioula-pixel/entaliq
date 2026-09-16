import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata() {
  const t = await getTranslations("summitPage");
  return { title: `${t("eyebrow")} — ${t("title")}`, description: t("body") };
}

export default async function SummitPage() {
  const t = await getTranslations("summitPage");

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
            <p className="font-display text-2xl font-bold text-fg">{t("daysLabel")}</p>
            <p className="mt-1 text-sm text-neutral-600">{t("daysSub")}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-sm border border-line bg-surface px-8 py-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-deep">
              {t("day1")}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
              {t("day1Body")}
            </p>
          </div>
          <div className="rounded-sm border border-line bg-surface px-8 py-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-dark">
              {t("day2")}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
              {t("day2Body")}
            </p>
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/register"
            className="inline-flex items-center rounded-sm bg-red px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-dark"
          >
            {t("registerCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
