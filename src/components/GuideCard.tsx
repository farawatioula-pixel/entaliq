import { Link } from "@/i18n/navigation";
import { CategoryIcon, categoryAccent } from "@/components/CategoryIcon";
import type { Guide } from "@/lib/guides";
import type { Locale } from "@/lib/data";

const categoryTint: Record<string, string> = {
  "graphics-design": "bg-violet-deep/10",
  "programming-tech": "bg-cyan-deep/10",
  "digital-marketing": "bg-red-dark/10",
  "writing-translation": "bg-violet-deep/10",
  "video-animation": "bg-red-dark/10",
  "ai-services": "bg-cyan-deep/10",
  "business-consulting": "bg-violet-deep/10",
  ecommerce: "bg-cyan-deep/10",
};

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
      className="group flex flex-col overflow-hidden rounded-sm border border-line bg-surface transition-colors hover:border-cyan-deep"
    >
      <div
        className={`flex h-36 items-center justify-center ${categoryTint[guide.category]}`}
      >
        <CategoryIcon category={guide.category} className={`h-12 w-12 ${categoryAccent[guide.category]}`} />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-5 py-5">
        <span className={`text-xs font-semibold uppercase tracking-widest ${categoryAccent[guide.category]}`}>
          {categoryLabel}
        </span>
        <h3 className="font-display text-lg font-bold leading-snug text-fg group-hover:text-cyan-deep">
          {guide.title[locale]}
        </h3>
        <p className="text-sm leading-relaxed text-neutral-600">{guide.excerpt[locale]}</p>
      </div>
    </Link>
  );
}
