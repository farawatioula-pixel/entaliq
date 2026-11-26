import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { stats, type Locale } from "@/lib/data";
import { guides } from "@/lib/guides";
import { GuideCard } from "@/components/GuideCard";
import PartnerLogos from "@/components/PartnerLogos";
import LaunchCTA from "@/components/LaunchCTA";
import SummitBanner from "@/components/SummitBanner";
import HeroVideo from "@/components/HeroVideo";
import HeroSearch from "@/components/HeroSearch";
import { GhorSafiStrip } from "@/components/GhorSafiGallery";
import { CategoryIcon, categoryOrder, categoryAccent } from "@/components/CategoryIcon";
import { lookFor, pexels } from "@/lib/photos";
import type { ProfileCategory } from "@/lib/types";
import { getListings } from "@/lib/marketplace";
import { ListingCard } from "@/components/ListingCard";

export const revalidate = 0;

const heroPillCategories: ProfileCategory[] = [
  "programming-tech",
  "graphics-design",
  "digital-marketing",
  "video-animation",
  "ai-services",
];

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
      <section className="relative overflow-hidden border-b-4 border-red bg-ink">
        <HeroVideo />
        <div className="absolute inset-0 bg-ink/60" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-32">
          {/* The H1 carries the brand name (منطلق / Mountaliq) so search engines
              tie the page to it; the marketplace line stays as the big visual headline. */}
          <h1 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/80 sm:text-sm">
            {t("heroBrand")}
          </h1>
          <p className="max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl sm:leading-[0.98] lg:text-6xl">
            {t("heroHeadline")}
          </p>

          <HeroSearch placeholder={t("heroSearchPlaceholder")} ctaLabel={t("heroSearchCta")} />

          <div className="mt-6 hidden flex-wrap gap-3 sm:flex">
            {heroPillCategories.map((category) => (
              <Link
                key={category}
                href={`/marketplace?category=${category}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                {tCat(category)}
                <span aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Summit closing ceremony registration */}
      <SummitBanner />

      {/* Ghor Al-Safi photos */}
      <GhorSafiStrip locale={locale} />

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

          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {categoryOrder.map((category) => {
              const look = lookFor(category);
              return (
                <Link
                  key={category}
                  href={`/marketplace?category=${category}`}
                  style={{ backgroundColor: look.color }}
                  className="group flex flex-col rounded-2xl p-3 pt-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-4 sm:pt-6"
                >
                  <span className="px-2 font-display text-[17px] font-bold leading-snug text-white sm:text-xl">
                    {tCat(category)}
                  </span>
                  <div className="mt-4 aspect-[4/3] overflow-hidden rounded-xl bg-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pexels(look.photo, 600)}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>
              );
            })}
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
