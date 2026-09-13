import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getGuide, guides } from "@/lib/guides";
import { GuideCard } from "@/components/GuideCard";
import { CategoryIcon, categoryAccent } from "@/components/CategoryIcon";
import type { Locale } from "@/lib/data";

export const revalidate = 0;

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations("guidesPage");
  const tCat = await getTranslations("categories");

  const guide = getGuide(slug);
  if (!guide) notFound();

  const moreGuides = guides.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <Link href="/guides" className="text-sm font-semibold text-cyan-deep hover:underline">
        {t("backToGuides")}
      </Link>

      <div className="mt-6 flex items-center gap-2">
        <CategoryIcon category={guide.category} className={`h-5 w-5 ${categoryAccent[guide.category]}`} />
        <span className={`text-xs font-semibold uppercase tracking-widest ${categoryAccent[guide.category]}`}>
          {tCat(guide.category)}
        </span>
      </div>

      <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-fg sm:text-4xl">
        {guide.title[locale]}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-neutral-600">{guide.excerpt[locale]}</p>

      <div className="mt-10 space-y-5 border-t border-line pt-10">
        {guide.body.map((paragraph, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-neutral-700">
            {paragraph[locale]}
          </p>
        ))}
      </div>

      {moreGuides.length > 0 && (
        <div className="mt-16 border-t border-line pt-10">
          <h2 className="font-display text-xl font-bold tracking-tight text-fg">{t("moreGuides")}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {moreGuides.map((g) => (
              <GuideCard key={g.slug} guide={g} locale={locale} categoryLabel={tCat(g.category)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
