import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { stats, type Locale } from "@/lib/data";
import { guides } from "@/lib/guides";
import { GuideCard } from "@/components/GuideCard";
import PartnerLogos from "@/components/PartnerLogos";
import LaunchCTA from "@/components/LaunchCTA";
import LogoBanner from "@/components/LogoBanner";
import HeroSearch from "@/components/HeroSearch";
import { CategoryIcon, categoryOrder, categoryAccent } from "@/components/CategoryIcon";
import { getListings } from "@/lib/marketplace";
import { ListingCard } from "@/components/ListingCard";

export const revalidate = 0;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations("home");
  const tCat = await getTranslations("categories");
  const tCard = await getTranslations("listingCard");

  const listings = (await getListings({ sort: "newest" })).slice(0, 6);
  const featuredGuides = guides.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="border-b-4 border-red bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
            {t("eyebrow")}
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-fg sm:text-5xl sm:leading-[0.98] lg:text-6xl">
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
          </div>

          <HeroSearch placeholder={t("heroSearchPlaceholder")} ctaLabel={t("heroSearchCta")} />

          <div className="mt-14">
            <LogoBanner />
          </div>
        </div>
      </section>

      {/* Browse by category */}
      <section className="border-b border-line bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            {t("browseEyebrow")}
          </p>
          <h2 className="mt-3 max-w-lg font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
            {t("browseTitle")}
          </h2>
          <p className="mt-3 max-w-md text-[15px] text-neutral-600">{t("browseBody")}</p>

          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-4">
            {categoryOrder.map((category) => (
              <Link
                key={category}
                href={`/marketplace?category=${category}`}
                className="group flex flex-col items-start gap-4 bg-surface px-6 py-7 transition-colors hover:bg-paper"
              >
                <CategoryIcon
                  category={category}
                  className={`h-7 w-7 ${categoryAccent[category]}`}
                />
                <span className="font-display text-[15px] font-bold leading-snug text-fg">
                  {tCat(category)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular services */}
      {listings.length > 0 && (
        <section className="border-b border-line bg-paper py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                  {t("popularEyebrow")}
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                  {t("popularTitle")}
                </h2>
              </div>
              <Link
                href="/marketplace"
                className="text-sm font-semibold text-cyan-deep hover:underline"
              >
                {t("popularCta")}
              </Link>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  fromLabel={tCard("from")}
                  sellerFallbackLabel={tCard("seller")}
                  dayDeliveryLabel={tCard("dayDelivery", { days: listing.delivery_days })}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Guides */}
      <section className="border-b border-line bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                {t("guidesEyebrow")}
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                {t("guidesTitle")}
              </h2>
            </div>
            <Link
              href="/guides"
              className="text-sm font-semibold text-cyan-deep hover:underline"
            >
              {t("guidesCta")}
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredGuides.map((guide) => (
              <GuideCard
                key={guide.slug}
                guide={guide}
                locale={locale}
                categoryLabel={tCat(guide.category)}
              />
            ))}
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
      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          {t("summitEyebrow")}
        </p>
        <h2 className="mt-4 max-w-xl font-display text-4xl font-bold leading-tight tracking-tight text-fg sm:text-5xl">
          {t("summitTitle")}
        </h2>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-neutral-600">
          {t("summitBody")}
        </p>

        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-4">
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
