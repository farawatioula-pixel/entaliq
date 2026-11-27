import { getTranslations, getLocale } from "next-intl/server";
import { lookFor, marketplaceHeroPhotos, photo, photoFocus } from "@/lib/photos";
import { getCategories, getListings, type ListingFilters } from "@/lib/marketplace";
import type { Category } from "@/lib/marketplace-types";
import { ListingCard } from "@/components/ListingCard";
import { Link } from "@/i18n/navigation";

export const revalidate = 0;

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    q?: string;
    sort?: string;
  }>;
}) {
  const { category, subcategory, q, sort } = await searchParams;
  const t = await getTranslations("marketplacePage");
  const tCard = await getTranslations("listingCard");
  const locale = await getLocale();
  const categoryName = (c: Category) => (locale === "ar" && c.name_ar ? c.name_ar : c.name);

  const sortOptions: { value: NonNullable<ListingFilters["sort"]>; label: string }[] = [
    { value: "newest", label: t("sortNewest") },
    { value: "price_low", label: t("sortPriceLow") },
    { value: "price_high", label: t("sortPriceHigh") },
    { value: "rating", label: t("sortTopRated") },
  ];

  const categories = await getCategories();
  const topLevel = categories.filter((c) => !c.parent_id);
  const activeTop = topLevel.find((c) => c.slug === category);
  const subcategories = activeTop ? categories.filter((c) => c.parent_id === activeTop.id) : [];

  const listings = await getListings({
    categorySlug: category,
    subcategorySlug: subcategory,
    search: q,
    sort: (sort as ListingFilters["sort"]) ?? "newest",
  });

  return (
    <main className="bg-paper">
      <section className="relative overflow-hidden bg-ink px-5 py-16 text-white sm:px-8 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute -start-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-violet opacity-30 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 end-0 h-[26rem] w-[26rem] rounded-full bg-red opacity-25 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-3 max-w-xl text-base text-neutral-300">{t("heroBody")}</p>

          <form action="/marketplace" method="get" className="mt-8 flex max-w-xl gap-2">
            {category && <input type="hidden" name="category" value={category} />}
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder={t("searchPlaceholder")}
              className="flex-1 rounded-lg border border-white/10 bg-white px-4 py-3.5 text-sm text-fg placeholder:text-neutral-400 focus:border-cyan-deep focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-red px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-dark"
            >
              {t("search")}
            </button>
          </form>
          </div>
          <div className="hidden grid-cols-2 gap-3 lg:grid" aria-hidden>
            {marketplaceHeroPhotos.map((id, i) => (
              <div
                key={id}
                className={`overflow-hidden rounded-2xl ${i % 2 === 1 ? "translate-y-6" : ""} ${
                  ["ring-cyan", "ring-red", "ring-volt", "ring-violet"][i]
                } aspect-[4/5] ring-4 ring-offset-0`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo(id)} alt="" style={{ objectPosition: photoFocus(id) }} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-5">
            <Link
              href="/marketplace"
              className={`flex shrink-0 items-center gap-3 rounded-2xl border-2 bg-surface p-2 pe-4 transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                !category ? "border-fg" : "border-transparent"
              }`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink text-lg text-volt">✦</span>
              <span className="font-display text-sm font-bold text-fg">{t("allCategories")}</span>
            </Link>
            {topLevel.map((c) => {
              const look = lookFor(c.slug);
              const active = category === c.slug;
              return (
                <Link
                  key={c.id}
                  href={`/marketplace?category=${c.slug}`}
                  style={active ? { backgroundColor: look.color, borderColor: look.color } : undefined}
                  className={`flex shrink-0 items-center gap-3 rounded-2xl border-2 p-2 pe-4 transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                    active ? "text-white" : "border-transparent bg-surface text-fg"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo(look.photo, "sm")} alt="" style={{ objectPosition: photoFocus(look.photo) }} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                  <span className="font-display text-sm font-bold leading-tight">{categoryName(c)}</span>
                </Link>
              );
            })}
          </div>

          {subcategories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={`/marketplace?category=${category}`}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                  !subcategory
                    ? "border-cyan-deep text-cyan-deep"
                    : "border-line text-neutral-600 hover:border-cyan-deep"
                }`}
              >
                {t("all")}
              </Link>
              {subcategories.map((sc) => (
                <Link
                  key={sc.id}
                  href={`/marketplace?category=${category}&subcategory=${sc.slug}`}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                    subcategory === sc.slug
                      ? "border-cyan-deep text-cyan-deep"
                      : "border-line text-neutral-600 hover:border-cyan-deep"
                  }`}
                >
                  {categoryName(sc)}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-neutral-600">{t("serviceCount", { count: listings.length })}</p>
            <div className="flex gap-1">
              {sortOptions.map((opt) => {
                const params = new URLSearchParams();
                if (category) params.set("category", category);
                if (subcategory) params.set("subcategory", subcategory);
                if (q) params.set("q", q);
                params.set("sort", opt.value);
                const isActive = (sort ?? "newest") === opt.value;
                return (
                  <Link
                    key={opt.value}
                    href={`/marketplace?${params.toString()}`}
                    className={`rounded-sm px-3 py-1.5 text-xs font-semibold transition-colors ${
                      isActive ? "bg-fg text-white" : "text-neutral-600 hover:bg-surface"
                    }`}
                  >
                    {opt.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="mt-10 rounded-sm border border-line bg-surface px-8 py-16 text-center">
              <p className="text-[15px] text-neutral-600">
                {t("noServicesMatch")}{" "}
                <Link href="/profile" className="text-cyan-deep hover:underline">
                  {t("listFirstOne")}
                </Link>
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          )}
        </div>
      </section>
    </main>
  );
}
