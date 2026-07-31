import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { stats, type Locale } from "@/lib/data";
import PartnerLogos from "@/components/PartnerLogos";
import LaunchCTA from "@/components/LaunchCTA";

export default function Home() {
  const t = useTranslations("home");
  const locale = useLocale() as Locale;

  return (
    <>
      {/* Hero */}
      <section className="border-b-4 border-red bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
            {t("eyebrow")}
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-[0.98] tracking-tight text-fg sm:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600">
            {t("heroBody")}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="inline-flex items-center rounded-sm bg-red px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-dark"
            >
              {t("registerCta")}
            </Link>
            <Link
              href="/directory"
              className="inline-flex items-center rounded-sm border border-line px-7 py-3.5 text-[15px] font-semibold text-fg transition-colors hover:border-cyan hover:text-cyan-deep"
            >
              {t("browseMarketplace")}
            </Link>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-line bg-surface py-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.value} className="flex items-baseline gap-3">
                <p className="font-display text-3xl font-bold text-red-dark">
                  {stat.value}
                </p>
                <p className="text-sm leading-snug text-neutral-600">{stat.label[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Summit */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          {t("summitEyebrow")}
        </p>
        <h2 className="mt-4 max-w-xl font-display text-4xl font-bold leading-tight tracking-tight text-fg sm:text-5xl">
          {t("summitTitle")}
        </h2>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-neutral-600">
          {t("summitBody")}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-4">
          <div className="bg-surface px-6 py-6">
            <p className="font-display text-2xl font-bold text-fg">{t("summitDates")}</p>
            <p className="mt-1 text-sm text-neutral-600">{t("summitDatesSub")}</p>
          </div>
          <div className="bg-surface px-6 py-6">
            <p className="font-display text-2xl font-bold text-fg">100</p>
            <p className="mt-1 text-sm text-neutral-600">{t("summitParticipants")}</p>
          </div>
          <div className="bg-surface px-6 py-6">
            <p className="font-display text-2xl font-bold text-fg">{t("summitRooms")}</p>
            <p className="mt-1 text-sm text-neutral-600">{t("summitRoomsSub")}</p>
          </div>
          <div className="bg-surface px-6 py-6">
            <p className="font-display text-2xl font-bold text-fg">{t("summitDaysLabel")}</p>
            <p className="mt-1 text-sm text-neutral-600">{t("summitDaysSub")}</p>
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
            {t("registerForSummit")}
          </Link>
        </div>
      </section>

      {/* Become a seller */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-8 rounded-sm border border-line bg-cyan/10 px-8 py-14 sm:flex-row sm:items-center sm:px-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-deep">
              {t("afterTraining")}
            </p>
            <h2 className="mt-3 max-w-md font-display text-3xl font-bold leading-tight tracking-tight text-fg sm:text-4xl">
              {t("becomeSellerHeading")}
            </h2>
          </div>
          <Link
            href="/signup"
            className="inline-flex shrink-0 items-center rounded-sm bg-red px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-dark"
          >
            {t("becomeSeller")}
          </Link>
        </div>
      </section>

      {/* Trust logos */}
      <section className="border-t border-line bg-surface py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <PartnerLogos />
        </div>
      </section>

      <LaunchCTA />
    </>
  );
}
