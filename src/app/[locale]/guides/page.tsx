import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { guides } from "@/lib/guides";
import { GuideCard } from "@/components/GuideCard";
import { categoryOrder } from "@/components/CategoryIcon";
import type { Locale } from "@/lib/data";
import type { ProfileCategory } from "@/lib/types";

export const revalidate = 0;

export default async function GuidesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const { category } = await searchParams;
  const t = await getTranslations("guidesPage");
  const tCat = await getTranslations("categories");

  const activeCategory = categoryOrder.includes(category as ProfileCategory)
    ? (category as ProfileCategory)
    : undefined;

  const filteredGuides = activeCategory
    ? guides.filter((g) => g.category === activeCategory)
    : guides;

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">{t("eyebrow")}</p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-fg sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-neutral-600">{t("body")}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            {t("chooseTopic")}
          </p>
          <nav className="mt-4 flex flex-col gap-1">
            <Link
              href="/guides"
              className={`rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                !activeCategory ? "bg-surface text-fg font-semibold" : "text-neutral-600 hover:text-fg"
              }`}
            >
              {t("allTopics")}
            </Link>
            {categoryOrder.map((c) => (
              <Link
                key={c}
                href={`/guides?category=${c}`}
                className={`rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                  activeCategory === c ? "bg-surface text-fg font-semibold" : "text-neutral-600 hover:text-fg"
                }`}
              >
                {tCat(c)}
              </Link>
            ))}
          </nav>
        </aside>

        <div>
          {filteredGuides.length === 0 ? (
            <p className="text-sm text-neutral-500">{t("empty")}</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredGuides.map((guide) => (
                <GuideCard
                  key={guide.slug}
                  guide={guide}
                  locale={locale}
                  categoryLabel={tCat(guide.category)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
