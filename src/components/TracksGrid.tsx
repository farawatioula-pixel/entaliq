import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { tracks, type Locale } from "@/lib/data";
import type { ProfileCategory } from "@/lib/types";

const categoryColor: Record<ProfileCategory, string> = {
  "graphics-design": "text-violet-deep",
  "programming-tech": "text-cyan-deep",
  "digital-marketing": "text-red-dark",
  "writing-translation": "text-violet-deep",
  "video-animation": "text-red-dark",
  "ai-services": "text-cyan-deep",
  "business-consulting": "text-violet-deep",
  ecommerce: "text-cyan-deep",
};

export default function TracksGrid({ showDetail = false }: { showDetail?: boolean }) {
  const t = useTranslations("categories");
  const locale = useLocale() as Locale;

  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {tracks.map((track) => (
        <div
          key={track.title.en}
          className="flex flex-col gap-3 bg-surface px-6 py-8 sm:px-8 sm:py-10"
        >
          <p
            className={`text-xs font-semibold uppercase tracking-widest ${categoryColor[track.category]}`}
          >
            {t(track.category)}
          </p>
          <h3 className="font-display text-xl font-bold text-fg">{track.title[locale]}</h3>
          <p className="text-[15px] leading-relaxed text-neutral-600">
            {showDetail ? track.detail[locale] : track.description[locale]}
          </p>
        </div>
      ))}
    </div>
  );
}

export function TracksCTA() {
  const t = useTranslations("tracksPage");
  return (
    <div className="mt-10 flex justify-center">
      <Link
        href="/register"
        className="inline-flex items-center gap-2 rounded-sm bg-surface border border-line px-7 py-3.5 text-sm font-semibold text-fg transition-colors hover:bg-line"
      >
        {t("applyForTrack")}
      </Link>
    </div>
  );
}
