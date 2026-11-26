import { Link } from "@/i18n/navigation";
import { CategoryIcon } from "@/components/CategoryIcon";
import { guidePhotoByCategory, lookFor, pexels } from "@/lib/photos";
import type { Guide } from "@/lib/guides";
import type { Locale } from "@/lib/data";

export function GuideCard({
  guide,
  locale,
  categoryLabel,
}: {
  guide: Guide;
  locale: Locale;
  categoryLabel: string;
}) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-44 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pexels(guidePhotoByCategory[guide.category] ?? lookFor(guide.category).photo, 700)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          style={{ backgroundColor: lookFor(guide.category).color }}
          className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white shadow"
        >
          <CategoryIcon category={guide.category} className="h-3.5 w-3.5 text-white" />
          {categoryLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-5 py-5">
        <h3 className="font-display text-lg font-bold leading-snug text-fg group-hover:text-cyan-deep">
          {guide.title[locale]}
        </h3>
        <p className="text-sm leading-relaxed text-neutral-600">{guide.excerpt[locale]}</p>
      </div>
    </Link>
  );
}
